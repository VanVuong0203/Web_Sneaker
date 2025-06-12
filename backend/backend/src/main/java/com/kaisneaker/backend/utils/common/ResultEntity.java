package com.kaisneaker.backend.utils.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResultEntity<T> {
    private String message;

    private boolean success = true;

    private String returnCode = "SUCCESS";

    private T result;

    public ResultEntity(String message, T result) {
        this.message = message;
        this.result = result;
    }

    public static <T> ResultEntity<T> of(String message, String returnCode, T result) {
        return new ResultEntity<T>(message, true, returnCode, result);
    }

    public static <T> ResultEntity<T> of(String message, T result) {
        return new ResultEntity<T>(message, result);
    }
}
