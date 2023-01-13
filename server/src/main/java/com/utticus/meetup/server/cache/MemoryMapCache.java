package com.utticus.meetup.server.cache;

import java.util.HashMap;
import java.util.Map;

public class MemoryMapCache<String, T> {
    private final Map<String, T> cache;
    public MemoryMapCache() {
        cache = new HashMap<>();
    }

    public void add(String key, T item) {
        cache.put(key, item);
    }

    public void addCollection(Map<String, T> items) {
        for (Map.Entry<String, T> entry : items.entrySet()) {
            cache.put(entry.getKey(), entry.getValue());
        }
    }

    public void delete(String key) {
        cache.remove(key);
    }

    public void deleteAll() {
        cache.clear();
    }

    public int size() {
        return cache.size();
    }
}
