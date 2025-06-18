package com.example.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** PC・書籍の情報リクエストを表すDTOクラス. */
@Getter
@Setter
@NoArgsConstructor
public class ProductsDTO {
  private Integer productCategory; // PC or Book
  private String name;
  private Integer price;

  private PCDetail pcDetail;
  private BookDetail bookDetail;
}
