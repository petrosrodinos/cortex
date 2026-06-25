export interface SavedPrompt {
  uuid: string;
  org_uuid: string;
  user_uuid: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSavedPromptDto {
  title: string;
  content: string;
}

export interface UpdateSavedPromptDto {
  title?: string;
  content?: string;
}
