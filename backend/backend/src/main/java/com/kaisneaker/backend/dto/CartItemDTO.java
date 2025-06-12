package com.kaisneaker.backend.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CartItemDTO {

    @NotNull(message = "idAccount must not be null")
    private UUID idAccount;

    @NotNull(message = "shoesId must not be null")
    private UUID shoesId;

    @NotNull(message = "idSize must not be null")
    private UUID idSize;

    @NotNull(message = "quantity must not be null")
    private int quantity;
}
