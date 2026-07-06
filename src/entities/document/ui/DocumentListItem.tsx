import { Badge } from "@astryxdesign/core/Badge";
import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Text } from "@astryxdesign/core/Text";
import * as stylex from "@stylexjs/stylex";
import { DocumentStatus, DocumentSummary, documentStatusLabels } from "../model";

const styles = stylex.create({
  card: {
    border: "1px solid #dde3ea",
    boxShadow: "none"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "flex-start"
  },
  title: {
    minWidth: 0,
    overflowWrap: "anywhere"
  },
  meta: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
    color: "#596579"
  },
  failure: {
    marginTop: 10,
    color: "#8a1f1f"
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 12,
    "@media (max-width: 560px)": {
      flexDirection: "column"
    }
  }
});

const statusBadgeVariants: Record<DocumentStatus, "blue" | "green" | "neutral" | "red"> = {
  TEXT_EXTRACTION_PENDING: "blue",
  TEXT_EXTRACTING: "blue",
  READY: "green",
  FAILED: "red"
};

export function DocumentListItem({
  document,
  isRetryPending = false,
  isRetryDisabled = false,
  onRetry
}: {
  document: DocumentSummary;
  isRetryPending?: boolean;
  isRetryDisabled?: boolean;
  onRetry?: (document: DocumentSummary) => void;
}) {
  const canRetry = document.status === "FAILED" && onRetry;

  return (
    <Card padding={3} xstyle={styles.card}>
      <div {...stylex.props(styles.header)}>
        <Text weight="medium" display="block" xstyle={styles.title}>
          {document.originalName}
        </Text>
        <Badge
          variant={statusBadgeVariants[document.status]}
          label={documentStatusLabels[document.status]}
        />
      </div>

      <div {...stylex.props(styles.meta)}>
        <Text type="supporting" display="block">
          {document.extension.toUpperCase()}
        </Text>
        <Text type="supporting" display="block">
          {formatBytes(document.sizeBytes)}
        </Text>
        <Text type="supporting" display="block">
          {formatDate(document.createdAt)}
        </Text>
      </div>

      {document.failureReason ? (
        <Text type="supporting" display="block" xstyle={styles.failure}>
          {document.failureReason}
        </Text>
      ) : null}

      {canRetry ? (
        <div {...stylex.props(styles.footer)}>
          <Button
            label="다시 시도"
            variant="secondary"
            isDisabled={isRetryPending || isRetryDisabled}
            isLoading={isRetryPending}
            onClick={() => onRetry(document)}
          />
        </div>
      ) : null}
    </Card>
  );
}

function formatBytes(value: number): string {
  if (value < 1024) {
    return `${value} B`;
  }

  if (value < 1024 * 1024) {
    return `${(value / 1024).toFixed(1)} KB`;
  }

  return `${(value / 1024 / 1024).toFixed(1)} MB`;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(value));
}
