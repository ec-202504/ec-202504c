package com.example.controller;

import com.example.dto.request.LoginRequest;
import com.example.dto.request.RegisterRequest;
import com.example.model.User;
import com.example.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
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
   * @return ステータスコード
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
   * <p>正常に登録された場合は、200 OK を返す.
   *
   * <p>失敗した場合は、401 UN UNAUTHORIZEDを返す.
   *
   * @param request ログイン情報
   * @return ユーザー
   */
  @PostMapping("/login")
  public ResponseEntity<User> login(@RequestBody LoginRequest request) {
    System.out.println(request);
    return userService
        .findByEmailAndPassword(request.getEmail(), request.getPassword())
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
  }
}
