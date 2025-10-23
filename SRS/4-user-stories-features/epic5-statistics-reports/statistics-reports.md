# Epic 5: Thống kê & Báo cáo

## Tổng quan Epic

Epic này bao gồm tất cả các chức năng liên quan đến việc thống kê, phân tích dữ liệu chi tiêu và tạo báo cáo cho nhóm du lịch. Người dùng có thể xem các biểu đồ, bảng thống kê và xuất báo cáo để hiểu rõ tình hình tài chính của nhóm.

## User Stories

### US-035: Xem tổng chi tiêu của nhóm

**Là một thành viên của nhóm**  
**Tôi muốn xem tổng chi tiêu của nhóm**  
**Để biết tổng số tiền đã chi trong chuyến đi**

#### Acceptance Criteria:

- **Given** tôi là thành viên của nhóm có chi tiêu
- **When** tôi truy cập trang thống kê của nhóm
- **Then** tôi thấy tổng chi tiêu với các thông tin chi tiết\*\*

#### Chi tiết chức năng:

- Hiển thị tổng chi tiêu của nhóm
- Tổng chi tiêu theo từng thành viên
- Tổng chi tiêu theo danh mục
- Tổng chi tiêu theo khoảng thời gian
- So sánh với ngân sách dự kiến (nếu có)

#### UI/UX Requirements:

- Card hiển thị tổng chi tiêu nổi bật
- Biểu đồ cột cho chi tiêu theo thành viên
- Biểu đồ tròn cho chi tiêu theo danh mục
- Timeline cho chi tiêu theo thời gian
- Responsive design cho mobile

#### Validation Rules:

- Chỉ hiển thị chi tiêu của nhóm hiện tại
- Tính toán chính xác dựa trên dữ liệu thực tế
- Làm tròn số tiền đến 1000 VND

---

### US-036: Xem chi tiêu theo danh mục

**Là một thành viên của nhóm**  
**Tôi muốn xem chi tiêu theo danh mục**  
**Để hiểu rõ nhóm đã chi tiêu nhiều nhất vào việc gì**

#### Acceptance Criteria:

- **Given** tôi đang xem trang thống kê của nhóm
- **When** tôi chọn xem chi tiêu theo danh mục
- **Then** tôi thấy biểu đồ và bảng chi tiêu theo danh mục\*\*

#### Chi tiết chức năng:

- Biểu đồ tròn hiển thị tỷ lệ chi tiêu theo danh mục
- Bảng chi tiết: Danh mục, Số tiền, Tỷ lệ %
- Top 3 danh mục chi tiêu nhiều nhất
- So sánh chi tiêu theo danh mục giữa các thành viên
- Lọc theo khoảng thời gian

#### UI/UX Requirements:

- Biểu đồ tròn với màu sắc phân biệt
- Legend hiển thị tên danh mục và tỷ lệ
- Bảng chi tiết với sort theo số tiền
- Filter dropdown theo thời gian
- Hover effect hiển thị chi tiết

#### Validation Rules:

- Chỉ hiển thị danh mục có chi tiêu
- Tính tỷ lệ % chính xác
- Sắp xếp theo số tiền giảm dần

---

### US-037: Xem chi tiêu theo thành viên

**Là một thành viên của nhóm**  
**Tôi muốn xem chi tiêu theo thành viên**  
**Để biết ai đã chi tiêu nhiều nhất trong nhóm**

#### Acceptance Criteria:

- **Given** tôi đang xem trang thống kê của nhóm
- **When** tôi chọn xem chi tiêu theo thành viên
- **Then** tôi thấy bảng và biểu đồ chi tiêu theo thành viên\*\*

#### Chi tiết chức năng:

- Bảng chi tiêu theo thành viên: Tên, Số tiền, Số giao dịch, Tỷ lệ %
- Biểu đồ cột hiển thị chi tiêu của từng thành viên
- Ranking thành viên theo tổng chi tiêu
- Chi tiết chi tiêu của từng thành viên
- So sánh chi tiêu giữa các thành viên

