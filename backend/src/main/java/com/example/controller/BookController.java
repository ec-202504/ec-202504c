package com.example.controller;

import com.example.dto.request.AddBookRequest;
import com.example.dto.request.UpdateBookRequest;
import com.example.model.Book;
import com.example.model.Language;
import com.example.model.Purpose;
import com.example.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** Bookの操作を行うコントローラクラス. */
@RestController
@RequiredArgsConstructor
@RequestMapping("/books")
public class BookController {
  private final BookService bookService;

  /**
   * Book一覧を取得するエンドポイント.
   *
   * @param sort ソート条件
   * @param page ページ番号
   * @param size 1ページあたりの表示件数
   * @param keyword 検索キーワード
   * @return Book一覧結果
   */
  @GetMapping
  public ResponseEntity<?> getBooks(
      @RequestParam(defaultValue = "priceAsc") String sort,
      @RequestParam(defaultValue = "0") Integer page,
      @RequestParam(defaultValue = "20") Integer size,
      @RequestParam(defaultValue = "") String keyword) {
    Sort sorting =
        switch (sort) {
          case "priceAsc" -> Sort.by(Sort.Direction.ASC, "price");
          case "priceDesc" -> Sort.by(Sort.Direction.DESC, "price");
          default -> Sort.by("id");
        };
    Pageable pageable = PageRequest.of(page, size, sorting);

    return ResponseEntity.ok(bookService.findBooksWithPageable(keyword, pageable));
  }

  /**
   * Bookの詳細情報を取得するエンドポイント.
   *
   * @param bookId BookのID
   * @return Bookの詳細情報
   */
  @GetMapping("/{bookId}")
  public ResponseEntity<?> getDetailPc(@PathVariable Integer bookId) {
    return bookService
        .findById(bookId)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  /**
   * BookをBooksテーブルに追加するエンドポイント.
   *
   * @param request Book登録リクエスト
   * @return 登録されたBook情報
   */
  @PostMapping
  public ResponseEntity<?> addBook(@RequestBody AddBookRequest request) {
    Book book = new Book();
    book.setName(request.getName());
    book.setPrice(request.getPrice());
    book.setAuthor(request.getAuthor());
    book.setPublishDate(request.getPublishDate());

    Language language = new Language();
    language.setId(request.getLanguageId());
    book.setLanguage(language);

    Purpose purpose = new Purpose();
    purpose.setId(request.getPurposeId());
    book.setPurpose(purpose);

    bookService.registerBook(book);

    return ResponseEntity.ok().build();
  }

  /**
   * Book情報を更新しBooksテーブルに登録するエンドポイント.
   *
   * @param bookId BookのID
   * @param request Book更新リクエスト
   * @return 更新されたBook情報
   */
  @PutMapping("/{bookId}")
  public ResponseEntity<?> updateBook(
      @PathVariable Integer bookId, @RequestBody UpdateBookRequest request) {
    return bookService
        .findById(bookId)
        .map(
            existBook -> {
              existBook.setName(request.getName());
              existBook.setPrice(request.getPrice());
              existBook.setAuthor(request.getAuthor());
              existBook.setPublishDate(request.getPublishDate());

              Language language = new Language();
              language.setId(request.getLanguageId());
              existBook.setLanguage(language);

              Purpose purpose = new Purpose();
              purpose.setId(request.getPurposeId());
              existBook.setPurpose(purpose);

              bookService.registerBook(existBook);

              return ResponseEntity.ok().build();
            })
        .orElse(ResponseEntity.notFound().build());
  }
  
  /**
   * BookをBooksテーブルから削除するエンドポイント.
   *
   * @param bookId BookのID
   * @return 削除されたBook情報
   */
  @DeleteMapping("/{bookId}")
  public ResponseEntity<?> removeBook(@PathVariable Integer bookId) {
    bookService.removeBook(bookId);
    return ResponseEntity.noContent().build();
  }
}
