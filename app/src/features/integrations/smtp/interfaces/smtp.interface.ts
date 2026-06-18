export interface TestSmtpConnectionDto {
  host: string;
  port: number;
  user?: string;
  password?: string;
  from: string;
}

export interface TestSmtpConnectionResponse {
  success: boolean;
  error?: string;
}
