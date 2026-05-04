import api from "../httpsCall";
import {
  ApiResponse,
  User,
  LoginRequest,
  UpdateProfileRequest,
} from "../../types/authTypes";

const AuthApi = {
  login: (data: LoginRequest): Promise<ApiResponse<User>> =>
    api.post("/auth/login", data),

  logout: (): Promise<ApiResponse> =>
    api.post("/auth/logout"),

  refresh: (): Promise<ApiResponse> =>
    api.post("/auth/refresh"),

  updateProfile: (data: UpdateProfileRequest): Promise<ApiResponse<User>> =>
    api.patch("/auth/profile", data),
};

export default AuthApi;
