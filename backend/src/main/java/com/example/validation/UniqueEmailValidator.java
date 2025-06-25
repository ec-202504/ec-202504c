package com.example.validation;

import com.example.service.UserService;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.RequiredArgsConstructor;

/** 入力されたメールアドレスが既に登録されていないかを判定するバリデータ. */
@RequiredArgsConstructor
public class UniqueEmailValidator implements ConstraintValidator<UniqueEmail, String> {
  private final UserService userService;

  /**
   * 入力されたメールアドレスが既に登録されていないかを判定する.
   *
   * @param email メールアドレス
   * @param context コンテクスト
   * @return メールアドレスが登録されていないか
   */
  @Override
  public boolean isValid(String email, ConstraintValidatorContext context) {
    return userService.findByEmail(email).isEmpty();
  }
}
