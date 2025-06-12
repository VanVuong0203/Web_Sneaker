package com.kaisneaker.backend.dto;

import java.math.BigDecimal;
import java.util.List;

import com.kaisneaker.backend.model.Brand;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private String shoesName;
    private BigDecimal shoesPrice;
    private String shoesDescription;
    private List<String> shoesImg;
    private Brand brand;
}
