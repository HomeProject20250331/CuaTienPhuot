# Epic 1: Quản lý người dùng

## Tổng quan Epic

Epic này bao gồm tất cả các chức năng liên quan đến quản lý tài khoản người dùng, từ đăng ký, đăng nhập đến quản lý thông tin cá nhân và bảo mật tài khoản.

## User Stories

### US-001: Đăng ký tài khoản mới

**Là một người dùng mới**  
**Tôi muốn đăng ký tài khoản**  
**Để có thể sử dụng ứng dụng chia tiền du lịch**

#### Acceptance Criteria:

- **Given** tôi là người dùng chưa có tài khoản
- **When** tôi truy cập trang đăng ký và điền thông tin
- **Then** tôi có thể tạo tài khoản thành công

#### Chi tiết chức năng:

- Form đăng ký với các trường: Email, Mật khẩu, Xác nhận mật khẩu, Họ tên
- Validation email format và độ mạnh mật khẩu
- Gửi email xác thực sau khi đăng ký
- Tự động đăng nhập sau khi đăng ký thành công

#### UI/UX Requirements:

- Form đăng ký đơn giản, rõ ràng
- Hiển thị lỗi validation real-time
- Loading state khi đang xử lý
- Link chuyển đến trang đăng nhập

#### Validation Rules:

- Email: Format hợp lệ, chưa tồn tại trong hệ thống
- Mật khẩu: Tối thiểu 8 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường, 1 số
- Họ tên: Không được rỗng, tối đa 100 ký tự
- Xác nhận mật khẩu: Phải khớp với mật khẩu

#### Error Handling:

- Email đã tồn tại: "Email này đã được sử dụng"
- Mật khẩu yếu: "Mật khẩu phải có ít nhất 8 ký tự..."
- Lỗi server: "Có lỗi xảy ra, vui lòng thử lại"

---

### US-002: Đăng nhập vào hệ thống

**Là một người dùng đã có tài khoản**  
**Tôi muốn đăng nhập vào hệ thống**  
**Để truy cập các chức năng của ứng dụng**

#### Acceptance Criteria:

- **Given** tôi đã có tài khoản hợp lệ
- **When** tôi nhập email và mật khẩu đúng
- **Then** tôi được chuyển đến dashboard chính

#### Chi tiết chức năng:

- Form đăng nhập với Email và Mật khẩu
- Lưu trạng thái đăng nhập (Remember me)
- Redirect đến trang trước đó sau khi đăng nhập
- Hiển thị thông báo lỗi rõ ràng

#### UI/UX Requirements:

- Form đăng nhập gọn gàng, tập trung
- Checkbox "Ghi nhớ đăng nhập"
- Link "Quên mật khẩu"
- Link chuyển đến trang đăng ký

#### Validation Rules:

- Email: Format hợp lệ, bắt buộc
- Mật khẩu: Bắt buộc, tối thiểu 1 ký tự

#### Error Handling:

- Thông tin đăng nhập sai: "Email hoặc mật khẩu không đúng"
- Tài khoản chưa xác thực: "Vui lòng xác thực email trước khi đăng nhập"
- Tài khoản bị khóa: "Tài khoản đã bị khóa, liên hệ hỗ trợ"

---

### US-003: Đăng xuất khỏi hệ thống

**Là một người dùng đã đăng nhập**  
**Tôi muốn đăng xuất khỏi hệ thống**  
**Để bảo mật tài khoản khi sử dụng chung thiết bị**

#### Acceptance Criteria:

- **Given** tôi đã đăng nhập vào hệ thống
- **When** tôi click nút đăng xuất
- **Then** tôi được chuyển về trang chủ và phiên đăng nhập bị hủy

#### Chi tiết chức năng:

- Nút đăng xuất trong menu user
- Xóa token khỏi localStorage
- Redirect về trang chủ
- Hiển thị thông báo đăng xuất thành công

#### UI/UX Requirements:

- Nút đăng xuất rõ ràng trong dropdown menu
- Confirmation dialog trước khi đăng xuất
- Toast notification "Đăng xuất thành công"

---

### US-004: Quản lý thông tin profile

**Là một người dùng đã đăng nhập**  
**Tôi muốn cập nhật thông tin cá nhân**  
**Để các thành viên khác có thể nhận diện tôi**

#### Acceptance Criteria:

- **Given** tôi đã đăng nhập vào hệ thống
- **When** tôi truy cập trang profile và cập nhật thông tin
- **Then** thông tin được lưu và hiển thị trong các nhóm

#### Chi tiết chức năng:

- Form chỉnh sửa: Họ tên, Số điện thoại, Ngày sinh
- Upload ảnh đại diện
- Preview ảnh trước khi lưu
- Lưu thay đổi real-time

#### UI/UX Requirements:

- Form profile với layout 2 cột
- Upload ảnh với drag & drop
- Preview ảnh đại diện hiện tại
- Nút "Lưu" và "Hủy" rõ ràng

#### Validation Rules:

- Họ tên: Bắt buộc, tối đa 100 ký tự
- Số điện thoại: Format Việt Nam (10-11 số)
- Ngày sinh: Không được trong tương lai
- Ảnh đại diện: JPG/PNG/PDF, tối đa 5MB

#### Error Handling:

- Lỗi upload ảnh: "File ảnh không hợp lệ"
- Lỗi lưu thông tin: "Không thể lưu thông tin, thử lại"

---

### US-005: Đổi mật khẩu

