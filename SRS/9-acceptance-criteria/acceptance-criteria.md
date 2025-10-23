# Acceptance Criteria - Ứng dụng CuaTienPhuot

## Tổng quan

Tài liệu này mô tả các tiêu chí chấp nhận (Acceptance Criteria) cho tất cả các tính năng trong ứng dụng CuaTienPhuot. Các tiêu chí này đảm bảo rằng mỗi tính năng được phát triển đúng yêu cầu và đáp ứng kỳ vọng của người dùng.

## 1. User Management - Tiêu chí chấp nhận

### 1.1 User Registration (Đăng ký người dùng)

#### AC-001: Đăng ký tài khoản mới

**Given** người dùng chưa có tài khoản
**When** họ nhập thông tin đăng ký hợp lệ
**Then** hệ thống tạo tài khoản mới và gửi email xác thực

**Chi tiết:**

- [ ] Form đăng ký có các trường: email, password, confirm password, full name
- [ ] Email phải có format hợp lệ
- [ ] Password tối thiểu 8 ký tự, có chữ hoa, chữ thường, số
- [ ] Confirm password phải khớp với password
- [ ] Full name không được để trống
- [ ] Hệ thống gửi email xác thực sau khi đăng ký
- [ ] Tài khoản chưa được kích hoạt cho đến khi xác thực email

#### AC-002: Validation đăng ký

**Given** người dùng nhập thông tin không hợp lệ
**When** họ submit form đăng ký
**Then** hệ thống hiển thị lỗi validation

**Chi tiết:**

- [ ] Email đã tồn tại → "Email này đã được sử dụng"
- [ ] Email không đúng format → "Email không hợp lệ"
- [ ] Password quá ngắn → "Mật khẩu phải có ít nhất 8 ký tự"
- [ ] Password không có chữ hoa → "Mật khẩu phải có ít nhất 1 chữ hoa"
- [ ] Password không khớp → "Mật khẩu xác nhận không khớp"
- [ ] Full name trống → "Họ tên không được để trống"

### 1.2 User Login (Đăng nhập)

#### AC-003: Đăng nhập thành công

**Given** người dùng có tài khoản đã kích hoạt
**When** họ nhập email và password đúng
**Then** hệ thống đăng nhập và chuyển hướng đến dashboard

**Chi tiết:**

- [ ] Form đăng nhập có trường email và password
- [ ] Hệ thống validate thông tin đăng nhập
- [ ] Sau khi đăng nhập thành công, tạo JWT token
- [ ] Chuyển hướng đến trang dashboard
- [ ] Hiển thị thông tin người dùng trên header

#### AC-004: Đăng nhập thất bại

**Given** người dùng nhập thông tin sai
**When** họ submit form đăng nhập
**Then** hệ thống hiển thị thông báo lỗi

**Chi tiết:**

- [ ] Email không tồn tại → "Email không tồn tại"
- [ ] Password sai → "Mật khẩu không đúng"
- [ ] Tài khoản chưa kích hoạt → "Vui lòng kiểm tra email để kích hoạt tài khoản"
- [ ] Tài khoản bị khóa → "Tài khoản đã bị khóa"

### 1.3 Password Reset (Đặt lại mật khẩu)

#### AC-005: Yêu cầu đặt lại mật khẩu

**Given** người dùng quên mật khẩu
**When** họ nhập email và click "Quên mật khẩu"
**Then** hệ thống gửi email hướng dẫn đặt lại mật khẩu

**Chi tiết:**

- [ ] Form có trường email
- [ ] Validate email có tồn tại trong hệ thống
- [ ] Gửi email chứa link đặt lại mật khẩu
- [ ] Link có thời hạn 1 giờ
- [ ] Hiển thị thông báo "Vui lòng kiểm tra email"

#### AC-006: Đặt lại mật khẩu mới

**Given** người dùng click link trong email
**When** họ nhập mật khẩu mới
**Then** hệ thống cập nhật mật khẩu và đăng nhập tự động

**Chi tiết:**

- [ ] Link phải còn hiệu lực (chưa hết hạn)
- [ ] Form có trường password và confirm password
- [ ] Validate mật khẩu mới theo quy tắc
- [ ] Sau khi đặt lại thành công, tự động đăng nhập
- [ ] Vô hiệu hóa link đã sử dụng

