package com.example.repository;

import com.example.model.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/** Userエンティティのリポジトリインターフェース. */
public interface UserRepository extends JpaRepository<User, Integer> {

  /**
   * メールアドレスでユーザーを検索する.
   *
   * @param email メールアドレス
   * @return ユーザー
   */
  Optional<User> findByEmail(String email);
}
