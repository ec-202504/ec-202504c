package com.example.dto.request;

import java.time.LocalDate;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Bookを追加するリクエストDTOクラス. */
@Getter
@Setter
@NoArgsConstructor
public class AddBookRequest {
  private String name;
  private Integer price;
  private String author;
  private LocalDate publishDate;
  private Integer languageId;
  private Integer purposeId;
  private Integer difficultyId;
}
