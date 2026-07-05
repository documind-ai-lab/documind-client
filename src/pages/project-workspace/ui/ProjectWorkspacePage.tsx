import { Badge } from "@astryxdesign/core/Badge";
import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { TextArea } from "@astryxdesign/core/TextArea";
import * as stylex from "@stylexjs/stylex";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { createChatMessage, listChatMessages } from "@/entities/chat/api";
import { ChatMessage, ChatSource } from "@/entities/chat/model";
import { ChatMessageItem } from "@/entities/chat/ui/ChatMessageItem";
import { listDocuments } from "@/entities/document/api";
import { DocumentSummary } from "@/entities/document/model";
import { DocumentListItem } from "@/entities/document/ui/DocumentListItem";
import { ProjectSummary, projectTypeLabels } from "@/entities/project/model";
import { UploadDocumentDialog } from "@/features/document-upload/ui/UploadDocumentDialog";
import { ApiError } from "@/shared/api/http";
import { PageResponse } from "@/shared/api/page-response";

const styles = stylex.create({
  page: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    color: "#1c1e21"
  },
  shell: {
    display: "grid",
    gridTemplateColumns: "300px minmax(0, 1fr) 360px",
    minHeight: "100vh",
    "@media (max-width: 1100px)": {
      gridTemplateColumns: "1fr"
    }
  },
  sidebar: {
    borderRight: "1px solid #dde3ea",
    backgroundColor: "#ffffff",
    padding: 24,
    "@media (max-width: 1100px)": {
      borderRight: "none",
      borderBottom: "1px solid #dde3ea"
    }
  },
  main: {
    padding: 32
  },
  aside: {
    borderLeft: "1px solid #dde3ea",
    backgroundColor: "#ffffff",
    padding: 24,
    "@media (max-width: 1100px)": {
      borderLeft: "none",
      borderTop: "1px solid #dde3ea"
    }
  },
  stack: {
    display: "grid",
    gap: 16
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "flex-start",
    marginBottom: 24,
    "@media (max-width: 720px)": {
      flexDirection: "column"
    }
  },
  headerText: {
    display: "grid",
    gap: 8,
    minWidth: 0
  },
  panel: {
    border: "1px solid #dde3ea",
    boxShadow: "none"
  },
  emptyPanel: {
    display: "grid",
    gap: 12
  },
  meta: {
    display: "grid",
    gap: 10
  },
  metaItem: {
    border: "1px solid #dde3ea",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f8fafc"
  },
  documentList: {
    display: "grid",
    gap: 10
  },
  chatSurface: {
    minHeight: 460,
    display: "grid",
    gap: 16,
    alignContent: "start"
  },
  chatList: {
    display: "grid",
    gap: 12
  },
  chatForm: {
    display: "grid",
    gap: 10,
    marginTop: 8
  },
  chatActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8
  },
  errorBox: {
    border: "1px solid #f3b4b4",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff5f5",
    color: "#8a1f1f"
  },
  sourceTabs: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 8
  },
  sourceTab: {
    border: "1px solid #dde3ea",
    borderRadius: 8,
    padding: "8px 10px",
    backgroundColor: "#f8fafc",
    textAlign: "center"
  },
  sourceList: {
    display: "grid",
    gap: 12
  },
  sourceQuote: {
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere"
  },
  sourceMeta: {
    color: "#596579"
  }
});

