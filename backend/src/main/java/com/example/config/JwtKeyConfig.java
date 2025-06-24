package com.example.config;

import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.Resource;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.stereotype.Component;

/**
 * JWTの署名・検証に使用するRSA鍵ペア（公開鍵・秘密鍵）を読み込み、 トークンの生成・検証用のBean（JwtEncoder / JwtDecoder）を提供する設定クラス.
 *
 * <p>対応アルゴリズム: RS256（公開鍵暗号方式）
 */
@Component
public class JwtKeyConfig {
  // Base64でエンコードされた秘密鍵（対象パスのファイルが読み込まれる）
  @Value("${JWT_PRIVATE_KEY_PATH}")
  private Resource jwtPrivateKeyResource;

  // Base64でエンコードされた公開鍵
  @Value("${JWT_PUBLIC_KEY_PATH}")
  private Resource jwtPublicKeyResource;

  private RSAPrivateKey rsaPrivateKey; // 秘密鍵のオブジェクト
  private RSAPublicKey rsaPublicKey; // 公開鍵のオブジェクト

  /** このクラスがBeanに登録される時に、公開鍵と秘密鍵のペアをセットする. */
  @PostConstruct
  public void initKeys() {
    try {
      String privateKeyPEM = readKeyFromResource(jwtPrivateKeyResource);
      String publicKeyPEM = readKeyFromResource(jwtPublicKeyResource);
      this.rsaPrivateKey = loadPrivateKey(privateKeyPEM);
      this.rsaPublicKey = loadPublicKey(publicKeyPEM);
    } catch (NoSuchAlgorithmException | InvalidKeySpecException | IOException e) {
      throw new RuntimeException("Failed to load RSA keys", e);
    }
  }

  /**
   * PEM形式（Base64 + ヘッダー）の鍵ファイルを読み込み、Base64文字列だけを抽出する.
   *
   * @param resource リソースオブジェクト（PEMファイル）
   * @return ヘッダー・改行・空白を除去したBase64文字列
   * @throws IOException 読み込み失敗時
   */
  private String readKeyFromResource(Resource resource) throws IOException {
    String key = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
    // PEMヘッダー・フッターを除去し改行など空白を削除
    return key.replaceAll("-----BEGIN (.*)-----", "")
        .replaceAll("-----END (.*)-----", "")
        .replaceAll("\\s", "");
  }

  /**
   * Base64エンコードされた秘密鍵文字列から RSAPrivateKey を生成する。
   *
   * @param base64PrivateKey Base64エンコード済み秘密鍵文字列
   * @return 秘密鍵オブジェクト
   * @throws NoSuchAlgorithmException アルゴリズム未対応時
   * @throws InvalidKeySpecException 不正な鍵形式の場合
   */
  private RSAPrivateKey loadPrivateKey(String base64PrivateKey)
      throws NoSuchAlgorithmException, InvalidKeySpecException {
    byte[] keyBytes = Base64.getDecoder().decode(base64PrivateKey);
    PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
    KeyFactory kf = KeyFactory.getInstance("RSA");
    return (RSAPrivateKey) kf.generatePrivate(spec);
  }

  /**
   * Base64エンコードされた公開鍵文字列から RSAPublicKey を生成する。
   *
   * @param base64PublicKey Base64エンコード済み公開鍵文字列
   * @return 公開鍵オブジェクト
   * @throws NoSuchAlgorithmException アルゴリズム未対応時
   * @throws InvalidKeySpecException 不正な鍵形式の場合
   */
  private RSAPublicKey loadPublicKey(String base64PublicKey)
      throws NoSuchAlgorithmException, InvalidKeySpecException {
    byte[] keyBytes = Base64.getDecoder().decode(base64PublicKey);
    X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
    KeyFactory kf = KeyFactory.getInstance("RSA");
    return (RSAPublicKey) kf.generatePublic(spec);
  }

  /**
   * JwtEncoder (生成用) Bean
   *
   * @return JWTエンコーダー
   */
  @Bean
  public JwtEncoder jwtEncoder() {
    JWK jwk = new RSAKey.Builder(rsaPublicKey).privateKey(rsaPrivateKey).build();
    JWKSource<SecurityContext> jwkSource = new ImmutableJWKSet<>(new JWKSet(jwk));
    return new NimbusJwtEncoder(jwkSource);
  }

  /**
   * JwtDecoder (検証用) Bean
   *
   * @return JWTデコーダー
   */
  @Bean
  public JwtDecoder jwtDecoder() {
    return NimbusJwtDecoder.withPublicKey(rsaPublicKey).build();
  }
}
