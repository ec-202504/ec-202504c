package com.example.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** 注文商品のドメインクラス. */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "order_products")
public class OrderProduct {
  /** 注文明細ID. */
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "order_product_id")
  private Integer orderProductId;

  /** 数量. */
  @Column(name = "quantity", nullable = false)
  private Integer quantity;

  /** 商品カテゴリ（0:PC, 1:Book）. */
  @Column(name = "product_category", nullable = false)
  private Integer productCategory;

  /** 商品ID. */
  @Column(name = "product_id", nullable = false)
  private Integer productId;

  /** 注文. */
  @ManyToOne
  @JoinColumn(name = "order_id", nullable = false)
  private Order order;
}