export function ProjectWorkspacePage({
  project,
  onBack
}: {
  project: ProjectSummary;
  onBack: () => void;
}) {
  const [documentPage, setDocumentPage] = useState<PageResponse<DocumentSummary> | null>(null);
  const [isDocumentsLoading, setIsDocumentsLoading] = useState(true);
  const [documentsErrorMessage, setDocumentsErrorMessage] = useState<string | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [chatPage, setChatPage] = useState<PageResponse<ChatMessage> | null>(null);
  const [isChatLoading, setIsChatLoading] = useState(true);
  const [chatErrorMessage, setChatErrorMessage] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [isSendingQuestion, setIsSendingQuestion] = useState(false);

  async function loadDocuments() {
    setIsDocumentsLoading(true);
    setDocumentsErrorMessage(null);

    try {
      setDocumentPage(await listDocuments({ projectId: project.id }));
    } catch (error) {
      setDocumentsErrorMessage(toDocumentErrorMessage(error));
    } finally {
      setIsDocumentsLoading(false);
    }
  }

  useEffect(() => {
    void loadDocuments();
  }, [project.id]);

  async function loadChatMessages() {
    setIsChatLoading(true);
    setChatErrorMessage(null);

    try {
      setChatPage(await listChatMessages({ projectId: project.id }));
    } catch (error) {
      setChatErrorMessage(toChatErrorMessage(error));
    } finally {
      setIsChatLoading(false);
    }
  }

  useEffect(() => {
    void loadChatMessages();
  }, [project.id]);

  async function handleSendQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const content = question.trim();

    if (content.length === 0 || content.length > 4000 || isSendingQuestion) {
      return;
    }

    setIsSendingQuestion(true);
    setChatErrorMessage(null);

    try {
      const response = await createChatMessage({ projectId: project.id, content });
      setQuestion("");
      setChatPage((currentPage) => {
        if (!currentPage) {
          return {
            items: [response.userMessage, response.assistantMessage],
            page: 1,
            size: 30,
            total: 2,
            hasNext: false
          };
        }

        return {
          ...currentPage,
          items: [...currentPage.items, response.userMessage, response.assistantMessage],
          total: currentPage.total + 2
        };
      });
    } catch (error) {
      setChatErrorMessage(toChatErrorMessage(error));
    } finally {
      setIsSendingQuestion(false);
    }
  }

  const documents = documentPage?.items ?? [];
  const documentCount = documentPage?.total ?? project.documentCount;
  const chatMessages = chatPage?.items ?? [];
  const latestAssistantSources = useMemo(
    () =>
      [...chatMessages]
        .reverse()
        .find((message) => message.role === "ASSISTANT" && message.sources.length > 0)
        ?.sources ?? [],
    [chatMessages]
  );
  const trimmedQuestion = question.trim();
  const isQuestionInvalid = trimmedQuestion.length > 4000;
  const canSendQuestion =
    trimmedQuestion.length > 0 && !isQuestionInvalid && !isSendingQuestion && !isChatLoading;

  return (
    <div {...stylex.props(styles.page)}>
      <div {...stylex.props(styles.shell)}>
        <aside {...stylex.props(styles.sidebar)}>
          <div {...stylex.props(styles.stack)}>
            <Button label="프로젝트 목록" variant="secondary" onClick={onBack} />

            <div>
              <Text type="supporting" weight="medium" display="block">
                DocuMind
              </Text>
              <Heading level={1}>워크스페이스</Heading>
            </div>

            <Card padding={4} xstyle={[styles.panel, styles.emptyPanel]}>
              <Heading level={2}>문서</Heading>

              {isDocumentsLoading ? (
                <Text type="supporting" display="block">
                  문서를 불러오는 중입니다.
                </Text>
              ) : null}

              {!isDocumentsLoading && documentsErrorMessage ? (
                <>
                  <Text type="supporting" display="block">
                    {documentsErrorMessage}
                  </Text>
                  <Button label="다시 시도" variant="secondary" onClick={loadDocuments} />
                </>
              ) : null}

              {!isDocumentsLoading && !documentsErrorMessage && documents.length === 0 ? (
                <Text type="supporting" display="block">
                  업로드된 문서가 없습니다.
                </Text>
              ) : null}

              {!isDocumentsLoading && !documentsErrorMessage && documents.length > 0 ? (
                <div {...stylex.props(styles.documentList)}>
                  {documents.map((document) => (
                    <DocumentListItem key={document.id} document={document} />
                  ))}
                </div>
              ) : null}

              <Button
                label="문서 업로드"
                variant="primary"
                onClick={() => setIsUploadDialogOpen(true)}
              />
            </Card>

            <div {...stylex.props(styles.meta)}>
              <div {...stylex.props(styles.metaItem)}>
                <Text type="supporting" display="block">
                  문서 수
                </Text>
                <Text weight="medium" display="block">
                  {documentCount}개
                </Text>
              </div>
              <div {...stylex.props(styles.metaItem)}>
                <Text type="supporting" display="block">
                  리스크 후보
                </Text>
                <Text weight="medium" display="block">
                  {project.riskCandidateCount}개
                </Text>
              </div>
            </div>
          </div>
        </aside>

        <main {...stylex.props(styles.main)}>
          <div {...stylex.props(styles.header)}>
            <div {...stylex.props(styles.headerText)}>
              <Badge variant="blue" label={projectTypeLabels[project.type]} />
              <Heading level={2}>{project.name}</Heading>
              <Text type="supporting" display="block">
                {project.description ?? "프로젝트 설명이 아직 없습니다."}
              </Text>
            </div>
            <Badge
              variant={project.status === "ACTIVE" ? "green" : "neutral"}
              label={project.status === "ACTIVE" ? "진행 중" : "보관됨"}
            />
          </div>

          <Card padding={5} xstyle={[styles.panel, styles.chatSurface]}>
            <Heading level={3}>AI 채팅</Heading>

            {isChatLoading ? (
              <Text type="supporting" display="block">
                대화 기록을 불러오는 중입니다.
              </Text>
            ) : null}

            {!isChatLoading && chatErrorMessage ? (
              <div {...stylex.props(styles.errorBox)}>
                <Text weight="medium" display="block">
                  {chatErrorMessage}
                </Text>
              </div>
            ) : null}

            {!isChatLoading && chatMessages.length === 0 ? (
              <Text type="supporting" display="block">
                아직 대화가 없습니다. 문서를 업로드한 뒤 검토할 내용을 질문하세요.
              </Text>
            ) : null}

            {chatMessages.length > 0 ? (
              <div {...stylex.props(styles.chatList)}>
                {chatMessages.map((message) => (
                  <ChatMessageItem key={message.id} message={message} />
                ))}
              </div>
            ) : null}

            <form {...stylex.props(styles.chatForm)} onSubmit={handleSendQuestion}>
              <TextArea
                label="질문"
                value={question}
                placeholder="예: 이 견적서에서 누락된 항목과 리스크를 알려줘"
                rows={4}
                maxLength={4000}
                isDisabled={isSendingQuestion}
                isLoading={isSendingQuestion}
                status={
                  isQuestionInvalid
                    ? { type: "error", message: "질문은 4000자 이하로 입력해주세요." }
                    : undefined
                }
                onChange={setQuestion}
              />
              <div {...stylex.props(styles.chatActions)}>
                <Button
                  label="다시 불러오기"
                  variant="secondary"
                  isDisabled={isSendingQuestion}
                  onClick={loadChatMessages}
                />
                <Button
                  label="질문 보내기"
                  variant="primary"
                  type="submit"
                  isDisabled={!canSendQuestion}
                  isLoading={isSendingQuestion}
                />
              </div>
            </form>
          </Card>
        </main>

        <aside {...stylex.props(styles.aside)}>
          <div {...stylex.props(styles.stack)}>
            <Heading level={2}>출처와 근거</Heading>
            <div {...stylex.props(styles.sourceTabs)}>
              <div {...stylex.props(styles.sourceTab)}>
                <Text weight="medium" display="block">
                  출처
                </Text>
              </div>
              <div {...stylex.props(styles.sourceTab)}>
                <Text weight="medium" display="block">
                  리스크
                </Text>
              </div>
              <div {...stylex.props(styles.sourceTab)}>
                <Text weight="medium" display="block">
                  사실
                </Text>
              </div>
              <div {...stylex.props(styles.sourceTab)}>
                <Text weight="medium" display="block">
                  요약
                </Text>
              </div>
            </div>

            {latestAssistantSources.length > 0 ? (
              <div {...stylex.props(styles.sourceList)}>
                {latestAssistantSources.map((source) => (
                  <SourceCard key={source.id} source={source} />
                ))}
              </div>
            ) : (
              <Card padding={4} xstyle={[styles.panel, styles.emptyPanel]}>
                <Heading level={3}>근거 없음</Heading>
                <Text type="supporting" display="block">
                  AI 답변이 생성되면 문서명, 페이지, 인용 문구가 표시됩니다.
                </Text>
              </Card>
            )}
          </div>
        </aside>
      </div>

      <UploadDocumentDialog
        projectId={project.id}
        isOpen={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onUploaded={() => {
          void loadDocuments();
        }}
      />
    </div>
  );
}

