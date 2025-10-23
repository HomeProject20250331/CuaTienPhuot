# Epic 4: Tính toán & Thanh toán

## Tổng quan Epic

Epic này bao gồm tất cả các chức năng liên quan đến việc tính toán công nợ, quản lý thanh toán và xử lý các giao dịch tài chính giữa các thành viên trong nhóm. Hệ thống sẽ tự động tính toán ai nợ ai bao nhiêu dựa trên các chi tiêu đã ghi nhận.

## User Stories

### US-026: Xem bảng công nợ

**Là một thành viên của nhóm**  
**Tôi muốn xem bảng công nợ của nhóm**  
**Để biết ai nợ ai bao nhiêu tiền**

#### Acceptance Criteria:

- **Given** tôi là thành viên của nhóm có chi tiêu
- **When** tôi truy cập trang công nợ của nhóm
- **Then** tôi thấy bảng công nợ với thông tin rõ ràng\*\*

#### Chi tiết chức năng:

- Hiển thị bảng công nợ dạng ma trận
- Thông tin: Người nợ, Người được nợ, Số tiền
- Tổng công nợ của từng người
- Tổng công nợ của toàn nhóm
- Lọc theo người cụ thể

#### UI/UX Requirements:

- Bảng công nợ với layout rõ ràng
- Màu sắc phân biệt: đỏ (nợ), xanh (được nợ)
- Tổng kết ở cuối bảng
- Filter dropdown theo người
- Export bảng công nợ (PDF/Excel)

#### Validation Rules:

- Chỉ hiển thị công nợ của nhóm hiện tại
- Sắp xếp theo số tiền giảm dần
- Làm tròn số tiền đến 1000 VND

---

### US-027: Tính toán công nợ tự động

**Là một thành viên của nhóm**  
**Tôi muốn hệ thống tự động tính toán công nợ**  
**Để không phải tính toán thủ công và tránh sai sót**

#### Acceptance Criteria:

- **Given** có chi tiêu mới được thêm vào nhóm
- **When** hệ thống xử lý chi tiêu
- **Then** công nợ được tính toán và cập nhật tự động\*\*

#### Chi tiết chức năng:

- Thuật toán chia đều đơn giản (mặc định)
- Tính toán dựa trên người tham gia chi tiêu
- Loại trừ người trả tiền khỏi việc chia tiền
- Cập nhật công nợ real-time
- Hỗ trợ công thức chia tiền tùy chỉnh

#### UI/UX Requirements:

- Hiển thị loading khi đang tính toán
- Thông báo khi công nợ được cập nhật
- Hiển thị công thức chia tiền đang sử dụng

#### Validation Rules:

- Chỉ tính toán cho chi tiêu đã được xác nhận
- Không tính toán cho chi tiêu đã bị xóa
- Xử lý trường hợp số tiền không chia đều

---

### US-028: Đánh dấu đã thanh toán

**Là một thành viên của nhóm**  
**Tôi muốn đánh dấu đã thanh toán**  
**Để theo dõi trạng thái thanh toán và cập nhật công nợ**

#### Acceptance Criteria:

- **Given** tôi có công nợ cần thanh toán
- **When** tôi đánh dấu đã thanh toán
- **Then** công nợ được cập nhật và thông báo cho người liên quan\*\*

#### Chi tiết chức năng:

- Nút "Đã thanh toán" cho mỗi khoản nợ
- Chọn phương thức thanh toán
- Thêm ghi chú cho giao dịch
- Xác nhận thanh toán từ người nhận
- Cập nhật công nợ sau khi thanh toán

#### UI/UX Requirements:

- Modal xác nhận thanh toán
- Dropdown chọn phương thức thanh toán
- Input ghi chú (tùy chọn)
- Button "Xác nhận" và "Hủy"
- Toast notification khi hoàn thành

#### Validation Rules:

- Chỉ người nợ mới đánh dấu thanh toán
- Phải xác nhận trước khi đánh dấu
- Không thể đánh dấu thanh toán cho chính mình

#### Error Handling:

- Không có quyền: "Bạn không thể đánh dấu thanh toán này"
- Lỗi cập nhật: "Không thể cập nhật trạng thái thanh toán"

---

### US-029: Xác nhận thanh toán

