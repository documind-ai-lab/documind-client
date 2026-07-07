import { Badge } from "@astryxdesign/core/Badge";
import { Card } from "@astryxdesign/core/Card";
import { Text } from "@astryxdesign/core/Text";
import * as stylex from "@stylexjs/stylex";
import { ChatMessage } from "../model";

const styles = stylex.create({
  card: {
    border: "1px solid #dde3ea",
    boxShadow: "none",
    backgroundColor: "#ffffff"
  },
  selectedCard: {
    borderColor: "#0f766e",
    backgroundColor: "#f0fdfa"
  },
  userCard: {
    backgroundColor: "#f3f8ff"
  },
  selectButton: {
    all: "unset",
    boxSizing: "border-box",
    display: "block",
    width: "100%",
    cursor: "pointer",
    borderRadius: 8,
    ":focus-visible": {
      outline: "2px solid #0f766e",
      outlineOffset: 3
    }
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
    marginBottom: 10
  },
  content: {
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere"
  },
  sources: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12
  }
});

export function ChatMessageItem({
  message,
  isSelected = false,
  onSelect
}: {
  message: ChatMessage;
  isSelected?: boolean;
  onSelect?: (message: ChatMessage) => void;
}) {
  const isUser = message.role === "USER";
  const isSelectable = !isUser && Boolean(onSelect);

  const card = (
    <Card
      padding={4}
      xstyle={[styles.card, isUser && styles.userCard, isSelected && styles.selectedCard]}
    >
      <div {...stylex.props(styles.header)}>
        <Badge variant={isUser ? "blue" : "green"} label={isUser ? "사용자" : "AI"} />
        <Text type="supporting" display="block">
          {formatDateTime(message.createdAt)}
        </Text>
      </div>

      <Text display="block" xstyle={styles.content}>
        {message.content}
      </Text>

      {message.sources.length > 0 ? (
        <div {...stylex.props(styles.sources)}>
          {message.sources.map((source) => (
            <Badge key={source.id} variant="neutral" label={`[${source.index}] ${source.title}`} />
          ))}
        </div>
      ) : null}
    </Card>
  );

  if (!isSelectable) {
    return card;
  }

  return (
    <button
      type="button"
      {...stylex.props(styles.selectButton)}
      aria-pressed={isSelected}
      aria-label="이 AI 답변의 출처 보기"
      onClick={() => onSelect?.(message)}
    >
      {card}
    </button>
  );
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}
