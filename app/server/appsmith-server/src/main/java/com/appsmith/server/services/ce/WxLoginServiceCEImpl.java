package com.appsmith.server.services.ce;

import com.appsmith.server.acl.AclPermission;
import com.appsmith.server.authentication.handlers.AuthenticationSuccessHandler;
import com.appsmith.server.domains.LoginSource;
import com.appsmith.server.domains.OAuth2Authorization;
import com.appsmith.server.domains.User;
import com.appsmith.server.exceptions.AppsmithError;
import com.appsmith.server.exceptions.AppsmithException;
import com.appsmith.server.repositories.UserRepository;
import com.appsmith.server.services.AnalyticsService;
import com.appsmith.server.services.BaseService;
import com.appsmith.server.services.SessionUserService;
import com.appsmith.server.services.WxLoginService;
import com.appsmith.server.utils.ConstantWxPropertiesUtils;
import com.appsmith.server.utils.HttpClientUtils;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Validator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.convert.MongoConverter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.web.server.DefaultServerRedirectStrategy;
import org.springframework.security.web.server.ServerRedirectStrategy;
import org.springframework.security.web.server.WebFilterExchange;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilterChain;
import org.springframework.web.server.WebSession;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Scheduler;

import java.net.URI;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import static org.springframework.security.web.server.context.WebSessionServerSecurityContextRepository.DEFAULT_SPRING_SECURITY_CONTEXT_ATTR_NAME;

@Slf4j
public class WxLoginServiceCEImpl extends BaseService<UserRepository, User, String> implements WxLoginService {

    ServerRedirectStrategy redirectStrategy = new DefaultServerRedirectStrategy();

    private final AuthenticationSuccessHandler authenticationSuccessHandler;
    private final SessionUserService sessionUserService;
    private static final WebFilterChain EMPTY_WEB_FILTER_CHAIN = serverWebExchange -> Mono.empty();

    private final ObjectMapper objectMapper;

    public WxLoginServiceCEImpl(
            Scheduler scheduler,
            Validator validator,
            MongoConverter mongoConverter,
            ReactiveMongoTemplate reactiveMongoTemplate,
            UserRepository repository,
            AnalyticsService analyticsService,
            AuthenticationSuccessHandler authenticationSuccessHandler,
            SessionUserService sessionUserService,
            ObjectMapper objectMapper) {
        super(scheduler, validator, mongoConverter, reactiveMongoTemplate, repository, analyticsService);
        this.authenticationSuccessHandler = authenticationSuccessHandler;
        this.sessionUserService = sessionUserService;
        this.objectMapper = objectMapper;
    }

    public Mono<Map<String, String>> getWxLoginCode() {
        String state = System.currentTimeMillis() + "";
        String codeUrl = UriComponentsBuilder.fromUriString("https://open.weixin.qq.com/connect/qrconnect")
                .queryParam("appid", ConstantWxPropertiesUtils.WX_OPEN_APP_ID)
                .queryParam("redirect_uri", ConstantWxPropertiesUtils.WX_OPEN_REDIRECT_URL)
                .queryParam("response_type", "code")
                .queryParam("scope", "snsapi_login")
                .queryParam("state", state)
                .fragment("wechat_redirect")
                .build()
                .encode()
                .toString();

        return Mono.just(Map.of("redirectUrl", codeUrl));
    }

