package com.example.repository;

import com.example.model.Order;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/** Orderエンティティのリポジトリインターフェース. */
public interface OrderRepository extends JpaRepository<Order, Integer> {
  /**
   * ユーザーIDを指定して注文を取得するメソッド.
   *
   * @param userId ユーザーID
   * @return 指定されたユーザーIDに対応する注文のリスト
   */
  List<Order> findByUserIdUserId(Integer userId);
}
