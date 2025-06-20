package com.example.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/** メールアドレスが既に登録されていないかを判定するアノテーション. */
@Constraint(validatedBy = UniqueEmailValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface UniqueEmail {
  /**
   * バリデーションエラーが発生した際に表示されるデフォルトのメッセージを返す.
   *
   * @return エラーメッセージ
   */
  String message() default "そのメールアドレスは既に登録されています";

  /**
   * バリデーショングループを指定するために使用(通常は使用しない).
   *
   * @return 適用対象のグループの配列
   */
  Class<?>[] groups() default {};

  /**
   * カスタムのメタ情報を指定するために使用される(通常は使用しない).
   *
   * @return ペイロードクラスの配列
   */
  Class<? extends Payload>[] payload() default {};
}
