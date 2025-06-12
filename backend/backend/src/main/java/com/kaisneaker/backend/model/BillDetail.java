package com.kaisneaker.backend.model;

import java.math.BigDecimal;
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
@AllArgsConstructor
@Builder
@Table(name = "bill_detail")
public class BillDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "bill_detail_id")
    private UUID billDetailId;

    @ManyToOne
    @JoinColumn(name = "bill_id", referencedColumnName = "bill_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Bill bill; // Liên kết với hoá đơn

    @ManyToOne
    @JoinColumn(name = "shoes_id", referencedColumnName = "shoes_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Product product; // Liên kết với sản phẩm

    @ManyToOne
    @JoinColumn(name = "id_size", referencedColumnName = "id_size", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Size size; // Liên kết với size của sản phẩm

    @Column(name = "quantity", nullable = false)
    private int quantity; // Số lượng sản phẩm

    @Column(name = "total_price", nullable = false)
    private BigDecimal totalPrice; // Tổng giá trị của sản phẩm (quantity * price)
}
