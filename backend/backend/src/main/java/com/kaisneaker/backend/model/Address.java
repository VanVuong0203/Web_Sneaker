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
@NoArgsConstructor
@Builder
@AllArgsConstructor
@Table(name = "app_address")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "shopping_info_id")
    private UUID shoppingInfoId;

    @Column(name = "shopping_info_name", nullable = false)
    private String shoppingInfoName;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "shopping_info_phone", nullable = false)
    private String shoppingInfoPhone;

    // Một tài khoản có nhiều địa chỉ giao hàng
    @ManyToOne
    @JoinColumn(name = "id_account", referencedColumnName = "id_account", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;
}
