package com.serviceflow.api.infrastructure.jackson;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

import tools.jackson.core.JacksonException;
import tools.jackson.core.JsonParser;
import tools.jackson.databind.DeserializationContext;
import tools.jackson.databind.ValueDeserializer;

public class UtcLocalDateTimeDeserializer extends ValueDeserializer<LocalDateTime> {

    @Override
    public LocalDateTime deserialize(JsonParser p, DeserializationContext ctxt) throws JacksonException {
        String text = p.getText();
        if (text == null || text.isBlank()) {
            return null;
        }
        String trimmed = text.trim();
        if (trimmed.endsWith("Z")) {
            return Instant.parse(trimmed).atZone(ZoneOffset.UTC).toLocalDateTime();
        }
        return LocalDateTime.parse(trimmed);
    }

    @Override
    public Class<LocalDateTime> handledType() {
        return LocalDateTime.class;
    }
}