package com.example.dto.request;

import com.example.validation.UniqueEmail;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** ユーザー登録リクエストDTO. ユーザー登録に必要な情報を保持する. */
@Getter
@Setter
@NoArgsConstructor
public class RegisterRequest {
  @NotBlank(message = "名前は必須です")
  String name;

  @NotBlank(message = "メールアドレスは必須です")
  @Email(message = "メールアドレスの形式が正しくありません")
  @UniqueEmail
  String email;

  @NotBlank(message = "パスワードは必須です")
  String password;

  @NotBlank(message = "郵便番号は必須です")
  String zipcode;

  @NotBlank(message = "都道府県は必須です")
  String prefecture;

  @NotBlank(message = "市区町村は必須です")
  String municipalities;

  @NotBlank(message = "住所は必須です")
  String address;

  @NotBlank(message = "電話番号は必須です")
  String telephone;
}