## 2. Group Management - Tiêu chí chấp nhận

### 2.1 Create Group (Tạo nhóm)

#### AC-007: Tạo nhóm mới

**Given** người dùng đã đăng nhập
**When** họ click "Tạo nhóm" và nhập thông tin
**Then** hệ thống tạo nhóm mới và thêm người tạo làm admin

**Chi tiết:**

- [ ] Form có trường: tên nhóm, mô tả, ảnh đại diện
- [ ] Tên nhóm bắt buộc, tối đa 100 ký tự
- [ ] Mô tả tối đa 500 ký tự
- [ ] Upload ảnh đại diện (JPG, PNG, tối đa 5MB)
- [ ] Người tạo tự động trở thành admin
- [ ] Tạo mã mời nhóm (6 ký tự)
- [ ] Chuyển hướng đến trang quản lý nhóm

#### AC-008: Validation tạo nhóm

**Given** người dùng nhập thông tin không hợp lệ
**When** họ submit form tạo nhóm
**Then** hệ thống hiển thị lỗi validation

**Chi tiết:**

- [ ] Tên nhóm trống → "Tên nhóm không được để trống"
- [ ] Tên nhóm quá dài → "Tên nhóm không được quá 100 ký tự"
- [ ] Mô tả quá dài → "Mô tả không được quá 500 ký tự"
- [ ] File ảnh quá lớn → "File ảnh không được quá 5MB"
- [ ] File ảnh không đúng format → "Chỉ chấp nhận file JPG, PNG"

### 2.2 Join Group (Tham gia nhóm)

#### AC-009: Tham gia nhóm bằng mã mời

**Given** người dùng có mã mời nhóm
**When** họ nhập mã và click "Tham gia"
**Then** hệ thống thêm họ vào nhóm

**Chi tiết:**

- [ ] Form có trường nhập mã mời
- [ ] Validate mã mời có tồn tại và còn hiệu lực
- [ ] Kiểm tra người dùng chưa tham gia nhóm
- [ ] Thêm người dùng vào nhóm với role "member"
- [ ] Gửi thông báo cho admin nhóm
- [ ] Chuyển hướng đến trang nhóm

#### AC-010: Tham gia nhóm bằng link

**Given** người dùng có link mời nhóm
**When** họ click link
**Then** hệ thống tự động thêm họ vào nhóm (nếu đã đăng nhập)

**Chi tiết:**

- [ ] Link chứa mã mời nhóm
- [ ] Nếu chưa đăng nhập → chuyển đến trang đăng nhập
- [ ] Nếu đã đăng nhập → tự động tham gia nhóm
- [ ] Hiển thị thông báo xác nhận tham gia

### 2.3 Group Settings (Cài đặt nhóm)

#### AC-011: Cập nhật thông tin nhóm

**Given** admin nhóm muốn cập nhật thông tin
**When** họ chỉnh sửa và lưu
**Then** hệ thống cập nhật thông tin nhóm

**Chi tiết:**

- [ ] Chỉ admin mới có thể chỉnh sửa
- [ ] Có thể cập nhật: tên nhóm, mô tả, ảnh đại diện
- [ ] Validation tương tự như tạo nhóm
- [ ] Lưu lịch sử thay đổi
- [ ] Thông báo cho tất cả thành viên

#### AC-012: Quản lý thành viên

**Given** admin nhóm muốn quản lý thành viên
**When** họ thực hiện các thao tác
**Then** hệ thống thực hiện theo yêu cầu

**Chi tiết:**

- [ ] Xem danh sách tất cả thành viên
- [ ] Xóa thành viên khỏi nhóm
- [ ] Chuyển quyền admin cho thành viên khác
- [ ] Xem lịch sử hoạt động của thành viên
- [ ] Gửi thông báo cho thành viên bị ảnh hưởng

## 3. Expense Management - Tiêu chí chấp nhận

### 3.1 Add Expense (Thêm chi tiêu)

#### AC-013: Thêm chi tiêu mới

**Given** thành viên nhóm muốn thêm chi tiêu
**When** họ nhập thông tin chi tiêu
**Then** hệ thống tạo chi tiêu mới và tính toán

**Chi tiết:**

