package com.example.repository;

import com.example.model.Purpose;
import org.springframework.data.jpa.repository.JpaRepository;

/** Purposeエンティティのリポジトリインターフェース. */
public interface PurposeRepository extends JpaRepository<Purpose, Integer> {}
