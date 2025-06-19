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

/** カート内商品のドメインクラス. */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "cart_products")
public class CartProduct {

  /** カート商品ID. */
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "cart_product_id")
  private Integer cartProductId;

  /** 数量. */
  @Column(name = "quantity", nullable = false)
  private Integer quantity;

  /** セッションID（未ログイン時用）. */
  @Column(name = "session_id", length = 255)
  private String sessionId;

  /** ユーザID（ログイン時）. */
  @ManyToOne
  @JoinColumn(name = "user_id")
  private User userId;

  /** 商品カテゴリ. */
  @Column(name = "product_category", nullable = false)
  private Integer productCategory;

  /** 商品ID. */
  @Column(name = "product_id", nullable = false)
  private Integer productId;
}
