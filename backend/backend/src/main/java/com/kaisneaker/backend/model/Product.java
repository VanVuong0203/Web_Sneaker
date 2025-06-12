package com.kaisneaker.backend.model;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
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
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "app_product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "shoes_id")
    private UUID shoesId;

    @Column(name = "shoes_name", nullable = false)
    private String shoesName;

    @Column(name = "shoes_price", nullable = false)
    private BigDecimal shoesPrice;

    @Column(name = "shoes_description", columnDefinition = "longtext")
    private String shoesDescription;

    @ElementCollection
    @CollectionTable(name = "shoes_images", joinColumns = @JoinColumn(name = "shoes_id"))
    @Column(name = "image_url", columnDefinition = "longtext")
    private List<String> shoesImg;

    @ManyToOne
    @JoinColumn(name = "id_brand", referencedColumnName = "id_brand", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Brand brand;
}
