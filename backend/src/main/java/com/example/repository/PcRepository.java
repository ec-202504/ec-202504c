package com.example.repository;

import com.example.model.Pc;
import org.springframework.data.jpa.repository.JpaRepository;

/** PCエンティティのリポジトリインターフェース. */
public interface PcRepository extends JpaRepository<Pc, Integer> {}