#### UI/UX Requirements:

- Bảng với avatar và tên thành viên
- Biểu đồ cột với màu sắc khác nhau
- Progress bar cho tỷ lệ chi tiêu
- Click vào thành viên để xem chi tiết
- Sort theo các cột khác nhau

#### Validation Rules:

- Chỉ hiển thị thành viên có chi tiêu
- Tính toán chính xác số tiền và tỷ lệ
- Sắp xếp theo số tiền giảm dần

---

### US-038: Xem chi tiêu theo thời gian

**Là một thành viên của nhóm**  
**Tôi muốn xem chi tiêu theo thời gian**  
**Để theo dõi xu hướng chi tiêu trong suốt chuyến đi**

#### Acceptance Criteria:

- **Given** tôi đang xem trang thống kê của nhóm
- **When** tôi chọn xem chi tiêu theo thời gian
- **Then** tôi thấy biểu đồ và bảng chi tiêu theo thời gian\*\*

#### Chi tiết chức năng:

- Biểu đồ đường hiển thị chi tiêu theo ngày
- Biểu đồ cột cho chi tiêu theo tuần/tháng
- Tổng chi tiêu theo từng ngày
- Xu hướng chi tiêu tăng/giảm
- So sánh chi tiêu giữa các ngày

#### UI/UX Requirements:

- Biểu đồ đường với timeline
- Toggle switch cho ngày/tuần/tháng
- Hover hiển thị chi tiết từng điểm
- Zoom in/out cho biểu đồ
- Export biểu đồ dưới dạng hình ảnh

#### Validation Rules:

- Hiển thị tất cả ngày có chi tiêu
- Tính toán chính xác tổng chi tiêu theo thời gian
- Xử lý timezone đúng

---

### US-039: Xuất báo cáo PDF

**Là một thành viên của nhóm**  
**Tôi muốn xuất báo cáo PDF**  
**Để lưu trữ và chia sẻ báo cáo tài chính của nhóm**

#### Acceptance Criteria:

- **Given** tôi đang xem trang thống kê của nhóm
- **When** tôi click xuất báo cáo PDF
- **Then** tôi nhận được file PDF chứa báo cáo đầy đủ\*\*

#### Chi tiết chức năng:

- Tạo báo cáo PDF với đầy đủ thông tin
- Bao gồm: Tổng quan, Chi tiêu theo danh mục, Chi tiêu theo thành viên
- Biểu đồ và bảng thống kê
- Thông tin nhóm và thời gian báo cáo
- Tùy chọn chọn nội dung cần xuất

#### UI/UX Requirements:

- Button "Xuất PDF" trong trang thống kê
- Modal chọn nội dung cần xuất
- Progress bar khi đang tạo PDF
- Download file tự động khi hoàn thành
- Preview PDF trước khi tải

#### Validation Rules:

- Chỉ thành viên nhóm mới xuất được báo cáo
- File PDF phải chứa đầy đủ thông tin
- Kích thước file PDF < 10MB

#### Error Handling:

- Lỗi tạo PDF: "Không thể tạo báo cáo PDF, thử lại"
- File quá lớn: "Dữ liệu quá lớn, vui lòng chọn khoảng thời gian nhỏ hơn"

---

### US-040: Xuất báo cáo Excel

**Là một thành viên của nhóm**  
**Tôi muốn xuất báo cáo Excel**  
**Để phân tích dữ liệu chi tiết trong Excel**

#### Acceptance Criteria:

- **Given** tôi đang xem trang thống kê của nhóm
- **When** tôi click xuất báo cáo Excel
- **Then** tôi nhận được file Excel chứa dữ liệu chi tiết\*\*

#### Chi tiết chức năng:

