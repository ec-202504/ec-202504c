package com.example.repository;

import com.example.model.PC;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PCRepository extends JpaRepository<PC, Integer> {}
