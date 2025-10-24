#!/bin/bash

# Script setup production environment
# Sử dụng: ./scripts/setup-prod.sh

set -e

# Màu sắc cho output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function để in màu
print_color() {
    printf "${1}${2}${NC}\n"
}

print_color $BLUE "🚀 Bắt đầu setup production environment..."

# Kiểm tra xem có đang ở trong thư mục BE không
if [ ! -f "package.json" ]; then
    print_color $RED "❌ Lỗi: Không tìm thấy package.json. Vui lòng chạy script từ thư mục BE/"
    exit 1
fi

# 1. Cài đặt dependencies
print_color $BLUE "📦 Cài đặt dependencies..."
npm install

# 2. Tạo file .env từ env.prod
print_color $BLUE "⚙️  Tạo file .env cho production..."
if [ -f "env.prod" ]; then
    cp env.prod .env
    print_color $GREEN "✅ Đã tạo file .env từ env.prod"
else
    print_color $YELLOW "⚠️  Không tìm thấy env.prod, sử dụng env.example..."
    if [ -f "env.example" ]; then
        cp env.example .env
        print_color $GREEN "✅ Đã tạo file .env từ env.example"
    else
        print_color $RED "❌ Không tìm thấy env.example"
        exit 1
    fi
fi

# 3. Build application
print_color $BLUE "🔨 Build application..."
npm run build

# 4. Khởi động MongoDB và Redis cho production
print_color $BLUE "🐳 Khởi động MongoDB và Redis cho production..."
docker-compose -f docker-compose.prod.yml up -d mongodb-prod redis-prod

# 5. Đợi MongoDB khởi động
print_color $BLUE "⏳ Đợi MongoDB khởi động..."
sleep 10

# 6. Kiểm tra kết nối MongoDB
print_color $BLUE "🔍 Kiểm tra kết nối MongoDB..."
if docker exec cuatienphuot-mongodb-prod mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    print_color $GREEN "✅ MongoDB đã sẵn sàng"
else
    print_color $YELLOW "⚠️  MongoDB chưa sẵn sàng, đợi thêm..."
    sleep 5
fi

# 7. Chạy seed data cho production (chỉ lần đầu)
print_color $BLUE "🌱 Chạy seed data cho production (chỉ lần đầu)..."
npm run seed:prod

print_color $GREEN "🎉 Setup production environment hoàn thành!"
print_color $BLUE "📋 Thông tin kết nối:"
print_color $YELLOW "   MongoDB: localhost:27021"
print_color $YELLOW "   Redis: localhost:6380"
print_color $YELLOW "   Database: cuatienphuot_prod"
print_color $BLUE "🚀 Để start production server:"
print_color $YELLOW "   npm run start:prod"
print_color $BLUE "🐳 Hoặc sử dụng Docker:"
print_color $YELLOW "   docker-compose -f docker-compose.prod.yml up -d"
print_color $BLUE "🔑 Thông tin đăng nhập mẫu:"
print_color $YELLOW "   Email: admin@ctp.com | Password: Admin123"
print_color $YELLOW "   Email: john.doe@ctp.com | Password: Admin123"
