package com.appsmith.server.controllers;

import com.appsmith.server.constants.Url;
import com.appsmith.server.domains.Application;
import com.appsmith.server.dtos.ResponseDTO;
import com.appsmith.server.solutions.CloudOSActionSolution;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping(Url.CLOUDOS_URL)
public class CloudOSController {

    private final CloudOSActionSolution cloudOSActionSolution;

    @Autowired
    public CloudOSController(CloudOSActionSolution cloudOSActionSolution) {
        this.cloudOSActionSolution = cloudOSActionSolution;
    }

    @PostMapping("/getMiniPreview")
    public Mono<ResponseDTO<String>> getMiniPreview(@RequestBody Map<String, Object> data) {
        log.debug("get mini-app's QR code image data (Base64)");
        return cloudOSActionSolution.getMiniPreview(data)
                .map(url -> new ResponseDTO<>(HttpStatus.OK.value(), url, null));
    }

}
