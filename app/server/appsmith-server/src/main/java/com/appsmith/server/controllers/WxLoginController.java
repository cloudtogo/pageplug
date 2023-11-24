package com.appsmith.server.controllers;

import com.appsmith.server.controllers.ce.WxLoginControllerCE;
import com.appsmith.server.services.WxLoginService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.appsmith.server.constants.ce.UrlCE.WX_LOGIN_URL;

@RestController
@RequestMapping(WX_LOGIN_URL)
public class WxLoginController extends WxLoginControllerCE {

    public WxLoginController(WxLoginService wxLoginService) {
        super(wxLoginService);
    }
}
