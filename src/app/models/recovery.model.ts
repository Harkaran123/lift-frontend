export interface ForgotPasswordRequest {
  email: string;
  forgotPassword: boolean;
  forgotUsername: boolean;
}

export interface EmailVerificationRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otpCode: string;
}
