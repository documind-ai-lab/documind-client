# 클라이언트 아키텍처 결정

## 목적

DocuMind 클라이언트는 프로젝트별 문서 분석 업무를 빠르게 확인하고 조작하는 B2B SaaS 웹앱이다. 초기 MVP에서는 화면 구현 속도와 컴포넌트 단위 수정 편의성을 우선한다.

이 문서는 `documind-client`에서 사용할 스타일링 방식과 클라이언트 화면 구현 기준을 정의한다.

## 결정 사항

클라이언트는 React inline style 직접 작성 방식을 사용한다.

사용하는 방식은 다음과 같다.

- JSX 요소의 `style={{ ... }}` 속성에 스타일을 직접 작성한다.
- 공통 색상, 간격, 폰트 크기, radius 값은 `theme.ts`에서 관리한다.
- 버튼, 입력, 모달, 패널처럼 반복되는 UI는 공통 컴포넌트로 만든다.

사용하지 않는 방식은 다음과 같다.

- Tailwind CSS
- 별도 CSS 파일
- CSS Modules
- styled-components
- emotion
- 컴포넌트 하단의 `styles` 객체

## 결정 이유

초기 제품은 고객 검증을 위한 MVP 성격이 강하다. 지금은 복잡한 스타일 시스템보다, 화면 구조를 빠르게 바꾸고 컴포넌트 안에서 스타일을 바로 확인하는 편이 더 중요하다.

또한 Figma나 Stitch에서 생성된 화면을 그대로 고정하기보다, Codex에서 컴포넌트 단위로 계속 다듬을 예정이다. 따라서 스타일이 컴포넌트 내부에 직접 보이는 구조가 초기 수정 속도에 유리하다.

## 기본 구현 규칙

컴포넌트는 다음 형태를 기본으로 작성한다.

```tsx
import { theme } from "../theme";

export function ProjectCard() {
  return (
    <article
      style={{
        padding: 16,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.card,
        backgroundColor: theme.colors.panel,
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: theme.fontSize.md,
          color: theme.colors.text,
        }}
      >
        견적 검토 프로젝트
      </h3>
    </article>
  );
}
```

스타일은 JSX에서 직접 읽히는 것을 우선한다. 같은 스타일이 여러 곳에서 반복되면 스타일 객체를 분리하지 않고, 먼저 공통 컴포넌트로 분리할 수 있는지 확인한다.


## FSD 구조 기준

클라이언트의 화면과 기능 배치는 FSD(Feature-Sliced Design)를 기준으로 한다.

초기 MVP에서는 FSD를 과하게 엄격한 규칙으로 사용하지 않는다. 대신 화면, 기능, 도메인, 공통 코드를 어디에 둘지 흔들리지 않게 하는 구조 기준으로 사용한다.

기본 레이어는 다음과 같다.

- `app`: 앱 초기화, 라우터, 전역 provider, 전역 에러 경계
- `pages`: 라우트 단위 화면 조립
- `widgets`: 여러 feature와 entity를 조합하는 화면 영역
- `features`: 사용자의 명확한 행동 단위
- `entities`: 프로젝트, 문서, 분석 결과처럼 도메인 명사를 표현하는 모델과 UI
- `shared`: 도메인에 묶이지 않는 공통 유틸, API 클라이언트, theme, 공통 UI

레이어 책임은 다음 기준으로 나눈다.

- 페이지 전체 레이아웃은 `pages`에 둔다.
- 문서 목록 패널, 채팅 패널, 출처 패널처럼 화면의 큰 영역은 `widgets`에 둔다.
- 프로젝트 생성, 문서 업로드, 질문 전송처럼 사용자가 수행하는 행동은 `features`에 둔다.
- Project, Document, Source, Risk 같은 도메인 데이터 표현은 `entities`에 둔다.
- Button, Modal, EmptyState, theme, API fetch helper처럼 도메인과 무관한 코드는 `shared`에 둔다.

## FSD와 스타일 기준

FSD는 파일과 책임을 나누는 구조 기준이고, 스타일 작성 방식은 기존 결정대로 React inline style 직접 작성 방식을 따른다.

따라서 FSD를 적용해도 다음 원칙은 유지한다.

