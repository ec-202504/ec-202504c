package com.example.config;

import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import org.springframework.http.HttpStatus;
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

  /**
   * エンティティが見つからない場合に、404エラーを返すハンドラメソッド.
   *
   * @param ex エンティティが見つからない例外
   * @return 404エラーメッセージ
   */
  @ExceptionHandler(EntityNotFoundException.class)
  public ResponseEntity<String> handleEntityNotFound(EntityNotFoundException ex) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
  }

  /**
   * その他の例外が発生した場合に、500エラーを返すハンドラメソッド.
   *
   * @param ex その他の例外
   * @return 500エラーメッセージ
   */
  @ExceptionHandler(MessagingException.class)
  public ResponseEntity<String> handleMessagingException(MessagingException ex) {
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("メール送信中にエラーが発生しました。");
  }
}
