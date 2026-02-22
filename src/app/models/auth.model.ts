export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  username: string;
  message: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileUpdateRequest {
  username: string;
  email: string;
  phoneNumber: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}
