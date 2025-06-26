package com.example.controller;

import com.example.dto.request.AddReviewRequest;
import com.example.dto.response.ReviewResponse;
import com.example.model.Review;
import com.example.model.User;
import com.example.service.ReviewService;
import com.example.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Reviewエンティティのコントローラークラス. */
@RestController
@RequiredArgsConstructor
@RequestMapping("/reviews")
public class ReviewController {
  private final ReviewService reviewService;
  private final UserService userService;

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

  /**
   * PCのレビューを登録する.
   *
   * @param productId PCのID
   * @param request レビュー登録リクエスト
   * @param jwt JWTトークン
   * @return レスポンス（成功時は201 Created）
   */
  @PostMapping("/pc/{productId}")
  public ResponseEntity<Void> addPcReview(
      @PathVariable Integer productId,
      @RequestBody AddReviewRequest request,
      @AuthenticationPrincipal Jwt jwt) {
    addReview(request, 0, productId, jwt);
    return ResponseEntity.status(HttpStatus.CREATED).build();
  }

  /**
   * Bookのレビューを登録する.
   *
   * @param productId BookのID
   * @param request レビュー登録リクエスト
   * @param jwt JWTトークン
   * @return レスポンス（成功時は201 Created）
   */
  @PostMapping("/book/{productId}")
  public ResponseEntity<Void> addBookReview(
      @PathVariable Integer productId,
      @RequestBody AddReviewRequest request,
      @AuthenticationPrincipal Jwt jwt) {
    addReview(request, 1, productId, jwt);
    return ResponseEntity.status(HttpStatus.CREATED).build();
  }

  /**
   * レビューを登録する共通メソッド.
   *
   * @param request レビュー登録リクエスト
   * @param productCategory 商品カテゴリ（0:PC, 1:Book）
   * @param productId 商品ID
   * @param jwt JWTトークン
   */
  private void addReview(
      AddReviewRequest request, Integer productCategory, Integer productId, Jwt jwt) {
    // レビューを作成
    Review review = new Review();
    BeanUtils.copyProperties(request, review);
    review.setProductCategory(productCategory);
    review.setProductId(productId);

    // jwtからユーザー情報を取得
    String email = jwt.getSubject();
    User user =
        userService
            .findByEmail(email)
            .orElseThrow(() -> new EntityNotFoundException("ユーザーが見つかりません: " + email));
    review.setUser(user);
    reviewService.addReview(review);
  }
}
