# Epic 6: Thông báo

## Tổng quan Epic

Epic này bao gồm tất cả các chức năng liên quan đến hệ thống thông báo real-time và không real-time. Người dùng sẽ nhận được thông báo về các hoạt động quan trọng trong nhóm như chi tiêu mới, thanh toán, thêm thành viên, v.v.

## User Stories

### US-045: Nhận thông báo khi được thêm vào nhóm

**Là một người dùng được mời tham gia nhóm**  
**Tôi muốn nhận thông báo khi được thêm vào nhóm**  
**Để biết mình đã được mời tham gia nhóm du lịch**

#### Acceptance Criteria:

- **Given** tôi được admin mời tham gia nhóm
- **When** admin gửi lời mời
- **Then** tôi nhận được thông báo và email về lời mời\*\*

#### Chi tiết chức năng:

- Thông báo real-time trong ứng dụng
- Email thông báo với thông tin nhóm
- Thông báo push notification (nếu có)
- Link trực tiếp đến trang nhóm
- Thông tin người mời và thời gian mời

#### UI/UX Requirements:

- Badge số lượng thông báo chưa đọc
- Toast notification khi có thông báo mới
- Email template đẹp với thông tin nhóm
- Button "Tham gia nhóm" trong email
- Hiển thị avatar người mời

#### Validation Rules:

- Chỉ gửi thông báo cho email hợp lệ
- Không gửi thông báo trùng lặp
- Thông báo có thời hạn 7 ngày

#### Error Handling:

- Lỗi gửi email: "Không thể gửi thông báo, thử lại"
- Email không tồn tại: "Email không hợp lệ"

---

### US-046: Nhận thông báo chi tiêu mới

**Là một thành viên của nhóm**  
**Tôi muốn nhận thông báo khi có chi tiêu mới**  
**Để theo dõi các khoản chi tiêu của nhóm**

#### Acceptance Criteria:

- **Given** tôi là thành viên của nhóm
- **When** có thành viên khác thêm chi tiêu mới
- **Then** tôi nhận được thông báo về chi tiêu mới\*\*

#### Chi tiết chức năng:

- Thông báo real-time khi có chi tiêu mới
- Thông tin: Người thêm, Số tiền, Danh mục, Mô tả
- Link trực tiếp đến chi tiết chi tiêu
- Thông báo email (tùy chọn)
- Thông báo push notification

#### UI/UX Requirements:

- Card thông báo với thông tin chi tiết
- Icon danh mục chi tiêu
- Số tiền hiển thị nổi bật
- Button "Xem chi tiết"
- Thời gian thông báo

#### Validation Rules:

- Chỉ gửi thông báo cho thành viên nhóm
- Không gửi thông báo cho người thêm chi tiêu
- Thông báo có thời hạn 3 ngày

---

### US-047: Nhận thông báo thanh toán

**Là một thành viên của nhóm**  
**Tôi muốn nhận thông báo về thanh toán**  
**Để theo dõi trạng thái thanh toán và công nợ**

#### Acceptance Criteria:

- **Given** tôi có liên quan đến giao dịch thanh toán
- **When** có thay đổi trạng thái thanh toán
- **Then** tôi nhận được thông báo phù hợp\*\*

#### Chi tiết chức năng:

- Thông báo khi có người đánh dấu đã thanh toán
- Thông báo khi có người xác nhận thanh toán
- Thông báo khi có giao dịch thanh toán mới
- Thông báo khi giao dịch bị hủy
- Thông tin: Người gửi, Người nhận, Số tiền, Trạng thái

#### UI/UX Requirements:

- Card thông báo với icon trạng thái
- Màu sắc phân biệt trạng thái
- Thông tin giao dịch rõ ràng
- Button "Xem chi tiết giao dịch"
- Progress bar cho trạng thái thanh toán

#### Validation Rules:

- Chỉ gửi thông báo cho người liên quan
- Thông báo phải chính xác theo trạng thái
- Không gửi thông báo trùng lặp

---

### US-048: Nhận thông báo nhắc nợ

**Là một thành viên của nhóm**  
**Tôi muốn nhận thông báo nhắc nợ**  
**Để không quên thanh toán các khoản nợ**

#### Acceptance Criteria:

- **Given** tôi có công nợ chưa thanh toán
- **When** đến thời gian nhắc nợ
- **Then** tôi nhận được thông báo nhắc nợ\*\*

#### Chi tiết chức năng:

- Thông báo nhắc nợ hàng ngày
- Thông báo nhắc nợ khi nợ quá 7 ngày
- Thông báo nhắc nợ khi nợ quá 30 ngày
- Thông tin: Số tiền nợ, Người được nợ, Thời gian nợ
- Link trực tiếp đến trang thanh toán

