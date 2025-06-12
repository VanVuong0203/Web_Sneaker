package com.kaisneaker.backend.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.kaisneaker.backend.dto.RegisterDTO;
import com.kaisneaker.backend.dto.UserDTO;
import com.kaisneaker.backend.model.Role;
import com.kaisneaker.backend.model.User;
import com.kaisneaker.backend.repository.RoleRepository;
import com.kaisneaker.backend.repository.UserRepository;
import com.kaisneaker.backend.service.UserService;
import com.kaisneaker.backend.utils.exceptions.NotFoundException;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy User"));
        return user;
    }

    @Override
    public void createUser(UserDTO user) {
        userRepository.save(mapToEntity(user));
    }

    @Override
    public User updateUser(UUID id, UserDTO userDTO) {

        User user = getUserById(id);

        // Cập nhật thông tin user
        user.setUsername(userDTO.getUsername());
        user.setFullName(userDTO.getFullName());
        user.setGender(userDTO.getGender());
        user.setEmail(userDTO.getEmail());
        user.setDateOfBirth(userDTO.getDateOfBirth());
        user.setImageUser(userDTO.getImageUser());

        if (userDTO.getCccd() != null && !userDTO.getCccd().isEmpty()) {
            // Kiểm tra CCCD chỉ khi nó không phải là null
            if (!userDTO.getCccd().matches("\\d{12}")) {
                throw new RuntimeException("CCCD không hợp lệ");
            }
            user.setCccd(userDTO.getCccd());
        }

        if (userDTO.getNumberPhone() != null && !userDTO.getNumberPhone().isEmpty()) {
            // Kiểm tra số điện thoại chỉ khi nó không phải là null
            if (!userDTO.getNumberPhone().matches("\\d{10}")) {
                throw new RuntimeException("Số điện thoại không hợp lệ");
            }
            user.setNumberPhone(userDTO.getNumberPhone());
        }

        // Nếu mật khẩu được thay đổi, mã hóa mật khẩu
        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }

        // Lưu lại thông tin đã cập nhật
        return userRepository.save(user);

    }

    @Override
    public void deleteUser(UUID id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
        }
    }

    private User mapToEntity(UserDTO dto) {
        // Chuyển đổi dateOfBirth từ String sang LocalDate
        Optional<User> existingUser = userRepository.findByUsername(dto.getUsername());

        // Kiểm tra xem tên đăng nhập đã tồn tại chưa
        // Nếu đã tồn tại thì ném ra ngoại lệ
        if (existingUser.isPresent()) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại");
        }

        Role role = roleRepository.findByRoleName(dto.getRoleName().toUpperCase())
                .orElseThrow(() -> new NotFoundException("Role không tồn tại"));

        // Tạo đối tượng User từ UserDTO
        User entity = User.builder()
                .username(dto.getUsername())
                .password(passwordEncoder.encode(dto.getPassword()))
                .fullName(dto.getFullName())
                .gender(dto.getGender())
                .cccd(dto.getCccd())
                .email(dto.getEmail())
                .numberPhone(dto.getNumberPhone())
                .dateOfBirth(dto.getDateOfBirth())
                .imageUser(dto.getImageUser())
                .role(role) // Gán Role cho user
                .build();

        return entity;
    }

    // Chuyển đổi RegisterDTO thành User
    private User convertToUser(RegisterDTO registerDTO) {

        Optional<User> existingUser = userRepository.findByUsername(registerDTO.getUsername());
        // Kiểm tra xem tên đăng nhập đã tồn tại chưa
        // Nếu đã tồn tại thì ném ra ngoại lệ
        if (existingUser.isPresent()) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại");
        }

        // Mặc định khi tạo là USER
        Role role = roleRepository.findByRoleName("USER")
                .orElseThrow(() -> new RuntimeException("Role không tồn tại"));

        return User.builder()
                .username(registerDTO.getUsername())
                .password(passwordEncoder.encode(registerDTO.getPassword()))
                .fullName("Nguyễn Văn A") // mặc định là Nguyễn Văn A
                .gender("Nam") // mặc định là Nam
                .role(role)
                .build();
    }

    // Hàm tạo tài khoản
    @Override
    public void register(RegisterDTO userRegisterDTO) {
        userRepository.save(convertToUser(userRegisterDTO));
    }

    @Override
    public User getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy User"));

        return user;
    }

}
