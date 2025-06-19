package com.example.service;

import com.example.model.User;
import com.example.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/** Userエンティティのサービスクラス. */
@Service
@RequiredArgsConstructor
public class UserService {
  private final UserRepository userRepository;

  /**
   * ユーザーをIDで検索するメソッド.
   *
   * @param id ユーザーID
   * @return 該当するユーザー情報
   */
  public User findById(Integer id) {
    return userRepository
        .findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ユーザーが見つかりません"));
  }
}
