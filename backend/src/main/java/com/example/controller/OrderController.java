package com.example.controller;

import com.example.dto.request.OrderRequest;
import com.example.model.Order;
import com.example.model.OrderProduct;
import com.example.model.User;
import com.example.service.OrderProductService;
import com.example.service.OrderService;
import com.example.service.UserService;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.ResponseEntity;
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

  /**
   * 全ての注文を取得するエンドポイント.
   *
   * @return 全ての注文のリスト
   */
  @PostMapping
  public ResponseEntity<?> createOrder(@RequestBody OrderRequest request) {
    Optional<User> optionalUser = userService.findById(request.getUserId());
    if (optionalUser.isEmpty()) {
      return ResponseEntity.badRequest().build();
    }
    Order order = new Order();
    BeanUtils.copyProperties(request, order);
    order.setOrderDate(LocalDateTime.now());
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

    return ResponseEntity.ok("Order created successfully");
  }
}
