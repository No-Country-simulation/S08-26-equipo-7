package com.serviceflow.api.infrastructure.config;

import java.time.LocalDateTime;

import org.springframework.boot.jackson.autoconfigure.JsonMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.serviceflow.api.infrastructure.jackson.UtcLocalDateTimeDeserializer;
import com.serviceflow.api.infrastructure.jackson.UtcLocalDateTimeSerializer;

import tools.jackson.databind.module.SimpleModule;

@Configuration
public class JacksonConfig {

    @Bean
    public JsonMapperBuilderCustomizer jacksonUtcCustomizer() {
        return builder -> {
            SimpleModule module = new SimpleModule("UtcLocalDateTime");
            module.addSerializer(LocalDateTime.class, new UtcLocalDateTimeSerializer());
            module.addDeserializer(LocalDateTime.class, new UtcLocalDateTimeDeserializer());
            builder.addModule(module);
        };
    }
}