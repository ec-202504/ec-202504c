package com.example.dto.response;

import com.example.model.Language;
import com.example.model.Purpose;
import java.time.LocalDate;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** 書籍の詳細情報リクエストを表すDTOクラス. */
@Getter
@Setter
@NoArgsConstructor
public class BookDetailResponse {
  private String author;
  private LocalDate publishDate;
  private Language language;
  private Purpose purpose;
}
