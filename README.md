# 인턴십 공고 플랫폼

React와 TypeScript를 사용하여 구현한 인턴십 공고 조회 및 관리 플랫폼입니다. 사용자 인증, 필터링, 북마크 기능을 제공합니다.

## 기술 스택

- React 19.1.0: 컴포넌트 기반 UI 라이브러리
- TypeScript: 타입 안정성을 위한 정적 타입 언어
- Vite: 빠른 개발 서버 및 빌드 도구
- React Router: 클라이언트 사이드 라우팅
- Axios: HTTP 클라이언트 라이브러리
- React Icons: 아이콘 컴포넌트

## 주요 기능

사용자 인증 시스템
- Context API를 활용한 전역 인증 상태 관리
- 로그인, 회원가입 기능
- localStorage를 통한 토큰 저장 및 자동 로그인
- 토큰 기반 API 인증 인터셉터 구현

인턴십 공고 필터링
- 직군 필터 (프론트엔드, 백엔드, 앱 개발, 기획, 디자인, 마케팅)
- 업종 필터 (핀테크, 헬스테크, 교육, 이커머스 등)
- 모집 상태 필터 (전체, 모집중)
- 정렬 옵션 (공고등록순, 마감임박순)
- 필터 초기화 기능

페이지네이션
- 페이지 블록 단위 네비게이션
- 이전/다음 페이지 이동
- 현재 페이지 하이라이트

북마크 기능
- Optimistic UI 업데이트를 통한 즉각적인 피드백
- API 호출 실패 시 상태 롤백 처리
- 로그인 필요 시 모달 표시

## 구현 세부사항

인증 시스템은 Context API를 사용하여 구현했습니다. AuthProvider에서 토큰과 사용자 정보를 관리하며, 페이지 로드 시 localStorage에 저장된 토큰을 확인하여 자동 로그인을 처리합니다. Axios 인터셉터를 통해 인증이 필요한 API 요청에 자동으로 Bearer 토큰을 추가합니다.

공고 데이터 관리는 PostProvider에서 Context API로 구현했습니다. 필터 파라미터를 URLSearchParams로 인코딩하여 API에 전달하며, useCallback과 useMemo를 활용하여 불필요한 리렌더링을 방지합니다.

필터링 UI는 아코디언 패널과 드롭다운 모달을 조합하여 구현했습니다. 체크박스와 라디오 버튼을 사용하여 다중 선택과 단일 선택을 처리하며, 필터 변경 시 자동으로 API를 호출하여 결과를 업데이트합니다.

북마크 기능은 Optimistic UI 패턴을 적용하여 사용자 클릭 즉시 UI를 업데이트하고, 이후 API 호출 결과에 따라 성공 시 유지, 실패 시 이전 상태로 롤백합니다.

## 프로젝트 구조

```
snu-intern-final/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── auth.tsx
│   ├── post.tsx
│   ├── api.ts
│   ├── type.ts
│   ├── Home.tsx
│   ├── InternCard.tsx
│   ├── components/
│   │   └── Header.tsx
│   └── pages/
│       ├── LoginPage.tsx
│       ├── SignupPage.tsx
│       ├── MyPage.tsx
│       └── ProfilePage.tsx
├── vite.config.ts
└── package.json
```