function SourceCard({ source }: { source: ChatSource }) {
  return (
    <Card padding={4} xstyle={[styles.panel, styles.emptyPanel]}>
      <Heading level={3}>
        [{source.index}] {source.title}
      </Heading>
      <Text display="block" xstyle={styles.sourceQuote}>
        {source.quote}
      </Text>
      <Text type="supporting" display="block" xstyle={styles.sourceMeta}>
        관련도 {source.relevance ?? "미산정"}
      </Text>
    </Card>
  );
}

function toDocumentErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 422) {
      return "owner 설정 또는 요청값을 확인해주세요.";
    }

    if (error.status === 404) {
      return "프로젝트를 찾을 수 없습니다.";
    }

    return `서버가 ${error.status} 응답을 반환했습니다.`;
  }

  if (error instanceof TypeError) {
    return "백엔드 서버에 연결할 수 없습니다.";
  }

  return "문서 목록을 불러오지 못했습니다.";
}

function toChatErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 400) {
      return "프로젝트 식별자 또는 질문 형식을 확인해주세요.";
    }

    if (error.status === 422) {
      return "owner 설정 또는 질문 내용을 확인해주세요.";
    }

    if (error.status === 404) {
      return "프로젝트를 찾을 수 없습니다.";
    }

    if (error.status === 409) {
      return "진행 중인 프로젝트에서만 질문할 수 있습니다.";
    }

    return `서버가 ${error.status} 응답을 반환했습니다.`;
  }

  if (error instanceof TypeError) {
    return "백엔드 서버에 연결할 수 없습니다.";
  }

  return "대화 요청을 처리하지 못했습니다.";
}
