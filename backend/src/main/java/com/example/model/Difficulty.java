package com.example.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** 難易度ドメインクラス. */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "difficulties")
public class Difficulty {
  /** 難易度ID. */
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "difficulty_id")
  private Integer id;

  /** 対象者. */
  @Column(name = "target", nullable = false, length = 255)
  private String target;
}
