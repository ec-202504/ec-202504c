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
import org.hibernate.annotations.ColumnDefault;

/** 商品レビューのドメインクラス. */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "reviews")
public class Review {
  /** レビューID. */
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "review_id")
  private Integer id;

  /** コメント. */
  @Column(name = "comment", nullable = false, length = 255)
  private String comment;

  /** 評価（1～5）. */
  @Column(name = "rating", nullable = false)
  @ColumnDefault("1")
  private Integer rating;

  /** 商品カテゴリ（0:PC, 1:Book）. */
  @Column(name = "product_category", nullable = false)
  private Integer productCategory;

  /** 商品ID. */
  @Column(name = "product_id", nullable = false)
  private Integer productId;

  /** ユーザー. */
  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  private User user;
}
