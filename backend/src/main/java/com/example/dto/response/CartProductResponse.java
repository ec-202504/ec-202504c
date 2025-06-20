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
  private String name;
  private Integer price;
  private Integer quantity;
  private String imageUrl;
}
