export interface User {
  _id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  phoneNumber: string | null;
  photo: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = null> {
  code: number;
  success: boolean;
  message: string;
  data: T;
  errorCode?: string;
  details?: any[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phoneNumber?: string;
  photo?: string;
}
