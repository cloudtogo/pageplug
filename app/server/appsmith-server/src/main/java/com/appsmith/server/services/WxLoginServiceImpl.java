package com.appsmith.server.services;

import com.appsmith.server.authentication.handlers.AuthenticationSuccessHandler;
import com.appsmith.server.repositories.UserRepository;
import com.appsmith.server.services.ce.WxLoginServiceCEImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Validator;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.convert.MongoConverter;
import org.springframework.stereotype.Service;
import reactor.core.scheduler.Scheduler;

@Service
public class WxLoginServiceImpl extends WxLoginServiceCEImpl implements WxLoginService {
    public WxLoginServiceImpl(
            Scheduler scheduler,
            Validator validator,
            MongoConverter mongoConverter,
            ReactiveMongoTemplate reactiveMongoTemplate,
            UserRepository repository,
            AnalyticsService analyticsService,
            AuthenticationSuccessHandler authenticationSuccessHandler,
            SessionUserService sessionUserService,
            ObjectMapper objectMapper) {
        super(
                scheduler,
                validator,
                mongoConverter,
                reactiveMongoTemplate,
                repository,
                analyticsService,
                authenticationSuccessHandler,
                sessionUserService,
                objectMapper);
    }
}
