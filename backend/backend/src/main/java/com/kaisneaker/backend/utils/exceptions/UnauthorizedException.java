package com.kaisneaker.backend.utils.exceptions;

import java.util.Map;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Data
public class UnauthorizedException extends AbstractBaseException {

    public String message = "Không có quyền truy cập";
    public String errorCode = "UNAUTHORIZED";
    public int errorStatus = 403;

    public UnauthorizedException(String message, Map<String, ?> detail) {
        this.message = message;
        this.detail = detail;
    }

    public UnauthorizedException(String message) {
        this.message = message;
    }
}
