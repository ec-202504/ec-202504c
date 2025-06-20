package com.example.repository;

import com.example.model.Book;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

/** Bookエンティティのリポジトリインターフェース. */
public interface BookRepository extends JpaRepository<Book, Integer> {

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
  List<Book> findByLanguage_Id(Integer languageId);
}