#### UI/UX Requirements:

- Card thông báo với icon cảnh báo
- Màu đỏ cho nợ quá hạn
- Số tiền nợ hiển thị nổi bật
- Button "Thanh toán ngay"
- Countdown thời gian nợ

#### Validation Rules:

- Chỉ gửi thông báo cho người có nợ
- Không gửi thông báo cho nợ đã thanh toán
- Tần suất thông báo hợp lý

---

### US-049: Xem danh sách thông báo

**Là một người dùng đã đăng nhập**  
**Tôi muốn xem danh sách thông báo**  
**Để theo dõi tất cả các thông báo đã nhận**

#### Acceptance Criteria:

- **Given** tôi đã đăng nhập vào hệ thống
- **When** tôi truy cập trang thông báo
- **Then** tôi thấy danh sách tất cả thông báo\*\*

#### Chi tiết chức năng:

- Danh sách thông báo theo thời gian
- Phân loại: Chưa đọc, Đã đọc, Tất cả
- Lọc theo loại thông báo
- Tìm kiếm thông báo theo nội dung
- Đánh dấu đã đọc/ chưa đọc

#### UI/UX Requirements:

- List view với các thông báo
- Badge "Chưa đọc" cho thông báo mới
- Filter tabs cho các loại thông báo
- Search bar cho tìm kiếm
- Pagination cho danh sách dài

#### Validation Rules:

- Chỉ hiển thị thông báo của user
- Sắp xếp theo thời gian giảm dần
- Phân trang 20 thông báo mỗi trang

---

### US-050: Đánh dấu thông báo đã đọc

**Là một người dùng đã đăng nhập**  
**Tôi muốn đánh dấu thông báo đã đọc**  
**Để quản lý trạng thái thông báo**

#### Acceptance Criteria:

- **Given** tôi đang xem danh sách thông báo
- **When** tôi click vào thông báo hoặc đánh dấu đã đọc
- **Then** thông báo được đánh dấu đã đọc\*\*

#### Chi tiết chức năng:

- Click vào thông báo để đánh dấu đã đọc
- Button "Đánh dấu tất cả đã đọc"
- Button "Đánh dấu tất cả chưa đọc"
- Cập nhật trạng thái real-time
- Cập nhật badge số lượng thông báo

#### UI/UX Requirements:

- Checkbox cho mỗi thông báo
- Button "Đánh dấu tất cả" ở header
- Visual feedback khi đánh dấu
- Cập nhật badge số lượng ngay lập tức

#### Validation Rules:

- Chỉ đánh dấu thông báo của user
- Cập nhật trạng thái chính xác
- Không đánh dấu thông báo đã xóa

---

### US-051: Xóa thông báo

**Là một người dùng đã đăng nhập**  
**Tôi muốn xóa thông báo**  
**Để dọn dẹp danh sách thông báo**

#### Acceptance Criteria:

- **Given** tôi đang xem danh sách thông báo
- **When** tôi xóa thông báo
- **Then** thông báo bị xóa khỏi danh sách\*\*

#### Chi tiết chức năng:

- Xóa từng thông báo riêng lẻ
- Xóa nhiều thông báo cùng lúc
- Xóa tất cả thông báo đã đọc
- Xóa tất cả thông báo cũ hơn 30 ngày
- Confirmation dialog trước khi xóa

#### UI/UX Requirements:

- Button "Xóa" cho mỗi thông báo
- Checkbox để chọn nhiều thông báo
- Button "Xóa đã chọn" ở header
- Confirmation dialog với cảnh báo
- Toast notification khi xóa thành công

#### Validation Rules:

- Chỉ xóa thông báo của user
- Không thể xóa thông báo quan trọng
- Xóa vĩnh viễn, không thể hoàn tác

---

### US-052: Cấu hình thông báo

**Là một người dùng đã đăng nhập**  
**Tôi muốn cấu hình thông báo**  
**Để kiểm soát loại thông báo muốn nhận**

#### Acceptance Criteria:

- **Given** tôi đang xem trang cài đặt
- **When** tôi cấu hình thông báo
- **Then** cài đặt được lưu và áp dụng ngay lập tức\*\*

#### Chi tiết chức năng:

- Toggle switch cho từng loại thông báo
- Cài đặt thông báo email
- Cài đặt thông báo push
- Cài đặt thông báo real-time
- Cài đặt thời gian nhắc nợ

#### UI/UX Requirements:

- Form cài đặt với các toggle switch
- Nhóm cài đặt theo loại thông báo
- Preview cài đặt hiện tại
- Button "Lưu cài đặt"
- Reset về mặc định

#### Validation Rules:

- Ít nhất 1 loại thông báo phải được bật
- Cài đặt phải hợp lệ
- Lưu cài đặt cho từng user

