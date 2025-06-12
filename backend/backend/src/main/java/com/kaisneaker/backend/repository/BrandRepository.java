package com.kaisneaker.backend.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kaisneaker.backend.model.Brand;

@Repository
public interface BrandRepository extends JpaRepository<Brand, UUID> {

}
