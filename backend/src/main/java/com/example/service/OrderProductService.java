package com.example.service;

import com.example.model.OrderProduct;
import com.example.repository.OrderProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class OrderProductService {
  private final OrderProductRepository orderProductRepository;

  /**
   * 注文商品を作成するメソッド.
   *
   * @param orderProduct 作成する注文商品
   */
  public void createOrderProduct(OrderProduct orderProduct) {
    orderProductRepository.save(orderProduct);
  }
}
