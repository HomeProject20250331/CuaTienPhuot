# Epic 2: Quản lý nhóm

## Tổng quan Epic

Epic này bao gồm tất cả các chức năng liên quan đến việc tạo, quản lý và tham gia các nhóm du lịch. Người dùng có thể tạo nhóm mới, mời thành viên, quản lý quyền hạn và theo dõi thông tin nhóm.

## User Stories

### US-008: Tạo nhóm du lịch mới

**Là một người dùng đã đăng nhập**  
**Tôi muốn tạo nhóm du lịch mới**  
**Để bắt đầu quản lý chi tiêu cho chuyến đi**

#### Acceptance Criteria:

- **Given** tôi đã đăng nhập vào hệ thống
- **When** tôi điền thông tin nhóm và tạo nhóm
- **Then** nhóm được tạo thành công và tôi trở thành admin

#### Chi tiết chức năng:

- Form tạo nhóm: Tên nhóm, Mô tả, Ảnh bìa, Cài đặt nhóm
- Tự động tạo invite code cho nhóm
- Thiết lập cài đặt mặc định cho nhóm
- Tự động thêm người tạo làm admin

#### UI/UX Requirements:

- Form tạo nhóm với layout rõ ràng
- Upload ảnh bìa với preview
- Toggle switches cho các cài đặt nhóm
- Nút "Tạo nhóm" và "Hủy"

#### Validation Rules:

- Tên nhóm: Bắt buộc, tối đa 100 ký tự
- Mô tả: Tối đa 500 ký tự
- Ảnh bìa: JPG/PNG, tối đa 10MB

#### Error Handling:

- Tên nhóm trống: "Tên nhóm không được để trống"
- Lỗi upload ảnh: "Không thể upload ảnh bìa"
- Lỗi tạo nhóm: "Không thể tạo nhóm, thử lại"

---

### US-009: Mời thành viên vào nhóm

**Là một admin của nhóm**  
**Tôi muốn mời thành viên mới vào nhóm**  
**Để họ có thể tham gia quản lý chi tiêu**

#### Acceptance Criteria:

- **Given** tôi là admin của nhóm
- **When** tôi mời thành viên qua email hoặc link
- **Then** thành viên nhận được lời mời và có thể tham gia nhóm

#### Chi tiết chức năng:

- Mời qua email: Nhập email, gửi lời mời
- Mời qua link: Copy link mời, chia sẻ
- Xem danh sách lời mời đã gửi
- Hủy lời mời chưa được chấp nhận

#### UI/UX Requirements:

- Modal mời thành viên với 2 tab: Email và Link
- Input email với validation
- Button copy link với feedback
- Danh sách lời mời với trạng thái

#### Validation Rules:

- Email: Format hợp lệ, chưa là thành viên
- Link mời: Có thời hạn 7 ngày

#### Error Handling:

- Email không hợp lệ: "Email không đúng định dạng"
- Email đã là thành viên: "Người này đã là thành viên"
- Lỗi gửi email: "Không thể gửi lời mời"

---

### US-010: Tham gia nhóm qua link mời

**Là một người dùng đã đăng nhập**  
**Tôi muốn tham gia nhóm qua link mời**  
**Để có thể tham gia quản lý chi tiêu nhóm**

#### Acceptance Criteria:

- **Given** tôi có link mời hợp lệ
- **When** tôi click vào link và xác nhận tham gia
- **Then** tôi được thêm vào nhóm với quyền member

#### Chi tiết chức năng:

- Xác thực link mời hợp lệ
- Hiển thị thông tin nhóm trước khi tham gia
- Xác nhận tham gia nhóm
- Tự động chuyển đến trang nhóm sau khi tham gia

#### UI/UX Requirements:

- Trang xác nhận tham gia với thông tin nhóm
- Nút "Tham gia nhóm" và "Hủy"
- Hiển thị danh sách thành viên hiện tại

#### Validation Rules:

- Link mời: Phải hợp lệ và chưa hết hạn
- User: Chưa là thành viên của nhóm

#### Error Handling:

- Link không hợp lệ: "Link mời không hợp lệ"
- Link hết hạn: "Link mời đã hết hạn"
- Đã là thành viên: "Bạn đã là thành viên của nhóm này"

---

### US-011: Xem danh sách nhóm của mình

**Là một người dùng đã đăng nhập**  
**Tôi muốn xem danh sách nhóm tôi tham gia**  
**Để dễ dàng truy cập các nhóm**

#### Acceptance Criteria:

