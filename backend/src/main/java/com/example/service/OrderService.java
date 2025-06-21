package com.example.service;

import com.example.dto.response.OrderHistoryResponse;
import com.example.dto.response.OrderProductResponse;
import com.example.model.Book;
import com.example.model.Order;
import com.example.model.OrderProduct;
import com.example.model.Pc;
import com.example.repository.BookRepository;
import com.example.repository.OrderRepository;
import com.example.repository.PcRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
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

  /**
   * ユーザーIDを指定して注文履歴を取得するメソッド.
   *
   * @param userId ユーザーID
   * @return 指定されたユーザーIDに対応する注文履歴のリスト
   */
  public List<OrderHistoryResponse> getOrderHistoryByUserId(Integer userId) {
    List<OrderHistoryResponse> orderHistoryResponses = new ArrayList<>();

    List<Order> orders = orderRepository.findByUserIdUserId(userId);
    for (Order order : orders) {
      OrderHistoryResponse orderHistoryResponse = new OrderHistoryResponse();
      orderHistoryResponse.setOrderId(order.getOrderId());
      orderHistoryResponse.setTotalPrice(order.getTotalPrice());
      orderHistoryResponse.setOrderDate(order.getOrderDateTime());
      orderHistoryResponse.setDeliveryDateTime(order.getDeliveryDateTime());
      orderHistoryResponse.setPaymentMethod(order.getPaymentMethod());

      List<OrderProductResponse> orderProductResponses = new ArrayList<>();

      for (OrderProduct orderProduct : order.getOrderProductList()) {
        OrderProductResponse orderProductResponse = new OrderProductResponse();

        // 商品の詳細情報を取得
        Integer productId = orderProduct.getProductId();
        Integer productCategory = orderProduct.getProductCategory();

        orderProductResponse.setProductId(productId);
        orderProductResponse.setProductCategory(productCategory);
        orderProductResponse.setQuantity(orderProduct.getQuantity());

        // カテゴリーごとに商品名と価格を設定
        if (productCategory == 0) {
          Optional<Pc> pc = pcRepository.findById(productId);
          if (pc.isPresent()) {
            orderProductResponse.setProductName(pc.get().getName());
            // TODO: 画像URLの取得方法を修正
            orderProductResponse.setImageUrl("https://placehold.jp/150x100.png");
            orderProductResponse.setPrice(pc.get().getPrice());
          }
        } else if (productCategory == 1) {
          Optional<Book> book = bookRepository.findById(productId);
          if (book.isPresent()) {
            orderProductResponse.setProductName(book.get().getName());
            // TODO: 画像URLの取得方法を修正
            orderProductResponse.setImageUrl("https://placehold.jp/150x100.png");
            orderProductResponse.setPrice(book.get().getPrice());
          }
        }

        orderProductResponses.add(orderProductResponse);
      }

      orderHistoryResponse.setProducts(orderProductResponses);
      orderHistoryResponses.add(orderHistoryResponse);
    }

    return orderHistoryResponses;
  }

  /**
   * 注文を作成するメソッド.
   *
   * @param order 作成する注文
   */
  public void createOrder(Order order) {
    orderRepository.save(order);
  }
}