    public Mono<Void> getCallback(String code, String state, ServerWebExchange exchange) {
        String accessTokenUrl = UriComponentsBuilder.fromUriString("https://api.weixin.qq.com/sns/oauth2/access_token")
                .queryParam("appid", ConstantWxPropertiesUtils.WX_OPEN_APP_ID)
                .queryParam("secret", ConstantWxPropertiesUtils.WX_OPEN_APP_SECRET)
                .queryParam("code", code)
                .queryParam("grant_type", AuthorizationGrantType.AUTHORIZATION_CODE.getValue())
                .build()
                .toString();

        JsonNode jsonNode;
        try {
            String accessTokenInfo = HttpClientUtils.get(accessTokenUrl);
            jsonNode = objectMapper.readTree(accessTokenInfo);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        boolean existOpenId = jsonNode.has("openid");
        boolean existRefreshToken = jsonNode.has("refresh_token");
        if (!existOpenId || !existRefreshToken) {
            URI location = URI.create("/user/login?error=access token fetch error");
            return this.redirectStrategy.sendRedirect(exchange, location);
        }

        String openId = jsonNode.get("openid").asText();
        String refresh_token = jsonNode.get("refresh_token").asText();
        String accessToken = getRefreshToken(refresh_token);

        return repository
                .findBySourceAndOpenId(LoginSource.WECHAT, openId)
                .flatMap(user -> Mono.zip(
                                exchange.getSession(),
                                ReactiveSecurityContextHolder.getContext(),
                                sessionUserService.getCurrentUser())
                        .switchIfEmpty(Mono.error(new AppsmithException(AppsmithError.INTERNAL_SERVER_ERROR)))
                        .flatMap(tuple -> {
                            User currentUser = tuple.getT3();
                            if (!currentUser.isAnonymous()) {
                                URI location = URI.create("/profile?error=该微信账号已经被其他账号绑定");
                                return this.redirectStrategy
                                        .sendRedirect(exchange, location)
                                        .thenReturn(user);
                            }

                            final WebSession session = tuple.getT1();
                            final SecurityContext securityContext = tuple.getT2();

                            final WebFilterExchange webFilterExchange =
                                    new WebFilterExchange(exchange, EMPTY_WEB_FILTER_CHAIN);

                            Authentication authentication =
                                    new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                            securityContext.setAuthentication(authentication);
                            session.getAttributes().put(DEFAULT_SPRING_SECURITY_CONTEXT_ATTR_NAME, securityContext);
                            return authenticationSuccessHandler
                                    .onAuthenticationSuccess(webFilterExchange, securityContext.getAuthentication())
                                    .thenReturn(user);
                        }))
                .switchIfEmpty(sessionUserService.getCurrentUser().flatMap(currentUser -> {
                    if (currentUser.isAnonymous()) {
                        URI location = URI.create("/user/signup?error=请使用邮箱登录后绑定微信账号");
                        return this.redirectStrategy
                                .sendRedirect(exchange, location)
                                .thenReturn(currentUser);
                    }

                    String userInfoUrl = UriComponentsBuilder.fromUriString("https://api.weixin.qq.com/sns/userinfo")
                            .queryParam("access_token", accessToken)
                            .queryParam("openid", openId)
                            .build()
                            .toString();

                    JsonNode userInfoJson;
                    try {
                        String resultInfo = HttpClientUtils.get(userInfoUrl);
                        userInfoJson = objectMapper.readTree(resultInfo);
                    } catch (Exception e) {
                        return Mono.error(new RuntimeException(e));
                    }

                    String nickname = userInfoJson.get("nickname").asText();
                    String headimgurl = userInfoJson.get("headimgurl").asText();

                    OAuth2Authorization authorization = new OAuth2Authorization();
                    authorization.setSource(LoginSource.WECHAT);
                    authorization.setName(nickname);
                    authorization.setAvatarUrl(headimgurl);
                    authorization.setOpenId(openId);
                    Map<String, Object> rawUserInfo = objectMapper.convertValue(userInfoJson, new TypeReference<>() {});
                    authorization.setRawUserInfo(rawUserInfo);
                    Set<OAuth2Authorization> oAuth2Authorizations = currentUser.getOAuth2Authorizations();
                    if (oAuth2Authorizations == null) {
                        oAuth2Authorizations = new HashSet<>();
                        currentUser.setOAuth2Authorizations(oAuth2Authorizations);
                    }
                    oAuth2Authorizations.add(authorization);
                    return repository
                            .updateById(currentUser.getId(), currentUser, AclPermission.MANAGE_USERS)
                            .then(this.redirectStrategy.sendRedirect(exchange, URI.create("/profile")))
                            .thenReturn(currentUser);
                }))
                .then();
    }

    /**
     * refresh access_token
     *
     * @param refreshToken
     * @return
     */
    private String getRefreshToken(String refreshToken) {
        String refreshTokenUrl = UriComponentsBuilder.fromUriString(
                        "https://api.weixin.qq.com/sns/oauth2/refresh_token")
                .queryParam("appid", ConstantWxPropertiesUtils.WX_OPEN_APP_ID)
                .queryParam("grant_type", "refresh_token")
                .queryParam("refresh_token", refreshToken)
                .build()
                .toString();
        try {
            String refreshTokenInfo = HttpClientUtils.get(refreshTokenUrl);
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode resRefreshTokenInfo = objectMapper.readTree(refreshTokenInfo);
            String newRefreshToken = resRefreshTokenInfo.get("access_token").asText();
            return newRefreshToken;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
