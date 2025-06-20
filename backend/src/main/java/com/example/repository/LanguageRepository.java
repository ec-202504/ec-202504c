package com.example.repository;

import com.example.model.Language;
import org.springframework.data.jpa.repository.JpaRepository;

/** Languageエンティティのリポジトリインターフェース. */
public interface LanguageRepository extends JpaRepository<Language, Integer> {}
