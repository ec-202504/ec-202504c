package com.example.config;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/** 500サーバーエラーを起こした際に例外を処理するハンドラ. */
@RestControllerAdvice
public class GlobalExceptionHandler {

  /**
   * バリデーションエラーが起きた際に、エラーメッセージを返すハンドラメソッド.
   *
   * @param ex フィールドエラー
   * @return エラーメッセージ
   */
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
    List<Map<String, String>> errors =
        ex.getBindingResult().getFieldErrors().stream()
            .map(
                error ->
                    Map.of(
                        "field", error.getField(),
                        "message", Objects.requireNonNull(error.getDefaultMessage())))
            .toList();

    return ResponseEntity.badRequest().body(Map.of("errors", errors));
  }
}