---

### US-053: Thông báo real-time

**Là một người dùng đang sử dụng ứng dụng**  
**Tôi muốn nhận thông báo real-time**  
**Để cập nhật thông tin ngay lập tức**

#### Acceptance Criteria:

- **Given** tôi đang sử dụng ứng dụng
- **When** có hoạt động mới trong nhóm
- **Then** tôi nhận được thông báo real-time\*\*

#### Chi tiết chức năng:

- WebSocket connection cho real-time
- Thông báo popup khi có hoạt động mới
- Cập nhật dữ liệu real-time
- Thông báo âm thanh (tùy chọn)
- Thông báo rung (mobile)

#### UI/UX Requirements:

- Toast notification xuất hiện từ góc màn hình
- Icon và màu sắc phân biệt loại thông báo
- Auto-hide sau 5 giây
- Click để xem chi tiết
- Sound notification (tùy chọn)

#### Validation Rules:

- Chỉ gửi thông báo cho user đang online
- Thông báo phải chính xác và kịp thời
- Không spam thông báo

---

### US-054: Thông báo email

**Là một người dùng đã đăng ký email**  
**Tôi muốn nhận thông báo qua email**  
**Để không bỏ lỡ thông tin quan trọng khi không online**

#### Acceptance Criteria:

- **Given** tôi đã cấu hình nhận email
- **When** có hoạt động quan trọng trong nhóm
- **Then** tôi nhận được email thông báo\*\*

#### Chi tiết chức năng:

- Email thông báo cho các hoạt động quan trọng
- Template email đẹp và responsive
- Link trực tiếp đến ứng dụng
- Unsubscribe link trong email
- Digest email hàng ngày (tùy chọn)

#### UI/UX Requirements:

- Email template với header và footer
- Logo và branding của ứng dụng
- Button CTA rõ ràng
- Responsive design cho mobile
- Dark mode support

#### Validation Rules:

- Chỉ gửi email cho user đã xác thực
- Tần suất email hợp lý
- Không gửi email spam

---

### US-055: Thông báo push notification

**Là một người dùng trên mobile**  
**Tôi muốn nhận thông báo push**  
**Để nhận thông báo ngay cả khi không mở ứng dụng**

#### Acceptance Criteria:

- **Given** tôi đã cho phép push notification
- **When** có hoạt động quan trọng
- **Then** tôi nhận được push notification\*\*

#### Chi tiết chức năng:

- Push notification cho mobile browsers
- Thông báo khi có chi tiêu mới
- Thông báo khi có thanh toán
- Thông báo nhắc nợ
- Click notification để mở ứng dụng

#### UI/UX Requirements:

- Icon và title rõ ràng
- Nội dung thông báo ngắn gọn
- Action buttons trong notification
- Deep link đến trang liên quan

#### Validation Rules:

- Chỉ gửi cho user đã cho phép
- Thông báo phải có nội dung hữu ích
- Không gửi quá nhiều thông báo

## Technical Requirements

### API Endpoints:

- `GET /api/notifications` - Lấy danh sách thông báo
- `PUT /api/notifications/:id/read` - Đánh dấu đã đọc
- `PUT /api/notifications/read-all` - Đánh dấu tất cả đã đọc
- `DELETE /api/notifications/:id` - Xóa thông báo
- `DELETE /api/notifications` - Xóa nhiều thông báo
- `GET /api/notifications/settings` - Lấy cài đặt thông báo
- `PUT /api/notifications/settings` - Cập nhật cài đặt
- `POST /api/notifications/test` - Test thông báo
- `GET /api/notifications/unread-count` - Số thông báo chưa đọc

### Database Operations:

- Tạo thông báo mới cho user
- Cập nhật trạng thái đã đọc
- Xóa thông báo cũ
- Lưu cài đặt thông báo user
- Cleanup thông báo hết hạn

### Security Requirements:

- Chỉ user mới xem được thông báo của mình
- Validate quyền gửi thông báo
- Rate limiting cho API thông báo
- Encrypt nội dung thông báo nhạy cảm

### Performance Requirements:

- Thông báo real-time < 100ms
- API response time < 300ms
- Background job cho gửi email
- Cache cài đặt thông báo user

## Dependencies

### Frontend Dependencies:

- Socket.io-client cho real-time
- React Query cho data fetching
- Toast notifications cho UI
- Service Worker cho push notification
- React Hook Form cho cài đặt

### Backend Dependencies:

- NestJS framework
- Socket.io cho WebSocket
- Bull Queue cho background jobs
- Nodemailer cho gửi email
- MongoDB với Mongoose

### External Services:

- Email service (SendGrid/AWS SES)
- Push notification service
- WebSocket service
- CDN cho static assets
