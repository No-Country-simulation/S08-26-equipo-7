package com.serviceflow.api.infrastructure.jackson;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

import tools.jackson.core.JsonGenerator;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.SerializationContext;
import tools.jackson.databind.ValueSerializer;

public class UtcLocalDateTimeSerializer extends ValueSerializer<LocalDateTime> {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

    @Override
    public void serialize(LocalDateTime value, JsonGenerator gen, SerializationContext serializers)
            throws JacksonException {
        if (value == null) {
            gen.writeNull();
            return;
        }
        gen.writeString(value.atOffset(ZoneOffset.UTC).format(FORMATTER));
    }

    @Override
    public Class<LocalDateTime> handledType() {
        return LocalDateTime.class;
    }
}