**Là một thành viên của nhóm**  
**Tôi muốn xác nhận đã nhận thanh toán**  
**Để hoàn tất giao dịch và cập nhật công nợ**

#### Acceptance Criteria:

- **Given** có người đánh dấu đã thanh toán cho tôi
- **When** tôi xác nhận đã nhận thanh toán
- **Then** giao dịch được hoàn tất và công nợ được cập nhật\*\*

#### Chi tiết chức năng:

- Thông báo khi có thanh toán cần xác nhận
- Xem chi tiết giao dịch thanh toán
- Xác nhận hoặc từ chối thanh toán
- Thêm ghi chú khi xác nhận
- Cập nhật trạng thái giao dịch

#### UI/UX Requirements:

- Notification badge cho thanh toán chờ xác nhận
- Modal xác nhận với thông tin chi tiết
- Button "Xác nhận" và "Từ chối"
- Input ghi chú khi từ chối

#### Validation Rules:

- Chỉ người nhận mới xác nhận được
- Phải xác nhận trong vòng 7 ngày
- Không thể xác nhận thanh toán đã hoàn tất

---

### US-030: Xem lịch sử thanh toán

**Là một thành viên của nhóm**  
**Tôi muốn xem lịch sử thanh toán**  
**Để theo dõi các giao dịch đã thực hiện**

#### Acceptance Criteria:

- **Given** tôi là thành viên của nhóm
- **When** tôi truy cập trang lịch sử thanh toán
- **Then** tôi thấy danh sách tất cả giao dịch thanh toán\*\*

#### Chi tiết chức năng:

- Danh sách giao dịch thanh toán
- Thông tin: Người gửi, Người nhận, Số tiền, Ngày, Trạng thái
- Lọc theo trạng thái, người, khoảng thời gian
- Tìm kiếm theo ghi chú
- Export lịch sử thanh toán

#### UI/UX Requirements:

- Bảng lịch sử với các cột thông tin
- Filter panel với các tùy chọn
- Search bar cho tìm kiếm
- Pagination cho danh sách dài
- Status badges cho trạng thái

#### Validation Rules:

- Chỉ hiển thị giao dịch của nhóm hiện tại
- Sắp xếp theo ngày giảm dần
- Phân trang 20 giao dịch mỗi trang

---

### US-031: Tạo giao dịch thanh toán

**Là một thành viên của nhóm**  
**Tôi muốn tạo giao dịch thanh toán**  
**Để thanh toán trực tiếp cho người khác**

#### Acceptance Criteria:

- **Given** tôi có công nợ với người khác
- **When** tôi tạo giao dịch thanh toán
- **Then** giao dịch được tạo và chờ xác nhận\*\*

#### Chi tiết chức năng:

- Form tạo giao dịch: Người nhận, Số tiền, Ghi chú
- Chọn phương thức thanh toán
- Tự động tính toán số tiền cần thanh toán
- Gửi thông báo cho người nhận
- Theo dõi trạng thái giao dịch

#### UI/UX Requirements:

- Modal tạo giao dịch với form đơn giản
- Dropdown chọn người nhận
- Input số tiền với validation
- Textarea cho ghi chú
- Button "Tạo giao dịch" và "Hủy"

#### Validation Rules:

- Người nhận: Phải là thành viên nhóm, khác người gửi
- Số tiền: > 0, không vượt quá số nợ
- Ghi chú: Tối đa 500 ký tự

#### Error Handling:

- Số tiền vượt quá nợ: "Số tiền không được vượt quá số nợ"
- Lỗi tạo giao dịch: "Không thể tạo giao dịch, thử lại"

---

### US-032: Hủy giao dịch thanh toán

**Là một thành viên của nhóm**  
**Tôi muốn hủy giao dịch thanh toán**  
**Khi giao dịch chưa được xác nhận hoặc có lỗi**

#### Acceptance Criteria:

- **Given** tôi đã tạo giao dịch thanh toán
- **When** tôi hủy giao dịch
- **Then** giao dịch bị hủy và thông báo cho người liên quan\*\*

#### Chi tiết chức năng:

- Nút "Hủy" cho giao dịch chưa xác nhận
- Confirmation dialog trước khi hủy
- Lý do hủy giao dịch (tùy chọn)
- Thông báo cho người nhận
- Cập nhật trạng thái giao dịch

