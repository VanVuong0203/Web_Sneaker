package com.kaisneaker.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SliderDTO {
    private String imageUrl;
    private String description;
    private int order; // Dùng để sắp xếp các slide
}
