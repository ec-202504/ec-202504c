package com.example.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** 言語ドメインクラス. */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "languages")
public class Language {
  /** 言語ID. */
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "language_id")
  private Integer id;

  /** 言語名. */
  @Column(name = "name", nullable = false, length = 255)
  private String name;
}
