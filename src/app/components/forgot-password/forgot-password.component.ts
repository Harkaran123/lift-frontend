import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RecoveryService } from '../../services/recovery.service';
import { ForgotPasswordRequest } from '../../models/recovery.model';

@Component({
  selector: 'app-forgot-password',
  template: `
    <div class="forgot-container">
      <div class="forgot-box">
        <h2>Account Recovery</h2>
        <p class="subtitle">Enter your email and select what you need to recover</p>
        
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Email Address</label>
            <input
              type="email"
              id="email"
              [(ngModel)]="request.email"
              name="email"
              required
              placeholder="Enter your email"
            />
          </div>

          <div class="options-group">
            <label class="option-label">
              <input
                type="checkbox"
                [(ngModel)]="request.forgotPassword"
                name="forgotPassword"
              />
              <span>I forgot my password</span>
            </label>
            <label class="option-label">
              <input
                type="checkbox"
                [(ngModel)]="request.forgotUsername"
                name="forgotUsername"
              />
              <span>I forgot my username</span>
            </label>
          </div>

          <div class="message success" *ngIf="successMessage">{{ successMessage }}</div>
          <div class="message error" *ngIf="errorMessage">{{ errorMessage }}</div>

          <button type="submit" [disabled]="isLoading || !isValid()">
            {{ isLoading ? 'Sending...' : 'Send Recovery Email' }}
          </button>
        </form>

        <div class="back-link">
          <a routerLink="/login">← Back to Login</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .forgot-container {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .forgot-box {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 450px;
    }
    h2 {
      margin: 0 0 0.5rem 0;
      color: #333;
      text-align: center;
    }
    .subtitle {
      margin: 0 0 1.5rem 0;
      color: #666;
      text-align: center;
      font-size: 0.9rem;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .options-group {
      margin-bottom: 1.5rem;
    }
    .option-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
      cursor: pointer;
    }
    .option-label input[type="checkbox"] {
      width: auto;
      margin: 0;
    }
    .option-label span {
      color: #333;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
      font-weight: 500;
    }
    input[type="email"] {
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
      background-color: #6B6CD1;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    button:hover:not(:disabled) {
      background-color: #5a5ab8;
    }
    button:disabled {
      background-color: #999;
      cursor: not-allowed;
    }
    .message {
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    .message.success {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }
    .message.error {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
    .back-link {
      margin-top: 1.5rem;
      text-align: center;
    }
    .back-link a {
      color: #6B6CD1;
      text-decoration: none;
    }
    .back-link a:hover {
      text-decoration: underline;
    }
  `]
})
export class ForgotPasswordComponent {
  request: ForgotPasswordRequest = {
    email: '',
    forgotPassword: false,
    forgotUsername: false
  };
  successMessage: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private recoveryService: RecoveryService,
    private router: Router
  ) {}

  isValid(): boolean {
    return this.request.email.length > 0 &&
           (this.request.forgotPassword || this.request.forgotUsername);
  }

  onSubmit(): void {
    if (!this.isValid()) {
      this.errorMessage = 'Please enter email and select at least one recovery option';
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.recoveryService.forgotPassword(this.request).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Recovery email sent successfully! Please check your inbox.';
        this.request = {
          email: '',
          forgotPassword: false,
          forgotUsername: false
        };
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.error || 'Failed to send recovery email';
      }
    });
  }
}
