package com.kaisneaker.backend.utils.exceptions;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public abstract class AbstractBaseException extends RuntimeException {
    public String message;
    public int errorStatus = 500;
    public String errorCode;
    public boolean success;
    public Map<String, ?> detail;
}
