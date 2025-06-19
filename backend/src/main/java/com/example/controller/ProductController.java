package com.example.controller;

import com.example.dto.response.BookDetailResponse;
import com.example.dto.response.PcDetailResponse;
import com.example.dto.response.ProductsResponse;
import com.example.service.BookService;
import com.example.service.PcService;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/** 全商品の操作を行うコントローラクラス. */
@RestController
@RequiredArgsConstructor
@RequestMapping("/products")
public class ProductController {
  private final PcService pcService;
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

                  var pcDetailResponse = new PcDetailResponse();
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
}
