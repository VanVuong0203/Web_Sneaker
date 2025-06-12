package com.kaisneaker.backend.service.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kaisneaker.backend.dto.ProductDTO;
import com.kaisneaker.backend.model.BillDetail;
import com.kaisneaker.backend.model.Product;
import com.kaisneaker.backend.repository.BillDetailRepository;
import com.kaisneaker.backend.repository.CartItemRepository;
import com.kaisneaker.backend.repository.ProductRepository;
import com.kaisneaker.backend.repository.StockRepository;
import com.kaisneaker.backend.service.ProductService;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private BillDetailRepository billDetailRepository;

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll(Sort.by(Sort.Direction.ASC, "shoesName"));
    }

    private Product mapToEntity(ProductDTO dto) {
        Product entity = Product.builder()
                .shoesName(dto.getShoesName())
                .shoesDescription(dto.getShoesDescription())
                .shoesPrice(dto.getShoesPrice())
                .brand(dto.getBrand())
                .shoesImg(dto.getShoesImg())
                .build();
        return entity;
    }

    @Override
    public Product getProductById(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Product"));
        return product;
    }

    @Override
    public void createProduct(ProductDTO productDTO) {

        productRepository.save(mapToEntity(productDTO));
    }

    @Override
    public Product updateProduct(UUID id, ProductDTO productDTO) {
        Product product = getProductById(id);
        product.setShoesName(productDTO.getShoesName());
        product.setShoesPrice(productDTO.getShoesPrice());
        product.setShoesDescription(productDTO.getShoesDescription());
        product.setShoesImg(productDTO.getShoesImg());
        product.setBrand(productDTO.getBrand());
        return productRepository.save(product);
    }

    @Override
    @Transactional
    public void deleteProduct(UUID productId) {
        if (productRepository.existsById(productId)) {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            List<BillDetail> billDetail = billDetailRepository.findByProduct(product);
            if (!billDetail.isEmpty()) {
                throw new RuntimeException("Sản phẩm còn tồn tại trong hóa đơn");
            }

            // Xóa các product trong giỏ hàng user
            cartItemRepository.deleteByProduct(product);

            // Xóa stock liên quan
            stockRepository.deleteByProduct(product);

            // Xóa product
            productRepository.delete(product);
        }
    }

    @Override
    public List<Product> getProductByName(String productName) {
        List<Product> product = productRepository.findByShoesNameContainingIgnoreCase(productName);

        return product;
    }

    @Override
    public List<Product> getTopSellingProduct() {
        return billDetailRepository.findTopSellingProducts(PageRequest.of(0, 4));
    }

}
