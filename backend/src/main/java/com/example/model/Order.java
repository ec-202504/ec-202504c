package com.example.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

/** 注文情報を表すドメインクラス. */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "orders")
public class Order {
  /** 注文ID. */
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "order_id")
  private Integer orderId;

  /** 合計金額. */
  @Column(name = "total_price", nullable = false)
  @ColumnDefault("0")
  private Integer totalPrice = 0;

  /** 注文日. */
  @Column(name = "order_date", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
  private LocalDateTime orderDate = LocalDateTime.now();

  /** 宛先氏名. */
  @Column(name = "destination_name", nullable = false)
  private String destinationName;

  /** 宛先メール. */
  @Column(name = "destination_email", nullable = false)
  private String destinationEmail;

  /** 宛先郵便番号. */
  @Column(name = "destination_zipcode", nullable = false, length = 7)
  private String destinationZipcode;

  /** 宛先都道府県. */
  @Column(name = "destination_prefecture", length = 10)
  private String destinationPrefecture;

  /** 宛先市区町村. */
  @Column(name = "destination_municipalities", length = 255)
  private String destinationMunicipalities;

  /** 宛先住所. */
  @Column(name = "destination_address", nullable = false)
  private String destinationAddress;

  /** 宛先電話番号. */
  @Column(name = "destination_telephone", nullable = false, length = 15)
  private String destinationTelephone;

  /** 配達日時. */
  @Column(
      name = "delivery_date_time",
      columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP + interval '1 hour'")
  private LocalDateTime deliveryDateTime = LocalDateTime.now();

  /** 支払い方法. 0:現金, 1:クレカ */
  @Column(name = "payment_method", nullable = false)
  @ColumnDefault("0")
  private Integer paymentMethod = 0;

  /** 注文ユーザ. */
  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  private User userId;

  /** 注文商品のリスト. */
  @OneToMany(
      mappedBy = "order",
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  private List<OrderProduct> orderProductList;
}
