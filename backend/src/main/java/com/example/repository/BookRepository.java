package com.example.repository;

import com.example.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;

/** Bookエンティティのリポジトリインターフェース. */
public interface BookRepository extends JpaRepository<Book, Integer> {}
