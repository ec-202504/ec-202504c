package com.example.controller;

import com.example.dto.response.BookDetailResponse;
import com.example.dto.response.PCDetailResponse;
import com.example.dto.response.ProductsResponse;
import com.example.service.BookService;
import com.example.service.PCService;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
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

  @GetMapping
  public ResponseEntity<?> getAllProducts(
      @RequestParam(defaultValue = "nameAsc") String sort,
      @RequestParam(defaultValue = "0") Integer limit,
      @RequestParam(defaultValue = "20") Integer offset,
      @RequestParam(defaultValue = "") String keyword) {
    List<ProductsResponse> productsList = new ArrayList<>();

    var allPcs = pcService.findPcs(keyword);
    productsList.addAll(
        allPcs.stream()
            .map(
                pc -> {
                  var productsResponse = new ProductsResponse();
                  productsResponse.setProductCategory(0);
                  productsResponse.setName(pc.getName());
                  productsResponse.setPrice(pc.getPrice());

                  var pcDetailResponse = new PCDetailResponse();
                  pcDetailResponse.setMemory(pc.getMemory());
                  pcDetailResponse.setStorage(pc.getStorage());
                  pcDetailResponse.setDeviceSize(pc.getDeviceSize().doubleValue());
                  pcDetailResponse.setDeviceType(pc.getDeviceType());
                  pcDetailResponse.setOs(pc.getOs());
                  pcDetailResponse.setCpu(pc.getCpu());
                  pcDetailResponse.setGpu(pc.getGpu());
                  pcDetailResponse.setPurpose(pc.getPurpose());

                  productsResponse.setPcDetailResponse(pcDetailResponse);
                  return productsResponse;
                })
            .toList());

    var allBooks = bookService.findBooks(keyword);
    productsList.addAll(
        allBooks.stream()
            .map(
                book -> {
                  var productsResponse = new ProductsResponse();
                  productsResponse.setProductCategory(1);
                  productsResponse.setName(book.getName());
                  productsResponse.setPrice(book.getPrice());

                  var bookDetailResponse = new BookDetailResponse();
                  bookDetailResponse.setAuthor(book.getAuthor());
                  bookDetailResponse.setPublishDate(book.getPublishDate());
                  bookDetailResponse.setLanguage(book.getLanguage());
                  bookDetailResponse.setPurpose(book.getPurpose());

                  productsResponse.setBookDetailResponse(bookDetailResponse);
                  return productsResponse;
                })
            .toList());

    // ソート処理
    Comparator<ProductsResponse> comparator =
        switch (sort) {
          case "priceAsc" -> Comparator.comparing(ProductsResponse::getPrice);
          case "priceDesc" -> Comparator.comparing(ProductsResponse::getPrice).reversed();
          case "nameDesc" -> Comparator.comparing(ProductsResponse::getName).reversed();
          case "nameAsc" -> Comparator.comparing(ProductsResponse::getName);
          default -> Comparator.comparing(ProductsResponse::getName);
        };

    productsList.sort(comparator);

    // ページング処理（offset, limitに基づいて部分リストを抽出）
    int fromIndex = Math.min(offset, productsList.size());
    int toIndex = Math.min(fromIndex + limit, productsList.size());
    List<ProductsResponse> pagedList = productsList.subList(fromIndex, toIndex);

    return ResponseEntity.ok(pagedList);
  }

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
