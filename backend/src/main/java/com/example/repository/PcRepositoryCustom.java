package com.example.repository;

import com.example.model.Pc;
import java.math.BigDecimal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/** Pcエンティティに対するカスタムクエリ操作を定義するインタフェース. */
public interface PcRepositoryCustom {
  /**
   * 複数の条件に基づいてPCを検索し、ページングされた結果を返す.
   *
   * @param sort 値段の順序を指定する文字列（priceAsc or priceDesc）
   * @param name 名前
   * @param price 価格
   * @param memory メモリ
   * @param storage ストレージ
   * @param deviceSize 本体サイズ
   * @param deviceType デバイスタイプ
   * @param osId OS
   * @param cpuId CPU
   * @param gpuId GPU
   * @param purposeId 使用目的
   * @param pageable ページネーション情報
   * @return PCに含まれる情報と一致するページネーションされたPCのリスト
   */
  Page<Pc> findByMultipleConditions(
      String sort,
      String name,
      Integer price,
      Integer memory,
      Integer storage,
      BigDecimal deviceSize,
      Integer deviceType,
      Integer osId,
      Integer cpuId,
      Integer gpuId,
      Integer purposeId,
      Pageable pageable);
}
