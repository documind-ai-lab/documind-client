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

## theme.ts 기준

`theme.ts`는 공통 디자인 토큰만 관리한다.

포함할 수 있는 값은 다음과 같다.

- 색상
- 폰트 크기
- 간격
- radius
- 그림자
- z-index

포함하지 않는 값은 다음과 같다.

- 특정 컴포넌트 전용 스타일 묶음
- 페이지별 레이아웃 스타일
- hover, focus 상태별 스타일 객체

## hover와 focus 처리

React inline style은 CSS pseudo class를 직접 사용할 수 없다. 따라서 hover나 focus 상태가 꼭 필요한 경우 React state로 처리한다.

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
- 예외가 필요하면 새 이슈로 분리해 결정한다.
