package com.example.repository;

import com.example.model.Cpu;
import org.springframework.data.jpa.repository.JpaRepository;

/** CPUエンティティのリポジトリインターフェース. */
public interface CpuRepository extends JpaRepository<Cpu, Integer> {}
