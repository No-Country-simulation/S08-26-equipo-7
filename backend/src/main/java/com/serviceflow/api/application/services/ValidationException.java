package com.serviceflow.api.application.services;

public class ValidationException extends RuntimeException {
    public ValidationException(String message) {
        super(message);
    }
}