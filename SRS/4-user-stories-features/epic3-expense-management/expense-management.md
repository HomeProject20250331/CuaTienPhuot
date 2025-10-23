# Epic 3: Quản lý chi tiêu

## Tổng quan Epic

Epic này bao gồm tất cả các chức năng liên quan đến việc thêm, chỉnh sửa, xóa và quản lý các khoản chi tiêu trong nhóm du lịch. Người dùng có thể ghi nhận chi tiêu, upload hóa đơn, phân loại và theo dõi chi tiêu.

## User Stories

### US-017: Thêm chi tiêu mới

**Là một thành viên của nhóm**  
**Tôi muốn thêm chi tiêu mới**  
**Để ghi nhận khoản tiền đã chi cho nhóm**

#### Acceptance Criteria:

- **Given** tôi là thành viên của nhóm
- **When** tôi điền thông tin chi tiêu và lưu
- **Then** chi tiêu được thêm vào nhóm và tính toán công nợ tự động

#### Chi tiết chức năng:

- Form thêm chi tiêu: Tiêu đề, Số tiền, Danh mục, Mô tả, Ngày chi
- Chọn người trả tiền (mặc định là người thêm)
- Chọn người tham gia chia tiền
- Upload hóa đơn (tùy chọn)
- Thêm địa điểm (tùy chọn)

#### UI/UX Requirements:

- Modal hoặc trang riêng cho form thêm chi tiêu
- Multi-select cho người tham gia
- Upload hóa đơn với drag & drop
- Preview hóa đơn sau khi upload
- Auto-save draft khi đang nhập

#### Validation Rules:

- Tiêu đề: Bắt buộc, tối đa 200 ký tự
- Số tiền: Bắt buộc, > 0, tối đa 100 triệu VND
- Danh mục: Phải chọn từ danh sách có sẵn
- Người tham gia: Ít nhất 1 người, tất cả phải là thành viên nhóm
- Hóa đơn: JPG/PNG/PDF, tối đa 10MB

#### Error Handling:

- Số tiền không hợp lệ: "Số tiền phải lớn hơn 0"
- Không chọn người tham gia: "Phải chọn ít nhất 1 người tham gia"
- Lỗi upload hóa đơn: "Không thể upload hóa đơn"
- Lỗi lưu chi tiêu: "Không thể lưu chi tiêu, thử lại"

---

### US-018: Xem danh sách chi tiêu của nhóm

**Là một thành viên của nhóm**  
**Tôi muốn xem danh sách chi tiêu của nhóm**  
**Để theo dõi các khoản đã chi và tìm kiếm chi tiêu cụ thể**

#### Acceptance Criteria:

- **Given** tôi là thành viên của nhóm
- **When** tôi truy cập trang chi tiêu của nhóm
- **Then** tôi thấy danh sách tất cả chi tiêu với thông tin chi tiết

#### Chi tiết chức năng:

- Hiển thị danh sách chi tiêu dạng bảng hoặc card
- Thông tin: Tiêu đề, Số tiền, Người trả, Ngày, Danh mục
- Phân trang cho danh sách dài
- Tìm kiếm theo tiêu đề, mô tả
- Lọc theo danh mục, người trả, khoảng thời gian

#### UI/UX Requirements:

- Bảng responsive với các cột thông tin
- Search bar và filter panel
- Pagination controls
- Sort theo các cột khác nhau
- Quick actions cho mỗi chi tiêu

#### Validation Rules:

- Chỉ hiển thị chi tiêu của nhóm hiện tại
- Sắp xếp mặc định theo ngày mới nhất
- Giới hạn 50 chi tiêu mỗi trang

---

### US-019: Xem chi tiết chi tiêu

**Là một thành viên của nhóm**  
**Tôi muốn xem chi tiết một chi tiêu cụ thể**  
**Để hiểu rõ thông tin và người tham gia chia tiền**

#### Acceptance Criteria:

- **Given** tôi là thành viên của nhóm
- **When** tôi click vào một chi tiêu từ danh sách
- **Then** tôi thấy trang chi tiết với đầy đủ thông tin

#### Chi tiết chức năng:

- Hiển thị đầy đủ thông tin chi tiêu
- Danh sách người tham gia và số tiền mỗi người
- Hóa đơn đính kèm (nếu có)
- Địa điểm chi tiêu (nếu có)
- Lịch sử chỉnh sửa (nếu có)

#### UI/UX Requirements:

- Layout 2 cột: thông tin chính và chi tiết
- Image viewer cho hóa đơn
- Map hiển thị địa điểm (nếu có)
- Action buttons cho edit/delete

#### Validation Rules:

- Chỉ thành viên nhóm mới xem được chi tiết
- Hiển thị thông tin đầy đủ và chính xác

---

### US-020: Chỉnh sửa chi tiêu

