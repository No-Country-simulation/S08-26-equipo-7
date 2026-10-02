package com.serviceflow.api.infrastructure.ratelimit;

import org.springframework.stereotype.Component;

import java.util.ArrayDeque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class InMemoryRateLimiter {

    private final Map<String, ArrayDeque<Long>> requestsByKey = new ConcurrentHashMap<>();

    public boolean allow(String key, int maxRequests, long windowMs) {
        long now = System.currentTimeMillis();
        ArrayDeque<Long> timestamps = requestsByKey.computeIfAbsent(key, k -> new ArrayDeque<>());

        synchronized (timestamps) {
            while (!timestamps.isEmpty() && now - timestamps.peekFirst() >= windowMs) {
                timestamps.pollFirst();
            }
            if (timestamps.size() >= maxRequests) {
                return false;
            }
            timestamps.addLast(now);
            return true;
        }
    }
}