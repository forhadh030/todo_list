import { Component, EventEmitter, Output } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { TodoService } from "../../services/todo.service"
import type { Todo } from "../../models/todo.model"

@Component({
  selector: "app-todo-form",
  templateUrl: "./todo-form.component.html",
  styleUrls: ["./todo-form.component.scss"],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class TodoFormComponent {
  @Output() todoAdded = new EventEmitter<void>()

  todoForm: FormGroup
  submitting = false
  error = ""

  constructor(
    private fb: FormBuilder,
    private todoService: TodoService,
  ) {
    this.todoForm = this.fb.group({
      title: ["", [Validators.required, Validators.minLength(3)]],
      description: [""],
    })
  }

  onSubmit(): void {
    if (this.todoForm.invalid) {
      return
    }

    this.submitting = true
    this.error = ""

    const newTodo: Todo = {
      title: this.todoForm.value.title,
      description: this.todoForm.value.description,
      completed: false,
    }

    this.todoService.createTodo(newTodo).subscribe({
      next: () => {
        this.todoForm.reset()
        this.submitting = false
        this.todoAdded.emit()
      },
      error: (err) => {
        this.error = "Failed to add todo. Please try again."
        this.submitting = false
        console.error("Error adding todo:", err)
      },
    })
  }

  get title() {
    return this.todoForm.get("title")
  }
}

