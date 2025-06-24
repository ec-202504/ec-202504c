package com.example.controller;

import com.example.dto.request.AddReviewRequest;
import com.example.dto.response.ReviewResponse;
import com.example.model.Review;
import com.example.model.User;
import com.example.service.ReviewService;
import com.example.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpSession;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
   * @param session HTTPセッション
   * @return レスポンス（成功時は201 Created）
   */
  @PostMapping("/pc/{productId}")
  public ResponseEntity<Void> addPcReview(
      @PathVariable Integer productId, @RequestBody AddReviewRequest request, HttpSession session) {
    addReview(request, session, 0, productId);
    return ResponseEntity.status(HttpStatus.CREATED).build();
  }

  /**
   * Bookのレビューを登録する.
   *
   * @param productId BookのID
   * @param request レビュー登録リクエスト
   * @param session HTTPセッション
   * @return レスポンス（成功時は201 Created）
   */
  @PostMapping("/book/{productId}")
  public ResponseEntity<Void> addBookReview(
      @PathVariable Integer productId, @RequestBody AddReviewRequest request, HttpSession session) {
    addReview(request, session, 1, productId);
    return ResponseEntity.status(HttpStatus.CREATED).build();
  }

  /**
   * レビューを登録する共通メソッド.
   *
   * @param request レビュー登録リクエスト
   * @param session HTTPセッション
   * @param productCategory 商品カテゴリ（0:PC, 1:Book）
   * @param productId 商品ID
   */
  private void addReview(
      AddReviewRequest request, HttpSession session, Integer productCategory, Integer productId) {
    // TODO: jwtからユーザーIDを取得するように変更
    Integer userId = (Integer) session.getAttribute("userId");
    if (userId == null) {
      throw new EntityNotFoundException("ログインが必要です");
    }

    // レビューを作成
    Review review = new Review();
    BeanUtils.copyProperties(request, review);
    review.setProductCategory(productCategory);
    review.setProductId(productId);

    // ユーザー情報を取得
    User user =
        userService.findById(userId).orElseThrow(() -> new EntityNotFoundException("ユーザーが見つかりません"));
    review.setUser(user);

    reviewService.addReview(review);
  }
}