**Là một thành viên của nhóm**  
**Tôi muốn chỉnh sửa chi tiêu đã tạo**  
**Để sửa lỗi thông tin hoặc cập nhật chi tiết**

#### Acceptance Criteria:

- **Given** tôi đã tạo chi tiêu hoặc là admin nhóm
- **When** tôi chỉnh sửa thông tin chi tiêu
- **Then** chi tiêu được cập nhật và công nợ được tính lại

#### Chi tiết chức năng:

- Form chỉnh sửa với thông tin hiện tại
- Có thể thay đổi: Tiêu đề, Số tiền, Danh mục, Mô tả
- Có thể thay đổi người tham gia
- Có thể thay đổi người trả tiền
- Upload hóa đơn mới hoặc xóa hóa đơn cũ

#### UI/UX Requirements:

- Form chỉnh sửa tương tự form thêm mới
- Hiển thị thông tin hiện tại
- Nút "Lưu" và "Hủy"
- Confirmation khi thay đổi quan trọng

#### Validation Rules:

- Chỉ người tạo hoặc admin mới chỉnh sửa được
- Validation tương tự khi thêm mới
- Không thể chỉnh sửa chi tiêu đã thanh toán

#### Error Handling:

- Không có quyền: "Bạn không có quyền chỉnh sửa chi tiêu này"
- Lỗi lưu: "Không thể lưu thay đổi, thử lại"

---

### US-021: Xóa chi tiêu

**Là một thành viên của nhóm**  
**Tôi muốn xóa chi tiêu đã tạo**  
**Khi chi tiêu được thêm nhầm hoặc không cần thiết**

#### Acceptance Criteria:

- **Given** tôi đã tạo chi tiêu hoặc là admin nhóm
- **When** tôi xóa chi tiêu
- **Then** chi tiêu bị xóa và công nợ được tính lại

#### Chi tiết chức năng:

- Nút "Xóa" trong chi tiết chi tiêu
- Confirmation dialog trước khi xóa
- Xóa hóa đơn đính kèm (nếu có)
- Cập nhật công nợ sau khi xóa

#### UI/UX Requirements:

- Nút "Xóa" màu đỏ trong action menu
- Confirmation dialog với cảnh báo
- Loading state khi đang xóa

#### Validation Rules:

- Chỉ người tạo hoặc admin mới xóa được
- Không thể xóa chi tiêu đã thanh toán
- Phải xác nhận trước khi xóa

#### Error Handling:

- Không có quyền: "Bạn không có quyền xóa chi tiêu này"
- Đã thanh toán: "Không thể xóa chi tiêu đã thanh toán"
- Lỗi xóa: "Không thể xóa chi tiêu, thử lại"

---

### US-022: Upload hóa đơn

**Là một thành viên của nhóm**  
**Tôi muốn upload hóa đơn cho chi tiêu**  
**Để làm bằng chứng và lưu trữ hóa đơn**

#### Acceptance Criteria:

- **Given** tôi đang thêm hoặc chỉnh sửa chi tiêu
- **When** tôi upload file hóa đơn
- **Then** hóa đơn được lưu và hiển thị trong chi tiêu\*\*

#### Chi tiết chức năng:

- Upload file: JPG, PNG, PDF
- Drag & drop interface
- Preview hóa đơn sau khi upload
- Xóa hóa đơn đã upload
- Thay thế hóa đơn cũ

#### UI/UX Requirements:

- Drag & drop zone với icon và text hướng dẫn
- Preview image với zoom
- Progress bar khi upload
- Button xóa hóa đơn

#### Validation Rules:

- File type: JPG, PNG, PDF
- File size: Tối đa 10MB
- File name: Tối đa 255 ký tự

#### Error Handling:

- File không hợp lệ: "File không đúng định dạng"
- File quá lớn: "File quá lớn, tối đa 10MB"
- Lỗi upload: "Không thể upload hóa đơn"

---

### US-023: Lọc và tìm kiếm chi tiêu

**Là một thành viên của nhóm**  
**Tôi muốn lọc và tìm kiếm chi tiêu**  
**Để tìm nhanh chi tiêu cụ thể hoặc theo điều kiện**

#### Acceptance Criteria:

- **Given** tôi đang xem danh sách chi tiêu
- **When** tôi sử dụng tìm kiếm và bộ lọc
- **Then** danh sách được cập nhật theo điều kiện\*\*

#### Chi tiết chức năng:

- Tìm kiếm theo tiêu đề và mô tả
- Lọc theo danh mục
- Lọc theo người trả tiền
- Lọc theo khoảng thời gian
- Lọc theo khoảng số tiền
- Lọc theo trạng thái thanh toán

#### UI/UX Requirements:

- Search bar với placeholder
- Filter panel với các checkbox và dropdown
- Clear filters button
- Kết quả tìm kiếm với highlight
- Số lượng kết quả hiển thị

