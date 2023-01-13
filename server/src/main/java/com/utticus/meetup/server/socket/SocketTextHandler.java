package com.utticus.meetup.server.socket;

import com.utticus.meetup.server.cache.UserMemoryCache;
import com.utticus.meetup.server.model.User;
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
import java.util.List;

@Component
public class SocketTextHandler extends TextWebSocketHandler {
    @Autowired
    UserMemoryCache userMemoryCache;

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message)
            throws InterruptedException, IOException {
        String payload = message.getPayload();
        System.out.println("16: " + session.getId());
        session.sendMessage(new TextMessage("Resp: " + payload));
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
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        System.out.println("socket closed: id=" + session.getId());
        System.out.println(status.getCode() + ", " + status.getReason());

        userMemoryCache.delete(session.getId());
        System.out.println("current user size: " + userMemoryCache.size());
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) {
        System.out.println("Server transport error: " + exception.getMessage());
    }
}
