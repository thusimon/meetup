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
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Component
public class SocketTextHandler extends TextWebSocketHandler {
    private static final Logger logger = LogManager.getLogger(SocketTextHandler.class);

    private static final Gson gson = new Gson();

    private final Set<WebSocketSession> webSocketSessionSet = new HashSet<>();

    @Autowired
    UserMemoryCache userMemoryCache;

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message)
            throws InterruptedException, IOException {
        String payload = message.getPayload();
        Map<String, Object> payloadJson = gson.fromJson(payload, Map.class);
        String textResp = socketMessageHandler(payloadJson, session);
        WebSocketSession sessionToSend = selectSession(payloadJson, session);
        sessionToSend.sendMessage(new TextMessage(textResp));
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
        webSocketSessionSet.add(session);
        String allUsers = socketMessageHandler(Map.of("msg", "GetAllUsers"), session);
        broadcast(allUsers);
        logger.info("user {} connected", name);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        logger.info("Socket {} closed, code={}, reason={}", session.getId(), status.getCode(), status.getReason());
        userMemoryCache.delete(session.getId());
        webSocketSessionSet.remove(session);
        String allUsers = socketMessageHandler(Map.of("msg", "GetAllUsers"), session);
        broadcast(allUsers);
        logger.info("There are {} users, {} sessions now", userMemoryCache.size(), webSocketSessionSet.size());
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) {
        logger.error("Server transport error: {}", exception.getMessage());
    }

    private WebSocketSession selectSession(Map<String, Object> payload, WebSocketSession currentSession) {
        WebSocketSession selectedSession = currentSession;
        String msg = (String)payload.get("msg");
        Object data = payload.get("data");
        switch (msg) {
            case "VideoInvite": {
                Map<String, String> dataMap = (Map<String, String>)data;
                String toId = dataMap.get("to");
                Optional<WebSocketSession> toSession = webSocketSessionSet.stream().filter(session -> session.getId().equals(toId)).findFirst();
                if (toSession.isPresent()) {
                    selectedSession = toSession.get();
                }
                break;
            }
            case "VideoInviteReject":
            case "VideoInviteAccept": {
                Map<String, Object> dataMap = (Map<String, Object>)data;
                Map<String, String> fromUser = (Map<String, String>)dataMap.get("from");
                String fromId = fromUser.get("id");
                Optional<WebSocketSession> toSession = webSocketSessionSet.stream().filter(session -> session.getId().equals(fromId)).findFirst();
                if (toSession.isPresent()) {
                    selectedSession = toSession.get();
                }
                break;
            }
            default:
                break;
        }
        return selectedSession;
    }
    private String socketMessageHandler(Map<String, Object> payload, WebSocketSession session) {
        Map<String, Object> resp = new HashMap<>();
        String msg = (String)payload.get("msg");
        Object data = payload.get("data");
        resp.put("msg", msg);
        switch (msg) {
            case "GetCurrentUser": {
                List<User> users = userMemoryCache.getAll();
                Optional<User> currentUser = users.stream().filter(user -> user.getId().equals(session.getId())).findFirst();
                if (currentUser.isPresent()) {
                    resp.put("data", currentUser.get());
                }
                break;
            }
            case "GetAllUsers": {
                List<User> users = userMemoryCache.getAll();
                resp.put("data", users);
                break;
            }
            case "VideoInvite": {
                Map<String, String> dataMap = (Map<String, String>)data;
                String fromId = dataMap.get("from");
                String toId = dataMap.get("to");
                List<User> users = userMemoryCache.getAll();
                Optional<User> fromUser = users.stream().filter(user -> user.getId().equals(fromId)).findFirst();
                Optional<User> toUser = users.stream().filter(user -> user.getId().equals(toId)).findFirst();
                Map<String, Object> sendData = new HashMap<>();
                if (fromUser.isPresent()) {
                    sendData.put("from", fromUser.get());
                }
                if (toUser.isPresent()) {
                    sendData.put("to", toUser.get());
                }
                resp.put("data", sendData);
                break;
            }
            case "VideoInviteReject":
            case "VideoInviteAccept": {
                resp.put("data", data);
                break;
            }
        }
        return gson.toJson(resp);
    }

    private void broadcast(String message) {
        webSocketSessionSet.forEach((session) -> {
            try {
                session.sendMessage(new TextMessage(message));
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        });
    }
}
