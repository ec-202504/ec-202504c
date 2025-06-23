package com.example.repository;

import com.example.model.Review;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/** Reviewエンティティのリポジトリインターフェース. */
public interface ReviewRepository extends JpaRepository<Review, Integer> {

  /**
   * 商品カテゴリと商品IDに基づいてレビューを取得する.
   *
   * @param productCategory 商品カテゴリ（0:PC, 1:Book）
   * @param productId 商品ID
   * @return レビュー一覧
   */
  List<Review> findByProductCategoryAndProductIdOrderByReviewDateTimeDesc(
      Integer productCategory, Integer productId);
}
