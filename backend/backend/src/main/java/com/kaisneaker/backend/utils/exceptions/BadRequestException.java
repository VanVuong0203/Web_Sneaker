package com.kaisneaker.backend.utils.exceptions;

import java.util.Map;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class BadRequestException extends AbstractBaseException {
    public String message = "Yêu cầu không phù hợp";
    public String errorCode = "BAD_REQUEST";
    public int errorStatus = 400;

    public BadRequestException(String message, String errorCode, Map<String, ?> detail) {
        this.setErrorCode(errorCode);
        this.setMessage(message);
        this.setDetail(detail);
    }
}
