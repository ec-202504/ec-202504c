package com.example.repository;

import com.example.model.Gpu;
import org.springframework.data.jpa.repository.JpaRepository;

/** GPUエンティティのリポジトリインターフェース. */
public interface GpuRepository extends JpaRepository<Gpu, Integer> {}
