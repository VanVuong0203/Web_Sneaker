package com.kaisneaker.backend.utils;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.kaisneaker.backend.model.User;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtils {
    // Secret key (>=32 bytes)
    private static final String SECRET_KEY = "KaisneakerSuperSecretKeyJwtMustBeLongEnough!";

    // Tạo key từ chuỗi secret
    private final SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));

    // Token hết hạn sau 10 ngày
    private final long JWT_EXPIRATION = 864000000L; // 10 ngày (10 * 24 * 60 * 60 * 1000)

    // 🔐 Tạo JWT từ username
    public String generateToken(UserDetails userDetails, User user) {

        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .claim("role", user.getRole().getRoleName()) // Thêm role vào token
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // 📦 Lấy username từ token
    public String extractUsername(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // ✅ Kiểm tra token hợp lệ
    public boolean isTokenValid(String token, UserDetails userDetails) {
        return extractUsername(token).equals(userDetails.getUsername()) && !isExpired(token);
    }

    // 🧭 Kiểm tra token hết hạn chưa
    private boolean isExpired(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().getExpiration().before(new Date());
    }
}
