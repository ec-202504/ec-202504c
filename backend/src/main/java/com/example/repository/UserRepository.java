package com.example.repository;

import com.example.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

/** Userエンティティのリポジトリインターフェース. */
public interface UserRepository extends JpaRepository<User, Integer> {}
