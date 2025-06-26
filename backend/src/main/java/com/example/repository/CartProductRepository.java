package com.example.repository;

import com.example.model.CartProduct;
import com.example.model.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/** 商品カートエンティティのリポジトリインターフェース. */
public interface CartProductRepository extends JpaRepository<CartProduct, Integer> {
  /**
   * セッションIDに紐づくカート内商品を取得する.
   *
   * <p>ログイン時にカートをマージする時のみ使用、ソートが必要なく単にデータが欲しいため
   *
   * @param sessionId セッションID
   * @return カート内商品
   */
  List<CartProduct> findBySessionId(String sessionId);

  /**
   * ユーザIDに紐づくカート内商品を取得する.
   *
   * @param user ユーザ
   * @return カート内商品リスト
   */
  List<CartProduct> findByUserIdOrderByCartProductIdDesc(User user);

  /**
   * ユーザID、商品ID、商品カテゴリに紐づくカート内商品を取得する.
   *
   * <p>userIdで比較する場合は、UserIdUserIdとする必要があるため注意.
   *
   * @param userId ユーザID
   * @param productId 商品ID
   * @param productCategory 商品カテゴリ
   * @return カート内商品
   */
  Optional<CartProduct> findByUserIdUserIdAndProductIdAndProductCategory(
      Integer userId, Integer productId, Integer productCategory);

  /**
   * セッションIDに紐づくカート内商品を取得する.
   *
   * @param sessionId セッションID
   * @return カート内商品リスト
   */
  List<CartProduct> findBySessionIdOrderByCartProductIdDesc(String sessionId);

  /**
   * セッションID、商品ID、商品カテゴリに紐づくカート内商品を取得する.
   *
   * @param sessionId セッションID
   * @param productId 商品ID
   * @param productCategory 商品カテゴリ
   * @return カート内商品
   */
  Optional<CartProduct> findBySessionIdAndProductIdAndProductCategory(
      String sessionId, Integer productId, Integer productCategory);
}
