#!/bin/bash

# Script để chạy seed data
# Sử dụng: ./seed.sh [dev|prod|test]

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

# Kiểm tra tham số
ENV=${1:-dev}

# Nếu là test, chạy script test
if [ "$ENV" = "test" ]; then
    print_color $BLUE "🔍 Kiểm tra dữ liệu seed..."
    cd scripts
    npx ts-node test-seed.ts
    exit 0
fi

print_color $BLUE "🌱 Bắt đầu chạy seed data cho môi trường: $ENV"

# Kiểm tra xem có đang ở trong thư mục BE không
if [ ! -f "package.json" ]; then
    print_color $RED "❌ Lỗi: Không tìm thấy package.json. Vui lòng chạy script từ thư mục BE/"
    exit 1
fi

# Kiểm tra xem có file .env không
if [ ! -f ".env" ]; then
    print_color $YELLOW "⚠️  Cảnh báo: Không tìm thấy file .env. Vui lòng tạo file .env từ env.example"
    if [ -f "env.example" ]; then
        print_color $BLUE "💡 Gợi ý: cp env.example .env"
    fi
fi

# Cài đặt dependencies nếu cần
if [ ! -d "node_modules" ]; then
    print_color $BLUE "📦 Cài đặt dependencies..."
    npm install
fi

# Build project nếu cần
if [ ! -d "dist" ]; then
    print_color $BLUE "🔨 Build project..."
    npm run build
fi

# Chạy seed data
print_color $BLUE "🚀 Chạy seed data..."

# Chuyển đến thư mục scripts
cd scripts

# Chạy script seed
if [ "$ENV" = "prod" ]; then
    NODE_ENV=production npx ts-node seed-data.ts
else
    NODE_ENV=development npx ts-node seed-data.ts
fi

print_color $GREEN "✅ Hoàn thành seed data!"
print_color $BLUE "🔑 Thông tin đăng nhập mẫu:"
print_color $YELLOW "   Email: admin@ctp.com | Password: Admin123"
print_color $YELLOW "   Email: john.doe@ctp.com | Password: Admin123"
print_color $YELLOW "   Email: jane.smith@ctp.com | Password: Admin123"
print_color $YELLOW "   Email: bob.wilson@ctp.com | Password: Admin123"
print_color $YELLOW "   Email: alice.brown@ctp.com | Password: Admin123"
