package com.example.service;

import com.example.model.Order;
import com.example.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Orderエンティティのサービスクラス. */
@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {
  private final OrderRepository orderRepository;

  /**
   * 注文を作成するメソッド.
   *
   * @param order 作成する注文
   */
  public void createOrder(Order order) {
    orderRepository.save(order);
  }
}
