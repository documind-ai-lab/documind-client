# 클라이언트 아키텍처 결정

## 목적

DocuMind 클라이언트는 프로젝트별 문서 분석 업무를 빠르게 확인하고 조작하는 B2B SaaS 웹앱이다. 이 문서는 `documind-client`에서 사용할 화면 구조, UI 시스템, 스타일링 기준을 정의한다.

초기 MVP의 목표는 프론트엔드 구현 부담을 줄이면서도, 고객에게 익숙하고 신뢰감 있는 업무용 화면을 제공하는 것이다.

## 결정 사항

클라이언트는 FSD(Feature-Sliced Design)를 애플리케이션 구조 기준으로 사용하고, UI 시스템은 Astryx를 기준으로 한다.

사용하는 방식은 다음과 같다.

- Astryx 컴포넌트를 기본 UI 부품으로 사용한다.
- StyleX로 컴포넌트 스타일을 확장한다.
- Astryx theme CSS를 앱 진입점에서 1회 import한다.
- DocuMind 도메인 의미가 있는 UI는 FSD 계층 안에서 래퍼 또는 조합 컴포넌트로 만든다.

사용하지 않는 방식은 다음과 같다.

- Tailwind CSS
- 직접 작성하는 일반 CSS 파일
- CSS Modules
- styled-components
- emotion
- React inline style 중심 구현

## 결정 이유

DocuMind는 프론트엔드, 백엔드, AI 영역을 한 명이 함께 개발하는 프로젝트다. 모든 UI 컴포넌트를 직접 설계하고 유지보수하면 제품 검증보다 화면 시스템 유지 비용이 커질 수 있다.

Astryx는 Meta 계열의 익숙한 UI 톤과 React 컴포넌트 기반 개발 방식을 제공한다. DocuMind는 Astryx를 벤더 UI 시스템으로 활용해 기본 접근성, 상태 표현, 컴포넌트 일관성을 확보하고, 제품 고유의 업무 흐름에 집중한다.

## UI 시스템 기준

Astryx는 다음 용도로 사용한다.

- 버튼, 입력창, 탭, 모달, 테이블, 배지, 빈 상태 같은 기본 UI 부품
- 밝은 배경, 중립적인 색상, 차분한 업무용 화면 톤
- 40~50대 한국인 실무자에게 부담 없는 정보 밀도와 상태 표현
- 반복되는 인터랙션 패턴의 일관성 확보

DocuMind는 Astryx를 그대로 노출하기보다, 도메인 의미가 있는 UI를 조합 컴포넌트로 관리한다.

예시는 다음과 같다.

```text
기본 UI 부품: Button, TextInput, Tabs, Dialog, Badge
DocuMind 조합 UI: ProjectCard, DocumentStatusBadge, ChatMessageBubble, SourcePanel
```

단순한 기본 부품은 Astryx 컴포넌트를 직접 사용할 수 있다. 프로젝트 카드, 문서 상태 배지, 채팅 메시지, 출처 패널처럼 제품 의미가 있는 UI는 `entities`, `features`, `widgets`, `shared/ui` 안에서 DocuMind 이름의 컴포넌트로 감싼다.

## StyleX 기준

컴포넌트 스타일 확장은 StyleX를 사용한다.

StyleX는 컴포넌트 파일 안에서 스타일을 선언하되, 빌드 결과는 CSS class로 최적화하는 방식이다. 따라서 기존 React inline style보다 hover, focus, responsive, theme token 처리가 안정적이다.

기본 예시는 다음과 같다.

```tsx
import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
  panel: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "white",
  },
});

export function DocumentPanel() {
  return <section {...stylex.props(styles.panel)} />;
}
```

Astryx 컴포넌트가 제공하는 스타일 확장 prop이 있으면 해당 방식을 우선 사용한다. raw DOM 요소가 필요한 경우에는 `stylex.props()`를 사용한다.

