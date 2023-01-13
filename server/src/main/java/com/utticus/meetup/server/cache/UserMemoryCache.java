package com.utticus.meetup.server.cache;

import com.utticus.meetup.server.model.User;
import org.springframework.stereotype.Service;

@Service
public class UserMemoryCache extends MemoryMapCache<String, User>{
}
