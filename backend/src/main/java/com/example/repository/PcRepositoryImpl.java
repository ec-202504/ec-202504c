package com.example.repository;

import com.example.model.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
public class PcRepositoryImpl implements PcRepositoryCustom {

  @PersistenceContext private EntityManager entityManager;

  /**
   * PCに含まれる情報と一致するページネーションされたPCのリストを取得する.
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
  @Override
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
    CriteriaBuilder cb = entityManager.getCriteriaBuilder();

    CriteriaQuery<Pc> cq = cb.createQuery(Pc.class);
    Root<Pc> root = cq.from(Pc.class);

    Join<Pc, Os> osJoin = root.join("os", JoinType.LEFT);
    Join<Pc, Cpu> cpuJoin = root.join("cpu", JoinType.LEFT);
    Join<Pc, Gpu> gpuJoin = root.join("gpu", JoinType.LEFT);
    Join<Pc, Purpose> purposeJoin = root.join("purpose", JoinType.LEFT);

    List<Predicate> predicates = new ArrayList<>();

    // 検索条件に名前が含まれていれば一致するPC名を大文字・小文字を無視して検索する条件を追加
    if (name != null && !name.isBlank()) {
      predicates.add(cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
    }

    // 検索条件に価格が含まれていれば指定した価格より低い価格のPCを検索する条件を追加
    if (price != null) {
      predicates.add(cb.le(root.get("price"), price));
    }

    // 検索条件にメモリが含まれていれば一致するメモリを検索条件に追加
    if (memory != null) {
      predicates.add(cb.equal(root.get("memory"), memory));
    }

    // 検索条件にストレージが含まれていれば一致するストレージを検索条件に追加
    if (storage != null) {
      predicates.add(cb.equal(root.get("storage"), storage));
    }

    // 検索条件にデバイスサイズが含まれていれば一致するデバイスサイズを検索条件に追加
    if (deviceSize != null) {
      predicates.add(cb.equal(root.get("deviceSize"), deviceSize));
    }

    // 検索条件にデバイスタイプが含まれていれば一致するデバイスタイプを検索条件に追加
    if (deviceType != null) {
      predicates.add(cb.equal(root.get("deviceType"), deviceType));
    }

    // 検索条件にOSの種類が含まれていれば一致するOSを検索条件に追加
    if (osId != null) {
      predicates.add(cb.equal(osJoin.get("id"), osId));
    }

    // 検索条件にCPUの種類が含まれていれば一致するCPUを検索条件に追加
    if (cpuId != null) {
      predicates.add(cb.equal(cpuJoin.get("id"), cpuId));
    }

    // 検索条件にGPUの種類が含まれていれば一致するGPUを検索条件に追加
    if (gpuId != null) {
      predicates.add(cb.equal(gpuJoin.get("id"), gpuId));
    }

    // 検索条件に目的の種類が含まれていれば一致する目的を検索条件に追加
    if (purposeId != null) {
      predicates.add(cb.equal(purposeJoin.get("id"), purposeId));
    }

    // 追加された条件のみをWHERE句に挿入
    cq.where(cb.and(predicates.toArray(new Predicate[0])));

    // 価格順にソート
    switch (sort) {
      case "priceAsc" -> cq.orderBy(cb.asc(root.get("price")));
      case "priceDesc" -> cq.orderBy(cb.desc(root.get("price")));
      default -> cq.orderBy(cb.asc(root.get("id")));
    }

    // 1ページに表示するPCのリストを作成
    List<Pc> resultList =
        entityManager
            .createQuery(cq)
            .setFirstResult((int) pageable.getOffset())
            .setMaxResults(pageable.getPageSize())
            .getResultList();

    // --- 件数カウント用クエリ(これがないとページネーションできない) ---
    CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
    Root<Pc> countRoot = countQuery.from(Pc.class);

    List<Predicate> countPredicates = new ArrayList<>();

    // 検索条件に名前が含まれていれば一致するPC名を大文字・小文字を無視して検索する条件を追加
    if (name != null && !name.isBlank()) {
      countPredicates.add(cb.like(cb.lower(countRoot.get("name")), "%" + name.toLowerCase() + "%"));
    }

    // 検索条件に価格が含まれていれば指定した価格より低い価格のPCを検索する条件を追加
    if (price != null) {
      countPredicates.add(cb.le(countRoot.get("price"), price));
    }

    // 検索条件にメモリが含まれていれば一致するメモリを検索条件に追加
    if (memory != null) {
      countPredicates.add(cb.equal(countRoot.get("memory"), memory));
    }

    // 検索条件にストレージが含まれていれば一致するストレージを検索条件に追加
    if (storage != null) {
      countPredicates.add(cb.equal(countRoot.get("storage"), storage));
    }

    // 検索条件にデバイスサイズが含まれていれば一致するデバイスサイズを検索条件に追加
    if (deviceSize != null) {
      countPredicates.add(cb.equal(countRoot.get("deviceSize"), deviceSize));
    }

    // 検索条件にデバイスタイプが含まれていれば一致するデバイスタイプを検索条件に追加
    if (deviceType != null) {
      countPredicates.add(cb.equal(countRoot.get("deviceType"), deviceType));
    }

    // 検索条件にOSの種類が含まれていれば一致するOSを検索条件に追加
    if (osId != null) {
      Join<Pc, Os> countOsJoin = countRoot.join("os", JoinType.LEFT);
      countPredicates.add(cb.equal(countOsJoin.get("id"), osId));
    }

    // 検索条件にCPUの種類が含まれていれば一致するCPUを検索条件に追加
    if (cpuId != null) {
      Join<Pc, Cpu> countCpuJoin = countRoot.join("cpu", JoinType.LEFT);
      countPredicates.add(cb.equal(countCpuJoin.get("id"), cpuId));
    }

    // 検索条件にGPUの種類が含まれていれば一致するGPUを検索条件に追加
    if (gpuId != null) {
      Join<Pc, Gpu> countGpuJoin = countRoot.join("gpu", JoinType.LEFT);
      countPredicates.add(cb.equal(countGpuJoin.get("id"), gpuId));
    }

    // 検索条件に目的の種類が含まれていれば一致する目的を検索条件に追加
    if (purposeId != null) {
      Join<Pc, Purpose> countPurposeJoin = countRoot.join("purpose", JoinType.LEFT);
      countPredicates.add(cb.equal(countPurposeJoin.get("id"), purposeId));
    }

    // 全件数を取得するSQL文を実行
    countQuery.select(cb.count(countRoot)).where(cb.and(countPredicates.toArray(new Predicate[0])));

    // 全件取得
    Long total = entityManager.createQuery(countQuery).getSingleResult();

    return new PageImpl<>(resultList, pageable, total);
  }
}