## Theme CSS 기준

Astryx theme CSS는 앱 진입점에서 한 번만 import한다.

예시는 다음과 같다.

```ts
import "@astryxdesign/core/reset.css";
import "@astryxdesign/core/astryx.css";
import "@astryxdesign/theme-neutral/theme.css";
```

테마 CSS는 전역 디자인 기준을 제공한다. 개별 화면에서 직접 CSS 파일을 추가하지 않는다.

Vite 앱에서는 `src/app/global.css`처럼 Astryx theme import만 담는 진입점 CSS 파일을 둘 수 있다. 이 파일에는 직접 작성한 class, selector, component style을 추가하지 않는다.

## FSD 구조 기준

클라이언트의 화면과 기능 배치는 FSD를 기준으로 한다.

초기 MVP에서는 FSD를 과하게 엄격한 규칙으로 사용하지 않는다. 대신 화면, 기능, 도메인, 공통 코드를 어디에 둘지 흔들리지 않게 하는 구조 기준으로 사용한다.

기본 레이어는 다음과 같다.

- `app`: 앱 초기화, 라우터, 전역 provider, Astryx theme import, 전역 에러 경계
- `pages`: 라우트 단위 화면 조립
- `widgets`: 여러 feature와 entity를 조합하는 화면 영역
- `features`: 사용자의 명확한 행동 단위
- `entities`: 프로젝트, 문서, 출처, 리스크처럼 도메인 명사를 표현하는 모델과 UI
- `shared`: 도메인에 묶이지 않는 공통 유틸, API 클라이언트, theme, 공통 UI

레이어 책임은 다음 기준으로 나눈다.

- 페이지 전체 레이아웃은 `pages`에 둔다.
- 문서 목록 패널, 채팅 패널, 출처 패널처럼 화면의 큰 영역은 `widgets`에 둔다.
- 프로젝트 생성, 문서 업로드, 질문 전송처럼 사용자가 수행하는 행동은 `features`에 둔다.
- Project, Document, Source, Risk 같은 도메인 데이터 표현은 `entities`에 둔다.
- 도메인과 무관한 공통 UI와 유틸은 `shared`에 둔다.

## FSD와 Astryx 사용 기준

FSD는 파일과 책임을 나누는 구조 기준이고, Astryx는 UI 구현 기준이다.

따라서 다음 원칙을 따른다.

- `shared/ui`는 도메인 의미가 없는 공통 UI 래퍼를 둘 수 있다.
- `entities/*/ui.tsx`는 도메인 데이터를 표현하는 UI를 둔다.
- `widgets/*/ui.tsx`는 여러 도메인 UI와 feature를 조합한다.
- Astryx 컴포넌트 import가 화면 전체에 무분별하게 퍼지면 래퍼 컴포넌트로 정리한다.
- Astryx 교체 가능성을 이유로 모든 기본 부품을 과도하게 감싸지 않는다.

## import 방향

FSD import 방향은 상위 레이어에서 하위 레이어로만 흐르게 한다.

허용 방향은 다음과 같다.

```text
app -> pages -> widgets -> features -> entities -> shared
```

예시는 다음과 같다.

- `pages`는 `widgets`, `features`, `entities`, `shared`를 사용할 수 있다.
- `features`는 `entities`와 `shared`를 사용할 수 있다.
- `entities`는 `shared`를 사용할 수 있다.
- `shared`는 다른 레이어를 알지 않는다.

피해야 할 방향은 다음과 같다.

- `shared`에서 `entities`를 import하지 않는다.
- `entities`에서 `features`를 import하지 않는다.
- `features`에서 `widgets`나 `pages`를 import하지 않는다.
- 같은 레이어의 서로 다른 slice가 내부 구현을 직접 import하지 않는다.

## 초기 디렉터리 예시

초기 MVP의 클라이언트 구조는 다음 형태를 기준으로 한다.

