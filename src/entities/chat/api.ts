import { ChatMessage, CreateChatMessageResponse } from "./model";
import { apiGetWithOwner, apiPostWithOwner } from "@/shared/api/http";
import { PageResponse } from "@/shared/api/page-response";

export type ListChatMessagesParams = {
  projectId: string;
  page?: number;
  size?: number;
};

export function listChatMessages(
  params: ListChatMessagesParams
): Promise<PageResponse<ChatMessage>> {
  const search = new URLSearchParams();

  search.set("page", String(params.page ?? 1));
  search.set("size", String(params.size ?? 30));

  return apiGetWithOwner<PageResponse<ChatMessage>>(
    `/projects/${params.projectId}/chat/messages?${search.toString()}`
  );
}

export type CreateChatMessageParams = {
  projectId: string;
  content: string;
};

export function createChatMessage(
  params: CreateChatMessageParams
): Promise<CreateChatMessageResponse> {
  return apiPostWithOwner<CreateChatMessageResponse, { content: string }>(
    `/projects/${params.projectId}/chat/messages`,
    { content: params.content }
  );
}
