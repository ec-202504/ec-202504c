package com.example.controller;

import com.example.dto.request.OrderRequest;
import com.example.dto.response.OrderHistoryResponse;
import com.example.model.Order;
import com.example.model.OrderProduct;
import com.example.model.User;
import com.example.service.MailService;
import com.example.service.OrderProductService;
import com.example.service.OrderService;
import com.example.service.UserService;
import jakarta.mail.MessagingException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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

  /**
   * 全ての注文を取得するエンドポイント.
   *
   * @return 全ての注文のリスト
   */
  @PostMapping
  public ResponseEntity<?> createOrder(@RequestBody OrderRequest request)
      throws MessagingException {
    Optional<User> optionalUser = userService.findById(request.getUserId());
    if (optionalUser.isEmpty()) {
      return ResponseEntity.badRequest().build();
    }
    Order order = new Order();
    BeanUtils.copyProperties(request, order);
    order.setOrderDateTime(LocalDateTime.now());
    order.setDeliveryDateTime(LocalDateTime.parse(request.getDeliveryDateTime()));

    User user = optionalUser.get();
    order.setUserId(user);

    orderService.createOrder(order);

    List<OrderProduct> orderProductList = new ArrayList<>();

    // リクエストに入っている商品リストを注文商品オブジェクトに格納後、オブジェクトをorder_productsテーブルに保存
    for (OrderProduct orderProduct : request.getProductList()) {
      OrderProduct product = new OrderProduct();
      product.setProductId(orderProduct.getProductId());
      product.setProductCategory(orderProduct.getProductCategory());
      product.setQuantity(orderProduct.getQuantity());
      product.setOrder(order);
      orderProductList.add(product);
      orderProductService.createOrderProduct(product);
    }

    // 相互補完のために注文商品のリストを注文ドメインにも保存する（なくても動くと思うけど念のため）
    order.setOrderProductList(orderProductList);

    // 注文完了メールを送信、エラーが発生した場合はMessagingExceptionをスロー
    mailService.sendOrderConfirmationEmail(user.getEmail(), order);

    return ResponseEntity.ok("Order created successfully");
  }

  /**
   * ユーザーの注文履歴を取得するエンドポイント.
   *
   * @return ユーザーの注文履歴
   */
  @GetMapping("/history")
  public ResponseEntity<?> getOrderHistory() {
    // TODO:  userIdをjwtから取得するようにする
    Integer userId = 1;
    // ユーザーが存在するか確認
    Optional<User> user = userService.findById(userId);
    if (user.isEmpty()) {
      return ResponseEntity.badRequest().body(Map.of("message", "ユーザが見つかりません"));
    }

    List<OrderHistoryResponse> orderHistory = orderService.getOrderHistoryByUserId(userId);
    return ResponseEntity.ok(orderHistory);
  }
}
