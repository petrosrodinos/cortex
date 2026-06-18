export interface TestSendGridConnectionDto {
  apiKey: string;
  from: string;
}

export interface TestSendGridConnectionResponse {
  success: boolean;
  error?: string;
}
