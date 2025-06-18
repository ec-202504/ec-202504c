package com.example.controller;

import com.example.dto.response.BookDetail;
import com.example.dto.response.PCDetail;
import com.example.dto.response.ProductsDTO;
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
    List<ProductsDTO> productsList = new ArrayList<>();

    var allPcs = pcService.findPcs(keyword);
    productsList.addAll(
        allPcs.stream()
            .map(
                pc -> {
                  var productsDto = new ProductsDTO();
                  productsDto.setProductCategory(0);
                  productsDto.setName(pc.getName());
                  productsDto.setPrice(pc.getPrice());

                  var pcDetail = new PCDetail();
                  pcDetail.setMemory(pc.getMemory());
                  pcDetail.setStorage(pc.getStorage());
                  pcDetail.setDeviceSize(pc.getDeviceSize().doubleValue());
                  pcDetail.setDeviceType(pc.getDeviceType());
                  pcDetail.setOs(pc.getOs());
                  pcDetail.setCpu(pc.getCpu());
                  pcDetail.setGpu(pc.getGpu());
                  pcDetail.setPurpose(pc.getPurpose());

                  productsDto.setPcDetail(pcDetail);
                  return productsDto;
                })
            .toList());

    var allBooks = bookService.findBooks(keyword);
    productsList.addAll(
        allBooks.stream()
            .map(
                book -> {
                  var productsDto = new ProductsDTO();
                  productsDto.setProductCategory(1);
                  productsDto.setName(book.getName());
                  productsDto.setPrice(book.getPrice());

                  var bookDetail = new BookDetail();
                  bookDetail.setAuthor(book.getAuthor());
                  bookDetail.setPublishDate(book.getPublishDate());
                  bookDetail.setLanguage(book.getLanguage());
                  bookDetail.setPurpose(book.getPurpose());

                  productsDto.setBookDetail(bookDetail);
                  return productsDto;
                })
            .toList());

    // ソート処理
    Comparator<ProductsDTO> comparator =
        switch (sort) {
          case "priceAsc" -> Comparator.comparing(ProductsDTO::getPrice);
          case "priceDesc" -> Comparator.comparing(ProductsDTO::getPrice).reversed();
          case "nameDesc" -> Comparator.comparing(ProductsDTO::getName).reversed();
          case "nameAsc" -> Comparator.comparing(ProductsDTO::getName);
          default -> Comparator.comparing(ProductsDTO::getName);
        };

    productsList.sort(comparator);

    // ページング処理（offset, limitに基づいて部分リストを抽出）
    int fromIndex = Math.min(offset, productsList.size());
    int toIndex = Math.min(fromIndex + limit, productsList.size());
    List<ProductsDTO> pagedList = productsList.subList(fromIndex, toIndex);

    return ResponseEntity.ok(pagedList);

    //    return ResponseEntity.ok(productsList);
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
