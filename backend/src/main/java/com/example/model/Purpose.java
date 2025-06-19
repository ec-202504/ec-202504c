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

/** 使用目的(Web開発, AI etc.)ドメインクラス. */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "purposes")
public class Purpose {
  /** 使用目的ID. */
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "purpose_id")
  private Integer id;

  /** 使用目的名. */
  @Column(name = "name", nullable = false, length = 255)
  private String name;
}
