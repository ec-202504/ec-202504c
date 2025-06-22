package com.example.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** 注文商品リクエストDTOクラス. 注文時にカートに入っている商品の情報 */
@Getter
@Setter
@NoArgsConstructor
public class OrderProductRequest {
  private Integer cartProductId;
  private Integer quantity;
  private Integer productId;
  private Integer productCategory;
}
