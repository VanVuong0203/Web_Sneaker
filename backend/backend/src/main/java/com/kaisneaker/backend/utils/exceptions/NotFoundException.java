package com.kaisneaker.backend.utils.exceptions;

import java.util.Map;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class NotFoundException extends AbstractBaseException {
    public String message = "Không tìm thấy dữ liệu";
    public String errorCode = "NOTFOUND";
    public final int errorStatus = 404;

    public NotFoundException() {
        this.setMessage(message);
    }

    public NotFoundException(Map<String, Object> detail) {
        this.setMessage(message);
        this.setDetail(detail);
    }

    public NotFoundException(String message) {
        this.setMessage(message);
    }
}
