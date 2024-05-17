package com.appsmith.server.services;

import com.appsmith.server.authentication.handlers.AuthenticationSuccessHandler;
import com.appsmith.server.repositories.UserRepository;
import com.appsmith.server.services.ce.WxLoginServiceCEImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Validator;
import org.springframework.stereotype.Service;

@Service
public class WxLoginServiceImpl extends WxLoginServiceCEImpl implements WxLoginService {
    public WxLoginServiceImpl(
            Validator validator,
            UserRepository repository,
            AnalyticsService analyticsService,
            AuthenticationSuccessHandler authenticationSuccessHandler,
            SessionUserService sessionUserService,
            ObjectMapper objectMapper) {
        super(validator, repository, analyticsService, authenticationSuccessHandler, sessionUserService, objectMapper);
    }
}
