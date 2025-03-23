import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { Router, RouterModule } from "@angular/router"
import { AuthService } from "../../services/auth.service"

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class RegisterComponent {
  registerForm: FormGroup
  error = ""
  success = ""
  loading = false

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group({
      username: ["", [Validators.required, Validators.minLength(3)]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    })
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return
    }

    this.loading = true
    this.error = ""
    this.success = ""

    const { username, email, password } = this.registerForm.value

    this.authService.register(username, email, password).subscribe({
      next: () => {
        this.success = "Registration successful! Please login."
        this.loading = false
        setTimeout(() => {
          this.router.navigate(["/login"])
        }, 2000)
      },
      error: (err) => {
        this.error = err.error || "Registration failed. Please try again."
        this.loading = false
        console.error("Registration error:", err)
      },
    })
  }
}