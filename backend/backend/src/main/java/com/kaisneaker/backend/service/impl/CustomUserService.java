package com.kaisneaker.backend.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.kaisneaker.backend.dto.impl.UserDetailsImpl;
import com.kaisneaker.backend.model.User;
import com.kaisneaker.backend.repository.UserRepository;

@Service
public class CustomUserService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("Looking for user: " + username);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    System.out.println("User not found: " + username);
                    return new UsernameNotFoundException("User not found");
                });
        System.out.println("User found: " + user.getUsername() + ", Password: " + user.getPassword());
        return new UserDetailsImpl(user);
    }
}
