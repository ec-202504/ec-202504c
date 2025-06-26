package com.example.repository;

import com.example.model.Book;
import com.example.model.Difficulty;
import com.example.model.Language;
import com.example.model.Purpose;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

/** Bookエンティティに対するカスタムクエリ操作を実装するクラス. */
public class BookRepositoryImpl implements BookRepositoryCustom {

  @PersistenceContext private EntityManager entityManager;

  @Override
  public Page<Book> findByMultipleConditions(
      String sort,
      String name,
      Integer price,
      String author,
      LocalDate publishDate,
      Integer languageId,
      Integer purposeId,
      Integer difficultyId,
      Pageable pageable) {

    CriteriaBuilder cb = entityManager.getCriteriaBuilder();

    // --- データ取得用クエリ ---
    CriteriaQuery<Book> cq = cb.createQuery(Book.class);
    Root<Book> root = cq.from(Book.class);
    Join<Book, Language> languageJoin = root.join("language", JoinType.LEFT);
    Join<Book, Purpose> purposeJoin = root.join("purpose", JoinType.LEFT);
    Join<Book, Difficulty> difficultyJoin = root.join("difficulty", JoinType.LEFT);

    List<Predicate> predicates = new ArrayList<>();

    if (name != null && !name.isBlank()) {
      predicates.add(cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
    }

    if (price != null) {
      predicates.add(cb.le(root.get("price"), price));
    }

    if (author != null && !author.isBlank()) {
      predicates.add(cb.like(cb.lower(root.get("author")), "%" + author.toLowerCase() + "%"));
    }

    if (publishDate != null) {
      predicates.add(cb.equal(root.get("publishDate"), publishDate));
    }

    if (languageId != null) {
      predicates.add(cb.equal(languageJoin.get("id"), languageId));
    }

    if (purposeId != null) {
      predicates.add(cb.equal(purposeJoin.get("id"), purposeId));
    }

    if (difficultyId != null) {
      predicates.add(cb.equal(difficultyJoin.get("id"), difficultyId));
    }

    cq.where(cb.and(predicates.toArray(new Predicate[0])));

    switch (sort) {
      case "priceAsc" -> cq.orderBy(cb.asc(root.get("price")));
      case "priceDesc" -> cq.orderBy(cb.desc(root.get("price")));
      default -> cq.orderBy(cb.asc(root.get("id")));
    }

    List<Book> resultList =
        entityManager
            .createQuery(cq)
            .setFirstResult((int) pageable.getOffset())
            .setMaxResults(pageable.getPageSize())
            .getResultList();

    // --- 件数カウント用クエリ ---
    CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
    Root<Book> countRoot = countQuery.from(Book.class);
    Join<Book, Language> countLanguageJoin = countRoot.join("language", JoinType.LEFT);
    Join<Book, Purpose> countPurposeJoin = countRoot.join("purpose", JoinType.LEFT);
    Join<Book, Difficulty> countDifficultyJoin = countRoot.join("difficulty", JoinType.LEFT);

    List<Predicate> countPredicates = new ArrayList<>();

    if (name != null && !name.isBlank()) {
      countPredicates.add(cb.like(cb.lower(countRoot.get("name")), "%" + name.toLowerCase() + "%"));
    }

    if (price != null) {
      countPredicates.add(cb.le(countRoot.get("price"), price));
    }

    if (author != null && !author.isBlank()) {
      countPredicates.add(
          cb.like(cb.lower(countRoot.get("author")), "%" + author.toLowerCase() + "%"));
    }

    if (publishDate != null) {
      countPredicates.add(cb.equal(countRoot.get("publishDate"), publishDate));
    }

    if (languageId != null) {
      countPredicates.add(cb.equal(countLanguageJoin.get("id"), languageId));
    }

    if (purposeId != null) {
      countPredicates.add(cb.equal(countPurposeJoin.get("id"), purposeId));
    }

    if (difficultyId != null) {
      countPredicates.add(cb.equal(countDifficultyJoin.get("id"), difficultyId));
    }

    countQuery.select(cb.count(countRoot)).where(cb.and(countPredicates.toArray(new Predicate[0])));

    Long total = entityManager.createQuery(countQuery).getSingleResult();

    return new PageImpl<>(resultList, pageable, total);
  }
}
