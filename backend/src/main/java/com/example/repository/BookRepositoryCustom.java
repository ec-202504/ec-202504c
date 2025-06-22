package com.example.repository;

import com.example.model.Book;
import java.time.LocalDate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BookRepositoryCustom {
  Page<Book> findByMultipleConditions(
      String sort,
      String name,
      Integer price,
      String author,
      LocalDate publishDate,
      Integer languageId,
      Integer purposeId,
      Pageable pageable);
}