- [ ] Form có trường: mô tả, số tiền, ngày, người trả, người tham gia
- [ ] Mô tả bắt buộc, tối đa 200 ký tự
- [ ] Số tiền phải > 0, tối đa 100,000,000 VNĐ
- [ ] Ngày không được trong tương lai
- [ ] Người trả phải là thành viên nhóm
- [ ] Ít nhất 1 người tham gia
- [ ] Upload hóa đơn (tùy chọn, JPG, PNG, PDF, tối đa 5MB)

#### AC-014: Chia tiền theo loại

**Given** người dùng chọn loại chia tiền
**When** họ submit chi tiêu
**Then** hệ thống tính toán theo loại đã chọn

**Chi tiết:**

- [ ] **Equal Split**: Chia đều cho tất cả người tham gia
- [ ] **Proportional**: Chia theo tỷ lệ người dùng nhập
- [ ] **Item-based**: Chia theo từng món (nếu có nhiều món)
- [ ] Hiển thị preview kết quả chia tiền trước khi lưu
- [ ] Cho phép điều chỉnh trước khi xác nhận

### 3.2 Edit Expense (Chỉnh sửa chi tiêu)

#### AC-015: Chỉnh sửa chi tiêu

**Given** người dùng muốn chỉnh sửa chi tiêu
**When** họ cập nhật thông tin
**Then** hệ thống cập nhật chi tiêu và tính lại

**Chi tiết:**

- [ ] Chỉ người tạo hoặc admin mới có thể chỉnh sửa
- [ ] Có thể chỉnh sửa tất cả thông tin chi tiêu
- [ ] Tự động tính lại số tiền mỗi người
- [ ] Cập nhật settlement nếu có thay đổi
- [ ] Lưu lịch sử thay đổi
- [ ] Thông báo cho người bị ảnh hưởng

#### AC-016: Xóa chi tiêu

**Given** người dùng muốn xóa chi tiêu
**When** họ xác nhận xóa
**Then** hệ thống xóa chi tiêu và cập nhật settlement

**Chi tiết:**

- [ ] Chỉ người tạo hoặc admin mới có thể xóa
- [ ] Hiển thị cảnh báo trước khi xóa
- [ ] Xóa tất cả dữ liệu liên quan
- [ ] Cập nhật lại settlement
- [ ] Thông báo cho tất cả thành viên

### 3.3 Expense Categories (Danh mục chi tiêu)

#### AC-017: Quản lý danh mục

**Given** admin nhóm muốn quản lý danh mục
**When** họ thêm/sửa/xóa danh mục
**Then** hệ thống cập nhật danh mục

**Chi tiết:**

- [ ] Danh mục mặc định: Ăn uống, Vận chuyển, Lưu trú, Giải trí, Khác
- [ ] Thêm danh mục mới với tên và icon
- [ ] Chỉnh sửa danh mục hiện có
- [ ] Xóa danh mục (chỉ khi chưa có chi tiêu)
- [ ] Sắp xếp thứ tự danh mục
- [ ] Áp dụng cho tất cả chi tiêu mới

## 4. Payment Calculation - Tiêu chí chấp nhận

### 4.1 Settlement Calculation (Tính toán thanh toán)

#### AC-018: Tính toán settlement

**Given** nhóm có nhiều chi tiêu
**When** hệ thống tính toán settlement
**Then** hiển thị danh sách giao dịch cần thiết

**Chi tiết:**

- [ ] Tính toán net amount cho mỗi người
- [ ] Tối ưu hóa số giao dịch (minimize transactions)
- [ ] Hiển thị ai cần trả ai bao nhiêu
- [ ] Sắp xếp theo thứ tự ưu tiên
- [ ] Cập nhật real-time khi có thay đổi

#### AC-019: Mark payment as completed

**Given** người dùng đã thanh toán
**When** họ đánh dấu "Đã thanh toán"
**Then** hệ thống cập nhật trạng thái

**Chi tiết:**

- [ ] Chỉ người nợ mới có thể đánh dấu
- [ ] Yêu cầu xác nhận từ người nhận
- [ ] Cập nhật trạng thái giao dịch
- [ ] Thông báo cho người nhận
- [ ] Cập nhật lại settlement

### 4.2 Payment History (Lịch sử thanh toán)

#### AC-020: Xem lịch sử thanh toán

**Given** người dùng muốn xem lịch sử
**When** họ truy cập trang lịch sử
**Then** hệ thống hiển thị danh sách giao dịch

