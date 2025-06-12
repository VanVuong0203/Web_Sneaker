package com.kaisneaker.backend.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
@Table(name = "bill")
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "bill_id")
    private UUID billId;

    @ManyToOne
    @JoinColumn(name = "id_account", referencedColumnName = "id_account", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user; // Người thực hiện giao dịch

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount; // Tổng giá trị đơn hàng

    @Column(name = "bill_date", nullable = false)
    private LocalDateTime billDate; // Ngày lập hoá đơn

    @Column(name = "status")
    private String status; // Trạng thái đơn hàng (Pending, Paid, Cancelled, etc.)

    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL)
    private List<BillDetail> billDetails; // Chi tiết các sản phẩm trong hoá đơn

    @ManyToOne
    @JoinColumn(name = "shopping_info_id", referencedColumnName = "shopping_info_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Address shippingAddress; // Địa chỉ giao hàng
}