#### Validation Rules:

- Tìm kiếm: Tối thiểu 2 ký tự
- Khoảng thời gian: Ngày bắt đầu <= Ngày kết thúc
- Khoảng số tiền: Số tiền tối thiểu <= Số tiền tối đa

---

### US-024: Phân loại chi tiêu

**Là một thành viên của nhóm**  
**Tôi muốn phân loại chi tiêu theo danh mục**  
**Để dễ dàng theo dõi và thống kê chi tiêu**

#### Acceptance Criteria:

- **Given** tôi đang thêm hoặc chỉnh sửa chi tiêu
- **When** tôi chọn danh mục cho chi tiêu
- **Then** chi tiêu được phân loại và có thể lọc theo danh mục\*\*

#### Chi tiết chức năng:

- Dropdown danh mục với các tùy chọn:
  - Ăn uống (Food)
  - Di chuyển (Transport)
  - Lưu trú (Accommodation)
  - Giải trí (Entertainment)
  - Mua sắm (Shopping)
  - Khác (Other)
- Tùy chỉnh danh mục cho nhóm (admin)
- Thống kê theo danh mục

#### UI/UX Requirements:

- Dropdown danh mục với icon
- Màu sắc phân biệt cho từng danh mục
- Icon đại diện cho mỗi danh mục
- Quick filter theo danh mục

#### Validation Rules:

- Phải chọn danh mục khi thêm chi tiêu
- Danh mục phải tồn tại trong hệ thống

---

### US-025: Thêm địa điểm chi tiêu

**Là một thành viên của nhóm**  
**Tôi muốn thêm địa điểm cho chi tiêu**  
**Để ghi nhận nơi đã chi tiêu và xem trên bản đồ**

#### Acceptance Criteria:

- **Given** tôi đang thêm hoặc chỉnh sửa chi tiêu
- **When** tôi thêm địa điểm cho chi tiêu
- **Then** địa điểm được lưu và hiển thị trên bản đồ\*\*

#### Chi tiết chức nệng:

- Input địa điểm với autocomplete
- Chọn địa điểm từ Google Maps
- Lưu tọa độ GPS
- Hiển thị địa điểm trên bản đồ
- Lịch sử địa điểm đã sử dụng

#### UI/UX Requirements:

- Input địa điểm với dropdown suggestions
- Map picker để chọn vị trí chính xác
- Hiển thị địa điểm trên map trong chi tiết
- Button "Xóa địa điểm"

#### Validation Rules:

- Địa điểm phải hợp lệ
- Tọa độ GPS phải trong phạm vi hợp lý

#### Error Handling:

- Địa điểm không tìm thấy: "Không tìm thấy địa điểm"
- Lỗi lưu địa điểm: "Không thể lưu địa điểm"

## Technical Requirements

### API Endpoints:

- `POST /api/groups/:groupId/expenses` - Thêm chi tiêu mới
- `GET /api/groups/:groupId/expenses` - Lấy danh sách chi tiêu
- `GET /api/expenses/:id` - Lấy chi tiết chi tiêu
- `PUT /api/expenses/:id` - Chỉnh sửa chi tiêu
- `DELETE /api/expenses/:id` - Xóa chi tiêu
- `POST /api/expenses/:id/upload-receipt` - Upload hóa đơn
- `DELETE /api/expenses/:id/receipt` - Xóa hóa đơn
- `GET /api/groups/:groupId/expenses/search` - Tìm kiếm chi tiêu
- `GET /api/groups/:groupId/expenses/filter` - Lọc chi tiêu

### Database Operations:

- Tạo expense mới với thông tin chi tiết
- Cập nhật expense và tính lại công nợ
- Xóa expense và cập nhật công nợ
- Upload file hóa đơn lên cloud storage
- Tìm kiếm và lọc expense theo điều kiện

### Security Requirements:

- Chỉ thành viên nhóm mới thêm/sửa/xóa chi tiêu
- Validate file upload để tránh malware
- Rate limiting cho API upload file
- Chỉ người tạo hoặc admin mới sửa/xóa được

### Performance Requirements:

- API response time < 500ms
- File upload progress tracking
- Pagination cho danh sách chi tiêu
- Cache danh sách chi tiêu để giảm database queries

## Dependencies

### Frontend Dependencies:

- React Hook Form cho form handling
- React Dropzone cho file upload
- React Query cho data fetching
- Google Maps API cho địa điểm
- Image viewer cho hóa đơn

### Backend Dependencies:

- NestJS framework
- MongoDB với Mongoose
- Multer cho file upload
- Sharp cho image processing
- Google Maps API cho địa điểm

### External Services:

- Cloud storage (AWS S3/Cloudinary) cho hóa đơn
- Google Maps API cho địa điểm
- CDN cho static assets
