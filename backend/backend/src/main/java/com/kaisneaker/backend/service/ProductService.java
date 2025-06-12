package com.kaisneaker.backend.service;

import java.util.List;
import java.util.UUID;

import com.kaisneaker.backend.dto.ProductDTO;
import com.kaisneaker.backend.model.Product;

public interface ProductService {
    List<Product> getAllProducts();

    Product getProductById(UUID id);

    List<Product> getProductByName(String productName);

    void createProduct(ProductDTO product);

    Product updateProduct(UUID id, ProductDTO product);

    void deleteProduct(UUID id);

    List<Product> getTopSellingProduct();
}
