# team-board

Next.js 프론트엔드 + NestJS 백엔드 + Redis를 사용하는, 노션(Notion)과 유사한 다중 사용자 협업 보드 토이 프로젝트.

## 기술 스택

- **frontend**: Next.js (App Router)
- **backend**: NestJS
- **저장소**: Redis (별도 DB 없이 Redis를 유일한 저장소로 사용)
- **로그인**: OAuth (네이버, 슬랙) — Redis 세션 + httpOnly 쿠키 방식

## 도메인 모델

계층 구조: **Team → Project → Task**

- **Team**: 최상위 엔티티. 프로젝트를 묶는 그룹
- **Project**: Team에 종속. `name`, `startDate`, `memo`, `status` 필드를 가짐
  - `status`: `IN_DEVELOPMENT`(개발 중) | `IN_OPERATION`(운영 중) | `CLOSED`(종료)
- **Task** (기능/일): Project에 종속되는 칸반 카드. `title`, `description`(개발 사항), `assignee`, `startDate`, `dueDate`, `status` 필드를 가짐
  - `status`: `TODO`(시작 전) | `IN_PROGRESS`(진행 중) | `DONE`(완료)

## 주요 기능

- **로그인**: 네이버 / 슬랙 OAuth 로그인, Redis 세션 기반 인증 (`middleware.ts` + 백엔드 전역 `SessionAuthGuard`로 이중 보호)
- **팀 관리**: 목록/추가/수정/삭제, 체크박스 다중 선택 후 일괄 삭제
- **프로젝트 관리**: 팀별 목록/추가/수정/삭제, 상태값(개발 중/운영 중/종료) 관리
- **태스크 칸반보드**: 프로젝트별 시작 전/진행 중/완료 3열 보드, 카드 추가·수정·삭제, **드래그 앤 드롭으로 상태 변경**
- 모든 생성·수정·삭제·드래그 액션 후에는 로컬 state를 직접 고치지 않고, **서버에서 최신 목록을 다시 조회해서 반영**함 (화면과 Redis 간 데이터 불일치 방지)

## 네비게이션 구조

```
/login  → 로그인 (네이버/슬랙)
/teams  → 팀 목록
  └ /teams/[teamId]           → 그 팀의 프로젝트 목록
       └ /projects/[projectId] → 프로젝트의 태스크 칸반보드
```

## 폴더 구조

```
team-board/
├── frontend/
│   ├── app/
│   │   ├── login/page.tsx
│   │   ├── teams/page.tsx                    # 팀 목록
│   │   ├── teams/[teamId]/page.tsx           # 팀별 프로젝트 목록
│   │   ├── projects/[projectId]/page.tsx     # 태스크 칸반보드
│   │   ├── shared.css                        # 공용 스타일(카드/모달/헤더 등)
│   │   └── middleware.ts                      # 로그인 여부에 따른 라우트 보호
│   ├── components/
│   │   ├── layout/Header.tsx                 # 홈/팀 이름/팀 추가/프로필/로그아웃
│   │   ├── team/{TeamList,TeamCard,TeamModal}.tsx
│   │   ├── project/{ProjectList,ProjectCard,ProjectModal}.tsx
│   │   └── task/{TaskBoard,TaskColumn,TaskCard,TaskForm}.tsx
│   ├── lib/api/{auth,auth-server,team,project,task}.ts
│   └── types/{user,team,project,task}.ts
├── backend/
│   └── src/
│       ├── redis/                    # ioredis 클라이언트 래퍼
│       ├── auth/                     # 네이버/슬랙 OAuth, 세션, SessionAuthGuard
│       ├── team/                     # controller/service/repository/dto
│       ├── project/                  # controller/service/repository/dto, ProjectStatus enum
│       └── task/                     # controller/service/repository/dto, TaskStatus enum
└── .claude/                          # 멀티 에이전트 설정 (project-lead, frontend, backend-api, realtime)
```

### Redis 키 스키마

| 키 | 타입 | 설명 |
|---|---|---|
| `team:{teamId}` | hash | 팀 정보 (id, name, createdAt) |
| `team:ids` | set | 전체 팀 id 목록 |
| `team:{teamId}:projects` | set | 해당 팀에 속한 project id 목록 |
| `project:{projectId}` | hash | 프로젝트 정보 (id, teamId, name, startDate, memo, status, createdAt) |
| `project:{projectId}:tasks` | set | 해당 프로젝트에 속한 task id 목록 |
| `task:{taskId}` | hash | 태스크 정보 (id, projectId, title, description, assignee, startDate, dueDate, status) |
| `user:{userId}` | hash | OAuth 로그인 사용자 정보 (id, provider, providerId, name, email, avatarUrl) |
| `user:provider:{provider}:{providerId}` | string | provider 계정 ↔ 내부 userId 매핑 |
| `session:{sessionId}` | string | 세션ID → userId (TTL 있음) |
| `oauth:state:{state}` | string | OAuth 콜백 CSRF 검증용 임시 값 (TTL 짧음) |

팀/프로젝트 삭제 시 하위 데이터(프로젝트/태스크)까지 cascade 삭제됩니다.

## 현재 진행 상태

- [x] 팀/프로젝트/태스크 CRUD 및 칸반보드(드래그 앤 드롭) 구현
- [x] 네이버/슬랙 OAuth 로그인 (Redis 세션)
- [x] 라우트 보호 (middleware + 백엔드 전역 Guard)
- [ ] 실시간 동기화 (WebSocket Gateway, Redis Pub/Sub) — 여러 사용자/탭 간 실시간 반영은 아직 미구현, 현재는 액션 후 재조회 방식
- [ ] 테스트 코드

## 실행 방법

### 한 번에 실행 (권장)

Redis가 로컬에서 떠 있어야 합니다 (`redis-server`).

```bash
npm install          # 루트 (concurrently)
npm install --prefix backend
npm install --prefix frontend
cp backend/.env.example backend/.env   # REDIS_URL, 네이버/슬랙 OAuth 키 등 설정

npm run dev          # backend(4000) + frontend(3000) 동시 실행
npm run dev:debug    # backend를 디버그 모드(--inspect)로 실행 (VS Code Attach 가능)
```

### 개별 실행

```bash
# 백엔드
cd backend && npm run start:dev

# 프론트엔드
cd frontend && npm run dev
```
