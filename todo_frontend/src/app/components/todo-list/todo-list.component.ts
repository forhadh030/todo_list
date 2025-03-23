import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { TodoService } from "../../services/todo.service"
import { Todo } from "../../models/todo.model"
import { TodoItemComponent } from "../todo-item/todo-item.component"
import { TodoFormComponent } from "../todo-form/todo-form.component"

@Component({
  selector: "app-todo-list",
  templateUrl: "./todo-list.component.html",
  styleUrls: ["./todo-list.component.scss"],
  standalone: true,
  imports: [CommonModule, TodoItemComponent, TodoFormComponent],
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = []
  loading = false
  error = ""
  filter: "all" | "active" | "completed" = "all"

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos()
  }

  loadTodos(): void {
    this.loading = true
    this.error = ""

    let observable

    switch (this.filter) {
      case "active":
        observable = this.todoService.getActiveTodos()
        break
      case "completed":
        observable = this.todoService.getCompletedTodos()
        break
      default:
        observable = this.todoService.getAllTodos()
    }

    observable.subscribe({
      next: (todos) => {
        this.todos = todos
        this.loading = false
      },
      error: (err) => {
        this.error = "Failed to load todos. Please try again."
        this.loading = false
        console.error("Error loading todos:", err)
      },
    })
  }

  toggleTodoCompleted(todo: Todo): void {
    this.todoService.toggleTodoCompleted(todo.id!).subscribe({
      next: (updatedTodo) => {
        const index = this.todos.findIndex((t) => t.id === updatedTodo.id)
        if (index !== -1) {
          this.todos[index] = updatedTodo
        }

        // If we're filtering, we might need to reload the list
        if (this.filter !== "all") {
          this.loadTodos()
        }
      },
      error: (err) => {
        this.error = "Failed to update todo. Please try again."
        console.error("Error toggling todo:", err)
      },
    })
  }

  deleteTodo(id: number): void {
    if (confirm("Are you sure you want to delete this todo?")) {
      this.todoService.deleteTodo(id).subscribe({
        next: () => {
          this.todos = this.todos.filter((todo) => todo.id !== id)
        },
        error: (err) => {
          this.error = "Failed to delete todo. Please try again."
          console.error("Error deleting todo:", err)
        },
      })
    }
  }

  setFilter(filter: "all" | "active" | "completed"): void {
    this.filter = filter
    this.loadTodos()
  }
}