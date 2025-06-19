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

/** GPU情報ドメインクラス. */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "gpus")
public class Gpu {
  /** GPU ID. */
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "gpu_id")
  private Integer id;

  /** GPU名. */
  @Column(name = "name", nullable = false, length = 255)
  private String name;
}
