package com.example.repository;

import com.example.model.CartProduct;
import com.example.model.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/** 商品カートエンティティのリポジトリインターフェース. */
public interface CartProductRepository extends JpaRepository<CartProduct, Integer> {
  /**
   * ユーザIDに紐づくカート内商品を取得するメソッド.
   *
   * @param user ユーザ
   * @return カート内商品リスト
   */
  List<CartProduct> findByUserId(User user);
}
