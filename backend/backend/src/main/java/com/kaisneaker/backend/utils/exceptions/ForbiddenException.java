package com.kaisneaker.backend.utils.exceptions;

import java.util.Map;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Data
public class ForbiddenException extends AbstractBaseException {
    public String message = "Không có quyền truy cập";
    public String errorCode = "FORBBIDEN";
    public final int errorStatus = 403;

    public ForbiddenException(String message, Map<String, ?> detail) {
        this.setMessage(message);
        this.setDetail(detail);
    }
}
