# team-board

Next.js 프론트엔드 + NestJS 백엔드 + Redis를 사용하는, 노션(Notion)과 유사한 다중 사용자 협업 보드 토이 프로젝트.

## 기술 스택

- **frontend**: Next.js (App Router)
- **backend**: NestJS
- **저장소**: Redis (별도 DB 없이 Redis를 유일한 저장소로 사용)
- **로그인 (예정)**: OAuth (네이버, 슬랙)

## 도메인 모델

- **Project**: 최상위 엔티티
- **Task** (기능/일): Project에 종속되는 카드. `title`, `description`, `assignee`, `dueDate`, `status` 필드를 가짐
  - `status`: `TODO`(미진행) | `IN_PROGRESS`(진행중) | `DONE`(완료)

## 폴더 구조

```
team-board/
├── frontend/                        # Next.js
│   ├── app/
│   │   ├── projects/page.tsx        # 프로젝트 목록
│   │   └── projects/[projectId]/page.tsx  # 칸반보드
│   ├── components/{project,task}/
│   ├── lib/api/{project,task}.ts
│   └── types/{project,task}.ts
├── backend/                         # NestJS
│   └── src/
│       ├── redis/                   # ioredis 클라이언트 래퍼
│       ├── project/                 # controller/service/repository/dto
│       └── task/                    # controller/service/repository/dto, TaskStatus enum
├── .claude/                         # 멀티 에이전트 설정 (project-lead, frontend, backend-api, realtime)
└── docs/superpowers/specs/          # 설계 스펙 문서
```

### Redis 키 스키마

| 키 | 타입 | 설명 |
|---|---|---|
| `project:{projectId}` | hash | 프로젝트 정보 (id, name, createdAt) |
| `project:ids` | set | 전체 프로젝트 id 목록 |
| `task:{taskId}` | hash | 태스크 정보 (id, projectId, title, description, assignee, dueDate, status) |
| `project:{projectId}:tasks` | set | 해당 프로젝트에 속한 task id 목록 |

## 현재 진행 상태

- [x] frontend / backend 폴더 구조 스캐폴딩 (module/controller/service/repository/dto, 페이지/컴포넌트 뼈대)
- [x] 의존성 설치 (`npm install` 완료)
- [ ] Project/Task CRUD 실제 로직 구현
- [ ] OAuth 로그인 (네이버, 슬랙)
- [ ] 실시간 동기화 (WebSocket Gateway, Redis Pub/Sub)
- [ ] 테스트 코드

## 실행 방법

### 한 번에 실행 (권장)

Redis가 로컬에서 떠 있어야 합니다 (`redis-server`).

```bash
npm install          # 루트 (concurrently)
npm install --prefix backend
npm install --prefix frontend
cp backend/.env.example backend/.env   # REDIS_URL 등 설정

npm run dev          # backend(4000) + frontend(3000) 동시 실행
```

### 개별 실행

```bash
# 백엔드
cd backend && npm run start:dev

# 프론트엔드
cd frontend && npm run dev
```

## 참고 문서

- 폴더 구조 설계 스펙: [`docs/superpowers/specs/2026-07-20-project-task-board-design.md`](docs/superpowers/specs/2026-07-20-project-task-board-design.md)
