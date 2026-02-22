import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/auth.model';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <div class="login-box">
        <h2>Lift Maintenance System</h2>
        <h3>Login</h3>
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              type="text"
              id="username"
              [(ngModel)]="loginRequest.username"
              name="username"
              required
              placeholder="Enter username"
            />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              [(ngModel)]="loginRequest.password"
              name="password"
              required
              placeholder="Enter password"
            />
          </div>
          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>
          <button type="submit" [disabled]="isLoading">
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </button>
        </form>
        <div class="info-text">
          <p>Default credentials: admin / admin123</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .login-box {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    h2 {
      margin: 0 0 0.5rem 0;
      color: #333;
      text-align: center;
    }
    h3 {
      margin: 0 0 1.5rem 0;
      color: #666;
      text-align: center;
      font-weight: normal;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
      font-weight: 500;
    }
    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      box-sizing: border-box;
    }
    input:focus {
      outline: none;
      border-color: #667eea;
    }
    button {
      width: 100%;
      padding: 0.75rem;
      background-color: #667eea;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    button:hover:not(:disabled) {
      background-color: #5a6fd6;
    }
    button:disabled {
      background-color: #999;
      cursor: not-allowed;
    }
    .error-message {
      color: #dc3545;
      margin-bottom: 1rem;
      text-align: center;
    }
    .info-text {
      margin-top: 1rem;
      text-align: center;
      color: #666;
      font-size: 0.875rem;
    }
    .info-text p {
      margin: 0;
    }
  `]
})
export class LoginComponent {
  loginRequest: LoginRequest = {
    username: '',
    password: ''
  };
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.loginRequest.username || !this.loginRequest.password) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginRequest).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/lifts']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.error || 'Invalid username or password';
      }
    });
  }
}
