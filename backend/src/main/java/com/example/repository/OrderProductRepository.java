package com.example.repository;

import com.example.model.OrderProduct;
import org.springframework.data.jpa.repository.JpaRepository;

/** OrderProductエンティティのリポジトリインターフェース. */
public interface OrderProductRepository extends JpaRepository<OrderProduct, Integer> {}
