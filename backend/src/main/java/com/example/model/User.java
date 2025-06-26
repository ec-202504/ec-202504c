package com.example.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

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

  /** 氏名. */
  @Column(name = "name", nullable = false, length = 255)
  private String name;

  /** メールアドレス. */
  @Column(name = "email", nullable = false, unique = true, length = 255)
  private String email;

  /** パスワードハッシュ. */
  @Column(name = "password", nullable = false, length = 255)
  private String password;

  /** 郵便番号. */
  @Column(name = "zipcode", nullable = false, length = 7)
  private String zipcode;

  /** 都道府県. */
  @Column(name = "prefecture", length = 10)
  private String prefecture;

  /** 市区町村. */
  @Column(name = "municipalities", length = 255)
  private String municipalities;

  /** 住所. */
  @Column(name = "address", nullable = false, length = 255)
  private String address;

  /** 電話番号. */
  @Column(name = "telephone", nullable = false, length = 15)
  private String telephone;

  /** 権限（false:ユーザ, true:管理者）. */
  @Column(name = "role", nullable = false)
  @ColumnDefault("false")
  private Boolean role = false;

  /** 通知許可. */
  @Column(name = "approval", nullable = false)
  @ColumnDefault("false")
  private Boolean approval = false;

  /** 注文リスト. */
  @OneToMany(mappedBy = "userId", fetch = FetchType.LAZY)
  @JsonIgnore
  private List<Order> orderList;
}
