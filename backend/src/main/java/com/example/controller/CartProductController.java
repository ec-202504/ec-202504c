package com.example.controller;

import com.example.dto.request.AddCartProductRequest;
import com.example.dto.response.CartProductResponse;
import com.example.model.CartProduct;
import com.example.model.User;
import com.example.service.BookService;
import com.example.service.CartProductService;
import com.example.service.PcService;
import com.example.service.UserService;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/** カート内商品に関するコントローラクラス. */
@RestController
@RequestMapping("/carts")
@RequiredArgsConstructor
public class CartProductController {
  private final CartProductService cartProductService;
  private final UserService userService;
  private final PcService pcService;
  private final BookService bookService;

  /**
   * カート内商品を取得するエンドポイント.
   *
   * @return カート内商品リスト
   */
  @GetMapping
  public ResponseEntity<?> getCartProducts() {
    List<CartProduct> cartProducts = cartProductService.getCartProducts();

    try {
      List<CartProductResponse> responses =
          cartProducts.stream().map(this::mapToResponse).filter(Objects::nonNull).toList();
      return ResponseEntity.ok(responses);
    } catch (ResponseStatusException e) {
      return ResponseEntity.notFound().build();
    }
  }

  /**
   * カート内商品を追加するエンドポイント.
   *
   * @param request カートに追加する商品情報を含むリクエストDTO
   * @return 成功メッセージ
   */
  @PostMapping
  public ResponseEntity<?> addCartProduct(@RequestBody AddCartProductRequest request) {
    User user = userService.findById(request.getUserId());

    if (user == null) {
      return ResponseEntity.badRequest().body("ユーザーが見つかりません");
    }

    CartProduct cartProduct = new CartProduct();
    cartProduct.setQuantity(request.getQuantity());
    cartProduct.setSessionId(request.getSessionId());
    cartProduct.setProductCategory(request.getProductCategory());
    cartProduct.setProductId(request.getProductId());

    cartProductService.addCartProduct(cartProduct);
    return ResponseEntity.ok().build();
  }

  /**
   * カート内商品をレスポンスDTOに変換するヘルパーメソッド.
   *
   * @param cartProduct カート内商品エンティティ
   * @return カート内商品レスポンスDTO
   */
  private CartProductResponse mapToResponse(CartProduct cartProduct) {
    CartProductResponse response = new CartProductResponse();
    response.setCartProductId(cartProduct.getCartProductId());
    response.setQuantity(cartProduct.getQuantity());

    return switch (cartProduct.getProductCategory()) {
      case 0 -> buildPcResponse(response, cartProduct.getProductId());
      case 1 -> buildBookResponse(response, cartProduct.getProductId());
      default -> {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "カート内にある商品が見つかりません");
      }
    };
  }

  /**
   * PC商品情報をレスポンスDTOに設定するヘルパーメソッド.
   *
   * @param response レスポンスDTO
   * @param productId 商品ID
   * @return 更新されたレスポンスDTO
   */
  private CartProductResponse buildPcResponse(CartProductResponse response, Integer productId) {
    return pcService
        .findById(productId)
        .map(
            pc -> {
              response.setName(pc.getName());
              response.setPrice(pc.getPrice());
              // TODO: 画像URLの取得方法を修正
              response.setImageUrl("https://placehold.jp/150x100.png");
              return response;
            })
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "カート内にあるPCが見つかりません"));
  }

  /**
   * Book商品情報をレスポンスDTOに設定するヘルパーメソッド.
   *
   * @param response レスポンスDTO
   * @param productId 商品ID
   * @return 更新されたレスポンスDTO
   */
  private CartProductResponse buildBookResponse(CartProductResponse response, Integer productId) {
    return bookService
        .findById(productId)
        .map(
            book -> {
              response.setName(book.getName());
              response.setPrice(book.getPrice());
              // TODO: 対応
              response.setImageUrl("https://placehold.jp/150x100.png");
              return response;
            })
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "カート内にある本が見つかりません"));
  }
}
