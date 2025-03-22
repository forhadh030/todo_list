import { Component } from "@angular/core"
import { RouterOutlet, RouterModule } from "@angular/router"
import { CommonModule } from "@angular/common"
import { AuthService } from "./services/auth.service"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
})
export class AppComponent {
  title = "Todo App"
  currentYear = new Date().getFullYear()

  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout()
  }
}