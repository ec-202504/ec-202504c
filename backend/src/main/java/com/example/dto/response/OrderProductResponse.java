package com.example.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** 注文履歴の商品情報レスポンスを表すDTOクラス. */
@Getter
@Setter
@NoArgsConstructor
public class OrderProductResponse {
  private Integer productId;
  private Integer productCategory; // "PC" or "Book
  private Integer quantity;
  private String productName;
  private byte[] imageUrl;
  private Integer price;
}