**Chi tiết:**

- [ ] Hiển thị tất cả giao dịch đã hoàn thành
- [ ] Lọc theo thời gian, người, trạng thái
- [ ] Sắp xếp theo thời gian (mới nhất trước)
- [ ] Hiển thị chi tiết từng giao dịch
- [ ] Export dữ liệu ra Excel/PDF

## 5. Statistics & Reports - Tiêu chí chấp nhận

### 5.1 Expense Statistics (Thống kê chi tiêu)

#### AC-021: Thống kê tổng quan

**Given** người dùng muốn xem thống kê
**When** họ truy cập trang thống kê
**Then** hệ thống hiển thị các biểu đồ và số liệu

**Chi tiết:**

- [ ] Tổng chi tiêu của nhóm
- [ ] Chi tiêu theo danh mục (pie chart)
- [ ] Chi tiêu theo thời gian (line chart)
- [ ] Chi tiêu theo người (bar chart)
- [ ] So sánh với các tháng trước
- [ ] Lọc theo khoảng thời gian

#### AC-022: Báo cáo chi tiết

**Given** người dùng muốn báo cáo chi tiết
**When** họ chọn loại báo cáo
**Then** hệ thống tạo báo cáo

**Chi tiết:**

- [ ] Báo cáo theo người (ai chi bao nhiêu)
- [ ] Báo cáo theo danh mục
- [ ] Báo cáo theo thời gian
- [ ] Báo cáo settlement
- [ ] Export PDF/Excel
- [ ] Gửi email báo cáo

### 5.2 Personal Statistics (Thống kê cá nhân)

#### AC-023: Thống kê cá nhân

**Given** người dùng muốn xem thống kê cá nhân
**When** họ truy cập trang cá nhân
**Then** hệ thống hiển thị thống kê của họ

**Chi tiết:**

- [ ] Tổng chi tiêu cá nhân
- [ ] Chi tiêu theo nhóm
- [ ] Chi tiêu theo danh mục
- [ ] So sánh với các thành viên khác
- [ ] Xu hướng chi tiêu theo thời gian

## 6. Notifications - Tiêu chí chấp nhận

### 6.1 Real-time Notifications (Thông báo real-time)

#### AC-024: Thông báo chi tiêu mới

**Given** có chi tiêu mới trong nhóm
**When** hệ thống tạo thông báo
**Then** tất cả thành viên nhận được thông báo

**Chi tiết:**

- [ ] Thông báo popup trên web
- [ ] Thông báo push trên mobile
- [ ] Email notification (tùy chọn)
- [ ] Hiển thị thông tin chi tiêu
- [ ] Link đến chi tiết chi tiêu

#### AC-025: Thông báo thanh toán

**Given** có giao dịch thanh toán
**When** hệ thống tạo thông báo
**Then** người liên quan nhận được thông báo

**Chi tiết:**

- [ ] Thông báo cho người nhận tiền
- [ ] Thông báo cho người trả tiền
- [ ] Thông báo cho admin nhóm
- [ ] Hiển thị số tiền và người liên quan
- [ ] Cập nhật trạng thái settlement

### 6.2 Notification Settings (Cài đặt thông báo)

#### AC-026: Cài đặt thông báo

**Given** người dùng muốn cài đặt thông báo
**When** họ thay đổi cài đặt
**Then** hệ thống áp dụng cài đặt mới

**Chi tiết:**

- [ ] Bật/tắt thông báo web
- [ ] Bật/tắt thông báo email
- [ ] Bật/tắt thông báo push
- [ ] Chọn loại thông báo muốn nhận
- [ ] Cài đặt thời gian nhận thông báo

#### AC-027: Thông báo nhóm mới

**Given** người dùng được mời vào nhóm mới
**When** họ nhận được thông báo
**Then** hiển thị thông tin nhóm và link tham gia

**Chi tiết:**

- [ ] Thông báo popup trên web
- [ ] Email notification với link tham gia
- [ ] Hiển thị tên nhóm và người mời
- [ ] Nút "Tham gia nhóm" trực tiếp
- [ ] Thông báo cho admin nhóm khi có thành viên mới

#### AC-028: Thông báo nhắc nợ

**Given** có người nợ tiền trong nhóm
**When** hệ thống gửi nhắc nợ
**Then** người nợ nhận được thông báo

