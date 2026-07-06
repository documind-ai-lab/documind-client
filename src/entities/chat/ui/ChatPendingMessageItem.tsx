import { Badge } from "@astryxdesign/core/Badge";
import { Card } from "@astryxdesign/core/Card";
import { Text } from "@astryxdesign/core/Text";
import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
  card: {
    border: "1px solid #dde3ea",
    boxShadow: "none",
    backgroundColor: "#ffffff"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
    marginBottom: 10
  },
  status: {
    display: "grid",
    gap: 4
  }
});

export function ChatPendingMessageItem() {
  return (
    <Card padding={4} xstyle={styles.card}>
      <div {...stylex.props(styles.header)}>
        <Badge variant="green" label="AI" />
        <Text type="supporting" display="block">
          답변 생성 중
        </Text>
      </div>

      <div {...stylex.props(styles.status)} role="status" aria-live="polite">
        <Text weight="medium" display="block">
          답변을 생성하는 중입니다.
        </Text>
        <Text type="supporting" display="block">
          문서 내용과 이전 대화를 확인하고 있습니다.
        </Text>
      </div>
    </Card>
  );
}
