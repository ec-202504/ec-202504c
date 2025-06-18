package com.example.service;

import com.example.model.Book;
import com.example.repository.BookRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/** Bookエンティティのリポジトリインターフェース. */
@Service
@RequiredArgsConstructor
public class BookService {
  private final BookRepository bookRepository;

  /**
   * PC一覧を取得するメソッド.
   *
   * @return PCのリスト
   */
  public List<Book> getAllBooks() {
    return bookRepository.findAll();
  }

  /**
   * ページネーション、ソートされたPCのリストを取得するメソッド.
   *
   * @param keyword 検索キーワード
   * @param pageable ページ情報
   * @return ページネーションされたされたPCのリスト
   */
  public Page<Book> findBooks(String keyword, Pageable pageable) {
    // キーワードがnullまたは空文字の場合、全件取得
    if (keyword == null || keyword.isBlank()) {
      return bookRepository.findAll(pageable);
    }
    return bookRepository.findByNameContainingIgnoreCase(keyword, pageable);
  }
}
