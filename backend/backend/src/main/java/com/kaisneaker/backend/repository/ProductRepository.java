package com.kaisneaker.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kaisneaker.backend.model.Brand;
import com.kaisneaker.backend.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    List<Product> findByShoesNameContainingIgnoreCase(String shoesName);

    List<Product> findByBrand(Brand brand);

}
