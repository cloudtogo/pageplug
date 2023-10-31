package com.appsmith.server.domains;

import lombok.Data;

import java.util.LinkedHashMap;
import java.util.Map;

@Data
public class OAuth2Authorization {

    private LoginSource source;

    private String name;

    private String avatarUrl;

    private String openId;

    private Map<String, Object> rawUserInfo = new LinkedHashMap<>();
}