**Chi tiết:**

- [ ] Thông báo hàng ngày cho người nợ
- [ ] Hiển thị số tiền cần trả
- [ ] Link đến trang thanh toán
- [ ] Admin có thể gửi nhắc nợ thủ công
- [ ] Tự động ngừng nhắc sau khi thanh toán

#### AC-029: Thông báo cập nhật nhóm

**Given** admin cập nhật thông tin nhóm
**When** thay đổi được lưu
**Then** tất cả thành viên nhận thông báo

**Chi tiết:**

- [ ] Thông báo khi đổi tên nhóm
- [ ] Thông báo khi đổi ảnh đại diện
- [ ] Thông báo khi thay đổi cài đặt nhóm
- [ ] Hiển thị chi tiết thay đổi
- [ ] Lịch sử thay đổi trong nhóm

#### AC-030: Thông báo xóa thành viên

**Given** admin xóa thành viên khỏi nhóm
**When** thao tác được thực hiện
**Then** thành viên bị xóa nhận thông báo

**Chi tiết:**

- [ ] Thông báo cho người bị xóa
- [ ] Thông báo cho admin xác nhận
- [ ] Lý do xóa (nếu có)
- [ ] Hướng dẫn liên hệ admin
- [ ] Cập nhật danh sách thành viên

#### AC-031: Thông báo chi tiêu được duyệt

**Given** chi tiêu cần phê duyệt
**When** admin duyệt/từ chối
**Then** người tạo nhận thông báo

**Chi tiết:**

- [ ] Thông báo khi chi tiêu được duyệt
- [ ] Thông báo khi chi tiêu bị từ chối
- [ ] Lý do từ chối (nếu có)
- [ ] Link đến chi tiết chi tiêu
- [ ] Cập nhật trạng thái settlement

#### AC-032: Thông báo backup dữ liệu

**Given** hệ thống thực hiện backup
**When** backup hoàn thành
**Then** admin nhận thông báo

**Chi tiết:**

- [ ] Thông báo backup thành công
- [ ] Thông báo backup thất bại
- [ ] Thông tin về kích thước backup
- [ ] Link download backup (nếu cần)
- [ ] Lịch sử backup trong hệ thống

#### AC-033: Thông báo bảo trì hệ thống

**Given** hệ thống cần bảo trì
**When** thời gian bảo trì đến
**Then** tất cả người dùng nhận thông báo

**Chi tiết:**

- [ ] Thông báo trước 24h
- [ ] Thông báo trước 1h
- [ ] Thông báo khi bắt đầu bảo trì
- [ ] Thông báo khi hoàn thành
- [ ] Ước tính thời gian bảo trì

## 7. Mobile Responsive - Tiêu chí chấp nhận

### 7.1 Mobile Layout (Giao diện mobile)

#### AC-034: Responsive design

**Given** người dùng truy cập trên mobile
**When** họ sử dụng ứng dụng
**Then** giao diện tự động điều chỉnh

**Chi tiết:**

- [ ] Layout tự động điều chỉnh theo màn hình
- [ ] Menu hamburger cho navigation
- [ ] Touch-friendly buttons (tối thiểu 44px)
- [ ] Swipe gestures cho navigation
- [ ] Optimized images cho mobile

#### AC-035: Mobile performance

**Given** người dùng sử dụng mobile
**When** họ thực hiện các thao tác
**Then** ứng dụng hoạt động mượt mà

**Chi tiết:**

- [ ] Page load time < 3s trên 3G
- [ ] Smooth scrolling và animations
- [ ] Offline capability cho basic functions
- [ ] Optimized bundle size
- [ ] Lazy loading cho images

### 7.2 Progressive Web App (PWA)

#### AC-036: PWA features

**Given** người dùng cài đặt PWA
**When** họ sử dụng ứng dụng
**Then** có trải nghiệm như native app

**Chi tiết:**

- [ ] Có thể cài đặt trên home screen
- [ ] Hoạt động offline với cached data
- [ ] Push notifications
- [ ] App-like navigation
- [ ] Splash screen và icons

## 8. Security - Tiêu chí chấp nhận

### 8.1 Authentication Security (Bảo mật xác thực)

#### AC-037: Session management

