package com.example.service;

import com.example.model.Book;
import com.example.repository.BookRepository;
import com.example.repository.LanguageRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Bookエンティティのリポジトリインターフェース. */
@Service
@RequiredArgsConstructor
@Transactional
public class BookService {
  private final BookRepository bookRepository;
  private final LanguageRepository languageRepository;

  /**
   * Book一覧を取得するメソッド.
   *
   * @return PCのリスト
   */
  public List<Book> getAllBooks() {
    return bookRepository.findAll();
  }

  /**
   * キーワードを含むBookのリストを取得するメソッド.
   *
   * @param keyword 検索キーワード
   * @return Book名にキーワードを含むBookのリスト
   */
  public List<Book> findBooks(String keyword) {
    // キーワードがnullまたは空文字の場合、全件取得
    if (keyword == null || keyword.isBlank()) {
      return bookRepository.findAll();
    }
    return bookRepository.findByNameContainingIgnoreCase(keyword);
  }

  /**
   * ページネーション、ソートされたPCのリストを取得するメソッド.
   *
   * @param keyword 検索キーワード
   * @param pageable ページ情報
   * @return ページネーションされたPCのリスト
   */
  public Page<Book> findBooksWithPageable(String keyword, Pageable pageable) {
    // キーワードがnullまたは空文字の場合、全件取得
    if (keyword == null || keyword.isBlank()) {
      return bookRepository.findAll(pageable);
    }
    return bookRepository.findByNameContainingIgnoreCase(keyword, pageable);
  }

  /**
   * Bookの詳細情報を取得するメソッド.
   *
   * @param bookId BookのID
   * @return Bookの詳細情報
   */
  public Optional<Book> findById(Integer bookId) {
    return bookRepository.findById(bookId);
  }

  /**
   * 言語IDと一致するBookのリストを取得するメソッド.
   *
   * @param languageId 言語ID
   * @return 言語IDと一致するBookのリスト
   */
  public List<Book> findByLanguageId(Integer languageId) {
    return bookRepository.findByLanguage_Id(languageId);
  }

  /**
   * Book登録を行うメソッド.
   *
   * @param book 登録するBookの詳細情報
   * @return 登録されたBookの詳細情報
   */
  public Book registerBook(Book book) {
    return bookRepository.save(book);
  }

  /**
   * Book削除を行うメソッド.
   *
   * @param bookId 削除するPCのID
   */
  public void removeBook(Integer bookId) {
    bookRepository.deleteById(bookId);
  }
}
