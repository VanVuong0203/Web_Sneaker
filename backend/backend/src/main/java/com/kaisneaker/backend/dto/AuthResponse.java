package com.kaisneaker.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

// 📤 Dùng để trả về token cho client
@Getter
@AllArgsConstructor
public class AuthResponse {
    private String token;
}
