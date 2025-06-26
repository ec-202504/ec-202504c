package com.example.controller;

import com.example.dto.request.OrderProductRequest;
import com.example.dto.request.OrderRequest;
import com.example.dto.response.OrderDetailResponse;
import com.example.model.Order;
import com.example.model.OrderProduct;
import com.example.model.User;
import com.example.service.CartProductService;
import com.example.service.MailService;
import com.example.service.OrderProductService;
import com.example.service.OrderService;
import com.example.service.UserService;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Orderエンティティのコントローラークラス. */
@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {
  private final OrderService orderService;
  private final OrderProductService orderProductService;
  private final UserService userService;
  private final MailService mailService;
  private final CartProductService cartProductService;

  /**
   * 注文する.
   *
   * @return 全ての注文のリスト
   */
  @PostMapping
  @Transactional
  public ResponseEntity<?> createOrder(
      @RequestBody OrderRequest request, @AuthenticationPrincipal Jwt jwt)
      throws MessagingException {
    // 注文情報を登録
    Order order = new Order();
    BeanUtils.copyProperties(request, order);
    order.setOrderDateTime(LocalDateTime.now());
    order.setDeliveryDateTime(LocalDateTime.now().plusDays(3)); // 配送予定日を注文日から3日後に設定
    // jwtからユーザーを取得
    String email = jwt.getSubject();
    User user =
        userService
            .findByEmail(email)
            .orElseThrow(() -> new EntityNotFoundException("ユーザーが見つかりません: " + email));
    order.setUserId(user);
    orderService.createOrder(order);

    List<OrderProduct> orderProductList = new ArrayList<>();
    // リクエストに入っている商品リストを注文商品オブジェクトに格納後、オブジェクトをorder_productsテーブルに保存
    for (OrderProductRequest orderProduct : request.getProductList()) {
      OrderProduct product = new OrderProduct();
      product.setProductId(orderProduct.getProductId());
      product.setProductCategory(orderProduct.getProductCategory());
      product.setQuantity(orderProduct.getQuantity());
      product.setOrder(order);
      orderProductList.add(product);
      orderProductService.createOrderProduct(product);

      // カートから商品を削除する処理
      cartProductService.deleteCartProduct(orderProduct.getCartProductId());
    }

    // 相互補完のために注文商品のリストを注文ドメインにも保存する（なくても動くと思うけど念のため）
    order.setOrderProductList(orderProductList);

    // 注文完了メールを送信、エラーが発生した場合はMessagingExceptionをスロー
    mailService.sendOrderConfirmationEmail(order.getDestinationEmail(), order);

    return ResponseEntity.ok(Map.of("message", "注文が完了しました", "orderId", order.getOrderId()));
  }

  /**
   * ユーザーの注文履歴を取得する.
   *
   * @return ユーザーの注文履歴
   */
  @GetMapping("/history")
  public ResponseEntity<?> getOrderHistory(@AuthenticationPrincipal Jwt jwt) {
    // TODO:  userIdをjwtから取得するようにする
    String email = jwt.getSubject();
    User user =
        userService
            .findByEmail(email)
            .orElseThrow(() -> new EntityNotFoundException("ユーザーが見つかりません: " + email));
    List<OrderDetailResponse> orderHistory = orderService.getOrderHistoryByUserId(user.getUserId());
    return ResponseEntity.ok(orderHistory);
  }

  /**
   * 注文IDに基づいて注文の詳細を取得するエンドポイント.
   *
   * @param orderId 注文ID
   * @return 注文の詳細情報
   */
  @GetMapping("/{orderId}")
  public ResponseEntity<?> getOrderDetails(@PathVariable Integer orderId) {
    try {
      OrderDetailResponse orderDetails = orderService.getOrderDetailsByOrderId(orderId);
      return ResponseEntity.ok(orderDetails);
    } catch (EntityNotFoundException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
    }
  }
}
