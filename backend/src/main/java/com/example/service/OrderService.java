package com.example.service;

import com.example.dto.response.OrderDetailResponse;
import com.example.dto.response.OrderProductResponse;
import com.example.model.Order;
import com.example.model.OrderProduct;
import com.example.repository.BookRepository;
import com.example.repository.OrderRepository;
import com.example.repository.PcRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Orderエンティティのサービスクラス. */
@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {
  private final OrderRepository orderRepository;
  private final PcRepository pcRepository;
  private final BookRepository bookRepository;

  private static final int CATEGORY_PC = 0;
  private static final int CATEGORY_BOOK = 1;

  /**
   * 全ユーザの注文リストを取得するメソッド.
   *
   * @return 全ユーザの注文リスト
   */
  public List<Order> getAllOrders() {
    return orderRepository.findAll();
  }

  /**
   * ユーザーIDを指定して注文履歴を取得するメソッド.
   *
   * @param userId ユーザーID
   * @return 指定されたユーザーIDに対応する注文履歴のリスト
   */
  public List<OrderDetailResponse> getOrderHistoryByUserId(Integer userId) {
    List<Order> orders = orderRepository.findByUserIdUserIdOrderByOrderDateTimeDesc(userId);

    if (orders.isEmpty()) {
      throw new EntityNotFoundException("注文履歴が見つかりません");
    }

    return orders.stream().map(this::mapToOrderHistoryResponse).toList();
  }

  /**
   * 注文を作成するメソッド.
   *
   * @param order 作成する注文
   */
  public void createOrder(Order order) {
    orderRepository.save(order);
  }

  /**
   * OrderエンティティをOrderHistoryResponseに変換するヘルパーメソッド.
   *
   * @param order 注文エンティティ
   * @return 変換されたOrderHistoryResponseオブジェクト
   */
  private OrderDetailResponse mapToOrderHistoryResponse(Order order) {
    List<OrderProductResponse> productResponses =
        order.getOrderProductList().stream().map(this::mapToOrderProductResponse).toList();

    return new OrderDetailResponse(
        order.getOrderId(),
        order.getTotalPrice(),
        order.getOrderDateTime(),
        order.getDeliveryDateTime(),
        order.getPaymentMethod(),
        productResponses);
  }

  /**
   * OrderProductエンティティをOrderProductResponseに変換するヘルパーメソッド.
   *
   * @param orderProduct 注文商品エンティティ
   * @return 変換されたOrderProductResponseオブジェクト
   */
  private OrderProductResponse mapToOrderProductResponse(OrderProduct orderProduct) {
    Integer productId = orderProduct.getProductId();
    Integer category = orderProduct.getProductCategory();

    OrderProductResponse response = new OrderProductResponse();
    response.setProductId(productId);
    response.setProductCategory(category);
    response.setQuantity(orderProduct.getQuantity());

    switch (category) {
      case CATEGORY_PC -> {
        return pcRepository
            .findById(productId)
            .map(
                pc -> {
                  response.setProductName(pc.getName());
                  response.setPrice(pc.getPrice());
                  response.setImageUrl(pc.getImageUrl());
                  return response;
                })
            .orElseThrow(() -> new EntityNotFoundException("PC (ID: " + productId + ") が見つかりません"));
      }
      case CATEGORY_BOOK -> {
        return bookRepository
            .findById(productId)
            .map(
                book -> {
                  response.setProductName(book.getName());
                  response.setPrice(book.getPrice());
                  response.setImageUrl(book.getImageUrl());
                  return response;
                })
            .orElseThrow(() -> new EntityNotFoundException("書籍 (ID: " + productId + ") が見つかりません"));
      }
      default -> throw new EntityNotFoundException("不正なカテゴリ: " + category);
    }
  }

  /**
   * 注文IDを指定して注文の詳細を取得するメソッド.
   *
   * @param orderId 注文ID
   * @return 指定された注文IDに対応する注文の詳細
   */
  public OrderDetailResponse getOrderDetailsByOrderId(Integer orderId) {
    return orderRepository
        .findById(orderId)
        .map(this::mapToOrderHistoryResponse)
        .orElseThrow(() -> new EntityNotFoundException("注文 (ID: " + orderId + ") が見つかりません"));
  }
}
