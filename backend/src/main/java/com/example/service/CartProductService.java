package com.example.service;

import com.example.model.CartProduct;
import com.example.model.User;
import com.example.repository.CartProductRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/** カート内商品に関するサービスクラス. */
@Service
@RequiredArgsConstructor
public class CartProductService {
  private final CartProductRepository cartProductRepository;

  /**
   * カート内商品を取得するメソッド.
   *
   * @return カート内商品リスト
   */
  public List<CartProduct> getCartProducts(User user) {
    return cartProductRepository.findByUserId(user);
  }

  /**
   * カート内商品を追加するメソッド.
   *
   * @param cartProduct 追加するカート内商品
   */
  public void addCartProduct(CartProduct cartProduct) {
    cartProductRepository.save(cartProduct);
  }
}
