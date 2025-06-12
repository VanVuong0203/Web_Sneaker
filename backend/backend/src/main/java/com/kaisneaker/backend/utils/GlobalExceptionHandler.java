package com.kaisneaker.backend.utils;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.kaisneaker.backend.utils.exceptions.AbstractBaseException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Xử lý các exception custom
    @ExceptionHandler(AbstractBaseException.class)
    public ResponseEntity<?> handleBaseException(AbstractBaseException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("success", false);
        body.put("message", ex.getMessage());
        body.put("errorCode", ex.getErrorCode());
        body.put("errorStatus", ex.getErrorStatus());
        body.put("detail", ex.getDetail());

        return ResponseEntity.status(ex.getErrorStatus()).body(body);
    }

    // Xử lý lỗi validate DTO
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, Object> body = new HashMap<>();
        var errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .collect(Collectors.toMap(
                        fieldError -> fieldError.getField(),
                        fieldError -> fieldError.getDefaultMessage()));

        body.put("success", false);
        body.put("message", "Validation failed");
        body.put("errorCode", "VALIDATION_ERROR");
        body.put("errorStatus", 400);
        body.put("detail", errors);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    // Xử lý các lỗi còn lại (không đoán trước được)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(Exception ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("success", false);
        body.put("message", ex.getMessage());
        body.put("errorCode", "INTERNAL_SERVER_ERROR");
        body.put("errorStatus", 500);
        body.put("detail", null);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}
