package com.kaisneaker.backend.model;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
@Table(name = "app_brand")
public class Brand {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_brand")
    private UUID idBrand;

    @Column(name = "brand_name", nullable = false)
    private String brandName;

    @Column(name = "description_brand")
    private String descriptionBrand;

    @Column(name = "image_brand", columnDefinition = "longtext")
    private String imageBrand;
}
