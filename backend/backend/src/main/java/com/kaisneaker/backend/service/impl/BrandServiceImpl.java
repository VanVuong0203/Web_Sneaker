package com.kaisneaker.backend.service.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kaisneaker.backend.dto.BrandDTO;
import com.kaisneaker.backend.model.Brand;
import com.kaisneaker.backend.model.Product;
import com.kaisneaker.backend.repository.BrandRepository;
import com.kaisneaker.backend.repository.ProductRepository;
import com.kaisneaker.backend.repository.StockRepository;
import com.kaisneaker.backend.service.BrandService;

@Service
public class BrandServiceImpl implements BrandService {

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private StockRepository stockRepository;

    @Override
    public void createBrand(BrandDTO Brand) {
        brandRepository.save(mapToEntity(Brand));

    }

    private Brand mapToEntity(BrandDTO dto) {
        Brand entity = Brand.builder()
                .brandName(dto.getBrandName())
                .descriptionBrand(dto.getDescriptionBrand())
                .imageBrand(dto.getImageBrand())
                .build();
        return entity;
    }

    @Override
    public List<Brand> getAllBrands() {
        return brandRepository.findAll();

    }

    @Override
    public Brand getBrandById(UUID idBrand) {
        Brand brand = brandRepository.findById(idBrand)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Brand"));
        return brand;
    }

    @Override
    public Brand updateBrand(UUID idBrand, BrandDTO updatedBrand) {
        Brand Brand = getBrandById(idBrand);
        Brand.setBrandName(updatedBrand.getBrandName());
        Brand.setDescriptionBrand(updatedBrand.getDescriptionBrand());
        Brand.setImageBrand(updatedBrand.getImageBrand());
        return brandRepository.save(Brand);
    }

    @Override
    @Transactional
    public void deleteBrand(UUID idBrand) {
        if (brandRepository.existsById(idBrand)) {
            Brand brand = brandRepository.findById(idBrand)
                    .orElseThrow(() -> new RuntimeException("Brand not found"));

            // Lấy tất cả product liên quan
            List<Product> products = productRepository.findByBrand(brand);

            for (Product product : products) {
                // Xóa stock trước
                stockRepository.deleteByProduct(product);
            }

            // Xóa product
            productRepository.deleteAll(products);

            brandRepository.delete(brand); // Sau đó mới xóa brand
        }
    }

}
