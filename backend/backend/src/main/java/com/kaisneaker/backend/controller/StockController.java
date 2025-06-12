package com.kaisneaker.backend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kaisneaker.backend.dto.SizeWithQuantityStockDTO;
import com.kaisneaker.backend.dto.StockDTO;
import com.kaisneaker.backend.model.Stock;
import com.kaisneaker.backend.service.StockService;
import com.kaisneaker.backend.utils.common.ResultEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@CrossOrigin
@RequestMapping("/stock")
public class StockController {
    @Autowired
    private StockService stockService;

    @GetMapping("")
    public ResponseEntity<ResultEntity<List<Stock>>> getAllStock() {
        return ResponseEntity.ok(ResultEntity.of("Lấy tất cả sản phẩm trong kho", stockService.getAllStocks()));
    }

    @PostMapping("")
    public ResponseEntity<ResultEntity<?>> createStock(@RequestBody StockDTO stockDTO) {
        try {
            stockService.createStock(stockDTO);
            return ResponseEntity.ok(ResultEntity.of("Tạo thành công số lượng sản phẩm trong kho", stockDTO));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ResultEntity.of("Đã tồn tại sản phẩm và size này trong kho", "BAD_REQUEST", stockDTO));
        }
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<ResultEntity<List<SizeWithQuantityStockDTO>>> getByProductId(@PathVariable UUID productId) {

        return ResponseEntity
                .ok(ResultEntity.of("Danh sách số lượng sản phẩm trong kho", stockService.getByProductId(productId)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResultEntity<String>> deleteStock(@PathVariable UUID id) {
        stockService.deleteStock(id);
        return ResponseEntity.ok(ResultEntity.of("Xoá Stock(" + id + ") thành công", "DELETED"));

    }

    @PutMapping("/{id}")
    public ResponseEntity<ResultEntity<Stock>> updateStock(
            @PathVariable UUID id,
            @RequestBody StockDTO stockDTO) {
        try {
            Stock updated = stockService.updateStock(id, stockDTO);
            return ResponseEntity.ok(ResultEntity.of("Cập nhật sản phẩm trong kho thành công", updated));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ResultEntity.of(e.getMessage(), "BAD_REQUEST", null));
        }
    }
}