- **Given** tôi đã tham gia một hoặc nhiều nhóm
- **When** tôi truy cập trang danh sách nhóm
- **Then** tôi thấy tất cả nhóm với thông tin cơ bản

#### Chi tiết chức năng:

- Hiển thị danh sách nhóm dạng card
- Thông tin: Tên nhóm, Ảnh bìa, Số thành viên, Tổng chi tiêu
- Phân loại: Nhóm tôi tạo, Nhóm tôi tham gia
- Tìm kiếm và lọc nhóm

#### UI/UX Requirements:

- Grid layout cho danh sách nhóm
- Card design với ảnh bìa và thông tin
- Search bar và filter dropdown
- Pagination cho danh sách dài

#### Validation Rules:

- Chỉ hiển thị nhóm user có quyền truy cập
- Sắp xếp theo thời gian tạo mới nhất

---

### US-012: Xem chi tiết nhóm

**Là một thành viên của nhóm**  
**Tôi muốn xem chi tiết nhóm**  
**Để hiểu rõ thông tin và hoạt động của nhóm**

#### Acceptance Criteria:

- **Given** tôi là thành viên của nhóm
- **When** tôi click vào nhóm từ danh sách
- **Then** tôi thấy trang chi tiết nhóm với đầy đủ thông tin

#### Chi tiết chức năng:

- Thông tin nhóm: Tên, mô tả, ảnh bìa, cài đặt
- Danh sách thành viên với vai trò
- Tổng quan chi tiêu: Tổng tiền, số giao dịch
- Các tab: Chi tiêu, Công nợ, Thống kê, Cài đặt

#### UI/UX Requirements:

- Header với ảnh bìa và thông tin nhóm
- Tab navigation cho các chức năng
- Sidebar với danh sách thành viên
- Responsive design cho mobile

#### Validation Rules:

- Chỉ thành viên mới xem được chi tiết nhóm
- Admin có thêm quyền chỉnh sửa

---

### US-013: Chỉnh sửa thông tin nhóm

**Là một admin của nhóm**  
**Tôi muốn chỉnh sửa thông tin nhóm**  
**Để cập nhật thông tin và cài đặt nhóm**

#### Acceptance Criteria:

- **Given** tôi là admin của nhóm
- **When** tôi chỉnh sửa thông tin nhóm
- **Then** thông tin được cập nhật và thông báo cho thành viên

#### Chi tiết chức năng:

- Chỉnh sửa: Tên nhóm, mô tả, ảnh bìa
- Cài đặt: Quyền thêm chi tiêu, yêu cầu phê duyệt
- Cài đặt thông báo cho nhóm
- Lưu thay đổi và thông báo

#### UI/UX Requirements:

- Form chỉnh sửa trong modal hoặc trang riêng
- Upload ảnh bìa mới với preview
- Toggle switches cho các cài đặt
- Nút "Lưu" và "Hủy"

#### Validation Rules:

- Tên nhóm: Bắt buộc, tối đa 100 ký tự
- Mô tả: Tối đa 500 ký tự
- Ảnh bìa: JPG/PNG, tối đa 10MB

#### Error Handling:

- Lỗi lưu thông tin: "Không thể lưu thông tin nhóm"
- Lỗi upload ảnh: "Không thể upload ảnh bìa"

---

### US-014: Quản lý thành viên nhóm

**Là một admin của nhóm**  
**Tôi muốn quản lý thành viên nhóm**  
**Để kiểm soát quyền hạn và loại bỏ thành viên không phù hợp**

#### Acceptance Criteria:

- **Given** tôi là admin của nhóm
- **When** tôi thực hiện các thao tác quản lý thành viên
- **Then** thay đổi được áp dụng và thông báo cho thành viên

#### Chi tiết chức năng:

- Xem danh sách thành viên với vai trò
- Thay đổi vai trò: Member ↔ Admin
- Loại bỏ thành viên khỏi nhóm
- Xem lịch sử hoạt động của thành viên

#### UI/UX Requirements:

- Bảng danh sách thành viên với actions
- Dropdown menu cho mỗi thành viên
- Confirmation dialog cho các thao tác quan trọng
- Hiển thị vai trò và ngày tham gia

#### Validation Rules:

- Không thể loại bỏ chính mình
- Phải có ít nhất 1 admin trong nhóm
- Chỉ admin mới có quyền quản lý thành viên

#### Error Handling:

- Lỗi thay đổi vai trò: "Không thể thay đổi vai trò"
- Lỗi loại bỏ thành viên: "Không thể loại bỏ thành viên"

