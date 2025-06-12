package com.kaisneaker.backend.service;

import java.util.List;
import java.util.UUID;

import com.kaisneaker.backend.dto.RegisterDTO;
import com.kaisneaker.backend.dto.UserDTO;
import com.kaisneaker.backend.model.User;

public interface UserService {
    List<User> getAllUsers();

    User getUserById(UUID id);

    User getUserByUsername(String username);

    void createUser(UserDTO user);

    User updateUser(UUID id, UserDTO user);

    void deleteUser(UUID id);

    void register(RegisterDTO userRegisterDTO);

}
