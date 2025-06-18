package com.example.repository;

import com.example.model.Pc;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

/** PCエンティティのリポジトリインターフェース. */
public interface PcRepository extends JpaRepository<Pc, Integer> {

  /**
   * PC名にキーワードを含むPCのページネーションされたリストを取得する.
   *
   * @param keyword 検索キーワード
   * @param pageable ページネーション情報
   * @return ページネーションされたPCのリスト
   */
  Page<Pc> findByNameContainingIgnoreCase(String keyword, Pageable pageable);
}
