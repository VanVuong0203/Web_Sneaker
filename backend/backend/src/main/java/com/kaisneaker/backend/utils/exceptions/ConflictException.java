package com.kaisneaker.backend.utils.exceptions;

import java.util.Map;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class ConflictException extends AbstractBaseException {
    public String message = "Resource conflict";
    public String errorCode = "CONFLICT";
    public final int errorStatus = 409;

    public ConflictException() {
        this.setMessage(message);
    }

    public ConflictException(Map<String, Object> detail) {
        this.setMessage(message);
        this.setDetail(detail);
    }

    public ConflictException(String message) {
        this.setMessage(message);
    }
}
