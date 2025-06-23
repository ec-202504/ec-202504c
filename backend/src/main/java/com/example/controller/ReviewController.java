package com.example.controller;

import com.example.dto.response.ReviewResponse;
import com.example.service.ReviewService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Reviewエンティティのコントローラークラス. */
@RestController
@RequiredArgsConstructor
@RequestMapping("/reviews")
public class ReviewController {
  private final ReviewService reviewService;

  /**
   * PCのレビューを全件取得する.
   *
   * @param productId PCのID
   * @return レビュー一覧
   */
  @GetMapping("/pc/{productId}")
  public ResponseEntity<List<ReviewResponse>> getPcReviews(@PathVariable Integer productId) {
    List<ReviewResponse> reviews = reviewService.getPcReviews(productId);
    return ResponseEntity.ok(reviews);
  }

  /**
   * Bookのレビューを全件取得する.
   *
   * @param productId BookのID
   * @return レビュー一覧
   */
  @GetMapping("/book/{productId}")
  public ResponseEntity<List<ReviewResponse>> getBookReviews(@PathVariable Integer productId) {
    List<ReviewResponse> reviews = reviewService.getBookReviews(productId);
    return ResponseEntity.ok(reviews);
  }
}
