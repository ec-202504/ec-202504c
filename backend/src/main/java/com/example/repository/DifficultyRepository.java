package com.example.repository;

import com.example.model.Difficulty;
import org.springframework.data.jpa.repository.JpaRepository;

/** Difficultyエンティティのリポジトリインターフェース. */
public interface DifficultyRepository extends JpaRepository<Difficulty, Integer> {}
