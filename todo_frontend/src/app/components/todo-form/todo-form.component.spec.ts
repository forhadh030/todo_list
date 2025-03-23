import { type ComponentFixture, TestBed } from "@angular/core/testing"
import { ReactiveFormsModule } from "@angular/forms"
import { HttpClientTestingModule } from "@angular/common/http/testing"
import { of, throwError } from "rxjs"

import { TodoFormComponent } from "./todo-form.component"
import { TodoService } from "../../services/todo.service"

describe("TodoFormComponent", () => {
  let component: TodoFormComponent
  let fixture: ComponentFixture<TodoFormComponent>
  let todoService: TodoService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoFormComponent, ReactiveFormsModule, HttpClientTestingModule],
      providers: [TodoService],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoFormComponent)
    component = fixture.componentInstance
    todoService = TestBed.inject(TodoService)
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })

  it("should initialize form with empty fields", () => {
    expect(component.todoForm.get("title")?.value).toBe("")
    expect(component.todoForm.get("description")?.value).toBe("")
  })

  it("should validate required title field", () => {
    const titleControl = component.todoForm.get("title")

    titleControl?.setValue("")
    expect(titleControl?.valid).toBeFalse()

    titleControl?.setValue("Test")
    expect(titleControl?.valid).toBeTrue()
  })

  it("should validate minimum length of title", () => {
    const titleControl = component.todoForm.get("title")

    titleControl?.setValue("Te")
    expect(titleControl?.valid).toBeFalse()

    titleControl?.setValue("Test")
    expect(titleControl?.valid).toBeTrue()
  })

  it("should submit form and create todo", () => {
    const todoData = {
      title: "Test Todo",
      description: "Test Description",
    }

    component.todoForm.setValue(todoData)

    spyOn(todoService, "createTodo").and.returnValue(of({ ...todoData, id: 1, completed: false }))
    spyOn(component.todoAdded, "emit")

    component.onSubmit()

    expect(todoService.createTodo).toHaveBeenCalledWith({
      title: "Test Todo",
      description: "Test Description",
      completed: false,
    })
    expect(component.todoForm.value.title).toBe("")
    expect(component.todoForm.value.description).toBe("")
    expect(component.submitting).toBeFalse()
    expect(component.todoAdded.emit).toHaveBeenCalled()
  })

  it("should handle error when creating todo", () => {
    const todoData = {
      title: "Test Todo",
      description: "Test Description",
    }

    component.todoForm.setValue(todoData)

    spyOn(todoService, "createTodo").and.returnValue(throwError(() => new Error("Test error")))
    spyOn(console, "error")

    component.onSubmit()

    expect(todoService.createTodo).toHaveBeenCalled()
    expect(component.error).toBe("Failed to add todo. Please try again.")
    expect(component.submitting).toBeFalse()
    expect(console.error).toHaveBeenCalled()
  })

  it("should not submit if form is invalid", () => {
    component.todoForm.setValue({
      title: "",
      description: "Test Description",
    })

    spyOn(todoService, "createTodo")

    component.onSubmit()

    expect(todoService.createTodo).not.toHaveBeenCalled()
  })
})