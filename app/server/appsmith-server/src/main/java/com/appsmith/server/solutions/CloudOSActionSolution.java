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
    private final CloudOSConfig cloudOSConfig;

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

}
