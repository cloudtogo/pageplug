package com.appsmith.server.configurations;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class CloudOSConfig {
    @Value("${pageplug.cloudos.api_baseurl}")
    String baseUrl;

    @Value("${pageplug.cloudos.mock_baseurl}")
    String mockUrl;

    @Value("${pageplug.cloudos.db_baseurl}")
    String dbUrl;

    @Value("${pageplug.cloudos.in_cloudos}")
    Boolean inCloudOS;

    @Value("${pageplug.cloudos.jwt_secret_key}")
    String secretKey;

    @Value("${pageplug.cloudos.wx_appid}")
    String wxAppId;

    @Value("${pageplug.cloudos.wx_secret}")
    String wxSecret;
}
