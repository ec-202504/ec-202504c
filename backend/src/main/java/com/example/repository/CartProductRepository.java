package com.example.repository;

import com.example.model.CartProduct;
import org.springframework.data.jpa.repository.JpaRepository;

/** 商品カートエンティティのリポジトリインターフェース. */
public interface CartProductRepository extends JpaRepository<CartProduct, Integer> {}
