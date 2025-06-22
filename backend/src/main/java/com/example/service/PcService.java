package com.example.service;

import com.example.model.*;
import com.example.repository.*;
import java.math.BigDecimal;
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
  private final OsRepository osRepository;
  private final CpuRepository cpuRepository;
  private final GpuRepository gpuRepository;
  private final PurposeRepository purposeRepository;

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
   * キーワードを含むPC名のリストを取得するメソッド（オートコンプリート用、最大20件）.
   *
   * @param keyword 検索キーワード
   * @return キーワードを含むPC名のリスト（最大20件）
   */
  public List<Pc> findPcsSuggestions(String keyword) {
    return pcRepository.findTop20ByNameContainingIgnoreCase(keyword);
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
   * CPUのIDと一致するPcのリストを取得するメソッド.
   *
   * @param cpuId CPUのID
   * @return CPUのIDと一致するPCのリスト
   */
  public List<Pc> findByCpuId(Integer cpuId) {
    return pcRepository.findByCpuId(cpuId);
  }

  /**
   * OSのIDと一致するPCのリストを取得するメソッド.
   *
   * @param osId OSのID
   * @return OSのIDと一致するPCのリスト
   */
  public List<Pc> findByOsId(Integer osId) {
    return pcRepository.findByOsId(osId);
  }

  /**
   * GPUのIDと一致するPCのリストを取得するメソッド.
   *
   * @param gpuId GPUのID
   * @return GPUのIDと一致するPCのリスト
   */
  public List<Pc> findByGpuId(Integer gpuId) {
    return pcRepository.findByGpuId(gpuId);
  }

  /**
   * 目的IDと一致するPCのリストを取得するメソッド.
   *
   * @param purposeId 目的ID
   * @return 目的IDと一致するPCのリスト
   */
  public List<Pc> findByPurposeId(Integer purposeId) {
    return pcRepository.findByPurposeId(purposeId);
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

  /**
   * OS一覧を取得するメソッド.
   *
   * @return OSのリスト
   */
  public List<Os> getAllOses() {
    return osRepository.findAll();
  }

  /**
   * CPU一覧を取得するメソッド.
   *
   * @return CPUのリスト
   */
  public List<Cpu> getAllCpus() {
    return cpuRepository.findAll();
  }

  /**
   * GPU一覧を取得するメソッド.
   *
   * @return GPUのリスト
   */
  public List<Gpu> getAllGpus() {
    return gpuRepository.findAll();
  }

  /**
   * PCの目的一覧を取得するメソッド.
   *
   * @return PCの目的のリスト
   */
  public List<Purpose> getAllPurposes() {
    return purposeRepository.findAllByProductCategory(0);
  }

  /**
   * 　検索結果が含まれるページネーションされたPCのリストを取得するメソッド.
   *
   * @param sort ソート条件（ASC or DESC）
   * @param name　デバイス名
   * @param price　価格
   * @param memory　メモリ
   * @param storage　ストレージ
   * @param deviceSize デバイスサイズ
   * @param deviceType デバイスタイプ
   * @param osId OSのID
   * @param cpuId CPUのID
   * @param gpuId GPUのID
   * @param purposeId 目的ID
   * @param pageable ページネーション情報
   * @return 検索結果が含まれるページネーションされたPCのリスト
   */
  public Page<Pc> findByMultipleConditions(
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
      Pageable pageable) {
    return pcRepository.findByMultipleConditions(
        sort,
        name,
        price,
        memory,
        storage,
        deviceSize,
        deviceType,
        osId,
        cpuId,
        gpuId,
        purposeId,
        pageable);
  }
}
