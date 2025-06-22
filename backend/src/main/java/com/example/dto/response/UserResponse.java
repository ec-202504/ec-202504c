package com.example.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** ユーザー情報を取得する際のレスポンスを表すDTOクラス. */
@Getter
@Setter
@NoArgsConstructor
public class UserResponse {
  private Integer userId;
  private String name;
  private String email;
  private String zipcode;
  private String address;
  private String telephone;
}
