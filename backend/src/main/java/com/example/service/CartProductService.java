package com.example.service;

import com.example.model.CartProduct;
import com.example.model.User;
import com.example.repository.CartProductRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** カート内商品に関するサービスクラス. */
@Service
@RequiredArgsConstructor
@Transactional
public class CartProductService {
  private final CartProductRepository cartProductRepository;

  /**
   * ユーザIDに紐づくカート内商品を取得するメソッド.
   *
   * @param user ユーザ
   * @return カート内商品リスト
   */
  public List<CartProduct> getCartProductsByUserId(User user) {
    return cartProductRepository.findByUserIdOrderByCartProductIdDesc(user);
  }

  /**
   * セッションIDに紐づくカート内商品を取得するメソッド.
   *
   * @param sessionId セッションID
   * @return カート内商品リスト
   */
  public List<CartProduct> getCartProductsBySessionId(String sessionId) {
    return cartProductRepository.findBySessionIdOrderByCartProductIdDesc(sessionId);
  }

  /**
   * ユーザID、商品ID、商品カテゴリに紐づくカート内商品を取得するメソッド.
   *
   * @param userId ユーザID
   * @param cartProductId 商品ID
   * @param productCategory 商品カテゴリ
   * @return カート内商品
   */
  public Optional<CartProduct> getExistingProduct(
      Integer userId, Integer cartProductId, Integer productCategory) {
    return cartProductRepository.findByUserIdUserIdAndProductIdAndProductCategory(
        userId, cartProductId, productCategory);
  }

  /**
   * セッションID、商品ID、商品カテゴリに紐づくカート内商品を取得するメソッド.
   *
   * @param sessionId セッションID
   * @param cartProductId 商品ID
   * @param productCategory 商品カテゴリ
   * @return カート内商品
   */
  public Optional<CartProduct> getExistingProductBySessionId(
      String sessionId, Integer cartProductId, Integer productCategory) {
    return cartProductRepository.findBySessionIdAndProductIdAndProductCategory(
        sessionId, cartProductId, productCategory);
  }

  /**
   * カート内商品を追加するメソッド.
   *
   * @param cartProduct 追加するカート内商品
   */
  public void addCartProduct(CartProduct cartProduct) {
    cartProductRepository.save(cartProduct);
  }

  /**
   * カート内商品の数量を更新するメソッド.
   *
   * @param cartProductId カート商品ID
   * @param quantity 新しい数量
   */
  public void updateCartProductQuantity(Integer cartProductId, Integer quantity) {
    Optional<CartProduct> optionalCartProduct = cartProductRepository.findById(cartProductId);
    if (optionalCartProduct.isEmpty()) {
      throw new EntityNotFoundException("カート商品が見つかりません");
    }

    CartProduct cartProduct = optionalCartProduct.get();
    cartProduct.setQuantity(quantity);
    cartProductRepository.save(cartProduct);
  }

  /**
   * カート内商品を削除するメソッド.
   *
   * @param cartProductId カート商品ID
   */
  public void deleteCartProduct(Integer cartProductId) {
    cartProductRepository.deleteById(cartProductId);
  }
}
