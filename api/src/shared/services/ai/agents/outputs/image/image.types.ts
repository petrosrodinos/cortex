export interface GenerateImageParams {
  prompt: string;
  size?: '1024x1024' | '1536x1024' | '1024x1536' | '1792x1024' | '1024x1792';
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
}

export interface GeneratedImageResult {
  file_url: string;
  filename: string;
  document_uuid: string;
  media_type: string;
  revised_prompt?: string;
}
