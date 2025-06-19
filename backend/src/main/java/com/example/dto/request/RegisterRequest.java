package com.example.dto.request;

import lombok.Getter;
import lombok.Setter;

/** ユーザー登録リクエストDTO. ユーザー登録に必要な情報を保持する. */
@Getter
@Setter
public class RegisterRequest {
  String name;
  String email;
  String password;
  String zipcode;
  String prefecture;
  String municipalities;
  String address;
  String telephone;
}
