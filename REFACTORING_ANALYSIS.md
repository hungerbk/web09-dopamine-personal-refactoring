# Murphy 리팩토링 분석 리포트

> 분석 대상: Next.js 16 + React 19 + TypeScript + Tailwind 3.4 프로젝트
> 범위: `src/` 디렉토리 (~292 파일), `public/` SVG 자산
> 제외: `node_modules`, `.next`, `dist`, `build`, `test/`, `e2e/`, `prisma/`, `data/`
> 작성일: 2026-04-25

---

## 목차

1. [중복 코드 (Duplicated Code)](#1-중복-코드-duplicated-code)
2. [유사 로직, 다른 구현 (Inconsistent Implementations)](#2-유사-로직-다른-구현-inconsistent-implementations)
3. [Props Drilling / 과도한 Props](#3-props-drilling--과도한-props)
4. [기타 리팩토링 후보 (긴 함수/네이밍)](#4-기타-리팩토링-후보)
5. [Tailwind 디자인 토큰화 후보](#5-tailwind-디자인-토큰화-후보)
6. [타입/상수 관리](#6-타입상수-관리)
7. [커스텀 훅 추출 후보](#7-커스텀-훅-추출-후보)
8. [성능 개선 후보](#8-성능-개선-후보-정적-분석)
9. [아이콘 사용 패턴](#9-아이콘-사용-패턴)
10. [요약 및 우선순위](#10-요약-및-우선순위)

---

## 1. 중복 코드 (Duplicated Code)

### [중복] API 라우트 인증 체크 블록 반복

- **위치**:
  - [src/app/api/projects/route.ts:7-10, 24-27, 46-49](src/app/api/projects/route.ts)
  - [src/app/api/projects/[projectId]/route.ts:10-13, 36-39](src/app/api/projects/[projectId]/route.ts)
  - [src/app/api/topics/route.ts:7-10](src/app/api/topics/route.ts)
  - [src/app/api/topics/[topicId]/issues/route.ts:41-44](src/app/api/topics/[topicId]/issues/route.ts)
- **현재 상태**: 동일한 3~4줄 인증 체크 블록이 다수 라우트 핸들러에 복사됨
  ```ts
  const { userId: ownerId, error } = await getAuthenticatedUserId(req);
  if (!ownerId) {
    return error ?? createErrorResponse('UNAUTHORIZED', 401);
  }
  ```
- **근거**: 정책 변경(에러 응답 형식, 세션 방식 등) 시 동일 수정이 여러 곳에 필요. 인증 우회/누락 리스크.
- **개선 제안**: `withAuth(handler)` 래퍼 또는 Next.js `middleware.ts`에서 공통 인증 처리. 라우트는 인증된 `userId`를 인자로만 받음.
- **우선순위**: **High**

### [중복] API 라우트 try/catch → console.error + createErrorResponse

- **위치**: 최소 50+ 라우트 핸들러
  - [src/app/api/projects/route.ts:17-19, 39-41, 61-63](src/app/api/projects/route.ts)
  - [src/app/api/issues/route.ts:41-43](src/app/api/issues/route.ts)
  - [src/app/api/topics/route.ts:26-28](src/app/api/topics/route.ts)
  - [src/app/api/issues/[issueId]/ideas/route.ts:37-39, 72-74](src/app/api/issues/[issueId]/ideas/route.ts)
  - [src/app/api/issues/[issueId]/categories/route.ts:17-19, 57-59](src/app/api/issues/[issueId]/categories/route.ts)
- **현재 상태**: 모든 라우트에서 동일한 catch 블록 패턴 반복
  ```ts
  } catch (error) {
    console.error('[operation] failed:', error);
    return createErrorResponse('[CODE]', 500);
  }
  ```
- **근거**: 로깅 포맷/관측 체계 변경 시 일괄 대응 불가. 일부는 한글 메시지, 일부는 영문 메시지로 구현 차이 발생(2장 참고).
- **개선 제안**: `withErrorHandler(handler, errorCode)` 고차 함수 도입 또는 Next.js `middleware.ts` 레벨 에러 핸들링.
- **우선순위**: **High**

### [중복] React Query mutation onError + toast 블록 반복

- **위치**:
  - [src/hooks/projects/use-project-mutation.ts:17-21, 36-38, 54-57](src/hooks/projects/use-project-mutation.ts)
  - [src/hooks/issues/use-issue-mutation.ts:32-35, 68-69, 86-88](src/hooks/issues/use-issue-mutation.ts)
  - [src/hooks/issues/use-idea-mutation.ts:51-53, 114-120, 155-161](src/hooks/issues/use-idea-mutation.ts)
- **현재 상태**: 25+ mutation에서 동일 패턴 반복
  ```ts
  onError: (error: unknown) => {
    const msg = error instanceof Error ? error.message : 'fallback';
    console.error('[op]:', error);
    toast.error(msg);
  };
  ```
- **근거**: 토스트 정책, 로깅 정책 변경 시 모든 hook 수정 필요. 폴백 문자열도 제각각.
- **개선 제안**: `createMutationErrorHandler(fallbackMsg)` 유틸 또는 `useApiMutation` 공통 훅.
- **우선순위**: **High**

### [중복] React Query queryKey 인라인 선언

- **위치**:
  - [src/hooks/projects/use-project-query.ts:6, 14](src/hooks/projects/use-project-query.ts)
  - [src/hooks/issues/use-issue-query.ts:8, 20](src/hooks/issues/use-issue-query.ts)
  - [src/hooks/topics/use-topic-query.ts:15, 21, 27](src/hooks/topics/use-topic-query.ts)
  - [src/hooks/issues/use-category-mutation.ts:18](src/hooks/issues/use-category-mutation.ts)
- **현재 상태**: `['projects']`, `['project', projectId]`, `['topics', topicId, 'issues']` 등 15+ 훅에 queryKey 문자열 리터럴 산재. invalidation 시 각 훅에서 개별 선언.
- **근거**: 키 하나 바꾸면 invalidate 호출부가 누락될 위험. 타입 안전성 없음.
- **개선 제안**: `queryKeys` 팩토리 파일 (`src/lib/query-keys.ts`) 도입.
  ```ts
  export const queryKeys = {
    projects: { all: ['projects'] as const, detail: (id: string) => ['project', id] as const },
    issues: { all: (topicId: string) => ['topics', topicId, 'issues'] as const, ... },
  };
  ```
- **우선순위**: **Medium**

### [중복] 수동 입력 유효성 체크

- **위치**:
  - [src/app/api/projects/route.ts:32-34](src/app/api/projects/route.ts)
  - [src/app/api/topics/route.ts:15-20](src/app/api/topics/route.ts)
  - [src/app/api/issues/route.ts:14-16](src/app/api/issues/route.ts)
- **현재 상태**: `if (!title) return createErrorResponse(...)` 같은 수동 검사 산재.
- **근거**: 스키마 기반 검증(zod 등) 부재로 검증 로직이 분산. 메시지 일관성 낮음.
- **개선 제안**: zod 도입 후 `parseBody(schema)` 헬퍼로 통일. 또는 최소한 `validateRequired(fields)` 유틸 공유.
- **우선순위**: **Medium**

### [중복] `useRef` 기반 외부 클릭 감지 로직

- **위치**:
  - [src/projects/components/project-card/project-card.tsx:40-41, 71-78](src/projects/components/project-card/project-card.tsx)
  - 기타 드롭다운 컴포넌트 (member-sidebar-item 등)
- **현재 상태**: `mousedown` 이벤트 리스너 등록/해제 코드가 3+ 곳에 중복.
- **개선 제안**: `useClickOutside(ref, handler)` 공용 훅 추출 (`src/hooks/use-click-outside.ts`).
- **우선순위**: **Medium**

### [중복] 텍스트에어리어 자동 높이 조절

- **위치**: [src/issues/components/idea-card/idea-card.tsx:173-178](src/issues/components/idea-card/idea-card.tsx)
- **현재 상태**: `textareaRef.current.style.height = 'auto'; ... = scrollHeight + 'px'` 수동 조작. 다른 입력 컴포넌트에서도 동일 필요 추정(추가 확인 필요).
- **개선 제안**: `useAutoGrowTextarea` 훅 추출.
- **우선순위**: **Low**

---

## 2. 유사 로직, 다른 구현 (Inconsistent Implementations)

### [불일치] 인증 헬퍼 모듈 2개 공존 + 시그니처 상이

- **위치**:
  - [src/lib/utils/api-auth.ts:7-29](src/lib/utils/api-auth.ts) — `getAuthenticatedUserId(request?)` → `{ userId, error }` 객체 반환
  - [src/lib/utils/auth-helpers.ts:6-17](src/lib/utils/auth-helpers.ts) — `getAuthenticatedUserId(req, issueId?)` → `string | null` 반환
  - [src/lib/utils/api-auth.ts:37-45](src/lib/utils/api-auth.ts) — `getIssueUserId(issueId)` (제3의 방식)
- **현재 상태**: 같은 이름의 함수가 서로 다른 파일에 있고 반환 타입/시그니처가 다름. 라우트마다 어느 쪽을 import 하는지 제각각.
  - 객체 반환 방식 사용: `api/projects/route.ts`, `api/topics/route.ts`
  - nullable 반환 방식 사용: `api/issues/[issueId]/ideas/route.ts:8`, `api/issues/[issueId]/ideas/[ideaId]/route.ts:7`
  - `getIssueUserId` 사용: `api/issues/[issueId]/route.ts:6`
- **근거**: 같은 이름이라 IDE 자동 import가 잘못된 모듈 불러올 여지. 반환 타입 불일치로 버그 발생 가능.
- **개선 제안**: 하나의 모듈(`src/lib/auth/`)로 통합. `requireUser(req)` / `requireIssueAccess(req, issueId)`로 명명 분리 후 단일 반환 타입.
- **우선순위**: **High**

### [불일치] 에러 처리 패턴 3종 혼재

- **위치**:
  - 패턴 A (서비스 에러 문자열 매핑): [src/app/api/issues/[issueId]/route.ts:68-75](src/app/api/issues/[issueId]/route.ts)
  - 패턴 B (단일 500 에러): [src/app/api/projects/[projectId]/route.ts:26-29](src/app/api/projects/[projectId]/route.ts)
  - 패턴 C (`getServerSession` 직접 사용): [src/app/api/projects/[projectId]/members/route.ts:7-14](src/app/api/projects/[projectId]/members/route.ts)
- **현재 상태**: 같은 종류의 라우트인데 에러 구조가 3가지로 갈림. 일부는 한글 로그, 일부는 영문 로그.
- **개선 제안**: 서비스 레이어에서 정의된 `AppError` 클래스 throw → 공통 핸들러에서 code/status 매핑.
- **우선순위**: **High**

### [불일치] toast 에러 메시지 처리 방식 3종

- **위치**:
  - 패턴 A (커스텀 메시지 + 한글 폴백): [src/hooks/projects/use-project-mutation.ts:18-21](src/hooks/projects/use-project-mutation.ts)
  - 패턴 B (폴백 없는 직접 표시): [src/hooks/issues/use-idea-mutation.ts:52, 116, 157](src/hooks/issues/use-idea-mutation.ts)
  - 패턴 C (하드코드된 한글 문자열): [src/hooks/issues/use-issue-member-mutation.ts:51, 58](src/hooks/issues/use-issue-member-mutation.ts)
- **현재 상태**: 100+ toast 호출에서 오류 표시 방식이 제각각.
- **개선 제안**: `showErrorToast(error, fallbackKey)` 유틸로 통일. 한글 폴백은 메시지 사전에서 조회.
- **우선순위**: **Medium**

### [불일치] 모달 상태 관리 방식

- **위치**:
  - 패턴 A (Zustand 스토어만): [src/components/modal/invite-project-modal/use-invite-project-modal.tsx:7-28](src/components/modal/invite-project-modal/use-invite-project-modal.tsx)
  - 패턴 B (스토어 + SSE broadcast 결합): [src/issues/components/close-issue-modal/use-close-issue-modal.ts:16-160](src/issues/components/close-issue-modal/use-close-issue-modal.ts)
- **현재 상태**: 후자는 모달 close 핸들러에 broadcast 로직이 섞여 있음(46-53, 84-86줄). 관심사 분리 부족.
- **개선 제안**: 모달은 순수 UI 상태만, broadcast는 별도 훅/side-effect로 분리.
- **우선순위**: **Medium**

### [불일치] 로딩 상태 명명/계산 방식

- **위치**:
  - `isLoading` 조합: [src/hooks/topics/use-topic-query.ts:36](src/hooks/topics/use-topic-query.ts)
  - `isPending` 분리 노출: [src/hooks/issues/use-idea-mutation.ts:172-174](src/hooks/issues/use-idea-mutation.ts)
  - 디바운스 로딩 커스텀 훅: [src/hooks/use-smart-loading.ts:3-20](src/hooks/use-smart-loading.ts)
- **현재 상태**: 세 가지 다른 방식이 공존. 컴포넌트는 어느 API를 받는지 매번 확인 필요.
- **개선 제안**: mutation은 `isPending`, query는 `isLoading` 컨벤션 확정 후 문서화.
- **우선순위**: **Low**

### [불일치] 날짜 포맷

- **위치**: [src/projects/components/project-detail-page.tsx](src/projects/components/project-detail-page.tsx) (`toLocaleDateString('ko-KR', ...)`)
- **현재 상태**: 날짜 포맷 유틸이 없어 각 컴포넌트에서 개별 처리. 대부분은 raw string 사용(추가 확인 필요).
- **개선 제안**: `src/lib/utils/date.ts`에 `formatDate(iso, style)` 공용 함수 추출.
- **우선순위**: **Low**

### [불일치] API fetch 래퍼 사용 여부

- **위치**:
  - 래퍼 사용: [src/lib/api/project.ts:4-43](src/lib/api/project.ts) (`getAPIResponseData` 경유)
  - 래퍼 미사용: [src/app/api/projects/[projectId]/members/route.ts:1-25](src/app/api/projects/[projectId]/members/route.ts)
- **현재 상태**: 응답 형식 규약이 라우트별로 다를 여지.
- **개선 제안**: 응답 형식은 `createSuccessResponse` / `createErrorResponse`로 통일하고, 이 래퍼를 벗어난 곳 점검.
- **우선순위**: **Medium**

---

## 3. Props Drilling / 과도한 Props

### [Props] CategoryCard — 14개 props

- **위치**: [src/issues/components/categories/category-card.tsx:11-27](src/issues/components/categories/category-card.tsx)
- **현재 상태**: `id, issueId, title, position, isMuted, children, hasActiveComment, status, onRemove, onPositionChange, onDrag, onDragStart, onDragEnd, checkCollision` — 핸들러 5개 + 상태 플래그 다수.
- **근거**: 드래그/위치 관련 핸들러가 상위에서 계산되어 강제 drilling. 캔버스 관련 상태는 이미 Zustand에 있음.
- **개선 제안**: 드래그/위치 관련 로직을 `CanvasContext` 또는 `useCategoryDrag` 훅으로 집약. props는 `id, issueId, status, children` 수준으로 축소.
- **우선순위**: **High**

### [Props] Canvas — 10개 props (다수 boolean flag)

- **위치**: [src/issues/components/canvas/canvas.tsx:9-20](src/issues/components/canvas/canvas.tsx)
- **현재 상태**: `showGrid, showControls, showMessage, showAddButton, enableAddIdea` 등 다수의 렌더 플래그 + 콜백.
- **근거**: boolean flag가 많은 컴포넌트는 내부 조합 폭발(“flag hell”). 재사용보다 복합 조건이 더 복잡.
- **개선 제안**: 슬롯/컴포지션 패턴 — `<Canvas><Canvas.Grid /><Canvas.Controls /></Canvas>` 구조로 분리.
- **우선순위**: **Medium**

### [Props] IdeaCard — 11개 props

- **위치**: [src/issues/components/idea-card/idea-card.tsx:21-31](src/issues/components/idea-card/idea-card.tsx)
- **현재 상태**: `IdeaWithPosition` 스프레드 + `issueId, status, isHotIdea, onVoteChange, onSave, onDelete, onClick, onPositionChange, disableAnimation` 6개 추가 콜백.
- **근거**: `issueId, status` 같은 이슈 컨텍스트는 이미 `useIssueData` 스토어에 존재. 콜백도 Mutation 훅 직접 호출로 대체 가능.
- **개선 제안**: 스토어에서 직접 꺼내고 콜백은 내부에서 mutation을 호출. props는 `idea: IdeaWithPosition` 하나로 수렴.
- **우선순위**: **High**

### [Props] MemberSidebarItem — 2단계 drilling

- **위치**: [src/components/sidebar/member-sidebar-item.tsx:7-16](src/components/sidebar/member-sidebar-item.tsx)
- **현재 상태**: `currentUserId, issueId, isQuickIssue` 3개가 상위(issue-detail-page) → sidebar → member-list → member-sidebar-item으로 변환 없이 전달됨.
- **개선 제안**: `IssueContext`(currentUserId, issueId, isQuickIssue) 생성 후 사용처에서 직접 소비.
- **우선순위**: **Medium**

### [Props] CommentWindow / CommentList — drilling 경로

- **위치**:
  - [src/issues/components/issue-detail-page.tsx:43](src/issues/components/issue-detail-page.tsx)
  - [src/issues/components/comments/comment-window.tsx:11-15](src/issues/components/comments/comment-window.tsx)
  - [src/issues/components/comments/comment-list.tsx](src/issues/components/comments/comment-list.tsx)
- **현재 상태**: 모달 상태 props가 2단계 전달. 이미 `useCommentWindowStore`가 부분 존재.
- **개선 제안**: `useCommentWindowStore`로 일관되게 치환.
- **우선순위**: **Low**

---

## 4. 기타 리팩토링 후보

### [긴 함수] issue-detail-page.tsx — 419줄

- **위치**: [src/issues/components/issue-detail-page.tsx:37-178](src/issues/components/issue-detail-page.tsx)
- **현재 상태**: 6개 이상의 useEffect가 권한 체크, auto-join, 리다이렉트, SSE 설정을 순차 처리. 복합 boolean(`isReadOnlySummaryView`)도 본문에서 계산.
- **개선 제안**: `useIssuePermissions(issue, user)` 훅, `useIssueAutoJoin`, `useIssueRedirect` 등 관심사별 훅 추출.
- **우선순위**: **High**

### [긴 함수] use-issue-events.ts — 355줄, 단일 useEffect 안 20+ 리스너

- **위치**: [src/issues/hooks/use-issue-events.ts:59-330](src/issues/hooks/use-issue-events.ts) (추가 확인 필요)
- **현재 상태**: 하나의 useEffect에서 20+ SSE 이벤트를 수신하고 각각 query invalidation. 121-135, 108-290줄에서 유사 블록 반복.
- **개선 제안**: `eventHandlers` 맵(이벤트명 → 핸들러)으로 선언형 변환. 도메인별(카테고리/아이디어/투표)로 훅 분할.
- **우선순위**: **High**

### [긴 함수] idea-card.tsx — 268줄

- **위치**: [src/issues/components/idea-card/idea-card.tsx](src/issues/components/idea-card/idea-card.tsx)
- **현재 상태**: 뷰와 훅 로직 혼재(75-156줄 setup). `useIdeaCard`로 일부 분리는 되어 있음.
- **개선 제안**: 남아있는 ref/애니메이션 로직을 `useIdeaCardAnimation` 등으로 추가 분리.
- **우선순위**: **Medium**

### [긴 함수] comment-window.tsx — 250줄

- **위치**: [src/issues/components/comments/comment-window.tsx:18-99](src/issues/components/comments/comment-window.tsx)
- **현재 상태**: 8개 상태 destructure + 컨텍스트 provider. 구조 자체는 양호.
- **개선 제안**: 유지. 필요 시 CommentInput/CommentBody 분리.
- **우선순위**: **Low**

### [네이밍] 이벤트 핸들러 네이밍은 대체로 일관적

- **위치**: 전반
- **현재 상태**: 내부는 `handle*`, props 로 받는 콜백은 `on*`이 잘 지켜지고 있음.
- **우선순위**: — (개선 불필요)

### [복잡 조건문] 주목할 수준의 3+ 단계 중첩 삼항 연산자는 발견되지 않음

- **위치**: [src/issues/components/comments/hooks/use-comment-list.ts:46-57](src/issues/components/comments/hooks/use-comment-list.ts)가 가장 깊은 편(2단계, 허용 수준).
- **우선순위**: **Low**

---

## 5. Tailwind 디자인 토큰화 후보

### [Tailwind] 현재 `tailwind.config.ts`에 정의된 토큰

- **위치**: [tailwind.config.ts:18-48](tailwind.config.ts)
- **현재 상태**:
  - `borderRadius`: half / large / medium / small
  - `fontSize`: xxl / xl / large / medium / small / xs
  - `fontWeight`: regular / medium / semibold / bold
  - `zIndex`: hide / base / important / selected / sticky / backdrop / modal / popover / overlay
  - **colors 토큰은 정의되어 있지 않음** — 모든 색상이 기본 팔레트 또는 arbitrary value.

### [Tailwind] 가장 많이 쓰이는 색상 TOP 10

| 순위 | 클래스            | 빈도 |
| ---- | ----------------- | ---- |
| 1    | `border-gray-200` | 32   |
| 2    | `text-gray-900`   | 24   |
| 3    | `text-gray-500`   | 24   |
| 4    | `text-gray-400`   | 24   |
| 5    | `bg-gray-100`     | 22   |
| 6    | `bg-green-600`    | 21   |
| 7    | `bg-gray-50`      | 20   |
| 8    | `text-gray-600`   | 19   |
| 9    | `bg-gray-200`     | 19   |
| 10   | `text-green-600`  | 17   |

- **근거**: 다수 회 재사용되는 색상은 semantic token으로 승격 시 일괄 변경/브랜딩 대응 용이.
- **개선 제안**: `theme.extend.colors`에 semantic alias 추가 (예: `surface.base` → `gray-50`, `surface.muted` → `gray-100`, `border.default` → `gray-200`, `text.primary` → `gray-900`, `text.secondary` → `gray-500`, `brand.primary` → `green-600`).
- **우선순위**: **Medium**

### [Tailwind] Gray 계열 혼용 (의미 중복 가능성)

- **현재 상태**:
  - 배경용으로 `gray-50`(20x), `gray-100`(22x), `gray-200`(19x), `gray-300`(7x) **네 단계** 공존
  - 텍스트용으로 `gray-400/500/600/700/800/900` **여섯 단계** 공존
  - 경계선 대부분 `border-gray-200`이나 `gray-100`, `gray-300`도 산발적으로 쓰임
- **근거**: 단계가 너무 많으면 디자인 정합성 저하, 의미 상 “같은 것”을 다른 단계로 작성한 사례가 생김.
- **개선 제안**: 배경 2단계(`surface`, `surface-muted`), 텍스트 3단계(`primary`, `secondary`, `tertiary`)로 수렴. 혼용 위치를 디자이너와 조율 후 일괄 치환.
- **우선순위**: **Medium**

### [Tailwind] arbitrary 색상값이 기본 팔레트와 중복

- **위치**: 23개 고유 arbitrary 색상 발견
  - `text-[#6b7280]` (2x) → `gray-500`과 동일
  - `text-[#111827]` (2x) → `gray-900`과 동일
  - `border-[#e5e7eb]` → `gray-200`과 동일
  - `bg-[#00a94f]`, `text-[#00a94f]`, `border-[#00a94f]` — 브랜드 그린 (토큰화 필요)
  - 기타: `#fbd6d0`, `#f3f4f6`, `#e2e8f0`, `#7fc196`, `#fef3c7`, `#fafafa`, `#f8fafc`, `#d4eddc`, `#c9c9c9`, `#92400e`
- **근거**: 기본 팔레트로 표현 가능한 색을 arbitrary로 쓰면 IDE 색상 미리보기/일괄 변경 어려움. 브랜드 컬러는 반드시 토큰화.
- **개선 제안**:
  1. `brand.primary: '#00a94f'` 토큰 추가 후 3곳 치환
  2. 팔레트와 동일한 hex는 `gray-500` 등 Tailwind 기본 클래스로 치환
  3. 남은 개별 hex는 의미 확인 후 semantic token으로 재분류 또는 유지
- **우선순위**: **Medium**

---

## 6. 타입/상수 관리

### [타입] Member 관련 타입 3종 파편화

- **위치**:
  - [src/projects/types/project.ts:11](src/projects/types/project.ts) — `ProjectMember { user: { id, image, displayName } }`
  - [src/issues/types/issue.ts:7](src/issues/types/issue.ts) — `IssueMember { id, nickname, role, isConnected }`
  - [src/projects/types/project.ts:38-42](src/projects/types/project.ts) — `ProjectwithTopic.members` 인라인 shape
- **현재 상태**: 세 가지가 호환되지 않는 구조. 공통 `User`/`Member` 기반 타입 없음.
- **개선 제안**: `src/types/member.ts`에 `BaseMember`, 확장으로 `ProjectMember`, `IssueMember`. Prisma 모델 기반 타입 재사용 검토.
- **우선순위**: **High**

### [타입] `Issue` 관련 타입 중복

- **위치**:
  - [src/issues/types/issue.ts:15-24](src/issues/types/issue.ts) — `Issue` interface
  - [src/projects/types/project.ts:29](src/projects/types/project.ts) — `ProjectwithTopic` 내부에 Issue-like 인라인 정의
- **현재 상태**: 이슈 표현이 두 군데 정의.
- **개선 제안**: `src/types/`로 중앙화, `Pick`/`Omit`으로 파생.
- **우선순위**: **Medium**

### [상수] 캔버스/레이아웃 매직 넘버 다수

- **위치**:
  - [src/issues/components/canvas/canvas.tsx:68, 77-78](src/issues/components/canvas/canvas.tsx) — `[background-size:40px_40px]`, `4000px`
  - [src/issues/components/comments/comment-window.tsx:122](src/issues/components/comments/comment-window.tsx) — `bottom-[-340px] right-[-400px]`, `h-[500px] w-[420px]`, `max-h-[min(800px,calc(100vh-32px))]`
  - [src/issues/components/idea-card/idea-card.tsx:34](src/issues/components/idea-card/idea-card.tsx) — `min-w-[30em] max-w-[30em] px-[35px] pb-[30px] pt-[35px]`
- **현재 상태**: 레이아웃 치수가 JSX에 하드코딩.
- **개선 제안**: `src/constants/layout.ts`에 `CANVAS_SIZE_PX`, `COMMENT_WINDOW_WIDTH_PX` 등으로 수렴. 디자이너 토큰화 병행.
- **우선순위**: **Medium**

### [상수] 그림자/시각 토큰 산발

- **위치**: 전반 (예: `shadow-[0_20px_60px_rgba(0,0,0,0.2)]` 등 15+ 고유 값, 추가 확인 필요)
- **개선 제안**: `tailwind.config.ts`의 `boxShadow.extend`에 semantic key로 등록.
- **우선순위**: **Low**

### [환경변수] `process.env` 직접 참조

- **위치**:
  - [src/proxy.ts](src/proxy.ts) — `process.env.NEXTAUTH_SECRET`
  - [src/app/sitemap.ts](src/app/sitemap.ts) — `process.env.BASE_URL`
  - [src/app/api/issues/[issueId]/categorize/route.ts](src/app/api/issues/[issueId]/categorize/route.ts) — `process.env.CLOVA_API_KEY`
  - [src/lib/redis.ts](src/lib/redis.ts) — Redis 호스트/포트 등 직접 참조 (추가 확인 필요)
- **현재 상태**: 일부는 `src/lib/auth.ts`/`src/lib/prisma.ts`에서 중앙화되었으나 API 라우트는 여전히 직접 참조.
- **개선 제안**: `src/lib/config.ts` 단일 진입점 + 타입 보장 (zod `parseEnv` 권장).
- **우선순위**: **Medium**

---

## 7. 커스텀 훅 추출 후보

### [훅] 이미 존재하는 것 (약 58개 훅)

- `src/hooks/issues/` 14개, `src/hooks/topics/` 8개, `src/hooks/projects/` 4개, `src/hooks/comments/` 5개 등. 전반적으로 추출 수준은 양호.

### [훅] 추출되지 않은 반복 패턴

- **useClickOutside** — 외부 클릭 감지 로직이 3+ 군데 중복(1장 참고). 추출 후보.
- **useAutoGrowTextarea** — 텍스트에어리어 자동 높이 조절(1장 참고).
- **useIssuePermissions** — `issue-detail-page.tsx` 권한/리드온리 판정 로직(4장 참고). 100줄 가까이 차지.
- **useMutationErrorToast** — `onError` → toast + 로그 공통 패턴(1장 참고).
- **우선순위**: **Medium** (개별적으로는 Low, 묶으면 Medium)

---

## 8. 성능 개선 후보 (정적 분석)

### [성능] `key={index}` 사용 — **없음** ✅

- **위치**: 전체 검색 결과 발견되지 않음.
- **현재 상태**: 양호.

### [성능] `<img>` 태그 — **없음** ✅

- **위치**: 전체에서 `<img>` 태그 발견되지 않음. 모든 이미지가 `next/image` 사용.

### [성능] `import *` 네임스페이스 임포트 11곳

- **위치**: 대부분 repository 배럴 (`import * as ideaRepository from '@/lib/repositories'`) — Next.js 서버 컴포넌트에서 허용되는 패턴.
- **주의 대상**: `import * as S from '@/components/sidebar'` 식 UI 네임스페이스 2곳 — 명시적 named import로 바꾸면 트리셰이킹에 더 안전.
- **우선순위**: **Low**

### [성능] `@xyflow/react` 정적 임포트 5곳

- **위치**:
  - `src/topics/components/topic-canvas.tsx`
  - `src/topics/components/issue-node.tsx`
  - `src/topics/components/issue-handle.tsx`
  - `src/topics/components/Issue-edge.tsx` (파일명 대소문자 주의)
  - `src/topics/components/issue-connection-line.tsx`
- **현재 상태**: 그래프 시각화 라이브러리를 정적으로 로드. `/topics` 라우트에서만 사용되지만 다른 페이지에도 영향 가능.
- **개선 제안**: 상위 페이지에서 `dynamic(() => import('...'), { ssr: false })`로 lazy-load. 번들 분리 효과 기대.
- **주의**: 프로파일링 전 단정 금지. **후보** 수준.
- **우선순위**: **Medium**

### [성능] `wordcloud` — 이미 dynamic

- **위치**: [src/issues/components/summary/word-cloud/word-cloud.tsx:45](src/issues/components/summary/word-cloud/word-cloud.tsx) — `import('wordcloud').then(...)` ✓
- **현재 상태**: 이미 lazy-load됨. 조치 불필요.

### [성능] 인라인 객체/함수 prop (약 23곳 `style={{...}}`)

- **주요 위치**:
  - [src/issues/components/idea-card/idea-card-header.tsx](src/issues/components/idea-card/idea-card-header.tsx)
  - `src/topics/components/issue-node-skeleton-grid/` — 반복 렌더되는 grid item
  - [src/issues/components/canvas/canvas.tsx](src/issues/components/canvas/canvas.tsx)
- **현재 상태**: 일부는 뷰포트 좌표 등 동적 값이라 정상. 반복 렌더 핫스팟(skeleton grid 등)은 리렌더 유발 가능.
- **개선 제안**: 핫 경로만 `useMemo`로 객체 메모이즈 또는 Tailwind 클래스로 이동.
- **주의**: 실제 측정 없이 최적화하지 말 것.
- **우선순위**: **Low**

---

## 9. 아이콘 사용 패턴

### [아이콘] 현황

- **위치**: [public/](public/) 디렉토리
- **전체**: 36개 SVG 파일
- **사용 방식**: `<Image>` 컴포넌트 + `src` 속성으로 문자열 경로 전달 (SVGR/스프라이트 미사용)
- **`<img>` 태그 사용**: 0건 (양호)

### [아이콘] 색상 변형 중복 파일

| 의미    | 파일들                                               | 비고                                |
| ------- | ---------------------------------------------------- | ----------------------------------- |
| crown   | `crown.svg`, `yellow-crown.svg`, `summary-crown.svg` | 3종                                 |
| add     | `add.svg`, `white-add.svg`                           | 2종 (white는 4곳 사용)              |
| edit    | `edit.svg`, `edit-gray.svg`                          | 2종                                 |
| people  | `people.svg`, `green-people.svg`                     | green은 **사용처 0건 (dead asset)** |
| comment | `comment.svg`, `green-comment.svg`                   | green은 **사용처 0건 (dead asset)** |

**중복/사용 안 되는 것 추정**:

- 색상 변형 중복: 최소 9개 파일 (5세트)
- Dead asset: 2개 (`green-people.svg`, `green-comment.svg`)

### [아이콘] 추천 개선 방향

프로젝트가 **Next.js 16**이므로 다음 중 하나 권장:

**권장 1순위 — SVGR + `currentColor`**

- 장점: 색상을 `className`(Tailwind text-\*)으로 제어 → 파일 분할 불필요
- 절차:
  1. `@svgr/webpack` 설치 후 `next.config.ts`에 webpack 설정 추가
  2. SVG 파일 내 `fill="#..."`을 `fill="currentColor"`로 수정
  3. 컴포넌트로 import: `import CrownIcon from '@/icons/crown.svg'`
  4. 사용: `<CrownIcon className="text-yellow-500" />`
- 중복 파일 5세트를 각 1개로 수렴 가능 → 최소 7개 파일 감소

**권장 2순위 — SVG sprite**

- 아이콘이 수백 개로 늘어날 때 고려. 현재 36개 수준에서는 과공학.

- **주의**: 파일 삭제/변환은 하지 말고 계획만 제시.
- **우선순위**: **High** (대표적인 리팩토링 저효율 지점, ROI 큼)

---

## 10. 요약 및 우선순위

### High 우선순위 (영향 범위 넓음 + ROI 큼)

1. **API 인증/에러 처리 통합** — 2개 인증 헬퍼 일원화, 50+ try/catch 블록 고차 함수화
2. **Mutation 에러 처리 공용 훅 추출** — 25+ mutation의 onError 통합
3. **Member/Issue 타입 중앙화** — `src/types/`로 수렴
4. **Props가 많은 컴포넌트 리팩토링** — CategoryCard(14), IdeaCard(11)
5. **issue-detail-page.tsx 훅 분리** — 419줄, 권한/리다이렉트/SSE 로직 분산
6. **use-issue-events.ts 선언형 전환** — 355줄 단일 useEffect 분해
7. **SVG 아이콘 SVGR + currentColor 전환** — 색상 변형 중복 5세트 + dead asset 2개

### Medium 우선순위

1. Query key 팩토리 (`src/lib/query-keys.ts`)
2. Tailwind semantic color 토큰 추가 + arbitrary hex 정리 (브랜드 `#00a94f` 우선)
3. Gray 단계 수렴 (배경 2, 텍스트 3 권장)
4. Canvas/레이아웃 매직넘버 상수화
5. 환경변수 중앙 config
6. `useClickOutside` / `useAutoGrowTextarea` 훅 추출
7. `@xyflow/react` dynamic import 검토
8. zod 기반 요청 검증 도입
9. Canvas 컴포넌트 composition 패턴 변경
10. 모달+SSE broadcast 관심사 분리

### Low 우선순위

1. 날짜 포맷 유틸
2. 로딩 상태 명명 컨벤션 문서화
3. CommentWindow/CommentList drilling → store 치환
4. box-shadow 토큰화
5. UI 네임스페이스 `import *` → named import
6. 반복 렌더 영역의 인라인 `style={{...}}` 정리 (프로파일링 선행)

### 추가 확인 필요 항목

- `src/lib/redis.ts` 환경변수 참조 라인 정확도
- `use-issue-events.ts` 355줄 상세 구조 (줄 번호 정확도)
- 날짜 포맷이 사용되는 모든 위치 (`toLocaleDateString` grep 추가 필요)
- box-shadow arbitrary value 정확한 중복 개수
- 텍스트에어리어 자동 높이 조절 패턴의 다른 사용처

### 분석에서 제외한 것

- UI/UX 개선 (색상 톤, 레이아웃 느낌, 접근성, 애니메이션)
- 비즈니스 로직 변경이 필요한 사항
- 단순 스타일 취향 차이

---

_본 리포트는 정적 분석 결과이며, 실제 리팩토링 전에 각 항목을 팀 리뷰 및 런타임 프로파일링(성능 항목 한정)으로 재검증할 것을 권장합니다._
