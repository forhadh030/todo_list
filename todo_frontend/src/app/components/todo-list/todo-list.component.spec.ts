import { type ComponentFixture, TestBed } from "@angular/core/testing"
import { HttpClientTestingModule } from "@angular/common/http/testing"
import { of, throwError } from "rxjs"

import { TodoListComponent } from "./todo-list.component"
import { TodoService } from "../../services/todo.service"
import { TodoItemComponent } from "../todo-item/todo-item.component"
import { TodoFormComponent } from "../todo-form/todo-form.component"
import { ReactiveFormsModule } from "@angular/forms"

describe("TodoListComponent", () => {
  let component: TodoListComponent
  let fixture: ComponentFixture<TodoListComponent>
  let todoService: TodoService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoListComponent, TodoItemComponent, TodoFormComponent, HttpClientTestingModule, ReactiveFormsModule],
      providers: [TodoService],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoListComponent)
    component = fixture.componentInstance
    todoService = TestBed.inject(TodoService)
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })

  it("should load todos on init", () => {
    const mockTodos = [
      { id: 1, title: "Test Todo 1", completed: false },
      { id: 2, title: "Test Todo 2", completed: true },
    ]
    spyOn(todoService, "getAllTodos").and.returnValue(of(mockTodos))

    component.ngOnInit()

    expect(todoService.getAllTodos).toHaveBeenCalled()
    expect(component.todos).toEqual(mockTodos)
    expect(component.loading).toBeFalse()
  })

  it("should handle error when loading todos", () => {
    spyOn(todoService, "getAllTodos").and.returnValue(throwError(() => new Error("Test error")))
    spyOn(console, "error")

    component.ngOnInit()

    expect(todoService.getAllTodos).toHaveBeenCalled()
    expect(component.error).toBe("Failed to load todos. Please try again.")
    expect(component.loading).toBeFalse()
    expect(console.error).toHaveBeenCalled()
  })

  it("should toggle todo completed status", () => {
    const mockTodo = { id: 1, title: "Test Todo", completed: false }
    const updatedTodo = { ...mockTodo, completed: true }
    component.todos = [mockTodo]

    spyOn(todoService, "toggleTodoCompleted").and.returnValue(of(updatedTodo))

    component.toggleTodoCompleted(mockTodo)

    expect(todoService.toggleTodoCompleted).toHaveBeenCalledWith(1)
    expect(component.todos[0]).toEqual(updatedTodo)
  })

  it("should delete todo", () => {
    const mockTodo = { id: 1, title: "Test Todo", completed: false }
    component.todos = [mockTodo]

    spyOn(todoService, "deleteTodo").and.returnValue(of(void 0))
    spyOn(window, "confirm").and.returnValue(true)

    component.deleteTodo(1)

    expect(todoService.deleteTodo).toHaveBeenCalledWith(1)
    expect(component.todos.length).toBe(0)
  })

  it("should set filter and reload todos", () => {
    spyOn(todoService, "getActiveTodos").and.returnValue(of([]))

    component.setFilter("active")

    expect(component.filter).toBe("active")
    expect(todoService.getActiveTodos).toHaveBeenCalled()
  })
})