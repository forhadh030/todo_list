package com.project.todo.controller;

import com.project.todo.model.Todo;
import com.project.todo.service.TodoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class TodoControllerTest {

    private MockMvc mockMvc;

    @Mock
    private TodoService todoService;

    @InjectMocks
    private TodoController todoController;

    private ObjectMapper objectMapper;

    private Todo todo1;
    private Todo todo2;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        mockMvc = MockMvcBuilders.standaloneSetup(todoController).build();

        todo1 = new Todo();
        todo1.setId(1L);
        todo1.setTitle("Todo 1");
        todo1.setDescription("Description 1");
        todo1.setCompleted(false);

        todo2 = new Todo();
        todo2.setId(2L);
        todo2.setTitle("Todo 2");
        todo2.setDescription("Description 2");
        todo2.setCompleted(true);
    }

    @Test
    void shouldGetAllTodos() throws Exception {
        List<Todo> todos = Arrays.asList(todo1, todo2);
        doReturn(todos).when(todoService).getAllTodos();

        mockMvc.perform(get("/api/todos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].title", is("Todo 1")))
                .andExpect(jsonPath("$[1].id", is(2)))
                .andExpect(jsonPath("$[1].title", is("Todo 2")));

        verify(todoService, times(1)).getAllTodos();
    }

    @Test
    void shouldGetCompletedTodos() throws Exception {
        doReturn(List.of(todo2)).when(todoService).getCompletedTodos();

        mockMvc.perform(get("/api/todos/completed"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(2)))
                .andExpect(jsonPath("$[0].completed", is(true)));

        verify(todoService, times(1)).getCompletedTodos();
    }

    @Test
    void shouldGetActiveTodos() throws Exception {
        doReturn(List.of(todo1)).when(todoService).getActiveTodos();

        mockMvc.perform(get("/api/todos/active"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].completed", is(false)));

        verify(todoService, times(1)).getActiveTodos();
    }

    @Test
    void shouldGetTodoById() throws Exception {
        doReturn(todo1).when(todoService).getTodoById(1L);

        mockMvc.perform(get("/api/todos/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.title", is("Todo 1")));

        verify(todoService, times(1)).getTodoById(1L);
    }

    @Test
    void shouldCreateTodo() throws Exception {
        Todo newTodo = new Todo();
        newTodo.setTitle("New Todo");
        newTodo.setDescription("New Description");

        doReturn(newTodo).when(todoService).createTodo(any(Todo.class));

        mockMvc.perform(post("/api/todos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newTodo)))
                .andExpect(status().isCreated());

        verify(todoService, times(1)).createTodo(any(Todo.class));
    }

    @Test
    void shouldUpdateTodo() throws Exception {
        Todo updatedTodo = new Todo();
        updatedTodo.setId(1L);
        updatedTodo.setTitle("Updated Todo");
        updatedTodo.setDescription("Updated Description");
        updatedTodo.setCompleted(true);

        doReturn(updatedTodo).when(todoService).updateTodo(eq(1L), any(Todo.class));

        mockMvc.perform(put("/api/todos/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedTodo)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.title", is("Updated Todo")))
                .andExpect(jsonPath("$.completed", is(true)));

        verify(todoService, times(1)).updateTodo(eq(1L), any(Todo.class));
    }

    @Test
    void shouldToggleTodoCompleted() throws Exception {
        Todo toggledTodo = new Todo();
        toggledTodo.setId(1L);
        toggledTodo.setTitle("Todo 1");
        toggledTodo.setCompleted(true);

        doReturn(toggledTodo).when(todoService).toggleTodoCompleted(1L);

        mockMvc.perform(patch("/api/todos/1/toggle"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.completed", is(true)));

        verify(todoService, times(1)).toggleTodoCompleted(1L);
    }

    @Test
    void shouldDeleteTodo() throws Exception {
        doNothing().when(todoService).deleteTodo(1L);

        mockMvc.perform(delete("/api/todos/1"))
                .andExpect(status().isNoContent());

        verify(todoService, times(1)).deleteTodo(1L);
    }
}