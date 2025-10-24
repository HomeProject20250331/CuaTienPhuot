#!/bin/bash

# Script release production
# Sử dụng: ./scripts/release.sh

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

print_color $BLUE "🚀 Bắt đầu release production..."

# Kiểm tra xem có đang ở trong thư mục BE không
if [ ! -f "package.json" ]; then
    print_color $RED "❌ Lỗi: Không tìm thấy package.json. Vui lòng chạy script từ thư mục BE/"
    exit 1
fi

# 1. Build application
print_color $BLUE "🔨 Build application..."
npm run build

# 2. Kiểm tra xem MongoDB production có đang chạy không
print_color $BLUE "🔍 Kiểm tra MongoDB production..."
if docker ps | grep -q "cuatienphuot-mongodb-prod"; then
    print_color $GREEN "✅ MongoDB production đang chạy"
else
    print_color $YELLOW "⚠️  MongoDB production chưa chạy, khởi động..."
    docker-compose -f docker-compose.prod.yml up -d mongodb-prod redis-prod
    sleep 10
fi

# 3. Build Docker image
print_color $BLUE "🐳 Build Docker image..."
docker build -t cuatienphuot-backend:latest .

# 4. Stop existing backend container nếu có
print_color $BLUE "🛑 Stop existing backend container..."
if docker ps | grep -q "cuatienphuot-backend-prod"; then
    docker stop cuatienphuot-backend-prod
    docker rm cuatienphuot-backend-prod
fi

# 5. Start backend container mới
print_color $BLUE "🚀 Start backend container mới..."
docker-compose -f docker-compose.prod.yml up -d backend-prod

# 6. Kiểm tra health
print_color $BLUE "🔍 Kiểm tra health của backend..."
sleep 5
if curl -f http://localhost:3001/api/v1/health > /dev/null 2>&1; then
    print_color $GREEN "✅ Backend đã sẵn sàng"
else
    print_color $YELLOW "⚠️  Backend chưa sẵn sàng, kiểm tra logs..."
    docker logs cuatienphuot-backend-prod
fi

print_color $GREEN "🎉 Release production hoàn thành!"
print_color $BLUE "📋 Thông tin:"
print_color $YELLOW "   Backend: http://localhost:3001"
print_color $YELLOW "   API Docs: http://localhost:3001/api/docs"
print_color $YELLOW "   Health: http://localhost:3001/api/v1/health"
print_color $BLUE "🔍 Để xem logs:"
print_color $YELLOW "   docker logs cuatienphuot-backend-prod"
print_color $BLUE "🛑 Để stop:"
print_color $YELLOW "   docker-compose -f docker-compose.prod.yml down"
