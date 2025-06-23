package com.example.service;

import com.example.dto.request.AddReviewRequest;
import com.example.dto.response.ReviewResponse;
import com.example.model.Review;
import com.example.model.User;
import com.example.repository.ReviewRepository;
import com.example.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

/** Reviewエンティティのサービスクラス. */
@Service
@RequiredArgsConstructor
@Transactional
public class ReviewService {
  private final ReviewRepository reviewRepository;
  private final UserRepository userRepository;

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
   * レビューを登録する.
   *
   * @param request レビュー登録リクエスト
   * @param session HTTPセッション
   */
  public void addReview(AddReviewRequest request, HttpSession session) {
    // TODO: jwtを使用してユーザー認証を行う
    Integer userId = (Integer) session.getAttribute("userId");
    if (userId == null) {
      throw new EntityNotFoundException("ログインが必要です");
    }

    User user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("ユーザーが見つかりません"));

    // レビューを作成
    Review review = new Review();
    BeanUtils.copyProperties(request, review);
    review.setUser(user);

    reviewRepository.save(review);
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
