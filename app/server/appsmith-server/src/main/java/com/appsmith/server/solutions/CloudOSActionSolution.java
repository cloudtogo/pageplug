package com.appsmith.server.solutions;

import com.appsmith.external.models.*;
import com.appsmith.server.acl.AclPermission;
import com.appsmith.server.configurations.CloudOSConfig;
import com.appsmith.server.domains.*;
import com.appsmith.server.dtos.ActionDTO;
import com.appsmith.server.exceptions.AppsmithError;
import com.appsmith.server.exceptions.AppsmithException;
import com.appsmith.server.repositories.DatasourceRepository;
import com.appsmith.server.services.*;
import com.google.gson.GsonBuilder;
import io.jsonwebtoken.lang.Strings;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpMethod;
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

    private final OrganizationService organizationService;
    private final DatasourceService datasourceService;
    private final DatasourceRepository datasourceRepository;
    private final ApplicationPageService applicationPageService;
    private final ApplicationForkingService applicationForkingService;
    private final NewActionService newActionService;
    private final PluginService pluginService;
    private final ActionCollectionService actionCollectionService;
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
        Organization organization = new Organization();
        organization.setName(name);
        return organizationService.create(organization).flatMap(org -> {
            Application app = new Application();
            app.setName(name);
            app.setColor("#EA6179");
            app.setIcon("money");
            app.setIsPublic(true);
            return applicationPageService.createApplication(app, org.getId());
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

        Organization organization = new Organization();
        organization.setName(deployId);
        return organizationService.create(organization)
                .flatMap(org -> applicationForkingService.forkApplicationToOrganization(appId, org.getId()))
                .flatMap(application ->
                        Flux.fromIterable(instanceList)
                                .flatMap(instance -> updateDatasourceUrl(instance, application))
                                .collectList()
                                .thenReturn("/applications/" + application.getId() + "/pages/" + application.getPages().get(0).getId())
                );
    }

    private Mono<Datasource> updateDatasourceUrl(LinkedHashMap<String, String> instance, Application application) {
        String componentName = instance.get("component_name");
        String componentId = instance.get("component_id");
        String serviceAddress = instance.get("service_address");
        String datasourceName = componentName == null ? componentId : componentName;
        return datasourceService.findByNameAndOrganizationId(datasourceName, application.getOrganizationId(), AclPermission.MANAGE_DATASOURCES)
                .flatMap(datasource -> {
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

    private Mono<String> refreshCloudOSApiData(String projectId, List<String> depList, String orgId, String pageId) {
        // clean attached datasource and actions
        final MultiValueMap<String, String> actionParams = new LinkedMultiValueMap<>();
        actionParams.add("pageId", pageId);
        final HashSet dcHash = new HashSet();
        return newActionService.getUnpublishedActions(actionParams)
                .filter(action -> action.getPluginType() == PluginType.API)
                .flatMap(action -> {
                    dcHash.add(action.getDatasource().getId());
                    return newActionService.deleteUnpublishedAction(action.getId());
                })
                .flatMap(action -> {
                    return Flux.fromIterable(dcHash).flatMap(dcId -> datasourceRepository.archiveById(dcId.toString()));
                })
                .collectList()
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

        // create new datasource
        Datasource newSource = new Datasource();
        newSource.setOrganizationId(orgId);
        newSource.setPluginId(pluginId);
        newSource.setName(componentDisplay);

        DatasourceConfiguration datasourceConfiguration = new DatasourceConfiguration();
        datasourceConfiguration.setUrl(cloudOSConfig.getMockUrl() + "/" + projectId + "/" + componentId);
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
                newPageAction.setOrganizationId(orgId);
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
                    .flatMap(action -> actionCollectionService.createAction(action))
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
                            && error.getMessage().contains("organization_datasource_deleted_compound_index")) {
                        return createSuffixedDatasource(datasource, name, 1 + suffix);
                    }
                    throw error;
                });
    }

}
