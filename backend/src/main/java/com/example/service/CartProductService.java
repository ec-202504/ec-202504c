package com.example.service;

import com.example.model.CartProduct;
import com.example.repository.CartProductRepository;
import java.util.List;
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
   * カート内商品を取得するメソッド.
   *
   * @return カート内商品リスト
   */
  public List<CartProduct> getCartProducts() {
    return cartProductRepository.findAll();
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
