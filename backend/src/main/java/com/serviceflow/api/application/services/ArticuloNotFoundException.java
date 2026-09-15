package com.serviceflow.api.application.services;

public class ArticuloNotFoundException extends RuntimeException {
    public ArticuloNotFoundException(String message) {
        super(message);
    }
}