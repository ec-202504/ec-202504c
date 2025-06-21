package com.example.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** 注文履歴のレスポンスを表すDTOクラス. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderHistoryResponse {
  private Integer orderId;
  private Integer totalPrice;
  private LocalDateTime orderDate;
  private LocalDateTime deliveryDateTime;
  private Integer paymentMethod; // 0: 現金, 1: クレジットカード
  private List<OrderProductResponse> products;
}
