package com.example.controller;

import com.example.dto.request.OrderRequest;
import com.example.model.Order;
import com.example.model.User;
import com.example.service.OrderService;
import com.example.service.UserService;
import java.time.LocalDateTime;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
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
    User user = optionalUser.get();

    Order order = new Order();
    order.setTotalPrice(request.getTotalPrice());
    order.setOrderDate(LocalDateTime.now());
    order.setDestinationName(request.getDestinationName());
    order.setDestinationEmail(request.getDestinationEmail());
    order.setDestinationZipcode(request.getDestinationZipcode());
    order.setDestinationPrefecture(request.getDestinationPrefecture());
    order.setDestinationMunicipalities(request.getDestinationMunicipalities());
    order.setDestinationAddress(request.getDestinationAddress());
    order.setDestinationTelephone(request.getDestinationTelephone());
    order.setDeliveryDateTime(LocalDateTime.parse(request.getDeliveryDateTime()));
    order.setPaymentMethod(request.getPaymentMethod());
    order.setUserId(user);

    orderService.createOrder(order);
    return ResponseEntity.ok("Order created successfully");
  }
}