#### UI/UX Requirements:

- Nút "Hủy" trong danh sách giao dịch
- Confirmation dialog với input lý do
- Toast notification khi hủy thành công

#### Validation Rules:

- Chỉ người tạo mới hủy được
- Chỉ hủy được giao dịch chưa xác nhận
- Phải xác nhận trước khi hủy

---

### US-033: Cấu hình công thức chia tiền

**Là một admin của nhóm**  
**Tôi muốn cấu hình công thức chia tiền**  
**Để áp dụng cách chia tiền phù hợp cho nhóm**

#### Acceptance Criteria:

- **Given** tôi là admin của nhóm
- **When** tôi cấu hình công thức chia tiền
- **Then** công thức được áp dụng cho các chi tiêu mới\*\*

#### Chi tiết chức năng:

- Chọn công thức chia tiền từ danh sách
- Cấu hình tham số cho công thức
- Preview kết quả chia tiền
- Áp dụng cho chi tiêu mới
- Lưu cấu hình cho nhóm

#### UI/UX Requirements:

- Dropdown chọn công thức chia tiền
- Form cấu hình tham số
- Preview panel hiển thị kết quả
- Button "Lưu cấu hình"

#### Validation Rules:

- Công thức phải hợp lệ
- Tham số phải trong phạm vi cho phép
- Chỉ áp dụng cho chi tiêu mới

---

### US-034: Xem tổng kết tài chính

**Là một thành viên của nhóm**  
**Tôi muốn xem tổng kết tài chính**  
**Để hiểu rõ tình hình tài chính của nhóm**

#### Acceptance Criteria:

- **Given** tôi là thành viên của nhóm
- **When** tôi truy cập trang tổng kết tài chính
- **Then** tôi thấy báo cáo tổng quan về tài chính nhóm\*\*

#### Chi tiết chức năng:

- Tổng chi tiêu của nhóm
- Tổng công nợ chưa thanh toán
- Số dư của từng thành viên
- Biểu đồ phân bố chi tiêu
- Xuất báo cáo tài chính

#### UI/UX Requirements:

- Dashboard với các card thống kê
- Biểu đồ tròn cho phân bố chi tiêu
- Bảng số dư thành viên
- Button "Xuất báo cáo"

#### Validation Rules:

- Chỉ hiển thị dữ liệu của nhóm hiện tại
- Tính toán chính xác dựa trên chi tiêu thực tế

## Technical Requirements

### API Endpoints:

- `GET /api/groups/:groupId/balances` - Lấy bảng công nợ
- `POST /api/groups/:groupId/settlements` - Tạo giao dịch thanh toán
- `GET /api/groups/:groupId/settlements` - Lấy lịch sử thanh toán
- `PUT /api/settlements/:id/mark-paid` - Đánh dấu đã thanh toán
- `PUT /api/settlements/:id/confirm` - Xác nhận thanh toán
- `DELETE /api/settlements/:id` - Hủy giao dịch
- `GET /api/groups/:groupId/financial-summary` - Tổng kết tài chính
- `PUT /api/groups/:groupId/payment-formula` - Cấu hình công thức chia tiền

### Database Operations:

- Tính toán công nợ dựa trên chi tiêu
- Tạo và cập nhật giao dịch thanh toán
- Cập nhật trạng thái thanh toán
- Lưu cấu hình công thức chia tiền
- Tính toán tổng kết tài chính

### Security Requirements:

- Chỉ thành viên nhóm mới xem được công nợ
- Validate quyền tạo/hủy giao dịch
- Rate limiting cho API thanh toán
- Audit log cho các giao dịch quan trọng

### Performance Requirements:

- Tính toán công nợ < 1 giây
- API response time < 500ms
- Cache kết quả tính toán công nợ
- Background job cho tính toán phức tạp

## Dependencies

### Frontend Dependencies:

- React Query cho data fetching
- Chart.js cho biểu đồ tài chính
- React Hook Form cho form handling
- Toast notifications cho feedback

### Backend Dependencies:

- NestJS framework
- MongoDB với Mongoose
- Bull Queue cho background jobs
- class-validator cho validation

### External Services:

- Email service cho thông báo thanh toán
- PDF generator cho xuất báo cáo
- CDN cho static assets
