package com.example.controller;

import com.example.dto.request.AddCartProductRequest;
import com.example.dto.request.UpdateCartQuantityRequest;
import com.example.dto.response.CartProductResponse;
import com.example.model.CartProduct;
import com.example.model.User;
import com.example.service.BookService;
import com.example.service.CartProductService;
import com.example.service.PcService;
import com.example.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
    // TODO: userIdをjwtから取得するようにする
    Integer userId = 1;
    User user =
        userService
            .findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ユーザーが見つかりません"));
    List<CartProduct> cartProducts = cartProductService.getCartProducts(user);

    try {
      List<CartProductResponse> responses = cartProducts.stream().map(this::mapToResponse).toList();
      return ResponseEntity.ok(responses);
    } catch (ResponseStatusException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }
  }

  /**
   * カート内商品を追加するエンドポイント.
   *
   * @param request カートに追加する商品情報を含むリクエストDTO
   * @param session HTTPセッション
   * @return 成功メッセージ
   */
  @PostMapping
  public ResponseEntity<?> addCartProduct(
      @RequestBody AddCartProductRequest request, HttpSession session) {
    Integer userId = 1;
    // ユーザが存在するか確認
    Optional<User> existingUser = userService.findById(userId);
    if (existingUser.isEmpty()) {
      return ResponseEntity.badRequest().build();
    }
    // 商品がすでにカートに存在するか確認し、存在すれば数量を更新する
    Optional<CartProduct> existingCartProduct =
        cartProductService.getExistingProduct(
            existingUser.get().getUserId(), request.getProductId(), request.getProductCategory());

    // 既に商品がカートあれば数量を更新
    if (existingCartProduct.isPresent()) {
      CartProduct cartProduct = existingCartProduct.get();
      Integer quantity = cartProduct.getQuantity() + request.getQuantity();
      cartProductService.updateCartProductQuantity(cartProduct.getCartProductId(), quantity);
    } else {
      CartProduct cartProduct = new CartProduct();
      cartProduct.setQuantity(request.getQuantity());
      cartProduct.setSessionId(session.getId());
      cartProduct.setProductCategory(request.getProductCategory());
      cartProduct.setProductId(request.getProductId());

      User user = existingUser.get();
      cartProduct.setUserId(user);

      cartProductService.addCartProduct(cartProduct);
    }

    return ResponseEntity.ok().build();
  }

  /**
   * カート内商品の数量を更新するエンドポイント.
   *
   * @param request 更新するカート内商品情報を含むリクエストDTO
   * @return 成功レスポンス
   */
  @PatchMapping("/quantity")
  public ResponseEntity<?> updateCartQuantity(@RequestBody UpdateCartQuantityRequest request) {
    try {
      cartProductService.updateCartProductQuantity(
          request.getCartProductId(), request.getQuantity());
    } catch (EntityNotFoundException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
    }
    return ResponseEntity.ok().build();
  }

  /**
   * カート内商品を削除するエンドポイント.
   *
   * @param cartProductId 削除するカート内商品ID
   * @return 成功レスポンス 404 No Content
   */
  @DeleteMapping("/{cartProductId}")
  public ResponseEntity<?> deleteCartProduct(@PathVariable Integer cartProductId) {
    cartProductService.deleteCartProduct(cartProductId);
    return ResponseEntity.noContent().build();
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
