package com.example.controller;

import com.example.dto.response.BookDetailResponse;
import com.example.dto.response.PcDetailResponse;
import com.example.dto.response.ProductsResponse;
import com.example.model.Book;
import com.example.model.Pc;
import com.example.service.BookService;
import com.example.service.PcService;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** 全商品の操作を行うコントローラクラス. */
@RestController
@RequiredArgsConstructor
@RequestMapping("/products")
public class ProductController {
  private final PcService pcService;
  private final BookService bookService;

  /**
   * 全ての商品の一覧を取得するエンドポイント.
   *
   * @param sort ソート条件
   * @param limit 1ページあたりの表示件数
   * @param offset 次ページの開始位置
   * @param keyword 検索キーワード
   * @return 商品一覧結果
   */
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
                  var productsResponse = getProductResponse(pc);
                  var pcDetailResponse = getPcDetailResponse(pc);
                  productsResponse.setPcDetailResponse(pcDetailResponse);
                  return productsResponse;
                })
            .toList());

    var allBooks = bookService.findBooks(keyword);
    productsList.addAll(
        allBooks.stream()
            .map(
                book -> {
                  var productsResponse = getProductResponse(book);
                  var bookDetailResponse = getBookDetailResponse(book);
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
   * productsResponseに値をセットする関数.
   *
   * @param product PCの詳細情報かBookの詳細情報
   * @return productsResponse
   */
  private static ProductsResponse getProductResponse(Object product) {
    ProductsResponse productsResponse = new ProductsResponse();

    if (product instanceof Pc pc) {
      productsResponse.setProductId(pc.getId());
      productsResponse.setProductCategory(0);
      productsResponse.setName(pc.getName());
      productsResponse.setPrice(pc.getPrice());
    } else if (product instanceof Book book) {
      productsResponse.setProductId(book.getId());
      productsResponse.setProductCategory(1);
      productsResponse.setName(book.getName());
      productsResponse.setPrice(book.getPrice());
    }

    return productsResponse;
  }

  /**
   * pcDetailResponseに値をセットする関数.
   *
   * @param pc PCの詳細情報
   * @return pcDetailResponse
   */
  private static PcDetailResponse getPcDetailResponse(Pc pc) {
    var pcDetailResponse = new PcDetailResponse();

    pcDetailResponse.setMemory(pc.getMemory());
    pcDetailResponse.setStorage(pc.getStorage());
    pcDetailResponse.setDeviceSize(pc.getDeviceSize().doubleValue());
    pcDetailResponse.setDeviceType(pc.getDeviceType());
    pcDetailResponse.setOs(pc.getOs());
    pcDetailResponse.setCpu(pc.getCpu());
    pcDetailResponse.setGpu(pc.getGpu());
    pcDetailResponse.setPurpose(pc.getPurpose());

    return pcDetailResponse;
  }

  /**
   * bookDetailResponseに値をセットする関数.
   *
   * @param book Bookの詳細情報
   * @return bookDetailResponse
   */
  private static BookDetailResponse getBookDetailResponse(Book book) {
    var bookDetailResponse = new BookDetailResponse();
    bookDetailResponse.setAuthor(book.getAuthor());
    bookDetailResponse.setPublishDate(book.getPublishDate());
    bookDetailResponse.setLanguage(book.getLanguage());
    bookDetailResponse.setPurpose(book.getPurpose());

    return bookDetailResponse;
  }
}
