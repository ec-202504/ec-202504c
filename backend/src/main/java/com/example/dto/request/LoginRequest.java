package com.example.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/** ログインリクエストDTO. */
@Getter
@Setter
@NoArgsConstructor
@ToString
public class LoginRequest {
  private String email;
  private String password;
}
