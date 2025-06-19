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
  String message() default "そのメールアドレスは既に登録されています";

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};
}
