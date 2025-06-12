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
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class BillDetailDTO {
    private UUID shoesId; // ID của giày
    private String shoesName; // Tên giày
    private String shoesImg; // Ảnh của giày
    private int quantity; // Số lượng giày
    private BigDecimal shoesPrice; // Giá của giày
    private UUID sizeId; // ID của size
    private String sizeVi;
    private BigDecimal totalPrice; // Tổng tiền của sản phẩm (quantity * shoesPrice)
}
