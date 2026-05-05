# Bright College Hub — Admin Panel

A production-ready admin panel built with React + TypeScript. This project was built to demonstrate real-world frontend engineering skills — clean architecture, type safety, reusable components, secure auth flow, and scalable state management.

---

## User Story

> As an admin of Bright College Hub, I need a secure dashboard where I can manage shops, job listings, and CMS content — with a clean UI, protected routes, and a session that handles token expiry gracefully without disrupting my workflow.

**What the admin can do:**
- Log in securely with email and password
- View a dashboard with key stats at a glance
- Manage **Shop listings** — create, edit, delete, paginate, search
- Manage **Job listings** — create, edit, delete with rich form fields
- Manage **CMS content** — create and edit content with a rich text editor
- Get automatically logged out when the session expires (with a toast notification)
- Stay logged in across page refreshes (persisted auth state)

---

## Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/bright-college-hub-admin.git
cd bright-college-hub-admin

# Install dependencies
npm install
```

### Environment Setup

Create a `.env` file in the root:

```env
VITE_BASE_URL=https://your-api-base-url.com/api
```

### Run Locally

```bash
npm run dev
```

App runs at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 18 |
| Language | TypeScript 5 |
| Build Tool | Vite |
| Styling | Tailwind CSS v4 + custom CSS |
| UI Components | MUI (Material UI) v7 |
| State Management | Redux Toolkit + Redux Persist |
| Routing | React Router DOM v6 |
| HTTP Client | Axios |
| Forms | React Hook Form + Yup |
| Date Handling | Day.js + MUI Date Pickers |
| Rich Text Editor | Tiptap |
| Notifications | React Hot Toast |
| Icons | React Icons |
| Linting | ESLint + Prettier + Husky |

---

## Project Architecture

```
src/
├── assets/          # Images, fonts, SVGs
├── components/
│   ├── Common/      # Reusable UI components (shared across modules)
│   └── Modules/     # Feature-specific components (Dashboard, Shop, Job, CMS, Auth)
├── layout/          # DashboardLayout — wraps all protected pages
├── Page/            # Route-level page components (thin wrappers)
├── service/
│   ├── httpsCall.ts # Axios instance with interceptors
│   ├── authEvents.ts# Event bus for auth signaling
│   └── apis/        # One API file per module
├── store/           # Redux store + auth slice
└── types/           # TypeScript interfaces per module
```

---

## Key Engineering Decisions

### 1. Type Safety — End to End

Every API response, request payload, and component prop is typed. Generic interfaces are used to avoid repetition:

```ts
// One generic wrapper covers all API responses
interface ApiResponse<T = null> {
  code: number;
  success: boolean;
  message: string;
  data: T;
}

// Usage — fully typed, no any
AuthApi.login(data): Promise<ApiResponse<User>>
```

Types live in `src/types/` — one file per module (`authTypes.ts`, `jobTypes.ts`, etc.).

---

### 2. Reusable Components

All shared UI is in `src/components/Common/`. Each component is generic and prop-driven:

| Component | What it does |
|---|---|
| `DataTable<T>` | Generic table with columns, pagination, loading skeleton, empty state |
| `FormField` | Unified input — text, select, textarea, password toggle |
| `DatePickerField` | MUI DatePicker wrapped with consistent styling |
| `RichTextEditor` | Tiptap-based editor with toolbar (bold, italic, links, alignment) |
| `SearchInput` | Debounced search input |
| `ConfirmModal` | Reusable delete/confirm dialog |
| `CustomButton` | Styled MUI button with optional link behavior |
| `TableSkeleton` | Animated loading placeholder for tables |
| `ProtectedRoute` | Auth guard using Redux state |

**Example — DataTable is fully generic:**
```tsx
// Works for any data shape — columns define the structure
<DataTable<Job>
  columns={columns}
  rows={jobs}
  loading={isLoading}
  pagination={pagination}
  onPageChange={setPage}
/>
```

---

### 3. Axios — Centralized HTTP Layer

All API calls go through a single Axios instance in `src/service/httpsCall.ts`.

**What the interceptor handles automatically:**
- Unwraps `response.data` so every API call gets clean data back
- On `401` — silently calls `/auth/refresh` and retries the original request
- On `TOKEN_REUSE` error — immediately fires logout (security: all sessions revoked)
- On refresh failure — fires logout and redirects to login

```ts
// Every API module uses the same instance
const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true, // httpOnly cookies sent automatically
});
```

---

### 4. Auth Event Bus — Decoupled Logout

The Axios interceptor lives outside React. To trigger logout from there without coupling it to React state, a lightweight event bus is used:

```ts
// From Axios interceptor (outside React)
emitLogout(); // fires a custom window event

// Inside React (App.tsx)
onLogout(() => {
  dispatch(logout());
  navigate("/login");
});
```

This keeps the service layer completely decoupled from React internals.

---

### 5. State Management — Redux Toolkit + Persist

Auth state is managed in Redux and persisted to `localStorage` via `redux-persist`. On page refresh, the user stays logged in.

```ts
// auth.store.ts — clean slice with typed actions
const authSlice = createSlice({
  reducers: {
    login: (state, action: PayloadAction<User>) => { ... },
    logout: (state) => { ... },
    updateUser: (state, action: PayloadAction<User>) => { ... },
  }
});
```

Only the `authSlice` is whitelisted for persistence — nothing else hits localStorage.

---

### 6. Forms — React Hook Form + Yup

All forms use `react-hook-form` for performance (no re-renders on every keystroke) with `yup` schemas for validation.

```ts
const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: yupResolver(schema),
});
```

---

### 7. Component Breakdown Pattern

Each module follows the same pattern — logic is separated from UI:

```
Modules/Job/
├── Job.tsx           # UI — table, search, action buttons
├── JobFormModal.tsx  # Form modal — create/edit
└── useDashboard.ts   # Custom hook — data fetching, state, handlers
```

Pages in `src/Page/` are thin wrappers that just render the module component. This keeps routing clean and components reusable.

---

### 8. Protected Routes

`ProtectedRoute` wraps all dashboard routes. It checks Redux auth state and redirects to `/login` if unauthenticated. The back button is also blocked from navigating back to protected pages after logout.

---

### 9. Layout System

`DashboardLayout` handles the shell — sidebar, header, footer, and the `<Outlet />` for nested routes. Sidebar toggle state lives here and controls body scroll lock on mobile.

---

## Module Overview

### Auth
- Login page with form validation
- Forgot/reset password flow
- Session handled via httpOnly cookies + refresh token rotation

### Dashboard
- Stats overview cards
- Quick summary of platform activity

### Shop Management
- List all shops with search + pagination
- Create / Edit shop via modal form
- Delete with confirmation dialog

### Job Management
- List all jobs with search + pagination
- Create / Edit job with rich fields (salary range, deadline, responsibilities)
- Delete with confirmation dialog

### CMS Management
- Create and edit content pages
- Rich text editor with formatting toolbar

---

## Code Quality

- **ESLint + Prettier** — enforced on every commit via Husky + lint-staged
- **TypeScript strict mode** — no implicit `any`
- **No unused dependencies** — clean `package.json`
- **Environment variables** — all secrets via `.env`, never hardcoded

---

## Deployment

Deployed on **Netlify**. The `netlify.toml` and `public/_redirects` handle SPA routing so direct URL access and page refreshes work correctly.
