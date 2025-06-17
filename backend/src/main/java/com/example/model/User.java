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

/** ユーザ情報を表すドメインクラス. */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {
  /** ユーザID. */
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "user_id")
  private Integer userId;

  /** ユーザ名. */
  @Column(name = "user_name", nullable = false)
  private String userName;

  /** メールアドレス. */
  @Column(name = "email", nullable = false, unique = true)
  private String email;

  /** パスワード. */
  @Column(name = "password", nullable = false)
  private String password;

  /** 郵便番号. */
  @Column(name = "zip_code", nullable = false, length = 7)
  private String zipCode;

  /** 都道府県. */
  @Column(name = "prefecture", length = 10)
  private String prefecture;

  /** 市区町村. */
  @Column(name = "municipalities")
  private String municipalities;

  /** 住所. */
  @Column(name = "address", nullable = false)
  private String address;

  /** 携帯番号. */
  @Column(name = "telephone", nullable = false, length = 15)
  private String telephone;
}
