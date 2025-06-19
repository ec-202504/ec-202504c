package com.example.repository;

import com.example.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

/** Orderエンティティのリポジトリインターフェース. */
public interface OrderRepository extends JpaRepository<Order, Integer> {}
