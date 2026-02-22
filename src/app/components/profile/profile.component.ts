import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RecoveryService } from '../../services/recovery.service';
import { UserProfile, ProfileUpdateRequest, ChangePasswordRequest } from '../../models/auth.model';
import { EmailVerificationRequest, VerifyOtpRequest } from '../../models/recovery.model';

@Component({
  selector: 'app-profile',
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <h2>User Profile</h2>
        <button class="btn-back" (click)="goBack()">Back to Lifts</button>
      </div>

      <div class="tabs">
        <button
          [class.active]="activeTab === 'profile'"
          (click)="activeTab = 'profile'"
        >
          Profile Details
        </button>
        <button
          [class.active]="activeTab === 'password'"
          (click)="activeTab = 'password'"
        >
          Change Password
        </button>
      </div>

      <!-- Profile Tab -->
      <div class="tab-content" *ngIf="activeTab === 'profile'">
        <div class="message success" *ngIf="profileMessage">{{ profileMessage }}</div>
        <div class="message error" *ngIf="profileError">{{ profileError }}</div>

        <form (ngSubmit)="updateProfile()" *ngIf="profile">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              type="text"
              id="username"
              [(ngModel)]="profileUpdate.username"
              name="username"
              required
            />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <div class="email-section">
              <input
                type="email"
                id="email"
                [(ngModel)]="profileUpdate.email"
                name="email"
                required
                [disabled]="isEmailVerified && emailChanged"
                (ngModelChange)="onEmailChange()"
              />
              <button 
                type="button" 
                class="btn-verify" 
                (click)="sendVerificationOtp()"
                [disabled]="isSendingOtp || !profileUpdate.email"
                *ngIf="emailChanged && !isEmailVerified"
              >
                {{ isSendingOtp ? 'Sending...' : 'Send OTP' }}
              </button>
            </div>
            <span class="verified-badge" *ngIf="isEmailVerified && emailChanged">✓ Verified</span>
          </div>

          <!-- OTP Verification Section -->
          <div class="otp-section" *ngIf="otpSent && !isEmailVerified">
            <div class="form-group">
              <label for="otpCode">Enter Verification Code</label>
              <input
                type="text"
                id="otpCode"
                [(ngModel)]="otpCode"
                name="otpCode"
                maxlength="6"
                placeholder="Enter 6-digit code"
              />
            </div>
            <button 
              type="button" 
              class="btn-confirm" 
              (click)="verifyOtp()"
              [disabled]="isVerifyingOtp || !otpCode"
            >
              {{ isVerifyingOtp ? 'Verifying...' : 'Verify Email' }}
            </button>
          </div>
          <div class="form-group">
            <label for="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              [(ngModel)]="profileUpdate.phoneNumber"
              name="phoneNumber"
            />
          </div>
          <div class="form-group">
            <label>Created At</label>
            <input type="text" [value]="profile.createdAt | date:'medium'" disabled />
          </div>
          <div class="form-group">
            <label>Last Updated</label>
            <input type="text" [value]="profile.updatedAt | date:'medium'" disabled />
          </div>
          <button type="submit" [disabled]="isUpdatingProfile">
            {{ isUpdatingProfile ? 'Updating...' : 'Update Profile' }}
          </button>
        </form>
      </div>

      <!-- Change Password Tab -->
      <div class="tab-content" *ngIf="activeTab === 'password'">
        <div class="message success" *ngIf="passwordMessage">{{ passwordMessage }}</div>
        <div class="message error" *ngIf="passwordError">{{ passwordError }}</div>

        <form (ngSubmit)="changePassword()">
          <div class="form-group">
            <label for="oldPassword">Old Password</label>
            <input
              type="password"
              id="oldPassword"
              [(ngModel)]="passwordRequest.oldPassword"
              name="oldPassword"
              required
            />
          </div>
          <div class="form-group">
            <label for="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              [(ngModel)]="passwordRequest.newPassword"
              name="newPassword"
              required
              minlength="6"
            />
          </div>
          <div class="form-group">
            <label for="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              [(ngModel)]="confirmPassword"
              name="confirmPassword"
              required
            />
          </div>
          <button type="submit" [disabled]="isChangingPassword">
            {{ isChangingPassword ? 'Changing...' : 'Change Password' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 600px;
      margin: 0 auto;
    }
    .profile-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    h2 {
      margin: 0;
      color: #333;
    }
    .btn-back {
      background-color: #6c757d;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-back:hover {
      background-color: #5a6268;
    }
    .tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid #ddd;
    }
    .tabs button {
      background: none;
      border: none;
      padding: 0.75rem 1.5rem;
      cursor: pointer;
      font-size: 1rem;
      color: #666;
      border-bottom: 2px solid transparent;
      transition: all 0.3s;
    }
    .tabs button.active {
      color: #1976d2;
      border-bottom-color: #1976d2;
    }
    .tab-content {
      background: white;
      padding: 1.5rem;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
      border-color: #1976d2;
    }
    input:disabled {
      background-color: #f5f5f5;
      color: #666;
    }
    button[type="submit"] {
      width: 100%;
      padding: 0.75rem;
      background-color: #1976d2;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s;
      margin-top: 1rem;
    }
    button[type="submit"]:hover:not(:disabled) {
      background-color: #1565c0;
    }
    button[type="submit"]:disabled {
      background-color: #999;
      cursor: not-allowed;
    }
    .email-section {
      display: flex;
      gap: 0.5rem;
    }
    .email-section input {
      flex: 1;
    }
    .btn-verify {
      padding: 0.75rem 1rem;
      background-color: #6B6CD1;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      white-space: nowrap;
    }
    .btn-verify:hover:not(:disabled) {
      background-color: #5a5ab8;
    }
    .btn-verify:disabled {
      background-color: #999;
      cursor: not-allowed;
    }
    .verified-badge {
      color: #28a745;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      display: block;
    }
    .otp-section {
      background-color: #f8f9fa;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    .btn-confirm {
      width: 100%;
      padding: 0.75rem;
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }
    .btn-confirm:hover:not(:disabled) {
      background-color: #218838;
    }
    .btn-confirm:disabled {
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
  `]
})
export class ProfileComponent implements OnInit {
  profile: UserProfile | null = null;
  profileUpdate: ProfileUpdateRequest = {
    username: '',
    email: '',
    phoneNumber: ''
  };
  passwordRequest: ChangePasswordRequest = {
    oldPassword: '',
    newPassword: ''
  };
  confirmPassword: string = '';

  // Email verification properties
  originalEmail: string = '';
  otpCode: string = '';
  otpSent: boolean = false;
  isEmailVerified: boolean = false;
  isSendingOtp: boolean = false;
  isVerifyingOtp: boolean = false;

  activeTab: 'profile' | 'password' = 'profile';

  profileMessage: string = '';
  profileError: string = '';
  passwordMessage: string = '';
  passwordError: string = '';

  isUpdatingProfile: boolean = false;
  isChangingPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private recoveryService: RecoveryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  get emailChanged(): boolean {
    return this.profileUpdate.email !== this.originalEmail;
  }

  onEmailChange(): void {
    // Reset verification when email changes
    if (this.profileUpdate.email !== this.originalEmail) {
      this.otpSent = false;
      this.isEmailVerified = false;
      this.otpCode = '';
    }
  }

  resetVerification(): void {
    this.otpCode = '';
    this.otpSent = false;
    this.isEmailVerified = false;
  }

  sendVerificationOtp(): void {
    if (!this.profileUpdate.email) {
      this.profileError = 'Please enter an email address';
      return;
    }

    this.isSendingOtp = true;
    this.profileMessage = '';
    this.profileError = '';

    const request: EmailVerificationRequest = {
      email: this.profileUpdate.email
    };

    this.recoveryService.sendVerificationOtp(request).subscribe({
      next: (response) => {
        this.isSendingOtp = false;
        this.otpSent = true;
        this.profileMessage = 'Verification code sent to your email. Please check your inbox.';
      },
      error: (error) => {
        this.isSendingOtp = false;
        this.profileError = error.error?.error || 'Failed to send verification code';
      }
    });
  }

  verifyOtp(): void {
    if (!this.otpCode || this.otpCode.length !== 6) {
      this.profileError = 'Please enter a valid 6-digit verification code';
      return;
    }

    this.isVerifyingOtp = true;
    this.profileMessage = '';
    this.profileError = '';

    const request: VerifyOtpRequest = {
      email: this.profileUpdate.email,
      otpCode: this.otpCode
    };

    this.recoveryService.verifyEmailOtp(request).subscribe({
      next: (response) => {
        this.isVerifyingOtp = false;
        this.isEmailVerified = true;
        this.profileMessage = 'Email verified successfully! You can now update your profile.';
      },
      error: (error) => {
        this.isVerifyingOtp = false;
        this.profileError = error.error?.error || 'Invalid or expired verification code';
      }
    });
  }

  loadProfile(): void {
    this.authService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.profileUpdate = {
          username: profile.username,
          email: profile.email,
          phoneNumber: profile.phoneNumber || ''
        };
        this.originalEmail = profile.email;
        this.resetVerification();
      },
      error: (error) => {
        this.profileError = 'Failed to load profile';
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  updateProfile(): void {
    // Check if email changed but not verified
    if (this.emailChanged && !this.isEmailVerified) {
      this.profileError = 'Please verify your new email address before updating';
      return;
    }

    this.profileMessage = '';
    this.profileError = '';
    this.isUpdatingProfile = true;

    this.authService.updateProfile(this.profileUpdate).subscribe({
      next: (response) => {
        this.isUpdatingProfile = false;
        this.profileMessage = 'Profile updated successfully';
        if (response.newToken) {
          this.profileMessage += '. Please note your username has been changed.';
        }
        this.originalEmail = this.profileUpdate.email;
        this.resetVerification();
        this.loadProfile();
      },
      error: (error) => {
        this.isUpdatingProfile = false;
        this.profileError = error.error?.error || 'Failed to update profile';
      }
    });
  }

  changePassword(): void {
    this.passwordMessage = '';
    this.passwordError = '';

    if (this.passwordRequest.newPassword !== this.confirmPassword) {
      this.passwordError = 'New password and confirm password do not match';
      return;
    }

    if (this.passwordRequest.newPassword.length < 6) {
      this.passwordError = 'New password must be at least 6 characters long';
      return;
    }

    this.isChangingPassword = true;

    this.authService.changePassword(this.passwordRequest).subscribe({
      next: (response) => {
        this.isChangingPassword = false;
        this.passwordMessage = response.message || 'Password changed successfully';
        this.passwordRequest = { oldPassword: '', newPassword: '' };
        this.confirmPassword = '';
        // Redirect to login after password change
        setTimeout(() => {
          this.authService.logout().subscribe(() => {
            this.router.navigate(['/login']);
          });
        }, 2000);
      },
      error: (error) => {
        this.isChangingPassword = false;
        this.passwordError = error.error?.error || 'Failed to change password';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/lifts']);
  }
}
