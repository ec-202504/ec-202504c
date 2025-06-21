package com.example.controller;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** 支払い関連の操作を行うコントローラクラス. */
@RestController
@RequestMapping("/payments")
public class PaymentController {
  @Value("${STRIPE_SECRET_KEY}")
  private String stripeSecretKey;

  /** StripeのAPIキーを初期化するメソッド. Beanの初期化時に呼び出される。 */
  @PostConstruct
  public void init() {
    Stripe.apiKey = stripeSecretKey;
  }

  /**
   * 支払いIntentを作成するエンドポイント.
   *
   * @return 支払いIntentのクライアントシークレット
   */
  @PostMapping("/verify-card")
  public ResponseEntity<Map<String, String>> createPaymentIntent() {
    try {
      PaymentIntentCreateParams params =
          PaymentIntentCreateParams.builder()
              .setAmount(50L) // 金額は最小値(50円)
              .setCurrency("jpy")
              .setAutomaticPaymentMethods(
                  PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                      .setEnabled(false) // card のみに制限
                      .build())
              .addPaymentMethodType("card")
              .setCaptureMethod(PaymentIntentCreateParams.CaptureMethod.MANUAL) // ホールドのみ
              .build();
      PaymentIntent intent = PaymentIntent.create(params);

      Map<String, String> response = new HashMap<>();
      response.put("clientSecret", intent.getClientSecret());

      return ResponseEntity.ok(response);
    } catch (StripeException e) {
      return ResponseEntity.status((HttpStatus.INTERNAL_SERVER_ERROR))
          .body(Map.of("error", e.getMessage()));
    }
  }
}
