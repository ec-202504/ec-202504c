package com.example.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** レビューのレスポンスDTO. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponse {
  /** レビューID. */
  private Integer id;

  /** コメント. */
  private String comment;

  /** 評価（1～5）. */
  private Integer rating;

  /** ユーザーID. */
  private Integer userId;

  /** ユーザー名. */
  private String userName;
}
