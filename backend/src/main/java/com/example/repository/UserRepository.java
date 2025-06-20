package com.example.repository;

import com.example.model.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/** Userエンティティのリポジトリインターフェース. */
public interface UserRepository extends JpaRepository<User, Integer> {
  /**
   * ユーザーをメールアドレスで検索する.
   *
   * @param email メールアドレス
   * @return ユーザー
   */
  Optional<User> findByEmail(String email);

  /**
   * ユーザーをメールアドレスとパスワードで検索する.
   *
   * @param email メールアドレス
   * @param password パスワード
   * @return ユーザー
   */
  Optional<User> findByEmailAndPassword(String email, String password);
}
