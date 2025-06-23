package com.example.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** レビュー登録リクエストDTO. */
@Getter
@Setter
@NoArgsConstructor
public class AddReviewRequest {
  /** コメント. */
  private String comment;

  /** 評価（1～5）. */
  private Integer rating;
}
