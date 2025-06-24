package com.example.config;

import com.example.dto.security.CustomUserDetails;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Component;

/** JWTトークンを提供するサービス. */
@Component
@RequiredArgsConstructor
public class JwtTokenProvider {
  private final JwtEncoder jwtEncoder; // JWT生成用のエンコーダー（JwtKeyConfigで設定）

  @Value("${JWT_ISSUER}")
  private String jwtIssuer; // 発行者

  @Value("${JWT_EXPIRATION}")
  private long jwtExpiration; // 有効期限

  /**
   * 認証情報からJWTトークンを生成する.
   *
   * @param authentication 認証情報
   * @return JWTトークン
   */
  public String generateToken(Authentication authentication) {
    CustomUserDetails principal = (CustomUserDetails) authentication.getPrincipal();
    // 取得した権限のコレクションを、JWTクレーム用にList<String>に変換. 例) ["ROLE_ADMIN", "ROLE_USER"]
    List<String> roles =
        principal.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.toList());
    // JWTクレームセット(ペイロード)の構築
    JwtClaimsSet claimsSet =
        JwtClaimsSet.builder()
            .subject(principal.getEmail()) // メールアドレスを"sub"クレームにセット
            .issuer(jwtIssuer) // 発行者
            .issuedAt(Date.from(Instant.now()).toInstant()) // 発行時刻
            .expiresAt(Date.from(Instant.now().plusMillis(jwtExpiration)).toInstant()) // 有効期限
            .claim("roles", roles) // カスタムクレームとしてロールを追加
            .build();
    // JWTを生成し、文字列に変換して返す
    return jwtEncoder.encode(JwtEncoderParameters.from(claimsSet)).getTokenValue();
  }
}
