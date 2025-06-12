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
public class AddressResponse {
    private UUID shoppingInfoId;
    private String shoppingInfoName;
    private String address;
    private String shoppingInfoPhone;
    private UUID idAccount;
}
