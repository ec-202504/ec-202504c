package com.example.service;

import com.example.model.Pc;
import com.example.repository.PcRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/** PC操作を行うサービスクラス. */
@Service
@RequiredArgsConstructor
public class PCService {
  private final PcRepository pcRepository;

  /**
   * PC一覧を取得するメソッド.
   *
   * @return PCのリスト
   */
  public List<Pc> getAllPcs() {
    return pcRepository.findAll();
  }

  /**
   * キーワードを含むPCのリストを取得するメソッド.
   *
   * @param keyword 検索キーワード
   * @return PC名にキーワードを含むPCのリスト
   */
  public List<Pc> findPcs(String keyword) {
    // キーワードがnullまたは空文字の場合、全件取得
    if (keyword == null || keyword.isBlank()) {
      return pcRepository.findAll();
    }
    return pcRepository.findByNameContainingIgnoreCase(keyword);
  }

  /**
   * ページネーション、ソートされたPCのリストを取得するメソッド.
   *
   * @param keyword 検索キーワード
   * @param pageable ページ情報
   * @return ページネーションされたPCのリスト
   */
  public Page<Pc> findPcs(String keyword, Pageable pageable) {
    // キーワードがnullまたは空文字の場合、全件取得
    if (keyword == null || keyword.isBlank()) {
      return pcRepository.findAll(pageable);
    }
    return pcRepository.findByNameContainingIgnoreCase(keyword, pageable);
  }

  /**
   * PC登録を行うメソッド.
   *
   * @param pc 登録するPCの詳細情報
   * @return 登録されたPCの詳細情報
   */
  public Pc registerPC(Pc pc) {
    return pcRepository.save(pc);
  }
}
