package com.example.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** カートに商品を追加するリクエストDTOクラス. */
@Getter
@Setter
@NoArgsConstructor
public class AddCartProductRequest {
  private Integer quantity;
  private String sessionId;
  private Integer userId;
  private Integer productCategory;
  private Integer productId;
}
