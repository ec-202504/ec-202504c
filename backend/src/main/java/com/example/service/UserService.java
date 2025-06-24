package com.example.service;

import com.example.model.User;
import com.example.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Userエンティティのサービスクラス. */
@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  /**
   * ユーザーをIDで検索する.
   *
   * @param id ユーザーID
   * @return ユーザー
   */
  public Optional<User> findById(Integer id) {
    return userRepository.findById(id);
  }

  /**
   * ユーザーをメールアドレスで検索する. (異常系:EntityNotFoundException)
   *
   * @param email メールアドレス
   * @return ユーザー
   */
  public User findByEmail(String email) {
    return userRepository
        .findByEmail(email)
        .orElseThrow(() -> new EntityNotFoundException("ユーザーが見つかりません: " + email));
  }

  /**
   * ユーザーをメールアドレスとパスワードで検索する.
   *
   * @param email メールアドレス
   * @param password パスワード
   * @return ユーザー
   */
  public Optional<User> findByEmailAndPassword(String email, String password) {
    return userRepository.findByEmailAndPassword(email, password);
  }

  /**
   * ユーザーを登録する.
   *
   * @param user ユーザー情報
   * @return ユーザー(自動採番されたユーザーIDを保持)
   */
  public User register(User user) {
    user.setPassword(passwordEncoder.encode(user.getPassword()));
    return userRepository.save(user);
  }
}
