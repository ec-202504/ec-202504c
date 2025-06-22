package com.example.repository;

import com.example.model.Book;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

/** Bookエンティティのリポジトリインターフェース. */
public interface BookRepository extends JpaRepository<Book, Integer>, BookRepositoryCustom {

  /**
   * Book名にキーワードを含むBookの一覧を、大文字・小文字を区別せずに取得する.
   *
   * @param keyword 検索キーワード
   * @return 名前にキーワードを含むBookのリスト
   */
  List<Book> findByNameContainingIgnoreCase(String keyword);

  /**
   * Book名にキーワードを含むBookのページネーションされたリストを取得する.
   *
   * @param keyword 検索キーワード
   * @param pageable ページネーション情報
   * @return ページネーションされたBookのリスト
   */
  Page<Book> findByNameContainingIgnoreCase(String keyword, Pageable pageable);

  /**
   * 言語IDと一致する書籍のリストを取得する.
   *
   * @param languageId 言語ID
   * @return 言語IDと一致する書籍のリスト
   */
  List<Book> findByLanguageId(Integer languageId);

  /**
   * 目的IDと一致する書籍のリストを取得する. findByPurposeIDでは正しい個数を取得できないためfindByPurpose_IDにする必要ある
   *
   * @param purposeId 目的ID
   * @return 目的IDと一致する書籍のリスト
   */
  List<Book> findByPurposeId(Integer purposeId);

  /**
   * PCに含まれる情報と一致するPCのリストを取得する.
   *
   * @param sort 値段の順序を指定する文字列（priceAsc or priceDesc）
   * @param name 名前
   * @param price 価格
   * @param languageId 言語
   * @param purposeId 使用目的
   * @param pageable ページネーション情報
   * @return PCに含まれる情報と一致するページネーションされたPCのリスト
   */
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
