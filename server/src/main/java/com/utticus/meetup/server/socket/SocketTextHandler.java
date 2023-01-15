package com.utticus.meetup.server.socket;

import com.google.gson.Gson;
import com.utticus.meetup.server.cache.UserMemoryCache;
import com.utticus.meetup.server.model.User;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.List;

@Component
public class SocketTextHandler extends TextWebSocketHandler {
    private static final Logger logger = LogManager.getLogger(SocketTextHandler.class);

    private static final Gson gson = new Gson();
    @Autowired
    UserMemoryCache userMemoryCache;

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message)
            throws InterruptedException, IOException {
        String payload = message.getPayload();
        String textResp = socketMessageHandler(payload, session);
        session.sendMessage(new TextMessage(textResp));
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        MultiValueMap<String, String> queryParams = UriComponentsBuilder.fromUri(session.getUri()).build().getQueryParams();
        List<String> nameVals = queryParams.get("name");
        String id = session.getId();
        String name = id;
        if (!nameVals.isEmpty()) {
            name = URLDecoder.decode(nameVals.get(0), "UTF-8");
        }
        userMemoryCache.add(id, new User(id, name));
        logger.info("user {} connected", name);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        logger.info("Socket {} closed, code={}, reason={}", session.getId(), status.getCode(), status.getReason());
        userMemoryCache.delete(session.getId());
        logger.info("There are {} users now", userMemoryCache.size());
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) {
        logger.error("Server transport error: {}", exception.getMessage());
    }

    private String socketMessageHandler(String message, WebSocketSession session) {
        String textResp = "";
        switch (message) {
            case "GetAllUsers": {
                List<User> users = new ArrayList<>();
                for (User user : userMemoryCache.getAll()) {
                    User clonedUser = null;
                    try {
                        clonedUser = (User) user.clone();
                    } catch (CloneNotSupportedException e) {
                        throw new RuntimeException(e);
                    }
                    if (clonedUser.getId() == session.getId()) {
                        clonedUser.setSelf(true);
                    }
                    users.add(clonedUser);
                }
                textResp = gson.toJson(users);
                break;
            }
        }
        return textResp;
    }
}
