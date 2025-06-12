package com.kaisneaker.backend.utils.common;

import java.util.List;

import lombok.Data;

@Data
public class ResultPageDTO<T> {
    List<T> results;
    int page;
    int total;
    int pages;
}
