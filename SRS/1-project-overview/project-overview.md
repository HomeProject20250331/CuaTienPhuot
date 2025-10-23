# 1. Tổng quan dự án - CuaTienPhuot

## 1.1 Giới thiệu ứng dụng

CuaTienPhuot là một ứng dụng web được thiết kế để giúp các nhóm du lịch quản lý và chia sẻ chi phí một cách minh bạch và công bằng. Ứng dụng cho phép người dùng tạo nhóm du lịch, theo dõi các khoản chi tiêu, tính toán công nợ và thực hiện thanh toán giữa các thành viên.

## 1.2 Vấn đề cần giải quyết

### Vấn đề hiện tại:

- **Thiếu minh bạch**: Khó theo dõi ai đã trả tiền gì và ai còn nợ ai
- **Tính toán phức tạp**: Việc chia tiền thủ công dễ sai sót, đặc biệt với nhóm lớn
- **Thiếu lưu trữ**: Không có hệ thống lưu trữ hóa đơn và lịch sử chi tiêu
- **Khó thống kê**: Không có báo cáo tổng quan về chi phí du lịch
- **Thiếu đồng bộ**: Thông tin không được cập nhật real-time giữa các thành viên

### Giải pháp của CuaTienPhuot:

- Hệ thống quản lý chi tiêu tập trung với real-time sync
- Thuật toán tự động tính toán công nợ
- Lưu trữ hóa đơn và lịch sử chi tiêu
- Báo cáo thống kê chi tiết
- Thông báo tự động cho các hoạt động quan trọng

## 1.3 Target Users (Người dùng mục tiêu)

### Primary Users:

- **Nhóm du lịch nhỏ (2-10 người)**: Bạn bè, gia đình đi du lịch ngắn hạn
- **Nhóm du lịch trung bình (10-50 người)**: Công ty, câu lạc bộ đi du lịch team building
- **Nhóm du lịch lớn (50+ người)**: Tour du lịch, sự kiện tập thể

### User Personas:

#### Persona 1: Người tổ chức du lịch (Travel Organizer)

- **Độ tuổi**: 25-40
- **Nghề nghiệp**: Nhân viên văn phòng, freelancer
- **Pain points**: Cần quản lý chi phí cho nhiều người, muốn minh bạch
- **Goals**: Tạo nhóm, mời thành viên, theo dõi chi tiêu tổng thể

#### Persona 2: Thành viên nhóm (Group Member)

- **Độ tuổi**: 20-50
- **Nghề nghiệp**: Đa dạng
- **Pain points**: Muốn biết mình nợ/được nợ bao nhiêu, muốn thanh toán nhanh
- **Goals**: Xem công nợ cá nhân, thanh toán, xem lịch sử chi tiêu

#### Persona 3: Người quản lý tài chính (Finance Manager)

- **Độ tuổi**: 30-45
- **Nghề nghiệp**: Kế toán, quản lý
- **Pain points**: Cần báo cáo chi tiết, xuất dữ liệu
- **Goals**: Tạo báo cáo, export dữ liệu, phân tích chi phí

## 1.4 Phạm vi dự án (Project Scope)

### In Scope (Trong phạm vi):

- ✅ Quản lý người dùng và authentication
- ✅ Quản lý nhóm du lịch
- ✅ Quản lý chi tiêu và hóa đơn
- ✅ Tính toán công nợ tự động
- ✅ Hệ thống thanh toán
- ✅ Thống kê và báo cáo
- ✅ Thông báo real-time
- ✅ Responsive web app
- ✅ Hỗ trợ đa ngôn ngữ (Tiếng Việt)

### Out of Scope (Ngoài phạm vi):

- ❌ Ứng dụng mobile native (chỉ Progressive Web App)
- ❌ Tích hợp ngân hàng/thanh toán thực tế
- ❌ Quản lý booking khách sạn/vé máy bay
- ❌ Tích hợp với các ứng dụng du lịch khác
- ❌ Hỗ trợ đa tiền tệ (chỉ VND)
- ❌ Quản lý tài sản chung (xe, thiết bị)

### In Scope - Progressive Web App (PWA):

- ✅ Cài đặt trên home screen như native app
- ✅ Hoạt động offline với cached data
- ✅ Push notifications
- ✅ App-like navigation và UX
- ✅ Responsive design cho tất cả devices

## 1.5 Lợi ích dự kiến

### Cho người dùng:

- Tiết kiệm thời gian tính toán chi phí
- Tăng tính minh bạch trong quản lý tài chính nhóm
- Giảm xung đột về tiền bạc trong nhóm
- Dễ dàng theo dõi và quản lý chi tiêu

### Cho dự án:

- Tạo ra sản phẩm hữu ích cho cộng đồng du lịch Việt Nam
- Có tiềm năng mở rộng và phát triển thêm tính năng
- Có thể monetize thông qua premium features

## 1.6 Success Metrics

### Technical Metrics:

- Thời gian phản hồi API < 500ms
- Thời gian tải trang < 2s
- Uptime > 99.9%
- Hỗ trợ 10,000+ users đồng thời

### Business Metrics:

- 1,000+ users đăng ký trong 3 tháng đầu
- 100+ nhóm du lịch hoạt động
- 10,000+ chi tiêu được ghi nhận
- 90%+ user satisfaction rating
