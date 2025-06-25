package com.example.controller;

import com.example.config.JwtTokenProvider;
import com.example.dto.request.LoginRequest;
import com.example.dto.request.RegisterRequest;
import com.example.model.User;
import com.example.service.UserService;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** 　ユーザー情報を操作するコントローラ. */
@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
  private final UserService userService;
  private final AuthenticationManager authenticationManager;
  private final JwtTokenProvider jwtTokenProvider;

  /**
   * ユーザーを登録する.
   *
   * <p>正常に登録された場合は、201 CREATED を返す.
   *
   * @param request ユーザー情報
   * @return ステータスコード201
   */
  @PostMapping("/register")
  public ResponseEntity<Void> register(@Validated @RequestBody RegisterRequest request) {
    User user = new User();
    BeanUtils.copyProperties(request, user);
    userService.register(user);
    return ResponseEntity.status(HttpStatus.CREATED).build();
  }

  /**
   * ログインする.
   *
   * <p>正常に登録された場合は、JWTトークンを生成し、200 OK を返す.
   *
   * <p>失敗した場合は、AuthenticationExceptionが発生する（GlobalExceptionHandlerが処理）.
   *
   * @param request ログイン情報
   * @return JWTトークン
   */
  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    // 初回認証
    UsernamePasswordAuthenticationToken token =
        new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword());
    Authentication authentication = authenticationManager.authenticate(token);
    // 認証成功 → JWTトークン生成
    String jwt = jwtTokenProvider.generateToken(authentication);
    return ResponseEntity.ok(Map.of("token", jwt));
  }

  /**
   * 現在のログイン状態を確認する.
   *
   * <p>JWTトークンが存在する（認証に成功）場合は、ユーザー情報を返す.
   *
   * <p>認証に失敗した場合は、AuthenticationExceptionが発生する.
   *
   * @param jwt SecurityContextから取得したJWTトークン
   * @return ユーザー情報
   */
  @GetMapping("/me")
  public ResponseEntity<?> me(@AuthenticationPrincipal Jwt jwt) {
    // なくても動くが念のため
    if (jwt == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    return ResponseEntity.ok(getUser(jwt));
  }

  /**
   * JWTからemailを取り出し、ユーザー検索し返す.
   *
   * @param jwt JWTトークン
   * @return ユーザー
   */
  private User getUser(Jwt jwt) {
    String email = jwt.getSubject();
    return userService.findByEmail(email);
  }
}
