package com.kaisneaker.backend.dto;

import java.math.BigDecimal;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductResponse {
    private UUID shoesId;
    private String shoesName;
    private BigDecimal shoesPrice;
    private String shoesDescription;
    private String shoesImg;
    private String brandName;
}
