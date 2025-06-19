package com.example.repository;

import com.example.model.Os;
import org.springframework.data.jpa.repository.JpaRepository;

/** OSエンティティのリポジトリインターフェース. */
public interface OsRepository extends JpaRepository<Os, Integer> {}