**Given** người dùng đã đăng nhập
**When** họ sử dụng ứng dụng
**Then** session được quản lý an toàn

**Chi tiết:**

- [ ] JWT token có expiration time
- [ ] Auto logout sau 30 phút không hoạt động
- [ ] Secure cookie settings
- [ ] CSRF protection
- [ ] Rate limiting cho login attempts

#### AC-038: Data encryption

**Given** dữ liệu được truyền tải
**When** hệ thống xử lý dữ liệu
**Then** dữ liệu được mã hóa

**Chi tiết:**

- [ ] HTTPS cho tất cả communications
- [ ] Encrypted password storage
- [ ] Encrypted sensitive data
- [ ] Secure API endpoints
- [ ] Input validation và sanitization

### 8.2 Authorization Security (Bảo mật phân quyền)

#### AC-039: Role-based access

**Given** người dùng có role khác nhau
**When** họ truy cập các tính năng
**Then** hệ thống kiểm tra quyền truy cập

**Chi tiết:**

- [ ] Chỉ admin mới có thể quản lý nhóm
- [ ] Chỉ người tạo mới có thể sửa chi tiêu
- [ ] Chỉ thành viên mới có thể xem nhóm
- [ ] API endpoints có authorization checks
- [ ] Frontend có route guards

## 9. Performance - Tiêu chí chấp nhận

### 9.1 Page Load Performance (Hiệu suất tải trang)

#### AC-040: Initial page load

**Given** người dùng truy cập ứng dụng
**When** trang web tải lần đầu
**Then** thời gian tải trong giới hạn cho phép

**Chi tiết:**

- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Time to Interactive < 3s
- [ ] Cumulative Layout Shift < 0.1
- [ ] First Input Delay < 100ms

#### AC-041: API response time

**Given** người dùng thực hiện thao tác
**When** hệ thống xử lý request
**Then** response time trong giới hạn

**Chi tiết:**

- [ ] Authentication APIs < 200ms
- [ ] CRUD operations < 300ms
- [ ] Complex queries < 500ms
- [ ] File uploads < 2s
- [ ] Real-time notifications < 100ms

### 9.2 Database Performance (Hiệu suất cơ sở dữ liệu)

#### AC-042: Query optimization

**Given** hệ thống thực hiện queries
**When** xử lý dữ liệu
**Then** queries được tối ưu hóa

**Chi tiết:**

- [ ] Database indexes cho frequently queried fields
- [ ] Query execution time < 100ms
- [ ] Connection pooling
- [ ] Caching cho frequently accessed data
- [ ] Database monitoring và alerting

## 10. Error Handling - Tiêu chí chấp nhận

### 10.1 User-friendly Error Messages (Thông báo lỗi thân thiện)

#### AC-043: Validation errors

**Given** người dùng nhập dữ liệu sai
**When** hệ thống validate
**Then** hiển thị thông báo lỗi rõ ràng

**Chi tiết:**

- [ ] Thông báo lỗi bằng tiếng Việt
- [ ] Chỉ ra chính xác lỗi ở đâu
- [ ] Gợi ý cách sửa lỗi
- [ ] Highlight trường bị lỗi
- [ ] Không hiển thị technical details

#### AC-044: System errors

**Given** hệ thống gặp lỗi
**When** người dùng thực hiện thao tác
**Then** hiển thị trang lỗi thân thiện

**Chi tiết:**

- [ ] Trang 404 cho URL không tồn tại
- [ ] Trang 500 cho server errors
- [ ] Thông báo "Đang bảo trì" khi cần
- [ ] Link quay lại trang chủ
- [ ] Contact support information

### 10.2 Error Recovery (Khôi phục lỗi)

#### AC-045: Auto retry

**Given** request bị lỗi network
**When** hệ thống phát hiện lỗi
**Then** tự động retry với exponential backoff

**Chi tiết:**

- [ ] Retry tối đa 3 lần
- [ ] Exponential backoff (1s, 2s, 4s)
- [ ] Chỉ retry cho network errors
- [ ] Hiển thị loading state
- [ ] Fallback sau khi retry thất bại

## 11. Accessibility - Tiêu chí chấp nhận

### 11.1 WCAG Compliance (Tuân thủ WCAG)

#### AC-046: Keyboard navigation

