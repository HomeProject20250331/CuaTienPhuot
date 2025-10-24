# 2. Tech Stack & Architecture - CuaTienPhuot

## 2.1 Technology Stack

### Backend

- **Framework**: NestJS (Node.js)
- **Database**: MongoDB với Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **File Upload**: Multer
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Deployment**: Docker + PM2

### Frontend

- **Framework**: Next.js 14+ (App Router)
- **UI Library**: Shadcn/ui + Radix UI
- **Styling**: TailwindCSS
- **State Management**: Zustand + React Query
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form + Zod
- **Form Validation**: Zod schemas với react-hook-form resolver
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Deployment**: Vercel

### Infrastructure

- **Database Hosting**: MongoDB Atlas
- **File Storage**: AWS S3 hoặc Cloudinary
- **CDN**: Cloudflare
- **Monitoring**: Sentry
- **Analytics**: Google Analytics
- **Email Service**: SendGrid hoặc AWS SES

## 2.2 System Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (NestJS)      │◄──►│   (MongoDB)     │
│                 │    │                 │    │                 │
│ - React UI      │    │ - REST APIs     │    │ - Users         │
│ - State Mgmt    │    │ - Authentication│    │ - Groups        │
│ - Routing       │    │ - Business Logic│    │ - Expenses      │
│ - Components    │    │ - Validation    │    │ - Settlements   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN           │    │   File Storage  │    │   External      │
│   (Cloudflare)  │    │   (AWS S3)      │    │   Services      │
│                 │    │                 │    │                 │
│ - Static Assets │    │ - Receipt Images│    │ - Email Service │
│ - Caching       │    │ - User Avatars  │    │ - Notifications │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### API Architecture

```
Frontend (Next.js)
    │
    ├── API Routes (/api/*)
    │   ├── Authentication Middleware
    │   ├── Rate Limiting
    │   └── Error Handling
    │
    └── Backend Services (NestJS)
        ├── Auth Module
        ├── Users Module
        ├── Groups Module
        ├── Expenses Module
        ├── Settlements Module
        ├── Notifications Module
        └── Statistics Module
```

## 2.3 Folder Structure

### Backend Structure (NestJS)

```
backend/
├── src/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts
│   │   │   └── local.strategy.ts
│   │   └── guards/
│   │       └── jwt-auth.guard.ts
│   ├── users/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.module.ts
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   └── update-user.dto.ts
│   │   └── schemas/
│   │       └── user.schema.ts
│   ├── groups/
│   │   ├── groups.controller.ts
│   │   ├── groups.service.ts
│   │   ├── groups.module.ts
│   │   ├── dto/
│   │   └── schemas/
│   ├── expenses/
│   ├── settlements/
│   ├── notifications/
│   ├── statistics/
│   ├── common/
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── pipes/
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── app.config.ts
│   ├── app.module.ts
│   └── main.ts
├── test/
├── docs/
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── package.json
├── tsconfig.json
├── nest-cli.json
└── .env.example
```

### Frontend Structure (Next.js)

```
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── groups/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       ├── expenses/
│   │   │       │   └── page.tsx
│   │   │       ├── balances/
│   │   │       │   └── page.tsx
│   │   │       └── stats/
│   │   │           └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   ├── forms/
│   │   │   ├── login-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   ├── create-group-form.tsx
│   │   │   └── add-expense-form.tsx
│   │   ├── layout/
│   │   │   ├── header.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── footer.tsx
│   │   ├── modals/
│   │   │   ├── create-group-modal.tsx
│   │   │   ├── add-expense-modal.tsx
│   │   │   └── settle-debt-modal.tsx
│   │   └── charts/
│   │       ├── expense-chart.tsx
│   │       └── category-chart.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── utils.ts
│   │   └── validations.ts
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   ├── use-groups.ts
│   │   └── use-expenses.ts
│   ├── store/
│   │   ├── auth-store.ts
│   │   ├── groups-store.ts
│   │   └── expenses-store.ts
│   └── types/
│       ├── auth.ts
│       ├── group.ts
│       ├── expense.ts
│       └── user.ts
├── public/
│   ├── images/
│   └── icons/
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── .env.local.example
```

## 2.4 Database Design

### MongoDB Collections Overview

```
MongoDB Database: cuatienphuot
├── users
├── groups
├── expenses
├── settlements
├── notifications
└── payment_formulas
```

## 2.5 Security Architecture

### Authentication Flow

```
1. User đăng nhập với email/password
2. Backend verify credentials
3. Generate JWT token với user info
4. Frontend store token trong localStorage
5. Mỗi API request gửi token trong Authorization header
6. Backend verify token và extract user info
```

### Security Measures

- **Password Hashing**: bcrypt với salt rounds = 12
- **JWT Expiration**: Access token 1 giờ, Refresh token 7 ngày
- **Rate Limiting**: 100 requests/phút per IP
- **Input Validation**: Zod schemas cho tất cả inputs
- **CORS**: Chỉ cho phép domain frontend
- **HTTPS**: Bắt buộc cho tất cả communications
- **File Upload**: Chỉ cho phép image files và PDF, max 5MB

## 2.6 Performance Considerations

### Backend Optimization

- **Database Indexing**: Index trên các field thường query
- **Caching**: Redis cho session và frequent queries
- **Pagination**: Limit 50 items per page
- **Lazy Loading**: Load related data khi cần
- **Connection Pooling**: MongoDB connection pool

### Frontend Optimization

- **Code Splitting**: Dynamic imports cho các page lớn
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Webpack bundle analyzer
- **CDN**: Static assets qua Cloudflare
- **Caching**: Service worker cho offline support

## 2.7 Deployment Architecture

### Production Environment

```
Internet
    │
    ├── Cloudflare CDN
    │   ├── Static Assets
    │   └── Caching
    │
    ├── Vercel (Frontend)
    │   ├── Next.js App
    │   └── Serverless Functions
    │
    └── AWS/DigitalOcean (Backend)
        ├── NestJS API
        ├── MongoDB Atlas
        ├── AWS S3 (File Storage)
        └── SendGrid (Email Service)
```

### Development Environment

```
Local Development
├── Frontend: localhost:3000 (Next.js dev server)
├── Backend: localhost:3001 (NestJS dev server)
└── Database: MongoDB Atlas (development cluster)
```
