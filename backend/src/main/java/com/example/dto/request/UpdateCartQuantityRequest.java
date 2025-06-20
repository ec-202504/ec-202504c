package com.example.dto.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/** カート内商品の数量更新リクエストDTOクラス. */
@Getter
@Setter
@ToString
public class UpdateCartQuantityRequest {
  private Integer cartProductId;
  private Integer quantity;
}
