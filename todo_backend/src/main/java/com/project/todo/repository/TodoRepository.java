package com.project.todo.repository;

import com.project.todo.model.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {

    List<Todo> findByCompletedOrderByCreatedAtDesc(boolean completed);

    List<Todo> findAllByOrderByCreatedAtDesc();
}
