export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: string;
    accessToken: string;
    refreshToken: string;
  };
}
