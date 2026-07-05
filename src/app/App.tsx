import { Badge } from "@astryxdesign/core/Badge";
import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
  page: {
    minHeight: "100vh",
    backgroundColor: "#f5f6f7",
    color: "#1c1e21"
  },
  shell: {
    display: "grid",
    gridTemplateColumns: "280px 1fr 360px",
    minHeight: "100vh"
  },
  sidebar: {
    borderRight: "1px solid #dfe3e8",
    backgroundColor: "#ffffff",
    padding: 24
  },
  main: {
    padding: 32
  },
  aside: {
    borderLeft: "1px solid #dfe3e8",
    backgroundColor: "#ffffff",
    padding: 24
  },
  eyebrow: {
    margin: 0,
    color: "#596579"
  },
  card: {
    marginTop: 24,
    maxWidth: 760
  },
  cardStack: {
    display: "grid",
    gap: 16
  },
  list: {
    display: "grid",
    gap: 12,
    marginTop: 20
  },
  item: {
    border: "1px solid #dfe3e8",
    borderRadius: 8,
    padding: 14
  },
  actions: {
    display: "flex",
    gap: 8,
    marginTop: 20
  }
});

export function App() {
  return (
    <div {...stylex.props(styles.page)}>
      <div {...stylex.props(styles.shell)}>
        <aside {...stylex.props(styles.sidebar)}>
          <Text type="supporting" weight="medium" display="block">
            DocuMind
          </Text>
          <Heading level={1}>프로젝트 문서 분석</Heading>

          <Card padding={4} xstyle={styles.card}>
            <Heading level={2}>문서</Heading>
            <Text type="supporting" display="block">
              견적서, 제안서, 계약서, 회의록을 프로젝트별로 관리합니다.
            </Text>
          </Card>
        </aside>

        <main {...stylex.props(styles.main)}>
          <Text type="supporting" weight="medium" display="block">
            워크스페이스
          </Text>
          <Heading level={2}>AI 문서 검토 준비 중</Heading>

          <Card padding={5} xstyle={[styles.card, styles.cardStack]}>
            <Badge variant="blue" label="Astryx + StyleX 기반" />
            <Heading level={3}>
              프로젝트별로 기억하는 AI 문서 분석 워크스페이스
            </Heading>
            <Text type="supporting" display="block">
              이 화면은 Astryx theme CSS와 StyleX 빌드 설정이 적용되는지 확인하기 위한
              초기 스캐폴드입니다.
            </Text>
            <div {...stylex.props(styles.actions)}>
              <Button label="새 프로젝트" variant="primary" />
              <Button label="문서 업로드" variant="secondary" />
            </div>
          </Card>
        </main>

        <aside {...stylex.props(styles.aside)}>
          <Heading level={2}>출처와 근거</Heading>
          <div {...stylex.props(styles.list)}>
            <div {...stylex.props(styles.item)}>
              <Text weight="medium" display="block">
                출처 없음
              </Text>
              <Text type="supporting" display="block">
                문서를 업로드하고 질문하면 근거가 표시됩니다.
              </Text>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
