package com.kaisneaker.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.kaisneaker.backend.model.BillDetail;
import com.kaisneaker.backend.model.Product;

@Repository
public interface BillDetailRepository extends JpaRepository<BillDetail, UUID> {
    @Query("SELECT bd.product FROM BillDetail bd GROUP BY bd.product ORDER BY SUM(bd.quantity) DESC")
    List<Product> findTopSellingProducts(Pageable pageable);

    List<BillDetail> findByProduct(Product product);
}
