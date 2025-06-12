package com.kaisneaker.backend.model;

import java.util.UUID;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "stock")
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_inventory")
    private UUID idInventory;

    @ManyToOne
    @JoinColumn(name = "shoes_id", // cột FK trong bảng stock
            referencedColumnName = "shoes_id", // cột PK trong bảng product
            nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE) // Hibernate tự sinh ON DELETE CASCADE
    private Product product;

    @ManyToOne
    @JoinColumn(name = "id_size", referencedColumnName = "id_size", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Size size;

    @Column(name = "quantity_in_stock", nullable = false)
    private int quantityInStock;
}
