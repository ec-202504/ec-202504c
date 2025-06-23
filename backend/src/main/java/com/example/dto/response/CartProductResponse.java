package com.example.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** カートのレスポンスを表すDTOクラス. */
@Getter
@Setter
@NoArgsConstructor
public class CartProductResponse {
  private Integer cartProductId;
  private Integer quantity;
  private Integer productId;
  private Integer productCategory;
  // pcs, booksからそれぞれ取得
  private String name;
  private Integer price;
  private String imageUrl;
}
