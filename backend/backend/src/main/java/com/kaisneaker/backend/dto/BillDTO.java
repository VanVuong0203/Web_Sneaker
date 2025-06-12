package com.kaisneaker.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
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
public class BillDTO {
    private UUID idAccount;
    private BigDecimal totalAmount;
    private LocalDate billDate;
    private String status;
    private UUID shoppingInfoId;
}
