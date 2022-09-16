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

    @PostMapping("/bindDependedActions")
    public Mono<ResponseDTO<String>> bindDependedActions(@RequestBody Map<String, Object> data) {
        log.debug("bind datasource and actions that blueprint kit depends on");
        return cloudOSActionSolution.bindDependedActions(data)
                .map(datasource -> new ResponseDTO<>(HttpStatus.OK.value(), datasource, null));
    }

    @PostMapping("/createOrganizationApplication")
    public Mono<ResponseDTO<Application>> createOrganizationApplication(@RequestBody Map<String, Object> data) {
        log.debug("create a organization and an application in it");
        return cloudOSActionSolution.createOrganizationApplication(data)
                .map(application -> new ResponseDTO<>(HttpStatus.OK.value(), application, null));
    }

    @PostMapping("/forkApplicationDeploy")
    public Mono<ResponseDTO<String>> forkApplicationDeploy(@RequestBody Map<String, Object> data) {
        log.debug("create a organization and fork an app for CloudOS blueprint deploy");
        return cloudOSActionSolution.forkApplicationDeploy(data)
                .map(appUrl -> new ResponseDTO<>(HttpStatus.OK.value(), appUrl, null));
    }

    @PostMapping("/forkApplicationTemplate")
    public Mono<ResponseDTO<String>> forkApplicationTemplate(@RequestBody Map<String, Object> data) {
        log.debug("create a organization and fork an app from CloudOS blueprint template");
        return cloudOSActionSolution.forkApplicationTemplate(data)
                .map(appUrl -> new ResponseDTO<>(HttpStatus.OK.value(), appUrl, null));
    }

    @PostMapping("/getMiniPreview")
    public Mono<ResponseDTO<String>> getMiniPreview(@RequestBody Map<String, Object> data) {
        log.debug("get mini-app's QR code image data (Base64)");
        return cloudOSActionSolution.getMiniPreview(data)
                .map(url -> new ResponseDTO<>(HttpStatus.OK.value(), url, null));
    }

    @PostMapping("/refreshTheCloudOSApiData")
    public Mono<ResponseDTO<String>> refreshCloudOSApiData(@RequestBody Map<String, Object> data) {
        log.debug("refresh cloudos api data");
        return cloudOSActionSolution.refreshTheCloudOSApiData(data)
                .map(url -> new ResponseDTO<>(HttpStatus.OK.value(), url, null));
    }

}
