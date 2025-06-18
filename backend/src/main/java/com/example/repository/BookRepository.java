package com.example.repository;

import com.example.model.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

/** Bookエンティティのリポジトリインターフェース. */
public interface BookRepository extends JpaRepository<Book, Integer> {
  /**
   * Book名にキーワードを含むBookのページネーションされたリストを取得する.
   *
   * @param keyword 検索キーワード
   * @param pageable ページネーション情報
   * @return ページネーションされたBookのリスト
   */
  Page<Book> findByNameContainingIgnoreCase(String keyword, Pageable pageable);
}
