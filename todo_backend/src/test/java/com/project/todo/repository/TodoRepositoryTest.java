package com.project.todo.repository;

import com.project.todo.model.Todo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@DataJpaTest
@ActiveProfiles("test")
public class TodoRepositoryTest {

    @Autowired
    private TodoRepository todoRepository;

    @Test
    void shouldSaveTodo() {
        // Given
        Todo todo = new Todo();
        todo.setTitle("Test Todo");
        todo.setDescription("Test Description");

        // When
        Todo savedTodo = todoRepository.save(todo);

        // Then
        assertNotNull(savedTodo);
        assertNotNull(savedTodo.getId());
        assertEquals("Test Todo", savedTodo.getTitle());
    }

    @Test
    void shouldFindByCompletedOrderByCreatedAtDesc() {
        // Given
        Todo todo1 = new Todo();
        todo1.setTitle("Todo 1");
        todo1.setCompleted(true);

        Todo todo2 = new Todo();
        todo2.setTitle("Todo 2");
        todo2.setCompleted(true);

        Todo todo3 = new Todo();
        todo3.setTitle("Todo 3");
        todo3.setCompleted(false);

        todoRepository.saveAll(List.of(todo1, todo2, todo3));

        // When
        List<Todo> completedTodos = todoRepository.findByCompletedOrderByCreatedAtDesc(true);
        List<Todo> activeTodos = todoRepository.findByCompletedOrderByCreatedAtDesc(false);

        // Then
        assertEquals(2, completedTodos.size());
        assertEquals(1, activeTodos.size());
        assertEquals("Todo 3", activeTodos.get(0).getTitle());
    }

    @Test
    void shouldFindAllByOrderByCreatedAtDesc() {
        // Given
        Todo todo1 = new Todo();
        todo1.setTitle("Todo 1");

        Todo todo2 = new Todo();
        todo2.setTitle("Todo 2");

        todoRepository.saveAll(List.of(todo1, todo2));

        // When
        List<Todo> todos = todoRepository.findAllByOrderByCreatedAtDesc();

        // Then
        assertEquals(2, todos.size());
        // The most recently created should be first due to DESC ordering
        assertEquals("Todo 2", todos.get(0).getTitle());
        assertEquals("Todo 1", todos.get(1).getTitle());
    }
}