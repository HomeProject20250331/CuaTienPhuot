# API Specifications - Tổng quan

## Base URL

```
Production: https://api.cuatienphuot.com
Development: http://localhost:3001
```

## Authentication

Tất cả API endpoints (trừ authentication) đều yêu cầu JWT token trong header:

```
Authorization: Bearer <jwt_token>
```

## Common Response Format

### Success Response

```json
{
  "success": true,
  "data": <response_data>,
  "message": "Success message",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": "Additional error details"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## HTTP Status Codes

| Code | Description                                                 |
| ---- | ----------------------------------------------------------- |
| 200  | OK - Request thành công                                     |
| 201  | Created - Tạo mới thành công                                |
| 400  | Bad Request - Dữ liệu đầu vào không hợp lệ                  |
| 401  | Unauthorized - Chưa đăng nhập hoặc token hết hạn            |
| 403  | Forbidden - Không có quyền truy cập                         |
| 404  | Not Found - Không tìm thấy resource                         |
| 409  | Conflict - Xung đột dữ liệu (VD: email đã tồn tại)          |
| 422  | Unprocessable Entity - Dữ liệu hợp lệ nhưng không thể xử lý |
| 429  | Too Many Requests - Quá nhiều request                       |
| 500  | Internal Server Error - Lỗi server                          |

## Pagination

Các API trả về danh sách đều hỗ trợ pagination:

### Query Parameters

- `page`: Số trang (default: 1)
- `limit`: Số items per page (default: 20, max: 100)
- `sort`: Trường sắp xếp (default: createdAt)
- `order`: Thứ tự sắp xếp (asc/desc, default: desc)

### Response Format

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## File Upload

Các API upload file hỗ trợ:

- **Content-Type**: multipart/form-data
- **Max file size**: 5MB
- **Supported formats**: jpg, jpeg, png, pdf
- **Response**: Trả về URL của file đã upload

## Rate Limiting

- **Authentication endpoints**: 5 requests/minute
- **Other endpoints**: 100 requests/minute
- **File upload**: 10 requests/minute

## API Endpoints Overview

### Authentication APIs

- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `POST /api/auth/refresh-token` - Làm mới token
- `POST /api/auth/forgot-password` - Quên mật khẩu
- `POST /api/auth/reset-password` - Đặt lại mật khẩu

### User APIs

- `GET /api/users/me` - Lấy thông tin profile
- `PUT /api/users/me` - Cập nhật profile
- `PUT /api/users/me/password` - Đổi mật khẩu
- `PUT /api/users/me/avatar` - Cập nhật avatar
- `GET /api/users/me/groups` - Danh sách nhóm của user
- `GET /api/users/me/notifications` - Thông báo cá nhân

### Group APIs

- `POST /api/groups` - Tạo nhóm mới
- `GET /api/groups` - Danh sách nhóm của user
- `GET /api/groups/:id` - Chi tiết nhóm
- `PUT /api/groups/:id` - Cập nhật nhóm
- `DELETE /api/groups/:id` - Xóa nhóm
- `POST /api/groups/:id/members` - Thêm thành viên
- `DELETE /api/groups/:id/members/:userId` - Xóa thành viên
- `GET /api/groups/:id/invite-link` - Lấy link mời
- `PUT /api/groups/:id/settings` - Cập nhật cài đặt nhóm
- `GET /api/groups/:id/members` - Danh sách thành viên

### Expense APIs

- `POST /api/groups/:groupId/expenses` - Thêm chi tiêu
- `GET /api/groups/:groupId/expenses` - Danh sách chi tiêu
- `GET /api/expenses/:id` - Chi tiết chi tiêu
- `PUT /api/expenses/:id` - Cập nhật chi tiêu
- `DELETE /api/expenses/:id` - Xóa chi tiêu
- `POST /api/expenses/:id/receipt` - Upload hóa đơn
- `GET /api/groups/:groupId/expense-categories` - Danh mục chi tiêu
- `POST /api/groups/:groupId/expense-categories` - Thêm danh mục

### Settlement APIs

- `GET /api/groups/:groupId/balances` - Bảng công nợ
- `POST /api/groups/:groupId/settlements` - Tạo thanh toán
- `GET /api/groups/:groupId/settlements` - Lịch sử thanh toán
- `PUT /api/settlements/:id/mark-paid` - Đánh dấu đã thanh toán
- `GET /api/groups/:groupId/payment-formulas` - Công thức chia tiền
- `PUT /api/groups/:groupId/payment-formulas` - Cập nhật công thức

### Statistics APIs

- `GET /api/groups/:groupId/stats/summary` - Tổng quan thống kê
- `GET /api/groups/:groupId/stats/by-category` - Thống kê theo danh mục
- `GET /api/groups/:groupId/stats/by-member` - Thống kê theo thành viên
- `GET /api/groups/:groupId/stats/by-time` - Thống kê theo thời gian
- `POST /api/groups/:groupId/stats/export` - Export báo cáo

### Notification APIs

- `GET /api/notifications` - Danh sách thông báo
- `PUT /api/notifications/:id/read` - Đánh dấu đã đọc
- `PUT /api/notifications/read-all` - Đánh dấu tất cả đã đọc
- `DELETE /api/notifications/:id` - Xóa thông báo
- `GET /api/users/me/notification-settings` - Cài đặt thông báo
- `PUT /api/users/me/notification-settings` - Cập nhật cài đặt
