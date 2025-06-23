package com.example.service;

import com.example.dto.response.ReviewResponse;
import com.example.model.Review;
import com.example.repository.ReviewRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/** Reviewエンティティのサービスクラス. */
@Service
@RequiredArgsConstructor
@Transactional
public class ReviewService {
  private final ReviewRepository reviewRepository;

  /**
   * PCのレビューを全件取得する.
   *
   * @param productId PCのID
   * @return レビュー一覧
   */
  public List<ReviewResponse> getPcReviews(Integer productId) {
    List<Review> reviews = reviewRepository.findByProductCategoryAndProductId(0, productId);
    return reviews.stream().map(this::convertToResponse).collect(Collectors.toList());
  }

  /**
   * Bookのレビューを全件取得する.
   *
   * @param productId BookのID
   * @return レビュー一覧
   */
  public List<ReviewResponse> getBookReviews(Integer productId) {
    List<Review> reviews = reviewRepository.findByProductCategoryAndProductId(1, productId);
    return reviews.stream().map(this::convertToResponse).collect(Collectors.toList());
  }

  /**
   * ReviewエンティティをReviewResponseに変換する.
   *
   * @param review Reviewエンティティ
   * @return ReviewResponse
   */
  private ReviewResponse convertToResponse(Review review) {
    return ReviewResponse.builder()
        .id(review.getId())
        .comment(review.getComment())
        .rating(review.getRating())
        .userId(review.getUser().getUserId())
        .userName(review.getUser().getName())
        .build();
  }
}
