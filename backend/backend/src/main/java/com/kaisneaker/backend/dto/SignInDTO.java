package com.kaisneaker.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO (Data Transfer Object) cho việc đăng nhập
 * Chứa thông tin cần thiết để xác thực người dùng
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SignInDTO {
    private String username;
    private String password;
}
