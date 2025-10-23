# CuaTienPhuot Frontend

Ứng dụng frontend cho CuaTienPhuot - Ứng dụng chia tiền chi tiêu nhóm du lịch.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **UI Library**: Shadcn/ui + Radix UI
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Cấu trúc dự án

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/               # Dashboard route group
│   │   ├── dashboard/
│   │   ├── groups/
│   │   └── profile/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/                   # Reusable components
│   ├── ui/                      # Shadcn/ui components
│   ├── layout/                  # Layout components
│   ├── forms/                   # Form components
│   ├── data-display/            # Data display components
│   ├── modals/                  # Modal components
│   └── notifications/           # Notification components
├── hooks/                       # Custom hooks
├── lib/                         # Utilities & helpers
├── store/                       # Zustand stores
├── types/                      # TypeScript types
└── constants/                   # App constants
```

## Cài đặt

1. Cài đặt dependencies:

```bash
npm install
```

2. Tạo file `.env.local` từ `.env.local.example`:

```bash
cp .env.local.example .env.local
```

3. Cập nhật các biến môi trường trong `.env.local`

4. Chạy development server:

```bash
npm run dev
```

## Scripts

- `npm run dev` - Chạy development server
- `npm run build` - Build production
- `npm run start` - Chạy production server
- `npm run lint` - Chạy ESLint
- `npm run type-check` - Kiểm tra TypeScript

## Tính năng

### Đã hoàn thành

- ✅ Cấu trúc dự án cơ bản
- ✅ UI components (Button, Input, Card, Label)
- ✅ Layout system
- ✅ Landing page
- ✅ Authentication pages (Login, Register)
- ✅ Dashboard page
- ✅ TypeScript types
- ✅ Zustand store setup

### Đang phát triển

- 🔄 Form components
- 🔄 Data display components
- 🔄 Modal components
- 🔄 API integration
- 🔄 Authentication flow
- 🔄 Group management
- 🔄 Expense management

## Cấu hình

### TailwindCSS

Dự án sử dụng TailwindCSS với cấu hình tùy chỉnh cho Shadcn/ui components.

### Shadcn/ui

Các component UI được xây dựng trên Radix UI primitives với styling bằng TailwindCSS.

### State Management

Sử dụng Zustand cho state management với persistence middleware.

## Development

### Code Standards

- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Component-based architecture

### Component Development

- Sử dụng TypeScript cho type safety
- Props interface cho mỗi component
- Responsive design với TailwindCSS
- Accessibility compliance

## Deployment

Dự án được deploy trên Vercel với:

- Automatic deployments từ main branch
- Environment variables configuration
- Build optimization
- CDN cho static assets
