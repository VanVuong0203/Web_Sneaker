package com.kaisneaker.backend.utils.exceptions;

import java.util.Map;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Data
public class UnauthenticatedException extends AbstractBaseException {

    public String message = "Bạn chưa đăng nhập";
    public String errorCode = "UNAUTHENTICATED";
    public int errorStatus = 401;

    public UnauthenticatedException(String message, Map<String, ?> detail) {
        this.message = message;
        this.detail = detail;
    }

    public UnauthenticatedException(String message) {
        this.message = message;
    }
}