**Given** người dùng sử dụng keyboard
**When** họ navigate ứng dụng
**Then** tất cả elements có thể truy cập bằng keyboard

**Chi tiết:**

- [ ] Tab order hợp lý
- [ ] Focus indicators rõ ràng
- [ ] Skip links cho main content
- [ ] Keyboard shortcuts cho common actions
- [ ] Escape key để đóng modals

#### AC-047: Screen reader support

**Given** người dùng sử dụng screen reader
**When** họ sử dụng ứng dụng
**Then** screen reader đọc được nội dung

**Chi tiết:**

- [ ] Semantic HTML elements
- [ ] Alt text cho images
- [ ] ARIA labels cho interactive elements
- [ ] Live regions cho dynamic content
- [ ] Proper heading hierarchy

### 11.2 Visual Accessibility (Khả năng tiếp cận thị giác)

#### AC-048: Color contrast

**Given** người dùng có vấn đề về thị giác
**When** họ xem nội dung
**Then** có đủ độ tương phản màu sắc

**Chi tiết:**

- [ ] Text contrast ratio ≥ 4.5:1
- [ ] Large text contrast ratio ≥ 3:1
- [ ] Color không phải là cách duy nhất truyền tải thông tin
- [ ] High contrast mode support
- [ ] Colorblind-friendly palette

## 12. Integration Testing - Tiêu chí chấp nhận

### 12.1 End-to-End Testing (Kiểm thử end-to-end)

#### AC-049: Complete user flows

**Given** người dùng thực hiện complete flow
**When** họ hoàn thành toàn bộ quy trình
**Then** hệ thống hoạt động đúng như mong đợi

**Chi tiết:**

- [ ] User registration → email verification → login
- [ ] Create group → invite members → add expenses
- [ ] Add expense → calculate settlement → mark payment
- [ ] View statistics → export reports
- [ ] Mobile responsive testing

#### AC-050: Cross-browser testing

**Given** người dùng sử dụng browsers khác nhau
**When** họ sử dụng ứng dụng
**Then** ứng dụng hoạt động nhất quán

**Chi tiết:**

- [ ] Chrome, Firefox, Safari, Edge
- [ ] Mobile browsers
- [ ] Different screen sizes
- [ ] Different operating systems
- [ ] Performance consistency

## 13. Data Migration - Tiêu chí chấp nhận

### 13.1 Data Import/Export (Nhập/xuất dữ liệu)

#### AC-051: Export data

**Given** người dùng muốn export dữ liệu
**When** họ chọn export
**Then** hệ thống tạo file dữ liệu

**Chi tiết:**

- [ ] Export expenses ra Excel/CSV
- [ ] Export settlement ra PDF
- [ ] Export statistics ra Excel
- [ ] Include all relevant data
- [ ] Proper file formatting

#### AC-052: Data backup

**Given** hệ thống cần backup dữ liệu
**When** backup process chạy
**Then** dữ liệu được backup an toàn

**Chi tiết:**

- [ ] Daily automated backups
- [ ] Point-in-time recovery
- [ ] Cross-region backup replication
- [ ] Backup verification
- [ ] Disaster recovery procedures

## 14. Monitoring & Analytics - Tiêu chí chấp nhận

### 14.1 Application Monitoring (Giám sát ứng dụng)

#### AC-053: Performance monitoring

**Given** ứng dụng đang chạy
**When** hệ thống monitor performance
**Then** thu thập metrics và alerts

**Chi tiết:**

- [ ] Response time monitoring
- [ ] Error rate tracking
- [ ] User activity analytics
- [ ] Database performance metrics
- [ ] Real-time alerts cho critical issues

#### AC-054: Business metrics

**Given** ứng dụng có users
**When** hệ thống track business metrics
**Then** thu thập data cho business insights

**Chi tiết:**

- [ ] User registration rate
- [ ] Group creation rate
- [ ] Expense frequency
- [ ] Feature adoption rate
- [ ] User retention metrics

## Kết luận

Các tiêu chí chấp nhận được mô tả trong tài liệu này đảm bảo rằng mỗi tính năng của ứng dụng CuaTienPhuot được phát triển đúng yêu cầu và đáp ứng kỳ vọng của người dùng. Việc tuân thủ các tiêu chí này sẽ giúp đảm bảo chất lượng và trải nghiệm người dùng tốt nhất cho ứng dụng.
