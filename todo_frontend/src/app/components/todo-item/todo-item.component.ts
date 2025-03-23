import { Component, EventEmitter, Input, Output } from "@angular/core"
import { CommonModule } from "@angular/common"
import type { Todo } from "../../models/todo.model"

@Component({
  selector: "app-todo-item",
  templateUrl: "./todo-item.component.html",
  styleUrls: ["./todo-item.component.scss"],
  standalone: true,
  imports: [CommonModule],
})
export class TodoItemComponent {
  @Input() todo!: Todo
  @Output() toggleCompleted = new EventEmitter<void>()
  @Output() deleteTodo = new EventEmitter<void>()

  isExpanded = false

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded
  }

  onToggleCompleted(): void {
    this.toggleCompleted.emit()
  }

  onDeleteTodo(): void {
    this.deleteTodo.emit()
  }

  formatDate(dateString?: string): string {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleString()
  }
}