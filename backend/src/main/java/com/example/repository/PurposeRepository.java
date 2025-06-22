package com.example.repository;

import com.example.model.Purpose;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/** Purposeエンティティのリポジトリインターフェース. */
public interface PurposeRepository extends JpaRepository<Purpose, Integer> {
  /**
   * 商品カテゴリを基に目的のリストを取得する.
   *
   * @param productCategory 商品カテゴリ
   * @return 商品カテゴリと一致する目的のリスト
   */
  List<Purpose> findAllByProductCategory(Integer productCategory);
}