- 레이어별 CSS 파일을 만들지 않는다.
- slice별 CSS 파일을 만들지 않는다.
- styled-components나 emotion을 추가하지 않는다.
- 컴포넌트 하단의 `styles` 객체를 만들지 않는다.
- JSX 요소의 `style={{ ... }}`에 스타일을 직접 작성한다.
- 공통 디자인 토큰은 `shared/theme` 또는 `shared/config/theme.ts`에서 관리한다.

반복되는 스타일은 스타일 객체로 분리하지 않는다. 먼저 `shared/ui`의 공통 컴포넌트나 해당 레이어 내부 컴포넌트로 분리할 수 있는지 확인한다.

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

## theme.ts 기준

`theme.ts`는 공통 디자인 토큰만 관리한다.

포함할 수 있는 값은 다음과 같다.

- 색상
- 폰트 크기
- 간격
- radius

포함하지 않는 값은 다음과 같다.

- 특정 컴포넌트 전용 스타일 묶음
- 페이지별 레이아웃 스타일
- hover, focus 상태별 스타일 객체

## hover와 focus 처리

React inline style은 CSS pseudo class를 직접 사용할 수 없다. 따라서 hover나 focus 상태가 꼭 필요한 경우 React state로 처리한다.

hover 상태와 focus 상태는 같은 상태값으로 섞지 않는다. 키보드 접근성을 위해 focus는 `onFocus`와 `onBlur` 기준으로 별도 관리하고, 최소한의 포커스 표시를 항상 유지한다.

다만 초기 MVP에서는 hover 효과를 과하게 만들지 않는다. 업무용 화면에서 필요한 최소한의 상태 표현만 사용한다.

예시는 다음과 같다.

```tsx
const [hovered, setHovered] = useState(false);

<button
  onMouseEnter={() => setHovered(true)}
  onMouseLeave={() => setHovered(false)}
  style={{
    backgroundColor: hovered ? theme.colors.primaryHover : theme.colors.primary,
  }}
>
  새 프로젝트
</button>
```

## 반응형 처리

반응형은 CSS media query 대신 컴포넌트 상태나 viewport hook으로 처리한다.

초기 MVP에서는 다음 기준을 따른다.

- 데스크톱 업무 화면을 우선한다.
- 모바일에서는 주요 정보가 겹치지 않게 세로 배치한다.
- 복잡한 반응형 레이아웃보다 명확한 화면 전환을 우선한다.

## 공통 컴포넌트 기준

다음 UI는 중복이 보이면 공통 컴포넌트로 분리한다.

- Button
- TextInput
- Select
- Modal
- Panel
- Tabs
- Badge
- EmptyState

공통 컴포넌트도 별도 CSS 파일을 만들지 않는다. 필요한 스타일은 JSX의 `style={{ ... }}`에 직접 작성하고, 공통 값은 `theme.ts`에서 가져온다.

## 예외 기준

React inline style로 구현하기 어려운 요구가 생기면 먼저 요구 자체를 단순화한다.

예외 검토가 필요한 경우는 다음과 같다.

- 복잡한 애니메이션
- 세밀한 scrollbar 스타일링
- 다수의 pseudo element
- 복잡한 media query
- 대규모 디자인 시스템 전환

이 경우에도 바로 CSS 파일을 추가하지 않는다. 별도 이슈에서 대안을 검토한 뒤 결정한다.

## 전환 기준

다음 상황이 반복되면 스타일링 방식 전환을 검토한다.

- JSX가 스타일 코드 때문에 읽기 어려워진다.
- hover, focus, responsive 처리가 대부분의 컴포넌트에 필요해진다.
- 같은 inline style이 여러 화면에 넓게 중복된다.
- 디자이너와 협업하면서 CSS class 기반 전달이 필요해진다.

전환 후보는 CSS-in-JS 또는 일반 CSS 파일이다. 전환 여부는 별도 ADR에서 결정한다.

## 완료 기준

클라이언트 작업은 다음 조건을 만족해야 한다.

- Tailwind, CSS 파일, CSS Modules, CSS-in-JS를 새로 추가하지 않는다.
- 스타일은 JSX 요소의 `style={{ ... }}`에 직접 작성한다.
- 공통 디자인 값은 `theme.ts`에서 가져온다.
- 반복되는 UI는 스타일 객체가 아니라 공통 컴포넌트로 정리한다.
- 화면과 기능 배치는 FSD 레이어 책임을 기준으로 정리한다.
- import 방향은 `app -> pages -> widgets -> features -> entities -> shared` 흐름을 지킨다.
- 예외가 필요하면 새 이슈로 분리해 결정한다.
