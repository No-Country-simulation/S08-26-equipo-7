package com.serviceflow.api.domain;

public enum RolUsuario {
    REQUESTER,
    AGENT,
    SUPERVISOR,
    ADMIN;

    public static String[] getNames() {
        return java.util.Arrays.stream(values()).map(Enum::name).toArray(String[]::new);
    }
}