package com.example.controller;

import com.example.dto.request.AddCartProductRequest;
import com.example.model.CartProduct;
import com.example.model.User;
import com.example.service.CartProductService;
import com.example.service.UserService;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** カート内商品に関するコントローラクラス. */
@RestController
@RequestMapping("/carts")
@RequiredArgsConstructor
public class CartProductController {
  private final CartProductService cartProductService;
  private final UserService userService;

  /**
   * カート内商品を取得するエンドポイント.
   *
   * @return カート内商品リスト
   */
  @GetMapping
  public ResponseEntity<?> getCartProducts() {
    List<CartProduct> cartProducts = cartProductService.getCartProducts();
    return ResponseEntity.ok(cartProducts);
  }

  /**
   * カート内商品を追加するエンドポイント.
   *
   * @param request カートに追加する商品情報を含むリクエストDTO
   * @return 成功メッセージ
   */
  @PostMapping
  public ResponseEntity<?> addCartProduct(@RequestBody AddCartProductRequest request) {
    Optional<User> optionalUser = userService.findById(request.getUserId());
    if (optionalUser.isEmpty()) {
      return ResponseEntity.badRequest().build();
    }
    User user = optionalUser.get();

    CartProduct cartProduct = new CartProduct();
    cartProduct.setQuantity(request.getQuantity());
    cartProduct.setSessionId(request.getSessionId());
    cartProduct.setProductCategory(request.getProductCategory());
    cartProduct.setProductId(request.getProductId());

    cartProductService.addCartProduct(cartProduct);
    return ResponseEntity.ok().build();
  }
}
