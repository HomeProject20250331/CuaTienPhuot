# 🚀 CuaTienPhuot Backend - Quick Start Guide

## 📋 Tóm tắt nhanh

### 🛠️ Development

```bash
# Setup lần đầu (tự động)
npm run setup:dev
npm run start:dev

# Development hàng ngày
npm run dev:db          # Khởi động DB
npm run start:dev       # Start server
npm run dev:db:down      # Dừng DB
```

### 🚀 Production

```bash
# Setup lần đầu (tự động)
npm run setup:prod
npm run start:prod

# Release mới (không tác động DB)
npm run release

# Production commands
npm run prod:db         # Khởi động DB
npm run prod:up         # Khởi động toàn bộ
npm run prod:down       # Dừng toàn bộ
```

## 🔧 Database Info

| Environment | MongoDB Port | Redis Port | Database Name     |
| ----------- | ------------ | ---------- | ----------------- |
| Development | 27020        | 6379       | cuatienphuot_dev  |
| Production  | 27021        | 6380       | cuatienphuot_prod |

## 📝 Commands Reference

### Development

- `npm run setup:dev` - Setup toàn bộ development
- `npm run dev:db` - Khởi động DB development
- `npm run dev:db:down` - Dừng DB development
- `npm run seed:dev` - Seed data development
- `npm run start:dev` - Start development server

### Production

- `npm run setup:prod` - Setup toàn bộ production
- `npm run prod:db` - Khởi động DB production
- `npm run prod:db:down` - Dừng DB production
- `npm run prod:up` - Khởi động toàn bộ production
- `npm run prod:down` - Dừng toàn bộ production
- `npm run release` - Release mới (không tác động DB)

### Seed Data

- `npm run seed:dev` - Seed data cho development
- `npm run seed:prod` - Seed data cho production (chỉ lần đầu)
- `npm run seed:test` - Test seed data

## 🔑 Login Info

**Test Accounts:**

- Email: `admin@ctp.com` | Password: `Admin123`
- Email: `john.doe@ctp.com` | Password: `Admin123`
- Email: `jane.smith@ctp.com` | Password: `Admin123`

## 🌐 URLs

- **API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/docs
- **Health**: http://localhost:3001/api/v1/health

## 🐳 Docker Commands

```bash
# Development
docker-compose -f docker-compose.dev.yml up -d
docker-compose -f docker-compose.dev.yml down

# Production
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.prod.yml down
```

## 🆘 Troubleshooting

```bash
# Reset development
npm run dev:db:down
npm run dev:db
npm run seed:dev
npm run start:dev

# Reset production
npm run prod:down
npm run prod:db
npm run seed:prod
npm run start:prod

# Check logs
docker logs cuatienphuot-mongodb-dev
docker logs cuatienphuot-mongodb-prod
```
