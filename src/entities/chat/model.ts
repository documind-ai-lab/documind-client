export type ChatRole = "USER" | "ASSISTANT";

export type ChatSource = {
  id: string;
  documentId: string;
  index: number;
  title: string;
  quote: string;
  relevance: number | null;
  createdAt: string;
};

export type ChatMessage = {
  id: string;
  projectId: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  sources: ChatSource[];
};

export type CreateChatMessageResponse = {
  userMessage: ChatMessage;
  assistantMessage: ChatMessage;
};
