package com.example.controller;

import com.example.dto.request.LoginRequest;
import com.example.dto.request.RegisterRequest;
import com.example.dto.response.UserResponse;
import com.example.model.User;
import com.example.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
   * <p>正常に登録された場合は、セッションにユーザーIDを入れ、200 OK を返す.
   *
   * <p>失敗した場合は、401 UNAUTHORIZEDを返す.
   *
   * @param request ログイン情報
   * @param session セッション
   * @return ユーザー(異常系:401)
   */
  @PostMapping("/login")
  public ResponseEntity<User> login(@RequestBody LoginRequest request, HttpSession session) {
    return userService
        .findByEmailAndPassword(request.getEmail(), request.getPassword())
        .map(
            user -> {
              session.setAttribute("userId", user.getUserId());
              return ResponseEntity.ok(user);
            })
        .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
  }

  /**
   * ログアウトする.
   *
   * <p>セッションを破棄し、204 NO CONTENT を返す.
   *
   * @param session セッション
   * @return ステータスコード204
   */
  @PostMapping("/logout")
  public ResponseEntity<Void> logout(HttpSession session) {
    session.invalidate();
    return ResponseEntity.noContent().build();
  }

  /**
   * 現在のログイン状態を確認する.
   *
   * <p>セッションにユーザーIDが存在すれば、200 OK を返す。
   *
   * <p>存在しない場合は、401 UNAUTHORIZED を返す。
   *
   * @param session セッション
   * @return 認証状態(正常:200, 異常:401)
   */
  @GetMapping("/me")
  public ResponseEntity<Void> me(HttpSession session) {
    Object userId = session.getAttribute("userId");
    if (userId != null) {
      return ResponseEntity.ok().build();
    } else {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
  }

  /**
   * ユーザー情報を取得する.
   *
   * <p>セッションにユーザーIDが存在すれば、200 OK とユーザー情報を返す。
   *
   * <p>存在しない場合は、404 NOT FOUND を返す。
   *
   * @param session セッション
   * @return ユーザー情報
   */
  @GetMapping
  public ResponseEntity<UserResponse> getUser(HttpSession session) {
    Integer userId = (Integer) session.getAttribute("userId");
    System.out.println("User ID from session: " + userId);
    if (userId == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    return userService
        .findById(userId)
        .map(
            user -> {
              UserResponse response = new UserResponse();
              response.setUserId(user.getUserId());
              response.setName(user.getName());
              response.setEmail(user.getEmail());
              response.setZipcode(user.getZipcode());
              response.setAddress(user.getAddress());
              response.setTelephone(user.getTelephone());
              return ResponseEntity.ok(response);
            })
        .orElse(ResponseEntity.notFound().build());
  }
}
