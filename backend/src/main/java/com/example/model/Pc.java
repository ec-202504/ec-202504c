package com.example.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

/** PC商品ドメインクラス. */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "pcs")
public class Pc {
  /** PC ID. */
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "pc_id")
  private Integer id;

  /** PC名. */
  @Column(name = "name", nullable = false, length = 255)
  private String name;

  /** 価格. */
  @Column(name = "price", nullable = false)
  private Integer price;

  /** メモリ(GB). */
  @Column(name = "memory", nullable = false)
  private Integer memory;

  /** ストレージ(GB). */
  @Column(name = "storage", nullable = false)
  private Integer storage;

  /** 本体サイズ(inch). */
  @Column(name = "device_size", precision = 4, scale = 1, nullable = false)
  private BigDecimal deviceSize;

  /** デバイスタイプ. 0:デスクトップ, 1:ノートPC */
  @Column(name = "device_type", nullable = false)
  @ColumnDefault("0")
  private Integer deviceType;

  /** OS. */
  @ManyToOne
  @JoinColumn(name = "os_id", nullable = false)
  private Os os;

  /** CPU. */
  @ManyToOne
  @JoinColumn(name = "cpu_id", nullable = false)
  private Cpu cpu;

  /** GPU. */
  @ManyToOne
  @JoinColumn(name = "gpu_id", nullable = false)
  private Gpu gpu;

  /** 使用目的. */
  @ManyToOne
  @JoinColumn(name = "purpose_id", nullable = false)
  private Purpose purpose;
}
