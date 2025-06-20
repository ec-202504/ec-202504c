package com.example.repository;

import com.example.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

/** Reviewエンティティのリポジトリインターフェース. */
public interface ReviewRepository extends JpaRepository<Review, Integer> {}
