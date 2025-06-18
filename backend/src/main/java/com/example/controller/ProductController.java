package com.example.controller;

import com.example.service.BookService;
import com.example.service.PCService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** 商品操作を行うコントローラクラス. */
@RestController
@RequiredArgsConstructor
@RequestMapping("/products")
public class ProductController {
  private final PCService pcService;
  private final BookService bookService;

  /**
   * PC一覧を取得するエンドポイント
   *
   * @param sort ソート条件
   * @param limit 1ページあたりの表示件数
   * @param offset 次ページの開始位置
   * @param keyword 検索キーワード
   * @return PC一覧結果
   */
  @GetMapping("/pcs")
  public ResponseEntity<?> getPCs(
      @RequestParam(defaultValue = "priceAsc") String sort,
      @RequestParam(defaultValue = "0") Integer limit,
      @RequestParam(defaultValue = "20") Integer offset,
      @RequestParam(defaultValue = "") String keyword) {
    Sort sorting =
        switch (sort) {
          case "priceAsc" -> Sort.by(Sort.Direction.ASC, "price");
          case "priceDesc" -> Sort.by(Sort.Direction.DESC, "price");
          default -> Sort.by("id");
        };
    Pageable pageable = PageRequest.of(limit, offset, sorting);

    return ResponseEntity.ok(pcService.findPcs(keyword, pageable));
  }

  /**
   * Book一覧を取得するエンドポイント
   *
   * @param sort ソート条件
   * @param limit 1ページあたりの表示件数
   * @param offset 次ページの開始位置
   * @param keyword 検索キーワード
   * @return Book一覧結果
   */
  @GetMapping("/books")
  public ResponseEntity<?> getBooks(
      @RequestParam(defaultValue = "priceAsc") String sort,
      @RequestParam(defaultValue = "0") Integer limit,
      @RequestParam(defaultValue = "20") Integer offset,
      @RequestParam(defaultValue = "") String keyword) {
    Sort sorting =
        switch (sort) {
          case "priceAsc" -> Sort.by(Sort.Direction.ASC, "price");
          case "priceDesc" -> Sort.by(Sort.Direction.DESC, "price");
          default -> Sort.by("id");
        };
    Pageable pageable = PageRequest.of(limit, offset, sorting);

    return ResponseEntity.ok(bookService.findBooks(keyword, pageable));
  }
}
