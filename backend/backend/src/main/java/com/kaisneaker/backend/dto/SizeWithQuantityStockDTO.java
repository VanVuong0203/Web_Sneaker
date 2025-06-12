package com.kaisneaker.backend.dto;

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
public class SizeWithQuantityStockDTO {
    private UUID idSize;
    private String sizeVi;
    private String sizeEur;
    private Integer quantityInStock;
}
