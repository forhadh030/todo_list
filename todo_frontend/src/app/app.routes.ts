import type { Routes } from "@angular/router"
import { TodoListComponent } from "./components/todo-list/todo-list.component"
import { LoginComponent } from "./components/login/login.component"
import { RegisterComponent } from "./components/register/register.component"
import { authGuard } from "./guards/auth.guard"

export const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "", component: TodoListComponent, canActivate: [() => authGuard()] },
  { path: "**", redirectTo: "" },
]