---

### US-015: Rời khỏi nhóm

**Là một thành viên của nhóm**  
**Tôi muốn rời khỏi nhóm**  
**Khi tôi không còn muốn tham gia nhóm đó**

#### Acceptance Criteria:

- **Given** tôi là thành viên của nhóm
- **When** tôi click rời khỏi nhóm
- **Then** tôi được loại bỏ khỏi nhóm và không thể truy cập

#### Chi tiết chức năng:

- Nút "Rời khỏi nhóm" trong cài đặt nhóm
- Confirmation dialog trước khi rời
- Xử lý trường hợp admin rời nhóm
- Thông báo cho các thành viên khác

#### UI/UX Requirements:

- Nút "Rời khỏi nhóm" trong menu cài đặt
- Confirmation dialog với cảnh báo
- Thông báo thành công sau khi rời

#### Validation Rules:

- Không thể rời nhóm nếu còn nợ tiền
- Admin rời nhóm phải chuyển quyền cho admin khác

#### Error Handling:

- Còn nợ tiền: "Bạn còn nợ tiền, hãy thanh toán trước khi rời nhóm"
- Lỗi rời nhóm: "Không thể rời nhóm, thử lại"

---

### US-016: Xóa nhóm

**Là một admin của nhóm**  
**Tôi muốn xóa nhóm**  
**Khi nhóm không còn hoạt động hoặc cần thiết**

#### Acceptance Criteria:

- **Given** tôi là admin của nhóm
- **When** tôi xóa nhóm
- **Then** nhóm và tất cả dữ liệu liên quan bị xóa vĩnh viễn

#### Chi tiết chức năng:

- Nút "Xóa nhóm" trong cài đặt nhóm
- Confirmation dialog với cảnh báo nghiêm trọng
- Xóa tất cả dữ liệu: chi tiêu, thanh toán, thông báo
- Thông báo cho tất cả thành viên

#### UI/UX Requirements:

- Nút "Xóa nhóm" màu đỏ trong cài đặt
- Confirmation dialog với text cảnh báo
- Yêu cầu nhập tên nhóm để xác nhận

#### Validation Rules:

- Chỉ admin mới có quyền xóa nhóm
- Phải nhập đúng tên nhóm để xác nhận
- Không thể hoàn tác sau khi xóa

#### Error Handling:

- Tên nhóm không đúng: "Tên nhóm không khớp"
- Lỗi xóa nhóm: "Không thể xóa nhóm, thử lại"

## Technical Requirements

### API Endpoints:

- `POST /api/groups` - Tạo nhóm mới
- `GET /api/groups` - Lấy danh sách nhóm của user
- `GET /api/groups/:id` - Lấy chi tiết nhóm
- `PUT /api/groups/:id` - Cập nhật thông tin nhóm
- `DELETE /api/groups/:id` - Xóa nhóm
- `POST /api/groups/:id/members` - Mời thành viên
- `DELETE /api/groups/:id/members/:userId` - Loại bỏ thành viên
- `PUT /api/groups/:id/members/:userId/role` - Thay đổi vai trò
- `GET /api/groups/:id/invite-link` - Lấy link mời
- `POST /api/groups/join/:inviteCode` - Tham gia nhóm qua link
- `POST /api/groups/:id/leave` - Rời khỏi nhóm

### Database Operations:

- Tạo group mới với thông tin cơ bản
- Tạo invite code unique cho nhóm
- Thêm/xóa thành viên trong nhóm
- Cập nhật vai trò thành viên
- Soft delete nhóm và dữ liệu liên quan

### Security Requirements:

- Chỉ thành viên mới xem được thông tin nhóm
- Chỉ admin mới có quyền quản lý nhóm
- Validate invite code trước khi tham gia
- Rate limiting cho API mời thành viên

### Performance Requirements:

- API response time < 500ms
- Hỗ trợ 100+ thành viên mỗi nhóm
- Cache thông tin nhóm để giảm database queries
- Pagination cho danh sách thành viên

## Dependencies

### Frontend Dependencies:

- React Router cho navigation
- React Hook Form cho form handling
- Axios cho API calls
- React Query cho data fetching
- Toast notifications cho feedback

### Backend Dependencies:

- NestJS framework
- MongoDB với Mongoose
- JWT cho authentication
- UUID cho tạo invite code
- class-validator cho validation

### External Services:

- Email service cho gửi lời mời
- File storage cho ảnh bìa nhóm
- CDN cho static assets
