package com.kaisneaker.backend.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    @NotBlank(message = "Username không được để trống")
    @Size(min = 4, max = 20)
    private String username;

    private String password;

    private String fullName;

    private String gender;

    private String cccd;

    @Email(message = "Email không hợp lệ")
    private String email;

    private String numberPhone;

    private LocalDate dateOfBirth; // parse về LocalDate trong service

    private String imageUser;

    private String roleName;
}
