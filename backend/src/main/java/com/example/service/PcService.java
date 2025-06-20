package com.example.service;

import com.example.model.Pc;
import com.example.repository.PcRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** PC操作を行うサービスクラス. */
@Service
@RequiredArgsConstructor
@Transactional
public class PcService {
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
  public Page<Pc> findPcsWithPageable(String keyword, Pageable pageable) {
    // キーワードがnullまたは空文字の場合、全件取得
    if (keyword == null || keyword.isBlank()) {
      return pcRepository.findAll(pageable);
    }
    return pcRepository.findByNameContainingIgnoreCase(keyword, pageable);
  }

  /**
   * PCの詳細情報を取得するメソッド.
   *
   * @param pcId PCのID
   * @return PCの詳細情報
   */
  public Optional<Pc> findById(Integer pcId) {
    return pcRepository.findById(pcId);
  }

  /**
   * OSのIDと一致するPCのリストを取得するメソッド.
   *
   * @param osId OSのID
   * @return OSのIDと一致するPCのリスト
   */
  public List<Pc> findByOsId(Integer osId) {
    return pcRepository.findByOs_Id(osId);
  }

  /**
   * PC登録を行うメソッド.
   *
   * @param pc 登録するPCの詳細情報
   * @return 登録されたPCの詳細情報
   */
  public Pc registerPc(Pc pc) {
    return pcRepository.save(pc);
  }

  /**
   * PC削除を行うメソッド.
   *
   * @param pcId 削除するPCのID
   */
  public void removePc(Integer pcId) {
    pcRepository.deleteById(pcId);
  }
}
