package com.example.service.secuiry;

import com.example.dto.security.CustomUserDetails;
import com.nimbusds.jwt.JWTClaimsSet;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

/** Jwtトークンを操作するサービス. */
@Component
public class JwtTokenProvider {
  @Value("${JWT_ISSUER}")
  private String jwtIssuer;

  @Value("${JWT_EXPIRATION}")
  private long jwtExpiration;

  public String generateToken(Authentication authentication) {
    CustomUserDetails principal = (CustomUserDetails) authentication.getPrincipal();
    // 取得したGrantedAuthorityのコレクションを、JWTペイロード用のList<String>に変換. 例) ["ROLE_ADMIN", "ROLE_USER"]
    List<String> roles =
        principal.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.toList());
    // JWTクレームセット(ペイロード)の構築
    JWTClaimsSet claimsSet =
        new JWTClaimsSet.Builder()
            .subject(principal.getUserId().toString()) // ユーザーIDを"sub"クレームに
            .issuer(jwtIssuer) // 発行者
            .issueTime(Date.from(Instant.now())) // 発行時刻
            .expirationTime(Date.from(Instant.now().plusMillis(jwtExpiration))) // 有効期限
            .claim("roles", roles) // カスタムクレームとしてロールを追加
            .build();
    return "";
  }
}
