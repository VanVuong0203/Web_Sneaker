package com.kaisneaker.backend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kaisneaker.backend.dto.UserDTO;
import com.kaisneaker.backend.model.User;
import com.kaisneaker.backend.service.UserService;
import com.kaisneaker.backend.utils.common.ResultEntity;

import jakarta.validation.Valid;

@RestController
@CrossOrigin
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("")
    public ResponseEntity<ResultEntity<UserDTO>> createUser(@Valid @RequestBody UserDTO userDTO) {
        userService.createUser(userDTO);
        return ResponseEntity.ok(ResultEntity.of("Tạo User thành công", userDTO));
    }

    @GetMapping("")
    public ResponseEntity<ResultEntity<List<User>>> getAllUsers() {
        return ResponseEntity.ok(ResultEntity.of("Danh sách Size", userService.getAllUsers()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResultEntity<User>> getUserByID(@PathVariable("id") UUID id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(ResultEntity.of("Lấy User thành công", user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResultEntity<User>> getUserByID(@PathVariable("id") UUID id,
            @Valid @RequestBody UserDTO userDTO) {
        User user = userService.updateUser(id, userDTO);
        return ResponseEntity.ok(ResultEntity.of("Cập nhật User thành công", user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResultEntity<String>> deleteSlider(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ResultEntity.of("Xoá User thành công", "DELETED"));
    }

    @GetMapping("/username")
    public ResponseEntity<ResultEntity<User>> getUserByUsername(@RequestParam String username) {
        User user = userService.getUserByUsername(username);
        return ResponseEntity.ok(ResultEntity.of("Lấy User thành công", "200", user));
    }
}
