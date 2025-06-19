package com.example.dto.request;

import lombok.Getter;
import lombok.Setter;

/** カート内商品の数量更新リクエストDTOクラス. */
@Getter
@Setter
public class UpdateCartQuantityRequest {
  private Integer cartProductId;
  private Integer quantity;
}
