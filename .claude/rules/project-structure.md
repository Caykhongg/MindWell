# Project Structure — MindWell

## Monorepo Layout

```
project-root/
├── .claude/                    # AI Agent configuration
├── frontend/                   # React 19 + Vite 6 + Tailwind CSS 4
│   ├── src/
│   │   ├── assets/             # Images, fonts
│   │   ├── components/         # Reusable UI components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utility functions, API client (ky)
│   │   ├── stores/             # Zustand stores
│   │   ├── types/              # TypeScript type definitions
│   │   ├── App.tsx             # Root component
│   │   ├── index.css           # Tailwind entry + global styles
│   │   └── main.tsx            # Entry point
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── backend/                    # Express 5 + Drizzle ORM + PostgreSQL
│   ├── src/
│   │   ├── config/             # Environment config
│   │   ├── controllers/        # Request/response handling
│   │   ├── db/                 # Drizzle schema + migrations
│   │   ├── middleware/         # Auth, validation, error handling
│   │   ├── repositories/       # Data access layer
│   │   ├── routes/             # Route definitions
│   │   ├── services/           # Business logic
│   │   ├── utils/              # Helpers
│   │   ├── validators/         # Zod schemas
│   │   ├── websocket/          # WebSocket handlers (counseling chat)
│   │   ├── app.ts              # Express app setup
│   │   └── index.ts            # Server entry
│   ├── drizzle.config.ts
│   ├── .env
│   └── package.json
│
├── assets/                     # Legacy assets
├── css/                        # Legacy styles
├── js/                         # Legacy scripts
├── index.html                  # Legacy entry (vanilla JS)
├── render.yaml                 # Render deployment config
├── README.md
└── .gitignore
```

## Layered Architecture (Backend)

```
Request → Routes → Middleware → Controllers → Services → Repositories → Database
                                     ↕
                                Validators (Zod)
```

- **Routes**: URL mapping only, no logic
- **Controllers**: Request/response handling
- **Services**: Business logic, orchestration
- **Repositories**: Data access (Drizzle queries)
- **Validators**: Zod schemas for input validation

## File Naming
- Source files: `kebab-case.ts` (`user-service.ts`)
- Test files: `[name].test.ts` (`user-service.test.ts`)
- Drizzle schemas: `*.schema.ts`
- Route files: `*.routes.ts`
