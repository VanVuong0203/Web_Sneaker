package com.kaisneaker.backend.dto.impl;

import com.kaisneaker.backend.model.User;
import lombok.AllArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

/**
 * Lớp ánh xạ User -> UserDetails để Spring Security có thể xử lý.
 */
@AllArgsConstructor
public class UserDetailsImpl implements UserDetails {

    private final User user;

    // Lấy quyền từ đối tượng role
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton((GrantedAuthority) () -> "ROLE_" + user.getRole().getRoleName());
    }

    @Override
    public String getPassword() {
        return user.getPassword(); // Mật khẩu mã hoá
    }

    @Override
    public String getUsername() {
        return user.getUsername(); // Tên đăng nhập
    }

    // Các method dưới đây có thể sửa theo trạng thái tài khoản (mặc định là true)
    @Override
    public boolean isAccountNonExpired() {
        return true; // Không hết hạn
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Không bị khoá
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Không hết hạn mật khẩu
    }

    @Override
    public boolean isEnabled() {
        return true; // Tài khoản hoạt động
    }

    public User getUser() {
        return user; // Truy cập toàn bộ thông tin gốc nếu cần
    }
}
