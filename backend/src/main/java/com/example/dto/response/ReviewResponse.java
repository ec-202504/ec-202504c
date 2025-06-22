package com.example.dto.response;

import lombok.Builder;
import lombok.Data;

/** レビューのレスポンスDTO. */
@Data
@Builder
public class ReviewResponse {
  /** レビューID. */
  private Integer id;

  /** コメント. */
  private String comment;

  /** 評価（1～5）. */
  private Integer rating;

  /** 商品カテゴリ（0:PC, 1:Book）. */
  private Integer productCategory;

  /** 商品ID. */
  private Integer productId;

  /** ユーザーID. */
  private Integer userId;

  /** ユーザー名. */
  private String userName;
}
