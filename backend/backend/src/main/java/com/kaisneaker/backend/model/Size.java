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
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "app_size")
public class Size {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_size")
    private UUID idSize;

    @Column(name = "size_vi", nullable = false)
    private String sizeVi;

    @Column(name = "size_eur")
    private String sizeEur;

}