```text
src/
  app/
    App.tsx
    router.tsx
  pages/
    projects/
    workspace/
  widgets/
    document-panel/
    chat-panel/
    evidence-panel/
  features/
    create-project/
    upload-document/
    ask-question/
  entities/
    project/
    document/
    source/
    risk/
  shared/
    api/
    theme/
    ui/
    lib/
```

디렉터리는 실제 코드가 필요해질 때 만든다. 빈 디렉터리만 미리 만들지 않는다.

## slice 내부 기준

각 slice는 필요할 때 다음 파일을 가질 수 있다.

```text
model.ts
api.ts
ui.tsx
index.ts
```

초기에는 파일을 과하게 나누지 않는다. 하나의 컴포넌트로 충분하면 `ui.tsx` 하나에서 시작하고, 상태나 API 호출이 커질 때 `model.ts`, `api.ts`로 분리한다.

## shared/theme 기준

`shared/theme`은 DocuMind에서 추가로 고정해야 하는 제품 토큰만 관리한다.

포함할 수 있는 값은 다음과 같다.

- 제품 전용 색상 별칭
- 문서 상태나 리스크 상태 색상 매핑
- 업무 화면에서 반복되는 간격 토큰
- 제품 전용 z-index, breakpoint 이름

포함하지 않는 값은 다음과 같다.

- Astryx가 이미 제공하는 기본 컴포넌트 스타일 복제
- 특정 페이지 전용 레이아웃 스타일
- 임의의 CSS class 모음

## 반응형 처리

반응형은 StyleX와 Astryx가 제공하는 패턴을 우선 사용한다.

초기 MVP에서는 다음 기준을 따른다.

- 데스크톱 업무 화면을 우선한다.
- 모바일에서는 주요 정보가 겹치지 않게 세로 배치한다.
- 복잡한 반응형 레이아웃보다 명확한 화면 전환을 우선한다.

## 공통 컴포넌트 기준

다음 UI는 중복이 보이면 공통 컴포넌트로 분리한다.

- Button wrapper
- TextInput wrapper
- Modal/Dialog wrapper
- Panel
- Tabs wrapper
- Badge wrapper
- EmptyState

단순히 Astryx 이름을 다시 export하는 래퍼는 만들지 않는다. DocuMind 기본 prop, 한국어 접근성 레이블, 상태 표현, 도메인 의미가 생길 때 래퍼를 만든다.

## 예외 기준

Astryx 또는 StyleX로 구현하기 어려운 요구가 생기면 먼저 요구 자체를 단순화한다.

예외 검토가 필요한 경우는 다음과 같다.

- Astryx가 제공하지 않는 복잡한 데이터 시각화
- 세밀한 문서 뷰어 레이아웃
- 대규모 가상 스크롤
- Canvas 또는 PDF viewer 연동
- Astryx beta 변경으로 인한 breaking change

이 경우 별도 이슈에서 대안을 검토한 뒤 결정한다.

## 완료 기준

클라이언트 작업은 다음 조건을 만족해야 한다.

- 화면과 기능 배치는 FSD 레이어 책임을 기준으로 정리한다.
- Astryx 컴포넌트를 기본 UI 시스템으로 사용한다.
- 스타일 확장은 StyleX를 사용한다.
- Astryx theme CSS는 앱 진입점에서만 import한다.
- Tailwind, CSS Modules, styled-components, emotion을 추가하지 않는다.
- 직접 작성하는 일반 CSS 파일을 추가하지 않는다.
- Astryx theme import 전용 CSS 파일에는 직접 작성한 selector를 추가하지 않는다.
- 도메인 의미가 있는 UI는 DocuMind 이름의 조합 컴포넌트로 관리한다.
- import 방향은 `app -> pages -> widgets -> features -> entities -> shared` 흐름을 지킨다.
- 예외가 필요하면 새 이슈로 분리해 결정한다.
