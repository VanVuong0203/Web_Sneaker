package com.kaisneaker.backend.service;

import java.util.List;
import java.util.UUID;

import com.kaisneaker.backend.dto.BrandDTO;
import com.kaisneaker.backend.model.Brand;

public interface BrandService {
    void createBrand(BrandDTO Brand);

    List<Brand> getAllBrands();

    Brand getBrandById(UUID idBrand);

    Brand updateBrand(UUID idBrand, BrandDTO updatedBrand);

    void deleteBrand(UUID idBrand);
}
