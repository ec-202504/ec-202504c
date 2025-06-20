package com.example.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** 書籍の詳細情報レスポンスを表すDTOクラス. */
@Getter
@Setter
@NoArgsConstructor
public class BookDetailResponse {
  private Integer bookId;
  private String name;
  private String imageUrl;
  private String author;
  private String publishDate;
  private Integer price;
  private String language;
  private String purpose;
}
