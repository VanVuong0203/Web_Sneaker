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
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "app_slider")
public class Slider {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "slider_id")
    private UUID slideId;

    @Column(name = "image_url", columnDefinition = "LONGTEXT")
    private String imageUrl;

    @Column(name = "description")
    private String description;

    @Column(name = "slide_order")
    private int slideOrder; // Dùng để sắp xếp các slide
}
