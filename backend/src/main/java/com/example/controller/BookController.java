package com.example.controller;

import com.example.dto.request.AddBookRequest;
import com.example.dto.request.UpdateBookRequest;
import com.example.model.*;
import com.example.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
