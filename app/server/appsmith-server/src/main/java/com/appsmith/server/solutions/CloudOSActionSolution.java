package com.appsmith.server.solutions;

import com.appsmith.external.models.*;
import com.appsmith.server.acl.AclPermission;
import com.appsmith.server.configurations.CloudOSConfig;
import com.appsmith.server.domains.*;
import com.appsmith.server.dtos.ActionDTO;
import com.appsmith.server.exceptions.AppsmithError;
import com.appsmith.server.exceptions.AppsmithException;
import com.appsmith.server.services.*;
import com.google.gson.GsonBuilder;
import io.jsonwebtoken.lang.Strings;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import io.jsonwebtoken.Jwts;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class CloudOSActionSolution {

    private static final String RESTAPI_PLUGIN = "restapi-plugin";

    private final WorkspaceService workspaceService;
    private final DatasourceService datasourceService;
    private final ApplicationPageService applicationPageService;
    private final ApplicationForkingService applicationForkingService;
    private final NewActionService newActionService;
    private final PluginService pluginService;
    private final LayoutActionService layoutActionService;
    private final CloudOSConfig cloudOSConfig;

    /**
     * verify CloudOS token in cookie.
     * @param token
     * @return is valid
     */
    public Mono<Boolean> verifyCloudOSToken(String token) {
        String secretKey = cloudOSConfig.getSecretKey();
        try {
            Jwts.parserBuilder().setSigningKey(secretKey).build().parse(token);
        } catch (Exception e) {
            log.debug(e.getMessage());
            return Mono.just(false);
        }

        return Mono.just(true);
    }

    /**
     * This method is used by CloudOS Composer.
     * It create a organization and an application in it.
     * post body
     * @param payload  application info
     * @return created application
     */
    public Mono<Application> createOrganizationApplication(Map<String, Object> payload) {
        String name = (String) payload.get("name");
        Boolean isMobile = (Boolean) payload.get("isMobile");
        Workspace organization = new Workspace();
        organization.setName(name);
        return workspaceService.create(organization).flatMap(org -> {
            Application app = new Application();
            app.setName(name);
            app.setColor("#EA6179");
            app.setIcon("money");
            app.setIsPublic(true);
            Application.AppLayout layout = new Application.AppLayout(Application.AppLayout.Type.DESKTOP);
            if (isMobile) {
                layout.setType(Application.AppLayout.Type.MOBILE_FLUID);
            }
            app.setPublishedAppLayout(layout);
            app.setUnpublishedAppLayout(layout);
            return applicationPageService.createApplication(app, org.getId());
        });
    }

    /**
     * This method is used by PagePlug. It's triggered after Viewer loaded.
     * It fetch mini-app's qrcode url for specified application.
     * post body
     * @param payload  app id
     * @return qrcode Base64
     */
    public Mono<String> getMiniPreview(Map<String, Object> payload) {
        String appId = (String) payload.get("app_id");
        return fetchAccessToken().flatMap(accessToken -> {
            return fetchWxaCode(accessToken, appId);
        }).flatMap(buffer -> {
            return Mono.just("data:image/png;base64," + Base64.getEncoder().encodeToString(buffer));
        });
    }

    // get mini-app access token for next api call
    private Mono<String> fetchAccessToken() {
        WebClient.Builder builder = WebClient.builder();
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.newInstance();
        try {
            log.debug("获取微信 access_token");
            uriBuilder.uri(new URI("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + cloudOSConfig.getWxAppId() + "&secret=" + cloudOSConfig.getWxSecret()));
        } catch (URISyntaxException e) {
            log.debug("Error while parsing access token URL." + e.toString());
        }
        return builder.build()
                .method(HttpMethod.GET)
                .uri(uriBuilder.build(true).toUri())
                .exchange()
                .doOnError(e -> Mono.error(new AppsmithException(AppsmithError.CLOUDOS_WECHAT_ACCESS_TOKEN_FAILURE, e)))
                .flatMap(response -> {
                    if (response.statusCode().is2xxSuccessful()) {
                        return response.bodyToMono(WxApiResponse.class);
                    } else {
                        log.debug("Unable to retrieve wechat api with error {}", response.statusCode());
                        return Mono.error(new AppsmithException(AppsmithError.CLOUDOS_WECHAT_ACCESS_TOKEN_FAILURE,
                                "Unable to retrieve wechat api with error " + response.statusCode()));
                    }
                })
                .flatMap(apiResponse -> {
                    log.debug(apiResponse.toString());
                    final String accessToken = apiResponse.getAccess_token();
                    if (accessToken != null) {
                        log.debug("成功获取 access_token ==> " + accessToken);
                        return Mono.just(accessToken);
                    } else {
                        log.debug("wx access token fetch error: " + apiResponse.getErrmsg());
                        return Mono.error(new AppsmithException(AppsmithError.CLOUDOS_WECHAT_ACCESS_TOKEN_FAILURE,
                                "wx access token fetch error " + apiResponse.getErrmsg()));
                    }
                });
    }

    // get mini-app wxacode image
    private Mono<byte[]> fetchWxaCode(String accessToken, String appId) {
        WebClient.Builder builder = WebClient.builder();
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.newInstance();
        try {
            log.debug("获取小程序码图片");
            uriBuilder.uri(new URI("https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=" + accessToken));
        } catch (URISyntaxException e) {
            log.debug("Error while parsing access token URL." + e.toString());
        }
        return builder.build()
                .method(HttpMethod.POST)
                .uri(uriBuilder.build(true).toUri())
                .body(BodyInserters.fromValue(Map.of(
                        "scene", appId,
                        "auto_color", true,
                        "is_hyaline", true
                )))
                .accept(MediaType.IMAGE_JPEG)
                .exchange()
                .doOnError(e -> Mono.error(new AppsmithException(AppsmithError.CLOUDOS_WECHAT_PREVIEW_FAILURE, e)))
                .flatMap(response -> {
                    log.debug(response.toString());
                    if (response.statusCode().is2xxSuccessful()) {
                        return response.bodyToMono(byte[].class);
                    } else {
                        log.debug("Unable to retrieve wechat api with error {} " + response.statusCode());
                        return Mono.error(new AppsmithException(AppsmithError.CLOUDOS_WECHAT_PREVIEW_FAILURE,
                                "Unable to retrieve wechat api with error " + response.statusCode()));
                    }
                })
                .flatMap(apiResponse -> {
                    final byte[] buffer = apiResponse;
                    if (buffer != null) {
                        log.debug("成功获取小程序码图片数据! ===> 长度为" + buffer.length);
                        return Mono.just(buffer);
                    } else {
                        log.debug("小程序码获取失败！");
                        return Mono.error(new AppsmithException(AppsmithError.CLOUDOS_WECHAT_PREVIEW_FAILURE,
                                "wx preview code fetch error"));
                    }
                });
    }

    /**
     * This method is used by CloudOS Factory.
     * It create a organization and fork an app from CloudOS blueprint template.
     * post body
     * @param payload  deploy info
     * @return created application
     */
    public Mono<String> forkApplicationTemplate(Map<String, Object> payload) {
        String orgName = (String) payload.get("org_name");
        String appId = (String) payload.get("lowcode_id");

        Workspace organization = new Workspace();
        organization.setName(orgName);
        log.debug("fork app: " + appId);
        return workspaceService.create(organization)
                .flatMap(org -> applicationForkingService.forkApplicationToWorkspace(appId, org.getId()))
                .flatMap(application -> {
                    return Mono.just("/org/" + application.getWorkspaceId() + "/applications/" + application.getId() + "/pages/" +
                            application.getPages().stream()
                                .filter(ApplicationPage::isDefault)
                                .map(ApplicationPage::getId)
                                .findFirst()
                                .orElse(""));
                });
    }

    /**
     * This method is used by CloudOS Factory.
     * It create a organization and fork an app for CloudOS blueprint deploy.
     * post body
     * @param payload  deploy info
     * @return created application
     */
    public Mono<String> forkApplicationDeploy(Map<String, Object> payload) {
        String deployId = (String) payload.get("deploy_id");
        String appId = (String) payload.get("lowcode_id");
        List<LinkedHashMap<String, String>> instanceList = (List<LinkedHashMap<String, String>>) payload.get("instance_list");

        Workspace organization = new Workspace();
        organization.setName(deployId);
        return workspaceService.create(organization)
                .flatMap(org -> applicationForkingService.forkApplicationToWorkspace(appId, org.getId()))
                .flatMap(application ->
                        Flux.fromIterable(instanceList)
                                .flatMap(instance -> updateDatasourceUrl(instance, application))
                                .collectList()
                                .thenReturn("/applications/" + application.getId() + "/pages/" +
                                    application.getPages().stream()
                                        .filter(ApplicationPage::isDefault)
                                        .map(ApplicationPage::getId)
                                        .findFirst()
                                        .orElse(""))
                );
    }

    private Mono<Datasource> updateDatasourceUrl(LinkedHashMap<String, String> instance, Application application) {
        String componentName = instance.get("component_name");
        String componentId = instance.get("component_id");
        String serviceAddress = instance.get("service_address");
        String datasourceName = componentName == null ? componentId : componentName;
        String dbPrefix = cloudOSConfig.getDbUrl();
        return datasourceService.findByNameAndWorkspaceId(datasourceName, application.getWorkspaceId(), AclPermission.MANAGE_DATASOURCES)
                .flatMap(datasource -> {
                    final String oldUrl = datasource.getDatasourceConfiguration().getUrl();
                    if (oldUrl.contains(dbPrefix)) {
                        return Mono.just(datasource);
                    }
                    final Datasource deployedDatasource = new Datasource();
                    final DatasourceConfiguration datasourceConfiguration = new DatasourceConfiguration();
                    datasourceConfiguration.setUrl(serviceAddress);
                    deployedDatasource.setDatasourceConfiguration(datasourceConfiguration);
                    return datasourceService.update(datasource.getId(), deployedDatasource);
                });
    }

    /**
     * This method is used by PagePlug. It's triggered after Editor loaded.
     * It create a datasource and sync APIs defined in CloudOS to it.
     * post body
     * @param payload  depended kits, page info, CloudOS bp info
     * @return created datasource
     */
    public Mono<String> bindDependedActions(Map<String, Object> payload) {
        List<String> depList = (List<String>) payload.get("dep_list");
        String projectId = (String) payload.get("project_id");
        String orgId = (String) payload.get("org_id");
        String pageId = (String) payload.get("page_id");
        String forceBind = (String) payload.get("force_bind");

        final MultiValueMap<String, String> actionParams = new LinkedMultiValueMap<>();
        actionParams.add("pageId", pageId);
        return newActionService.getUnpublishedActions(actionParams)
                .filter(action -> action.getPluginType() == PluginType.API)
                .collectList()
                .flatMap(actions -> {
                    if (actions.size() > 0 && forceBind != "true") {
                        return Mono.just("CloudOS接口已经同步过了，不执行同步操作。(●ˇ∀ˇ●)");
                    }
                    return refreshCloudOSApiData(projectId, depList, orgId, pageId);
                });
    }

    /**
     * This method is used by CloudOS Factory.
     * It refresh a datasource and sync APIs defined in CloudOS to it.
     * @param payload
     * @return
     */
    public Mono<String> refreshTheCloudOSApiData(Map<String, Object> payload) {
        log.debug("received payload: " + payload);
        List<String> depList = (List<String>) payload.get("dep_list");
        String projectId = (String) payload.get("project_id");
        String orgId = (String) payload.get("org_id");
        String pageId = (String) payload.get("page_id");

        // clean attached datasource and actions
        final HashSet<String> dcHash = new HashSet();
        if (depList.stream().count() == 0) {
            return fetchCloudOSApiData(projectId, depList, orgId, pageId);
        } else {
            return newActionService.findByPageId(pageId)
                    .filter(action -> action.getPluginType() == PluginType.API)
                    .flatMap(action -> {
                        dcHash.add(action.getUnpublishedAction().getDatasource().getId());
                        return newActionService.archive(action);
                    })
                    .collectList()
                    .thenMany(Flux.fromIterable(dcHash).flatMap(datasourceService::archiveById))
                    .then(fetchCloudOSApiData(projectId, depList, orgId, pageId));
        }
    }

    private Mono<String> refreshCloudOSApiData(String projectId, List<String> depList, String orgId, String pageId) {
        // clean attached datasource and actions
        final HashSet<String> dcHash = new HashSet();
        return newActionService.findByPageId(pageId)
                .filter(action -> action.getPluginType() == PluginType.API)
                .flatMap(action -> {
                    dcHash.add(action.getUnpublishedAction().getDatasource().getId());
                    return newActionService.archive(action);
                })
                .collectList()
                .thenMany(Flux.fromIterable(dcHash).flatMap(datasourceService::archiveById))
                .then(fetchCloudOSApiData(projectId, depList, orgId, pageId));
    }

    // request for depended api list
    private Mono<String> fetchCloudOSApiData(String projectId, List<String> depList, String orgId, String pageId) {
        WebClient.Builder builder = WebClient.builder();
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.newInstance();
        try {
            uriBuilder.uri(new URI(cloudOSConfig.getBaseUrl() + "/v1/project/" + projectId + "/components/api"));
        } catch (URISyntaxException e) {
            log.debug("Error while parsing access token URL.", e);
        }
        return builder.build()
                .method(HttpMethod.POST)
                .uri(uriBuilder.build(true).toUri())
                .header("uid", "admin123")
                .body(BodyInserters.fromValue(Map.of(
                        "components", depList,
                        "type", "all",
                        "orderId", "admin123",
                        "resourceCode", "composer_enter"
                )))
                .exchange()
                .doOnError(e -> Mono.error(new AppsmithException(AppsmithError.CLOUDOS_REQUEST_SYNC_API_FAILURE, e)))
                .flatMap(response -> {
                    if (response.statusCode().is2xxSuccessful()) {
                        return response.bodyToMono(CloudOSApiResponse.class);
                    } else {
                        log.debug("Unable to retrieve CloudOS api with error {}", response.statusCode());
                        return Mono.error(new AppsmithException(AppsmithError.CLOUDOS_REQUEST_SYNC_API_FAILURE,
                                "Unable to retrieve CloudOS api with error " + response.statusCode()));
                    }
                })
                .zipWith(pluginService.findByPackageName(RESTAPI_PLUGIN).flatMap(plugin -> Mono.just(plugin.getId())))
                .flatMap(tuple -> {
                    CloudOSApiResponse apiResponse = tuple.getT1();
                    String pluginId = tuple.getT2();
                    if (apiResponse.getCode() == 0) {
                        List<Map<String, ?>> bpList = new ArrayList<>(apiResponse.getData().values());
                        return Flux.fromIterable(bpList)
                                .flatMap(bp -> createNewDataSourceAndActions(bp, orgId, pageId, pluginId, projectId))
                                .collectList()
                                .thenReturn("CloudOS接口同步成功！(●'◡'●)");
                    } else {
                        log.debug("CloudOS api fetch error", apiResponse.getMessage());
                        return Mono.error(new AppsmithException(AppsmithError.CLOUDOS_REQUEST_SYNC_API_FAILURE,
                                "CloudOS api fetch error " + apiResponse.getMessage()));
                    }
                });
    }

    private Mono<Datasource> createNewDataSourceAndActions(Map<String, ?> bp, String orgId, String pageId, String pluginId, String projectId) {
        final String componentName = (String) bp.get("componentName");
        final String componentId = (String) bp.get("componentId");
        final String componentDisplay = componentName == null ? componentId : componentName;
        List<Map<String, ?>> cloudOSApiList = (List<Map<String, ?>>) bp.get("apis");
        log.debug("绑定组件 " + componentName + " 的API");
        log.debug(cloudOSApiList.toString());
        Boolean isDbApi = cloudOSApiList.stream().anyMatch(ca -> {
            final String apiKey = (String) ca.get("apiKey");
            return apiKey != null;
        });
        final String apiHost = isDbApi ? cloudOSConfig.getDbUrl() : cloudOSConfig.getMockUrl() + "/" + projectId + "/" + componentId;
        log.debug("数据源地址：" + apiHost);

        // create new datasource
        Datasource newSource = new Datasource();
        newSource.setWorkspaceId(orgId);
        newSource.setPluginId(pluginId);
        newSource.setName(componentDisplay);

        DatasourceConfiguration datasourceConfiguration = new DatasourceConfiguration();
        datasourceConfiguration.setUrl(apiHost);
        ArrayList<Property> properties = new ArrayList<>();
        properties.add(new Property("isSendSessionEnabled", "N"));
        properties.add(new Property("sessionSignatureKey", ""));
        datasourceConfiguration.setProperties(properties);
        newSource.setDatasourceConfiguration(datasourceConfiguration);

        return createSuffixedDatasource(newSource).flatMap(savedDataSource -> {
            final List<ActionDTO> apiList = new ArrayList<>();
            cloudOSApiList.forEach(ca -> {
                final String apiName = (String) ca.get("apiName");
                final String url = (String) ca.get("url");
                final String method = (String) ca.get("method");
                final String headers = (String) ca.get("headers");
                final String query = (String) ca.get("query");
                final String body = (String) ca.get("body");
                final ActionDTO newPageAction = new ActionDTO();
                newPageAction.setName(apiName + "_" + componentDisplay);
                newPageAction.setWorkspaceId(orgId);
                newPageAction.setDatasource(savedDataSource);
                newPageAction.setPluginId(pluginId);
                newPageAction.setPageId(pageId);
                newPageAction.setActionConfiguration(new ActionConfiguration());
                newPageAction.getActionConfiguration().setHttpMethod(HttpMethod.resolve(method));
                newPageAction.getActionConfiguration().setPath(url);
                newPageAction.getActionConfiguration().setTimeoutInMillisecond("10000");
                newPageAction.getActionConfiguration().setBody(body);
                newPageAction.getActionConfiguration().setHeaders(actionConfigurationList(headers, "lable", "default"));
                newPageAction.getActionConfiguration().setQueryParameters(actionConfigurationList(query, "param", "default"));
                apiList.add(newPageAction);
            });
            return Flux.fromIterable(apiList)
                    .flatMap(action -> layoutActionService.createAction(action))
                    .collectList()
                    .thenReturn(savedDataSource);
        });
    }

    private List<Property> actionConfigurationList(String field, String kk, String vk) {
        final List<Property> fieldList = new ArrayList<>();
        final List<Map<String, String>> parsedList = new GsonBuilder().create().fromJson(field, List.class);
        parsedList.forEach(o -> {
            fieldList.add(new Property(o.get(kk), o.get(vk)));
        });
        return fieldList;
    }

    private Mono<Datasource> createSuffixedDatasource(Datasource datasource) {
        return createSuffixedDatasource(datasource, datasource.getName(), 0);
    }

    /**
     * Tries to create the given datasource with the name, over and over again with an incremented suffix, but **only**
     * if the error is because of a name clash.
     * @param datasource Datasource to try create.
     * @param name Name of the datasource, to which numbered suffixes will be appended.
     * @param suffix Suffix used for appending, recursion artifact. Usually set to 0.
     * @return A Mono that yields the created datasource.
     */
    private Mono<Datasource> createSuffixedDatasource(Datasource datasource, String name, int suffix) {
        final String actualName = name + (suffix == 0 ? "" : " (" + suffix + ")");
        datasource.setName(actualName);
        return datasourceService.create(datasource)
                .onErrorResume(DuplicateKeyException.class, error -> {
                    if (error.getMessage() != null
                            && error.getMessage().contains("workspace_datasource_deleted_compound_index")) {
                        return createSuffixedDatasource(datasource, name, 1 + suffix);
                    }
                    throw error;
                });
    }

}
