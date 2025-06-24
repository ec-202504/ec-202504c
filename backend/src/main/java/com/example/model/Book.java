package com.example.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** 書籍ドメインクラス. */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "books")
public class Book {
  /** 本ID. */
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "book_id")
  private Integer id;

  /** 本のタイトル. */
  @Column(name = "name", nullable = false, length = 255)
  private String name;

  /** 著者. */
  @Column(name = "author", nullable = false, length = 255)
  private String author;

  /** 出版日. */
  @Column(name = "publish_date", nullable = false)
  private LocalDate publishDate;

  /** 価格. */
  @Column(name = "price", nullable = false)
  private Integer price;

  /** 言語. */
  @ManyToOne
  @JoinColumn(name = "language_id", nullable = false)
  private Language language;

  /** 使用目的. */
  @ManyToOne
  @JoinColumn(name = "purpose_id", nullable = false)
  private Purpose purpose;

  /** 対象者. */
  @ManyToOne
  @JoinColumn(name = "difficulty_id", nullable = false)
  private Difficulty difficulty;
}
