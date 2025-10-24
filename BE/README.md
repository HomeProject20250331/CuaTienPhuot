# CuaTienPhuot Backend API

Backend API cho ứng dụng CuaTienPhuot - Quản lý chi tiêu nhóm du lịch.

## 🚀 Tech Stack

- **Framework**: NestJS (Node.js)
- **Database**: MongoDB với Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **File Upload**: Multer
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Deployment**: Docker

## 📋 Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Git

## 🛠️ Quick Start

### Development

```bash
# Clone repository
git clone <repository-url>
cd CuaTienPhuot/BE

# Setup toàn bộ development environment
npm run setup:dev
npm run start:dev
```

### Production

```bash
# Setup toàn bộ production environment
npm run setup:prod
npm run start:prod
```

> 📖 Xem [QUICK_START.md](./QUICK_START.md) để biết thêm chi tiết về các lệnh.

## 📋 Commands Reference

### Development Commands

```bash
# Setup toàn bộ development environment
npm run setup:dev

# Khởi động DB development
npm run dev:db

# Dừng DB development
npm run dev:db:down

# Seed data development
npm run seed:dev

# Start development server
npm run start:dev
```

### Production Commands

```bash
# Setup toàn bộ production environment
npm run setup:prod

# Khởi động DB production
npm run prod:db

# Dừng DB production
npm run prod:db:down

# Khởi động toàn bộ production (DB + Backend + Nginx)
npm run prod:up

# Dừng toàn bộ production
npm run prod:down

# Release mới (build + deploy)
npm run release
```

### Seed Data Commands

```bash
# Seed data cho development
npm run seed:dev

# Seed data cho production (chỉ lần đầu)
npm run seed:prod

# Test seed data
npm run seed:test
```

## 🐳 Docker Configuration

### Development Environment

- **MongoDB**: `localhost:27020` → Database: `cuatienphuot_dev`
- **Redis**: `localhost:6379`

```bash
# Khởi động development environment
npm run dev:db

# Kết nối MongoDB shell
docker exec -it cuatienphuot-mongodb-dev mongosh -u admin -p admin123 --authenticationDatabase admin
```

### Production Environment

- **MongoDB**: `localhost:27021` → Database: `cuatienphuot_prod`
- **Redis**: `localhost:6380`

```bash
# Khởi động production environment
npm run prod:up

# Kết nối MongoDB shell
docker exec -it cuatienphuot-mongodb-prod mongosh -u admin -p admin123 --authenticationDatabase admin
```

### Manual Docker Commands

```bash
# Build image
docker build -t cuatienphuot-backend:latest .

# Run container
docker run -p 3001:3001 cuatienphuot-backend:latest

# Development compose
docker-compose -f docker-compose.dev.yml up -d

# Production compose
docker-compose -f docker-compose.prod.yml up -d
```

## 🔄 Workflows

### Development Workflow

```bash
# Setup lần đầu
npm run setup:dev
npm run start:dev

# Development hàng ngày
npm run dev:db      # Khởi động DB nếu chưa chạy
npm run start:dev    # Start development server

# Dừng development
# Ctrl+C để dừng server
npm run dev:db:down  # Dừng DB nếu cần
```

### Production Workflow

```bash
# Setup lần đầu
npm run setup:prod
npm run start:prod

# Release mới
npm run release     # Không tác động DB

# Dừng production
npm run prod:down
```

### Database Management

| Environment | Port  | Database            | Reset Command                     |
| ----------- | ----- | ------------------- | --------------------------------- |
| Development | 27020 | `cuatienphuot_dev`  | `npm run seed:dev`                |
| Production  | 27021 | `cuatienphuot_prod` | `npm run seed:prod` (chỉ lần đầu) |

### 🛠️ Troubleshooting

```bash
# Reset development
npm run dev:db:down && npm run dev:db && npm run seed:dev && npm run start:dev

# Reset production
npm run prod:down && npm run prod:db && npm run seed:prod && npm run start:prod

# Check logs
docker logs cuatienphuot-mongodb-dev
docker logs cuatienphuot-mongodb-prod
```

## 📚 API Documentation

- **Development**: http://localhost:3001/api/docs
- **Production**: http://your-domain/api/docs

## 🧪 Testing

```bash
npm run test        # Unit tests
npm run test:e2e    # E2E tests
npm run test:cov    # Test coverage
```

## 📁 Project Structure

```
src/
├── auth/           # Authentication module
├── users/          # Users module
├── groups/         # Groups module
├── expenses/       # Expenses module
├── settlements/    # Settlements module
├── notifications/  # Notifications module
├── statistics/     # Statistics module
├── schemas/        # Mongoose schemas
├── common/         # Common utilities
├── config/         # Configuration files
├── app.module.ts
└── main.ts
```

## 🔐 Authentication

API sử dụng JWT authentication:

- **Register**: `POST /api/v1/auth/register`
- **Login**: `POST /api/v1/auth/login`
- **Refresh Token**: `POST /api/v1/auth/refresh`
- **Forgot Password**: `POST /api/v1/auth/forgot-password`
- **Reset Password**: `POST /api/v1/auth/reset-password`

Tất cả các endpoint khác yêu cầu Bearer token trong header:

```
Authorization: Bearer <your-jwt-token>
```

## 📊 Database

### Collections

- **Users**: Thông tin người dùng
- **Groups**: Nhóm du lịch
- **Expenses**: Chi tiêu
- **Settlements**: Thanh toán
- **Notifications**: Thông báo
- **PaymentFormulas**: Công thức chia tiền
- **CalculationCache**: Cache tính toán

### Relationships

- User ↔ Group (Many-to-Many)
- Group → Expense (One-to-Many)
- User → Expense (Many-to-Many)
- Group → Settlement (One-to-Many)
- User → Notification (One-to-Many)

## 🧮 Payment Calculation

Hệ thống hỗ trợ 3 loại chia tiền:

1. **Equal Split**: Chia đều
2. **Proportional Split**: Chia theo tỷ lệ
3. **Custom Split**: Chia tùy chỉnh

## 🔧 Configuration

Environment variables được cấu hình trong:

- **Development**: `env.dev`
- **Production**: `env.prod`

## 🚀 Deployment

### Production Checklist

- [ ] Set strong JWT secrets
- [ ] Configure MongoDB with authentication
- [ ] Set up Redis with password
- [ ] Configure CORS origins
- [ ] Set up SSL certificates
- [ ] Configure rate limiting
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

Nếu gặp vấn đề, vui lòng tạo issue hoặc liên hệ team phát triển.

## 📞 Contact

- **Email**: support@cuatienphuot.com
- **Website**: https://cuatienphuot.com
- **Documentation**: https://docs.cuatienphuot.com
