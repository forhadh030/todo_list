package com.project.todo.service;

import com.project.todo.exception.ResourceNotFoundException;
import com.project.todo.model.Todo;
import com.project.todo.repository.TodoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TodoServiceTest {

    @Mock
    private TodoRepository todoRepository;

    @InjectMocks
    private TodoService todoService;

    private Todo todo1;
    private Todo todo2;

    @BeforeEach
    void setUp() {
        todo1 = new Todo();
        todo1.setId(1L);
        todo1.setTitle("Todo 1");
        todo1.setCompleted(false);

        todo2 = new Todo();
        todo2.setId(2L);
        todo2.setTitle("Todo 2");
        todo2.setCompleted(true);
    }

    @Test
    void shouldGetAllTodos() {
        // Given
        doReturn(Arrays.asList(todo1, todo2)).when(todoRepository).findAllByOrderByCreatedAtDesc();

        // When
        List<Todo> todos = todoService.getAllTodos();

        // Then
        assertEquals(2, todos.size());
        verify(todoRepository, times(1)).findAllByOrderByCreatedAtDesc();
    }

    @Test
    void shouldGetCompletedTodos() {
        // Given
        doReturn(List.of(todo2)).when(todoRepository).findByCompletedOrderByCreatedAtDesc(true);

        // When
        List<Todo> completedTodos = todoService.getCompletedTodos();

        // Then
        assertEquals(1, completedTodos.size());
        assertEquals("Todo 2", completedTodos.get(0).getTitle());
        verify(todoRepository, times(1)).findByCompletedOrderByCreatedAtDesc(true);
    }

    @Test
    void shouldGetActiveTodos() {
        // Given
        doReturn(List.of(todo1)).when(todoRepository).findByCompletedOrderByCreatedAtDesc(false);

        // When
        List<Todo> activeTodos = todoService.getActiveTodos();

        // Then
        assertEquals(1, activeTodos.size());
        assertEquals("Todo 1", activeTodos.get(0).getTitle());
        verify(todoRepository, times(1)).findByCompletedOrderByCreatedAtDesc(false);
    }

    @Test
    void shouldGetTodoById() {
        // Given
        doReturn(Optional.of(todo1)).when(todoRepository).findById(1L);

        // When
        Todo foundTodo = todoService.getTodoById(1L);

        // Then
        assertNotNull(foundTodo);
        assertEquals(1L, foundTodo.getId());
        verify(todoRepository, times(1)).findById(1L);
    }

    @Test
    void shouldThrowExceptionWhenTodoNotFound() {
        // Given
        doReturn(Optional.empty()).when(todoRepository).findById(3L);

        // When/Then
        Exception exception = assertThrows(ResourceNotFoundException.class, () -> {
            todoService.getTodoById(3L);
        });

        assertTrue(exception.getMessage().contains("Todo not found with id: 3"));
    }

    @Test
    void shouldCreateTodo() {
        // Given
        Todo newTodo = new Todo();
        newTodo.setTitle("New Todo");

        doReturn(newTodo).when(todoRepository).save(any(Todo.class));

        // When
        Todo createdTodo = todoService.createTodo(newTodo);

        // Then
        assertNotNull(createdTodo);
        assertEquals("New Todo", createdTodo.getTitle());
        verify(todoRepository, times(1)).save(newTodo);
    }

    @Test
    void shouldUpdateTodo() {
        // Given
        Todo todoToUpdate = new Todo();
        todoToUpdate.setTitle("Updated Title");
        todoToUpdate.setDescription("Updated Description");
        todoToUpdate.setCompleted(true);

        doReturn(Optional.of(todo1)).when(todoRepository).findById(1L);
        doAnswer(invocation -> invocation.getArgument(0)).when(todoRepository).save(any(Todo.class));

        // When
        Todo updatedTodo = todoService.updateTodo(1L, todoToUpdate);

        // Then
        assertNotNull(updatedTodo);
        assertEquals("Updated Title", updatedTodo.getTitle());
        assertEquals("Updated Description", updatedTodo.getDescription());
        assertTrue(updatedTodo.isCompleted());
        verify(todoRepository, times(1)).findById(1L);
        verify(todoRepository, times(1)).save(any(Todo.class));
    }

    @Test
    void shouldToggleTodoCompleted() {
        // Given
        doReturn(Optional.of(todo1)).when(todoRepository).findById(1L);
        doAnswer(invocation -> {
            Todo savedTodo = invocation.getArgument(0);
            savedTodo.setId(1L);
            return savedTodo;
        }).when(todoRepository).save(any(Todo.class));

        // When
        Todo toggledTodo = todoService.toggleTodoCompleted(1L);

        // Then
        assertNotNull(toggledTodo);
        assertTrue(toggledTodo.isCompleted()); // Was false, now should be true
        verify(todoRepository, times(1)).findById(1L);
        verify(todoRepository, times(1)).save(any(Todo.class));
    }

    @Test
    void shouldDeleteTodo() {
        // Given
        doReturn(Optional.of(todo1)).when(todoRepository).findById(1L);
        doNothing().when(todoRepository).delete(any(Todo.class));

        // When
        todoService.deleteTodo(1L);

        // Then
        verify(todoRepository, times(1)).findById(1L);
        verify(todoRepository, times(1)).delete(todo1);
    }
}

