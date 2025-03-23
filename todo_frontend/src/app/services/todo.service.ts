import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import type { Todo } from "../models/todo.model"
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: "root",
})
export class TodoService {
  private apiUrl = `${environment.apiUrl}/todos`

  constructor(private http: HttpClient) {}

  getAllTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl)
  }

  getCompletedTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.apiUrl}/completed`)
  }

  getActiveTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.apiUrl}/active`)
  }

  getTodoById(id: number): Observable<Todo> {
    return this.http.get<Todo>(`${this.apiUrl}/${id}`)
  }

  createTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, todo)
  }

  updateTodo(id: number, todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/${id}`, todo)
  }

  toggleTodoCompleted(id: number): Observable<Todo> {
    return this.http.patch<Todo>(`${this.apiUrl}/${id}/toggle`, {})
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }
}