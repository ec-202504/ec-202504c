package com.example.repository;

import com.example.model.Pc;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

/** PCエンティティのリポジトリインターフェース. */
public interface PcRepository extends JpaRepository<Pc, Integer> {

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
   * OSのIDと一致するPCのリストを取得する.
   *
   * @param osId OSのID
   * @return OSのIDと一致するPCのリスト
   */
  List<Pc> findByOs_Id(Integer osId);
  /**
   * GPUのIDと一致するPCのリストを取得する.
   *
   * @param gpuId GPUのID
   * @return GPUのIDと一致するPCのリスト
   */
  List<Pc> findByGpu_Id(Integer gpuId);

  /**
   * 目的IDと一致するPCのリストを取得する.
   *
   * @param purposeId 目的ID
   * @return 目的IDと一致するPCのリスト
   */
  List<Pc> findByPurpose_Id(Integer purposeId);
}
