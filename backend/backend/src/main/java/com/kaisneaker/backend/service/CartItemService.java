package com.kaisneaker.backend.service;

import java.util.List;
import java.util.UUID;

import com.kaisneaker.backend.dto.CartItemDTO;
import com.kaisneaker.backend.dto.CartItemResponse;

public interface CartItemService {

    String createCartItem(CartItemDTO dto);

    List<CartItemResponse> getAllCartItems();

    CartItemResponse updateCartItem(UUID idCart, CartItemDTO dto);

    void deleteCartItem(UUID idCart);

    void clearCart(UUID userId);

    List<CartItemResponse> getCartItemsByAccountId(UUID userId);
}
