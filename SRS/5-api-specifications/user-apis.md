# User Management APIs

## GET /api/users/me

Lấy thông tin profile của user hiện tại.

### Headers

```
Authorization: Bearer <access_token>
```

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "fullName": "Nguyễn Văn A",
    "phone": "+84901234567",
    "avatar": "https://example.com/avatar.jpg",
    "isEmailVerified": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "lastLoginAt": "2024-01-01T00:00:00.000Z",
    "preferences": {
      "language": "vi",
      "timezone": "Asia/Ho_Chi_Minh",
      "currency": "VND",
      "notifications": {
        "email": true,
        "push": true,
        "sms": false
      }
    }
  }
}
```

### Error Responses

- **401**: Token không hợp lệ hoặc đã hết hạn

---

## PUT /api/users/me

Cập nhật thông tin profile.

### Headers

```
Authorization: Bearer <access_token>
```

### Request Body

```json
{
  "fullName": "Nguyễn Văn B",
  "phone": "+84901234568",
  "preferences": {
    "language": "en",
    "timezone": "UTC",
    "currency": "USD",
    "notifications": {
      "email": true,
      "push": false,
      "sms": true
    }
  }
}
```

### Validation Rules

- `fullName`: Optional, min 2 characters, max 100 characters
- `phone`: Optional, valid Vietnamese phone format
- `preferences`: Optional object
  - `language`: "vi" | "en"
  - `timezone`: Valid timezone string
  - `currency`: "VND" | "USD" | "EUR"
  - `notifications`: Object with boolean values

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "fullName": "Nguyễn Văn B",
    "phone": "+84901234568",
    "avatar": "https://example.com/avatar.jpg",
    "isEmailVerified": true,
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "preferences": {
      "language": "en",
      "timezone": "UTC",
      "currency": "USD",
      "notifications": {
        "email": true,
        "push": false,
        "sms": true
      }
    }
  },
  "message": "Profile đã được cập nhật"
}
```

### Error Responses

- **400**: Dữ liệu đầu vào không hợp lệ
- **401**: Token không hợp lệ hoặc đã hết hạn
- **409**: Số điện thoại đã được sử dụng bởi user khác

---

## PUT /api/users/me/password

Đổi mật khẩu.

### Headers

```
Authorization: Bearer <access_token>
```

### Request Body

```json
{
  "currentPassword": "old_password123",
  "newPassword": "new_password123"
}
```

### Validation Rules

- `currentPassword`: Required, mật khẩu hiện tại
- `newPassword`: Required, min 8 characters, must contain letters and numbers, khác với currentPassword

### Success Response (200)

```json
{
  "success": true,
  "message": "Mật khẩu đã được thay đổi thành công"
}
```

### Error Responses

- **400**: Dữ liệu đầu vào không hợp lệ
- **401**: Token không hợp lệ hoặc mật khẩu hiện tại không chính xác
- **422**: Mật khẩu mới không đủ mạnh hoặc trùng với mật khẩu cũ

### Security Notes

- Sau khi đổi mật khẩu thành công, tất cả refresh tokens sẽ bị vô hiệu hóa
- User cần đăng nhập lại

---

## PUT /api/users/me/avatar

Cập nhật avatar.

### Headers

```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

### Request Body (multipart/form-data)

```
avatar: <file>
```

### File Requirements

- **Max size**: 5MB
- **Supported formats**: jpg, jpeg, png, gif
- **Dimensions**: 200x200px to 2048x2048px
- **Aspect ratio**: 1:1 (square)

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "avatar": "https://example.com/avatars/user_id_1640995200.jpg",
    "avatarThumbnail": "https://example.com/avatars/thumb_user_id_1640995200.jpg"
  },
  "message": "Avatar đã được cập nhật"
}
```

### Error Responses

- **400**: File không hợp lệ hoặc quá lớn
- **401**: Token không hợp lệ hoặc đã hết hạn
- **413**: File quá lớn (>5MB)
- **415**: Định dạng file không được hỗ trợ

### Processing Notes

- File sẽ được resize về 400x400px cho thumbnail
- File gốc được giữ nguyên (max 2048x2048px)
- Avatar cũ sẽ bị xóa sau khi upload thành công

---

## DELETE /api/users/me/avatar

Xóa avatar (trở về avatar mặc định).

### Headers

```
Authorization: Bearer <access_token>
```

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "avatar": null,
    "avatarThumbnail": null
  },
  "message": "Avatar đã được xóa"
}
```

### Error Responses

- **401**: Token không hợp lệ hoặc đã hết hạn

---

## GET /api/users/me/groups

Lấy danh sách nhóm của user.

### Headers

```
Authorization: Bearer <access_token>
```

### Query Parameters

- `page`: Số trang (default: 1)
- `limit`: Số items per page (default: 20, max: 100)
- `status`: Lọc theo trạng thái ("active" | "archived")
- `role`: Lọc theo vai trò ("admin" | "member")

### Success Response (200)

```json
{
  "success": true,
  "data": [
    {
      "id": "group_id",
      "name": "Nhóm du lịch Đà Lạt",
      "description": "Chuyến đi Đà Lạt tháng 3",
      "avatar": "https://example.com/group_avatar.jpg",
      "role": "admin",
      "memberCount": 5,
      "totalExpenses": 5000000,
      "lastActivity": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### Error Responses

- **401**: Token không hợp lệ hoặc đã hết hạn

---

## GET /api/users/me/notifications

Lấy danh sách thông báo của user.

### Headers

```
Authorization: Bearer <access_token>
```

### Query Parameters

- `page`: Số trang (default: 1)
- `limit`: Số items per page (default: 20, max: 100)
- `type`: Lọc theo loại thông báo ("expense" | "settlement" | "group" | "system")
- `isRead`: Lọc theo trạng thái đọc (true | false)

### Success Response (200)

```json
{
  "success": true,
  "data": [
    {
      "id": "notification_id",
      "type": "expense",
      "title": "Chi tiêu mới",
      "message": "Bạn có chi tiêu mới trong nhóm 'Nhóm du lịch Đà Lạt'",
      "isRead": false,
      "data": {
        "groupId": "group_id",
        "expenseId": "expense_id",
        "amount": 500000
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  },
  "unreadCount": 5
}
```

### Error Responses

- **401**: Token không hợp lệ hoặc đã hết hạn
