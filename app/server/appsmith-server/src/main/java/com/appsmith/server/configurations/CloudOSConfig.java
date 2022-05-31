package com.appsmith.server.configurations;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class CloudOSConfig {
    @Value("${pageplug.cloudos.wx_appid}")
    String wxAppId;

    @Value("${pageplug.cloudos.wx_secret}")
    String wxSecret;
}
