package com.kaisneaker.backend.dto;

import java.math.BigDecimal;
import java.util.UUID;

public interface CartItemWithStockProjection {
    UUID getIdCartItem();

    UUID getIdAccount();

    UUID getShoesId();

    String getShoesName();

    BigDecimal getShoesPrice();

    String getShoesDescription();

    String getShoesImg();

    String getBrandName();

    UUID getSizeId();

    String getSizeVi();

    String getSizeEur();

    int getQuantityInStock(); // từ Stock

    int getQuantity(); // trong giỏ hàng
}
