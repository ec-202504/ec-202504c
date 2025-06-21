package com.example.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** PC・書籍の情報リクエストを表すDTOクラス. */
@Getter
@Setter
@NoArgsConstructor
public class ProductsResponse {
  private Integer productId; // PcID or BookID
  private Integer productCategory; // PC or Book
  private String name;
  private Integer price;
  private PcOverviewResponse pcDetailResponse;
  private BookOverviewResponse bookDetailResponse;
}
