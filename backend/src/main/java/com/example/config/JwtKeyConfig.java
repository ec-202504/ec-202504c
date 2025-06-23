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

/** JWTトークンの生成と検証方法を設定するクラス(RS256: 公開鍵と秘密鍵のペア). */
@Component
public class JwtKeyConfig {
  @Value("${JWT_PRIVATE_KEY_PATH}")
  private Resource jwtPrivateKeyResource;

  @Value("${JWT_PUBLIC_KEY_PATH}")
  private Resource jwtPublicKeyResource;

  private RSAPrivateKey rsaPrivateKey;
  private RSAPublicKey rsaPublicKey;

  /** このクラスがBeanに登録される時に、公開鍵と秘密鍵のペアをセットする. */
  @PostConstruct
  public void initKeys() {
    try {
      String privateKeyPEM = readKeyFromResource(jwtPrivateKeyResource);
      String publicKeyPEM = readKeyFromResource(jwtPublicKeyResource);
      this.rsaPrivateKey = loadPrivateKey(privateKeyPEM);
      this.rsaPublicKey = loadPublicKey(publicKeyPEM);
      System.out.println("RSA keys loaded successfully in JwtKeyConfig.");
    } catch (NoSuchAlgorithmException | InvalidKeySpecException | IOException e) {
      System.err.println("Failed to load RSA keys: " + e.getMessage());
      throw new RuntimeException("Error initializing JWT keys", e);
    }
  }

  private String readKeyFromResource(Resource resource) throws IOException {
    String key = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
    // PEMヘッダー・フッターを除去し改行など空白を削除
    return key.replaceAll("-----BEGIN (.*)-----", "")
        .replaceAll("-----END (.*)-----", "")
        .replaceAll("\\s", "");
  }

  /**
   * @param base64PrivateKey
   * @return
   * @throws NoSuchAlgorithmException
   * @throws InvalidKeySpecException
   */
  private RSAPrivateKey loadPrivateKey(String base64PrivateKey)
      throws NoSuchAlgorithmException, InvalidKeySpecException {
    byte[] keyBytes = Base64.getDecoder().decode(base64PrivateKey);
    PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
    KeyFactory kf = KeyFactory.getInstance("RSA");
    return (RSAPrivateKey) kf.generatePrivate(spec);
  }

  private RSAPublicKey loadPublicKey(String base64PublicKey)
      throws NoSuchAlgorithmException, InvalidKeySpecException {
    byte[] keyBytes = Base64.getDecoder().decode(base64PublicKey);
    X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
    KeyFactory kf = KeyFactory.getInstance("RSA");
    return (RSAPublicKey) kf.generatePublic(spec);
  }

  // --- JwtEncoder (生成用) Bean ---
  @Bean
  public JwtEncoder jwtEncoder() {
    JWK jwk = new RSAKey.Builder(rsaPublicKey).privateKey(rsaPrivateKey).build();
    JWKSource<SecurityContext> jwkSource = new ImmutableJWKSet<>(new JWKSet(jwk));
    return new NimbusJwtEncoder(jwkSource);
  }

  // --- JwtDecoder (検証用) Bean ---
  @Bean
  public JwtDecoder jwtDecoder() {
    return NimbusJwtDecoder.withPublicKey(rsaPublicKey).build();
  }
}
