export interface TestResendConnectionDto {
  apiKey: string;
  from: string;
}

export interface TestResendConnectionResponse {
  success: boolean;
  error?: string;
}
