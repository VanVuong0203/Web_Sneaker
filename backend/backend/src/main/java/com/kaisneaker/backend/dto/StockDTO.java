package com.kaisneaker.backend.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StockDTO {

    private UUID productId;
    private UUID idSize;
    private int quantityInStock;
}
