package com.project.todo.model;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

public class TodoTest {

    @Test
    void shouldCreateTodoWithDefaultValues() {
        // When
        Todo todo = new Todo();

        // Then
        assertNull(todo.getId());
        assertNull(todo.getTitle());
        assertNull(todo.getDescription());
        assertFalse(todo.isCompleted());
        assertNotNull(todo.getCreatedAt());
        assertNull(todo.getUpdatedAt());
        assertNull(todo.getCompletedAt());
    }

    @Test
    void shouldUpdateCompletedAtWhenCompletedIsTrue() {
        // Given
        Todo todo = new Todo();
        todo.setTitle("Test Todo");
        todo.setCompleted(true);

        // When
        todo.onUpdate(); // Manually trigger the @PreUpdate method

        // Then
        assertNotNull(todo.getUpdatedAt());
        assertNotNull(todo.getCompletedAt());
    }

    @Test
    void shouldNotUpdateCompletedAtWhenAlreadyCompleted() {
        // Given
        Todo todo = new Todo();
        todo.setTitle("Test Todo");
        todo.setCompleted(true);

        LocalDateTime initialCompletedAt = LocalDateTime.now().minusDays(1);
        todo.setCompletedAt(initialCompletedAt);

        // When
        todo.onUpdate(); // Manually trigger the @PreUpdate method

        // Then
        assertNotNull(todo.getUpdatedAt());
        assertEquals(initialCompletedAt, todo.getCompletedAt());
    }
}