**Là một người dùng đã đăng nhập**  
**Tôi muốn đổi mật khẩu**  
**Để bảo mật tài khoản tốt hơn**

#### Acceptance Criteria:

- **Given** tôi đã đăng nhập vào hệ thống
- **When** tôi nhập mật khẩu cũ và mật khẩu mới
- **Then** mật khẩu được cập nhật và tôi phải đăng nhập lại

#### Chi tiết chức năng:

- Form đổi mật khẩu: Mật khẩu cũ, Mật khẩu mới, Xác nhận mật khẩu mới
- Validation mật khẩu cũ
- Validation độ mạnh mật khẩu mới
- Đăng xuất tự động sau khi đổi mật khẩu

#### UI/UX Requirements:

- Form đổi mật khẩu trong modal hoặc trang riêng
- Hiển thị độ mạnh mật khẩu real-time
- Nút "Hiện/Ẩn mật khẩu" cho từng trường

#### Validation Rules:

- Mật khẩu cũ: Phải đúng với mật khẩu hiện tại
- Mật khẩu mới: Tối thiểu 8 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường, 1 số
- Xác nhận mật khẩu: Phải khớp với mật khẩu mới

#### Error Handling:

- Mật khẩu cũ sai: "Mật khẩu cũ không đúng"
- Mật khẩu mới yếu: "Mật khẩu mới không đủ mạnh"
- Lỗi server: "Không thể đổi mật khẩu, thử lại"

---

### US-006: Quên mật khẩu

**Là một người dùng đã có tài khoản**  
**Tôi muốn reset mật khẩu**  
**Khi tôi quên mật khẩu đăng nhập**

#### Acceptance Criteria:

- **Given** tôi quên mật khẩu đăng nhập
- **When** tôi nhập email và yêu cầu reset mật khẩu
- **Then** tôi nhận được email hướng dẫn reset mật khẩu

#### Chi tiết chức năng:

- Form nhập email để reset mật khẩu
- Gửi email chứa link reset mật khẩu
- Link reset có thời hạn 1 giờ
- Form nhập mật khẩu mới sau khi click link

#### UI/UX Requirements:

- Form đơn giản chỉ có trường email
- Thông báo "Kiểm tra email để reset mật khẩu"
- Link "Quay lại đăng nhập"

#### Validation Rules:

- Email: Format hợp lệ, phải tồn tại trong hệ thống

#### Error Handling:

- Email không tồn tại: "Email này chưa được đăng ký"
- Lỗi gửi email: "Không thể gửi email, thử lại sau"
- Link hết hạn: "Link reset mật khẩu đã hết hạn"

---

### US-007: Xác thực email

**Là một người dùng mới đăng ký**  
**Tôi muốn xác thực email**  
**Để kích hoạt tài khoản và nhận thông báo**

#### Acceptance Criteria:

- **Given** tôi vừa đăng ký tài khoản mới
- **When** tôi click link xác thực trong email
- **Then** tài khoản được kích hoạt và tôi có thể đăng nhập\*\*

#### Chi tiết chức năng:

- Gửi email xác thực sau khi đăng ký
- Link xác thực có thời hạn 24 giờ
- Tự động đăng nhập sau khi xác thực thành công
- Gửi lại email xác thực nếu cần

#### UI/UX Requirements:

- Trang xác thực email với thông báo rõ ràng
- Nút "Gửi lại email xác thực"
- Link "Quay lại đăng nhập"

#### Error Handling:

- Link không hợp lệ: "Link xác thực không hợp lệ"
- Link hết hạn: "Link xác thực đã hết hạn, gửi lại email mới"
- Email đã được xác thực: "Email đã được xác thực trước đó"

## Technical Requirements

### API Endpoints:

- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `POST /api/auth/refresh-token` - Làm mới token
- `POST /api/auth/forgot-password` - Quên mật khẩu
- `POST /api/auth/reset-password` - Reset mật khẩu
- `POST /api/auth/verify-email` - Xác thực email
- `GET /api/users/me` - Lấy thông tin user
- `PUT /api/users/me` - Cập nhật thông tin user
- `PUT /api/users/me/password` - Đổi mật khẩu
- `POST /api/users/me/avatar` - Upload ảnh đại diện

### Database Operations:

- Tạo user mới với thông tin cơ bản
- Hash mật khẩu với bcrypt (salt rounds = 12)
- Tạo và verify JWT tokens
- Lưu trữ email verification tokens
- Lưu trữ password reset tokens
- Cập nhật thông tin user profile

### Security Requirements:

- Mã hóa mật khẩu với bcrypt
- JWT token với expiration time
- Rate limiting cho các API đăng nhập
- Validation input để tránh injection
- HTTPS cho tất cả communications
- Email verification trước khi sử dụng

### Performance Requirements:

- API response time < 500ms
- Email gửi trong vòng 30 giây
- Hỗ trợ 1000+ concurrent users
- Cache user session để giảm database queries

## Dependencies

### Frontend Dependencies:

- React Hook Form cho form handling
- Zod cho validation
- Axios cho API calls
- React Router cho navigation
- Toast notifications cho feedback

### Backend Dependencies:

- NestJS framework
- MongoDB với Mongoose
- bcrypt cho password hashing
- JWT cho authentication
- Nodemailer cho gửi email
- class-validator cho validation

### External Services:

- Email service (SendGrid/AWS SES)
- File storage (AWS S3/Cloudinary) cho ảnh đại diện
- CDN cho static assets
