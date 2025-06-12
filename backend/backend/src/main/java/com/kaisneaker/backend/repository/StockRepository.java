package com.kaisneaker.backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.kaisneaker.backend.dto.SizeWithQuantityStockDTO;
import com.kaisneaker.backend.model.Product;
import com.kaisneaker.backend.model.Size;
import com.kaisneaker.backend.model.Stock;

@Repository
public interface StockRepository extends JpaRepository<Stock, UUID> {

        @Query("""
                            SELECT s.size.idSize, s.size.sizeVi, s.size.sizeEur, s.quantityInStock
                            FROM Stock s
                            WHERE s.product.shoesId = :shoesId
                        """)
        List<Object[]> findAvailableSizesWithQuantity(@Param("shoesId") UUID shoesId);

        @Query("""
                            SELECT s
                            FROM Stock s
                            WHERE s.product.shoesId = :productId
                              AND s.size.idSize   = :sizeId
                        """)
        Optional<Stock> findAvailableStock(@Param("productId") UUID productId,
                        @Param("sizeId") UUID sizeId);

        boolean existsByProduct_ShoesIdAndSize_IdSize(UUID shoesId, UUID idSize);

        Optional<Stock> findByProductAndSize(Product product, Size size);

        @Query("""
                            SELECT new com.kaisneaker.backend.dto.SizeWithQuantityStockDTO(
                                s.size.idSize,
                                s.size.sizeVi,
                                s.size.sizeEur,
                                s.quantityInStock
                            )
                            FROM Stock s
                            WHERE s.product.shoesId = :productId
                              AND s.size.idSize   = :sizeId
                        """)
        Optional<SizeWithQuantityStockDTO> findSizeWithQuantityByProductAndSize(
                        @Param("productId") UUID productId,
                        @Param("sizeId") UUID sizeId);

        void deleteByProduct(Product product);

}