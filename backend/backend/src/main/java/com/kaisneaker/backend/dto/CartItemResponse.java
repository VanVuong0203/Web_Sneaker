package com.kaisneaker.backend.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemResponse {
    private UUID idAccount;
    private UUID idCartItem;
    private ProductResponse product;
    private SizeWithQuantityStockDTO size;
    private int quantity;
}
