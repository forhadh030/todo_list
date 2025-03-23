import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { BehaviorSubject, type Observable, tap } from "rxjs"
import { environment } from "../../environments/environment"

interface AuthResponse {
  token: string
}

interface RegisterRequest {
  username: string
  email: string
  password: string
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`
  private tokenSubject = new BehaviorSubject<string | null>(this.getStoredToken())
  public token$ = this.tokenSubject.asObservable()

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { 
      username, 
      password 
    }).pipe(
      tap((response) => {
        this.storeToken(response.token)
        this.tokenSubject.next(response.token)
      }),
    )
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, email, password })
  }

  logout(): void {
    localStorage.removeItem("auth_token")
    this.tokenSubject.next(null)
  }

  isLoggedIn(): boolean {
    return !!this.getStoredToken()
  }

  getToken(): string | null {
    return this.tokenSubject.value
  }

  private storeToken(token: string): void {
    localStorage.setItem("auth_token", token)
  }

  private getStoredToken(): string | null {
    return localStorage.getItem("auth_token")
  }
}