package com.example.repository;

import com.example.model.Book;
import java.time.LocalDate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/** Bookエンティティに対するカスタムクエリ操作を定義するインタフェース. */
public interface BookRepositoryCustom {
  /**
   * 複数の条件でBookエンティティを検索し、ページングされた結果を返す.
   *
   * @param sort ソート条件（例: "name,asc"）
   * @param name 書籍名
   * @param price 価格
   * @param author 著者名
   * @param publishDate 出版日
   * @param languageId 言語ID
   * @param purposeId 使用目的ID
   * @param difficultyId 難易度ID
   * @param pageable ページング情報
   * @return 条件に一致するBookエンティティのページ
   */
  Page<Book> findByMultipleConditions(
      String sort,
      String name,
      Integer price,
      String author,
      LocalDate publishDate,
      Integer languageId,
      Integer purposeId,
      Integer difficultyId,
      Pageable pageable);
}
