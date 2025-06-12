package com.kaisneaker.backend.controller;

import java.util.List;
import java.util.UUID;

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

import com.kaisneaker.backend.dto.ProductDTO;
import com.kaisneaker.backend.model.Product;
import com.kaisneaker.backend.service.ProductService;
import com.kaisneaker.backend.utils.common.ResultEntity;

@RestController
@RequestMapping("/products")
@CrossOrigin
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping("")
    public ResponseEntity<ResultEntity<List<Product>>> getAllProducts() {
        return ResponseEntity.ok(ResultEntity.of("Danh sách Brand", productService.getAllProducts()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResultEntity<Product>> getProductById(@PathVariable() UUID id) {
        return ResponseEntity
                .ok(ResultEntity.of("Lấy Product (" + id + ") thành công: ", productService.getProductById(id)));
    }

    @GetMapping("/search/{name}")
    public ResponseEntity<ResultEntity<List<Product>>> getProductContainsName(@PathVariable("name") String name) {
        return ResponseEntity
                .ok(ResultEntity.of("Tìm kiếm Product thành công: ", productService.getProductByName(name)));
    }

    @PostMapping("")
    public ResponseEntity<ResultEntity<ProductDTO>> createProduct(@RequestBody ProductDTO productDTO) {
        productService.createProduct(productDTO);

        return ResponseEntity.ok(ResultEntity.of("Tạo Product thành công", productDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResultEntity<Product>> updateProduct(@PathVariable UUID id,
            @RequestBody ProductDTO productDTO) {
        return ResponseEntity
                .ok(ResultEntity.of("Cập nhật Product(" + id + ") thành công",
                        productService.updateProduct(id, productDTO)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResultEntity<String>> deleteProduct(@PathVariable UUID id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ResultEntity.of("Xoá sản phẩm thành công", "DELETED"));

    }

    @GetMapping("/top-selling")
    public ResponseEntity<ResultEntity<List<Product>>> getTop4SellingProducts() {
        List<Product> products = productService.getTopSellingProduct();
        return ResponseEntity.ok(ResultEntity.of("Lấy sản phẩm nổi bật thành công", products));
    }
}