package com.kaisneaker.backend.utils.exceptions;

import java.util.Map;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Data
public class ServerException extends AbstractBaseException {

    public String message = "Có lỗi hệ thống xảy ra";
    public String errorCode = "SERVER_ERROR";
    public int errorStatus = 500;

    public ServerException(String message, String errorCode, Map<String, ?> detail) {
        this.message = message;
        this.errorCode = errorCode;
        this.errorStatus = 500; // luôn 500 cho server error
        this.detail = detail;
    }
}