- Tạo file Excel với nhiều sheet
- Sheet 1: Tổng quan chi tiêu
- Sheet 2: Chi tiết từng giao dịch
- Sheet 3: Chi tiêu theo danh mục
- Sheet 4: Chi tiêu theo thành viên
- Sheet 5: Chi tiêu theo thời gian

#### UI/UX Requirements:

- Button "Xuất Excel" bên cạnh xuất PDF
- Modal chọn sheet cần xuất
- Progress bar khi đang tạo Excel
- Download file tự động khi hoàn thành

#### Validation Rules:

- Chỉ thành viên nhóm mới xuất được
- File Excel phải chứa dữ liệu chính xác
- Kích thước file Excel < 50MB

---

### US-041: So sánh chi tiêu giữa các nhóm

**Là một người dùng tham gia nhiều nhóm**  
**Tôi muốn so sánh chi tiêu giữa các nhóm**  
**Để hiểu rõ chi tiêu của từng chuyến đi**

#### Acceptance Criteria:

- **Given** tôi tham gia nhiều nhóm du lịch
- **When** tôi truy cập trang so sánh nhóm
- **Then** tôi thấy bảng so sánh chi tiêu giữa các nhóm\*\*

#### Chi tiết chức năng:

- Bảng so sánh: Tên nhóm, Tổng chi tiêu, Số thành viên, Chi tiêu/người
- Biểu đồ cột so sánh tổng chi tiêu
- Biểu đồ tròn so sánh chi tiêu theo danh mục
- Ranking các nhóm theo chi tiêu
- Lọc theo khoảng thời gian

#### UI/UX Requirements:

- Bảng so sánh với các cột rõ ràng
- Biểu đồ cột side-by-side
- Color coding cho từng nhóm
- Click vào nhóm để xem chi tiết
- Export báo cáo so sánh

#### Validation Rules:

- Chỉ hiển thị nhóm user tham gia
- Tính toán chính xác chi tiêu/người
- Sắp xếp theo tổng chi tiêu giảm dần

---

### US-042: Xem báo cáo chi tiết cá nhân

**Là một thành viên của nhóm**  
**Tôi muốn xem báo cáo chi tiết cá nhân**  
**Để theo dõi chi tiêu cá nhân trong nhóm**

#### Acceptance Criteria:

- **Given** tôi là thành viên của nhóm
- **When** tôi truy cập trang báo cáo cá nhân
- **Then** tôi thấy báo cáo chi tiết về chi tiêu cá nhân\*\*

#### Chi tiết chức năng:

- Tổng chi tiêu cá nhân trong nhóm
- Chi tiêu theo danh mục của cá nhân
- Chi tiêu theo thời gian của cá nhân
- So sánh với trung bình nhóm
- Ranking cá nhân trong nhóm

#### UI/UX Requirements:

- Dashboard cá nhân với các card thống kê
- Biểu đồ tròn cho chi tiêu theo danh mục
- Biểu đồ đường cho chi tiêu theo thời gian
- Progress bar so sánh với trung bình
- Export báo cáo cá nhân

#### Validation Rules:

- Chỉ hiển thị dữ liệu của user hiện tại
- Tính toán chính xác dựa trên chi tiêu thực tế
- So sánh với dữ liệu nhóm chính xác

---

### US-043: Thiết lập ngân sách dự kiến

**Là một admin của nhóm**  
**Tôi muốn thiết lập ngân sách dự kiến**  
**Để theo dõi chi tiêu so với kế hoạch**

#### Acceptance Criteria:

- **Given** tôi là admin của nhóm
- **When** tôi thiết lập ngân sách dự kiến
- **Then** hệ thống theo dõi chi tiêu so với ngân sách\*\*

#### Chi tiết chức năng:

- Thiết lập ngân sách tổng cho nhóm
- Thiết lập ngân sách theo danh mục
- Thiết lập ngân sách theo thành viên
- Cảnh báo khi vượt ngân sách
- Báo cáo thực tế vs dự kiến

