package com.appsmith.server.controllers.ce;

import com.appsmith.server.dtos.ResponseDTO;
import com.appsmith.server.services.WxLoginService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Map;

import static com.appsmith.server.constants.ce.UrlCE.WX_LOGIN_URL;

@RequestMapping(WX_LOGIN_URL)
public class WxLoginControllerCE {
    private final WxLoginService wxLoginService;

    public WxLoginControllerCE(WxLoginService wxLoginService) {
        this.wxLoginService = wxLoginService;
    }

    @GetMapping("code")
    public Mono<ResponseDTO<Map<String, String>>> getWxCode() {
        return wxLoginService.getWxLoginCode().map(res -> new ResponseDTO<>(HttpStatus.OK.value(), res, null));
    }

    @GetMapping("callback")
    public Mono<Void> callback(@RequestParam String code, @RequestParam String state, ServerWebExchange exchange) {
        return wxLoginService.getCallback(code, state, exchange);
    }
}
