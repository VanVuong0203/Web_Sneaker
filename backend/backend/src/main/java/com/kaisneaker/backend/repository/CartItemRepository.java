package com.kaisneaker.backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.kaisneaker.backend.dto.CartItemWithStockProjection;
import com.kaisneaker.backend.model.CartItem;
import com.kaisneaker.backend.model.Product;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, UUID> {
        List<CartItem> findByUserIdAccount(UUID idAccount);

        Optional<CartItem> findByUserIdAccountAndProductShoesIdAndSizeIdSize(UUID idAccount, UUID idProduct,
                        UUID idSize);

        void deleteByUserIdAccount(UUID idAccount);

        @Query("SELECT ci.idCart AS idCartItem, u.idAccount AS idAccount, " +
                        "p.shoesId AS shoesId, p.shoesName AS shoesName, p.shoesPrice AS shoesPrice, " +
                        "p.shoesDescription AS shoesDescription, p.shoesImg AS shoesImg, b.brandName AS brandName, " +
                        "s.idSize AS sizeId, s.sizeVi AS sizeVi, s.sizeEur AS sizeEur, " +
                        "st.quantityInStock AS quantityInStock, ci.quantity AS quantity " +
                        "FROM CartItem ci " +
                        "JOIN ci.user u " +
                        "JOIN ci.product p " +
                        "JOIN p.brand b " +
                        "JOIN ci.size s " +
                        "JOIN Stock st ON st.product.shoesId = p.shoesId AND st.size.idSize = s.idSize")
        List<CartItemWithStockProjection> findAllWithStock();

        @Query("SELECT ci.idCart AS idCartItem, u.idAccount AS idAccount, " +
                        "p.shoesId AS shoesId, p.shoesName AS shoesName, p.shoesPrice AS shoesPrice, " +
                        "p.shoesDescription AS shoesDescription, " +
                        "MIN(p.shoesImg) AS shoesImg, b.brandName AS brandName, " +
                        "s.idSize AS sizeId, s.sizeVi AS sizeVi, s.sizeEur AS sizeEur, " +
                        "st.quantityInStock AS quantityInStock, ci.quantity AS quantity " +
                        "FROM CartItem ci " +
                        "JOIN ci.user u " +
                        "JOIN ci.product p " +
                        "JOIN p.brand b " +
                        "JOIN ci.size s " +
                        "JOIN Stock st ON st.product.shoesId = p.shoesId AND st.size.idSize = s.idSize " +
                        "WHERE u.idAccount = :userId " +
                        "GROUP BY ci.idCart, u.idAccount, p.shoesId, p.shoesName, p.shoesPrice, " +
                        "p.shoesDescription, b.brandName, s.idSize, s.sizeVi, s.sizeEur, st.quantityInStock, ci.quantity")
        List<CartItemWithStockProjection> findAllByUserIdWithStock(@Param("userId") UUID userId);

        void deleteByProduct(Product product);
}
