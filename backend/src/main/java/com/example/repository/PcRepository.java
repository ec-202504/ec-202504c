package com.example.repository;

import com.example.model.Pc;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

/** PCエンティティのリポジトリインターフェース. */
public interface PcRepository extends JpaRepository<Pc, Integer>, PcRepositoryCustom {

  /**
   * PC名にキーワードを含むPCの一覧を、大文字・小文字を区別せずに取得する.
   *
   * @param keyword 検索キーワード
   * @return 名前にキーワードを含むPCのリスト
   */
  List<Pc> findByNameContainingIgnoreCase(String keyword);

  /**
   * PC名にキーワードを含むPCのページネーションされたリストを取得する.
   *
   * @param keyword 検索キーワード
   * @param pageable ページネーション情報
   * @return ページネーションされたPCのリスト
   */
  Page<Pc> findByNameContainingIgnoreCase(String keyword, Pageable pageable);

  /**
   * PC名にキーワードを含むPCのリストを取得する（オートコンプリート用、最大20件）.
   *
   * @param keyword 検索キーワード
   * @return キーワードを含むPC名のリスト（最大20件）
   */
  List<Pc> findTop20ByNameContainingIgnoreCase(String keyword);

  /**
   * CPUのIDと一致するPCのリストを取得する.
   *
   * @param cpuId CPUのID
   * @return CPUのIDと一致するPCのリスト
   */
  List<Pc> findByCpuId(Integer cpuId);

  /**
   * OSのIDと一致するPCのリストを取得する.
   *
   * @param osId OSのID
   * @return OSのIDと一致するPCのリスト
   */
  List<Pc> findByOsId(Integer osId);

  /**
   * GPUのIDと一致するPCのリストを取得する.
   *
   * @param gpuId GPUのID
   * @return GPUのIDと一致するPCのリスト
   */
  List<Pc> findByGpuId(Integer gpuId);

  /**
   * 目的IDと一致するPCのリストを取得する.
   *
   * @param purposeId 目的ID
   * @return 目的IDと一致するPCのリスト
   */
  List<Pc> findByPurposeId(Integer purposeId);

  /**
   * PCに含まれる情報と一致するPCのリストを取得する.
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
