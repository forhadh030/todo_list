import { TestBed } from "@angular/core/testing"
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing"

import { TodoService } from "./todo.service"
import { environment } from "../../environments/environment"

describe("TodoService", () => {
  let service: TodoService
  let httpMock: HttpTestingController
  const apiUrl = `${environment.apiUrl}/todos`

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    })
    service = TestBed.inject(TodoService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
  })

  it("should be created", () => {
    expect(service).toBeTruthy()
  })

  it("should get all todos", () => {
    const mockTodos = [
      { id: 1, title: "Todo 1", completed: false },
      { id: 2, title: "Todo 2", completed: true },
    ]

    service.getAllTodos().subscribe((todos) => {
      expect(todos).toEqual(mockTodos)
    })

    const req = httpMock.expectOne(apiUrl)
    expect(req.request.method).toBe("GET")
    req.flush(mockTodos)
  })

  it("should get completed todos", () => {
    const mockTodos = [{ id: 2, title: "Todo 2", completed: true }]

    service.getCompletedTodos().subscribe((todos) => {
      expect(todos).toEqual(mockTodos)
    })

    const req = httpMock.expectOne(`${apiUrl}/completed`)
    expect(req.request.method).toBe("GET")
    req.flush(mockTodos)
  })

  it("should get active todos", () => {
    const mockTodos = [{ id: 1, title: "Todo 1", completed: false }]

    service.getActiveTodos().subscribe((todos) => {
      expect(todos).toEqual(mockTodos)
    })

    const req = httpMock.expectOne(`${apiUrl}/active`)
    expect(req.request.method).toBe("GET")
    req.flush(mockTodos)
  })

  it("should get todo by id", () => {
    const mockTodo = { id: 1, title: "Todo 1", completed: false }

    service.getTodoById(1).subscribe((todo) => {
      expect(todo).toEqual(mockTodo)
    })

    const req = httpMock.expectOne(`${apiUrl}/1`)
    expect(req.request.method).toBe("GET")
    req.flush(mockTodo)
  })

  it("should create todo", () => {
    const newTodo = { title: "New Todo", completed: false }
    const mockResponse = { id: 3, ...newTodo }

    service.createTodo(newTodo).subscribe((todo) => {
      expect(todo).toEqual(mockResponse)
    })

    const req = httpMock.expectOne(apiUrl)
    expect(req.request.method).toBe("POST")
    expect(req.request.body).toEqual(newTodo)
    req.flush(mockResponse)
  })

  it("should update todo", () => {
    const updatedTodo = { id: 1, title: "Updated Todo", completed: true }

    service.updateTodo(1, updatedTodo).subscribe((todo) => {
      expect(todo).toEqual(updatedTodo)
    })

    const req = httpMock.expectOne(`${apiUrl}/1`)
    expect(req.request.method).toBe("PUT")
    expect(req.request.body).toEqual(updatedTodo)
    req.flush(updatedTodo)
  })

  it("should toggle todo completed status", () => {
    const mockResponse = { id: 1, title: "Todo 1", completed: true }

    service.toggleTodoCompleted(1).subscribe((todo) => {
      expect(todo).toEqual(mockResponse)
    })

    const req = httpMock.expectOne(`${apiUrl}/1/toggle`)
    expect(req.request.method).toBe("PATCH")
    expect(req.request.body).toEqual({})
    req.flush(mockResponse)
  })

  it("should delete todo", () => {
    service.deleteTodo(1).subscribe((response) => {
      expect(response).toBeUndefined()
    })

    const req = httpMock.expectOne(`${apiUrl}/1`)
    expect(req.request.method).toBe("DELETE")
    req.flush(null)
  })
})

