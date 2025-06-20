package com.example.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** ログインリクエストDTO. */
@Getter
@Setter
@NoArgsConstructor
public class LoginRequest {
  private String email;
  private String password;
}
