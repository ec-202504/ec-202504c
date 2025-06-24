package com.example.model;

import java.util.Objects;

/**
 * 商品を一意な識別子として使用されるレコードクラス.
 *
 * @param productId 商品ID
 * @param productCategory 商品カテゴリ
 */
public record ProductKey(Integer productId, Integer productCategory) {

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (!(o instanceof ProductKey that)) {
      return false;
    }
    return Objects.equals(productId, that.productId)
        && Objects.equals(productCategory, that.productCategory);
  }
}
