package com.kaisneaker.backend.controller;

import com.kaisneaker.backend.dto.CartItemDTO;
import com.kaisneaker.backend.dto.CartItemResponse;
import com.kaisneaker.backend.service.CartItemService;
import com.kaisneaker.backend.utils.common.ResultEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/cart")
@CrossOrigin
public class CartItemController {

    @Autowired
    private CartItemService cartItemService;

    @PostMapping("")
    public ResponseEntity<ResultEntity<CartItemDTO>> createCartItem(@RequestBody CartItemDTO cartItemDTO) {
        String message = cartItemService.createCartItem(cartItemDTO);
        return ResponseEntity.ok(ResultEntity.of(message, cartItemDTO));
    }

    @GetMapping("")
    public ResponseEntity<ResultEntity<List<CartItemResponse>>> getAllCartItems() {
        return ResponseEntity
                .ok(ResultEntity.of("Lấy danh sách giỏ hàng thành công", cartItemService.getAllCartItems()));
    }

    @GetMapping("/account/{userId}")
    public ResponseEntity<ResultEntity<List<CartItemResponse>>> getCartItemsByAccountId(
            @PathVariable("userId") UUID accountID) {
        return ResponseEntity.ok(ResultEntity.of("Lấy danh sách giỏ hàng theo tài khoản thành công",
                cartItemService.getCartItemsByAccountId(accountID)));
    }

    @PutMapping("/{idCart}")
    public ResponseEntity<ResultEntity<CartItemResponse>> updateCartItem(@PathVariable("idCart") UUID idCart,
            @RequestBody CartItemDTO cartItemDTO) {
        return ResponseEntity.ok(ResultEntity.of("Cập nhật sản phẩm trong giỏ hàng thành công",
                cartItemService.updateCartItem(idCart, cartItemDTO)));
    }

    @DeleteMapping("/{idCart}")
    public ResponseEntity<ResultEntity<?>> deleteCartItem(@PathVariable UUID idCart) {
        cartItemService.deleteCartItem(idCart);
        return ResponseEntity.ok(ResultEntity.of("Xóa sản phẩm trong giỏ hàng thành công", "DELETED", null));
    }

    @DeleteMapping("/account/{userId}")
    public ResponseEntity<ResultEntity<?>> deleteCartItemsByAccountId(@PathVariable("userId") UUID accountID) {
        cartItemService.clearCart(accountID);
        return ResponseEntity
                .ok(ResultEntity.of("Xóa tất cả sản phẩm trong giỏ hàng thành công", "DELETED", null));
    }
}