#### UI/UX Requirements:

- Form thiết lập ngân sách với các trường
- Slider cho ngân sách tổng
- Input cho ngân sách theo danh mục
- Toggle switch cho cảnh báo
- Preview ngân sách trước khi lưu

#### Validation Rules:

- Ngân sách phải > 0
- Ngân sách theo danh mục không vượt quá tổng
- Chỉ admin mới thiết lập được

---

### US-044: Xem cảnh báo vượt ngân sách

**Là một thành viên của nhóm**  
**Tôi muốn nhận cảnh báo vượt ngân sách**  
**Để kiểm soát chi tiêu trong kế hoạch**

#### Acceptance Criteria:

- **Given** nhóm đã thiết lập ngân sách dự kiến
- **When** chi tiêu vượt quá ngân sách
- **Then** tôi nhận được cảnh báo và thông báo\*\*

#### Chi tiết chức năng:

- Cảnh báo khi vượt ngân sách tổng
- Cảnh báo khi vượt ngân sách theo danh mục
- Cảnh báo khi vượt ngân sách cá nhân
- Thông báo real-time khi thêm chi tiêu
- Dashboard hiển thị tình trạng ngân sách

#### UI/UX Requirements:

- Toast notification cho cảnh báo
- Badge cảnh báo trên menu
- Dashboard với progress bar ngân sách
- Color coding: xanh (an toàn), vàng (cảnh báo), đỏ (vượt)

#### Validation Rules:

- Cảnh báo chỉ hiển thị khi vượt ngân sách
- Tính toán chính xác dựa trên chi tiêu thực tế
- Cảnh báo real-time khi có chi tiêu mới

## Technical Requirements

### API Endpoints:

- `GET /api/groups/:groupId/stats/summary` - Tổng quan thống kê
- `GET /api/groups/:groupId/stats/by-category` - Chi tiêu theo danh mục
- `GET /api/groups/:groupId/stats/by-member` - Chi tiêu theo thành viên
- `GET /api/groups/:groupId/stats/by-time` - Chi tiêu theo thời gian
- `GET /api/groups/:groupId/stats/comparison` - So sánh với nhóm khác
- `GET /api/users/me/stats/personal` - Báo cáo cá nhân
- `POST /api/groups/:groupId/export/pdf` - Xuất báo cáo PDF
- `POST /api/groups/:groupId/export/excel` - Xuất báo cáo Excel
- `PUT /api/groups/:groupId/budget` - Thiết lập ngân sách
- `GET /api/groups/:groupId/budget/alerts` - Cảnh báo ngân sách

### Database Operations:

- Aggregate queries cho thống kê
- Tính toán tổng chi tiêu theo các tiêu chí
- So sánh dữ liệu giữa các nhóm
- Lưu trữ cấu hình ngân sách
- Cache kết quả thống kê để tăng performance

### Security Requirements:

- Chỉ thành viên nhóm mới xem được thống kê
- Validate quyền xuất báo cáo
- Rate limiting cho API xuất báo cáo
- Audit log cho các thao tác xuất báo cáo

### Performance Requirements:

- Thống kê phức tạp < 2 giây
- Cache kết quả thống kê 1 giờ
- Background job cho xuất báo cáo lớn
- Pagination cho dữ liệu lớn

## Dependencies

### Frontend Dependencies:

- Chart.js cho biểu đồ
- React Query cho data fetching
- PDF.js cho preview PDF
- ExcelJS cho xuất Excel
- React Hook Form cho form handling

### Backend Dependencies:

- NestJS framework
- MongoDB với Mongoose
- Puppeteer cho tạo PDF
- ExcelJS cho xuất Excel
- Bull Queue cho background jobs

### External Services:

- Cloud storage cho file báo cáo
- Email service cho gửi báo cáo
- CDN cho static assets
