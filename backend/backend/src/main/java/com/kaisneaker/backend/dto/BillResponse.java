package com.kaisneaker.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class BillResponse {
    private UUID billId;
    private UUID idAccount; // ID tài khoản người dùng
    private String imageUser;
    private String fullName;
    private String gender;
    private BigDecimal totalAmount; // Tổng giá trị đơn hàng
    private LocalDate billDate; // Ngày lập hóa đơn
    private String status; // Trạng thái hóa đơn
    private AddressResponse shoppingInfo; // Thông tin địa chỉ giao hàng
    private List<BillDetailDTO> billDetail; // Chi tiết hóa đơn
}
