import { type ComponentFixture, TestBed } from "@angular/core/testing"

import { TodoItemComponent } from "./todo-item.component"

describe("TodoItemComponent", () => {
  let component: TodoItemComponent
  let fixture: ComponentFixture<TodoItemComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoItemComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoItemComponent)
    component = fixture.componentInstance
    component.todo = { id: 1, title: "Test Todo", completed: false }
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })

  it("should toggle expanded state", () => {
    expect(component.isExpanded).toBeFalse()

    component.toggleExpand()
    expect(component.isExpanded).toBeTrue()

    component.toggleExpand()
    expect(component.isExpanded).toBeFalse()
  })

  it("should emit toggleCompleted event", () => {
    spyOn(component.toggleCompleted, "emit")

    component.onToggleCompleted()

    expect(component.toggleCompleted.emit).toHaveBeenCalled()
  })

  it("should emit deleteTodo event", () => {
    spyOn(component.deleteTodo, "emit")

    component.onDeleteTodo()

    expect(component.deleteTodo.emit).toHaveBeenCalled()
  })

  it("should format date correctly", () => {
    const testDate = "2023-04-15T10:30:00"
    const formattedDate = component.formatDate(testDate)

    expect(formattedDate).not.toBe("")
    expect(typeof formattedDate).toBe("string")
  })

  it("should handle undefined date", () => {
    const formattedDate = component.formatDate(undefined)

    expect(formattedDate).toBe("")
  })
})