package com.appsmith.server.services.ce;

import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Map;

public interface WxLoginServiceCE {

    Mono<Map<String, String>> getWxLoginCode();

    Mono<Void> getCallback(String code, String state, ServerWebExchange exchange);
}
