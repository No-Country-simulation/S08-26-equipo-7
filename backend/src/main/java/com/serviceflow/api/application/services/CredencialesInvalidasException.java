package com.serviceflow.api.application.services;

public class CredencialesInvalidasException extends RuntimeException {

    public CredencialesInvalidasException(String message) {
        super(message);
    }
}