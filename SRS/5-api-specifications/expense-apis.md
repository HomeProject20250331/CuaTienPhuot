# Expense Management APIs

## POST /api/groups/:groupId/expenses

Thêm chi tiêu mới vào nhóm.

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

- `groupId`: Group ID

### Request Body

```json
{
  "title": "Ăn trưa tại nhà hàng ABC",
  "description": "Bữa trưa cho cả nhóm",
  "amount": 500000,
  "currency": "VND",
  "category": "food",
  "paidBy": "user_id",
  "participants": [
    {
      "userId": "user_id_1",
      "amount": 100000
    },
    {
      "userId": "user_id_2",
      "amount": 100000
    },
    {
      "userId": "user_id_3",
      "amount": 100000
    }
  ],
  "expenseDate": "2024-01-01T12:00:00.000Z",
  "location": "Nhà hàng ABC, Quận 1, TP.HCM",
  "tags": ["lunch", "restaurant"]
}
```

### Validation Rules

- `title`: Required, min 2 characters, max 200 characters
- `description`: Optional, max 1000 characters
- `amount`: Required, > 0, max 999,999,999
- `currency`: Required, phải khớp với currency của nhóm
- `category`: Required, "food" | "transport" | "accommodation" | "entertainment" | "shopping" | "other"
- `paidBy`: Required, user ID của người trả tiền
- `participants`: Required array, min 1 participant
  - `userId`: Required, user ID
  - `amount`: Required, > 0, tổng phải bằng amount
- `expenseDate`: Optional, ISO 8601 format (default: now)
- `location`: Optional, max 200 characters
- `tags`: Optional array, max 10 tags, mỗi tag max 20 characters

### Success Response (201)

```json
{
  "success": true,
  "data": {
    "id": "expense_id",
    "title": "Ăn trưa tại nhà hàng ABC",
    "description": "Bữa trưa cho cả nhóm",
    "amount": 500000,
    "currency": "VND",
    "category": "food",
    "paidBy": {
      "id": "user_id",
      "fullName": "Nguyễn Văn A",
      "avatar": "https://example.com/avatar.jpg"
    },
    "participants": [
      {
        "userId": "user_id_1",
        "user": {
          "id": "user_id_1",
          "fullName": "Nguyễn Văn B",
          "avatar": "https://example.com/avatar2.jpg"
        },
        "amount": 100000,
        "share": 0.2
      }
    ],
    "expenseDate": "2024-01-01T12:00:00.000Z",
    "location": "Nhà hàng ABC, Quận 1, TP.HCM",
    "tags": ["lunch", "restaurant"],
    "receipt": null,
    "status": "active",
    "createdBy": "user_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Chi tiêu đã được thêm thành công"
}
```

### Error Responses

- **400**: Dữ liệu đầu vào không hợp lệ
- **401**: Token không hợp lệ hoặc đã hết hạn
- **403**: Không có quyền thêm chi tiêu vào nhóm này
- **404**: Nhóm không tồn tại
- **422**: Tổng amount của participants không khớp với amount

---

## GET /api/groups/:groupId/expenses

Lấy danh sách chi tiêu của nhóm.

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

- `groupId`: Group ID

### Query Parameters

- `page`: Số trang (default: 1)
- `limit`: Số items per page (default: 20, max: 100)
- `category`: Lọc theo danh mục
- `paidBy`: Lọc theo người trả tiền (user ID)
- `participant`: Lọc theo người tham gia (user ID)
- `dateFrom`: Lọc từ ngày (ISO 8601)
- `dateTo`: Lọc đến ngày (ISO 8601)
- `minAmount`: Lọc theo số tiền tối thiểu
- `maxAmount`: Lọc theo số tiền tối đa
- `tags`: Lọc theo tags (comma-separated)
- `search`: Tìm kiếm theo title/description

### Success Response (200)

```json
{
  "success": true,
  "data": [
    {
      "id": "expense_id",
      "title": "Ăn trưa tại nhà hàng ABC",
      "description": "Bữa trưa cho cả nhóm",
      "amount": 500000,
      "currency": "VND",
      "category": "food",
      "paidBy": {
        "id": "user_id",
        "fullName": "Nguyễn Văn A",
        "avatar": "https://example.com/avatar.jpg"
      },
      "participantCount": 3,
      "expenseDate": "2024-01-01T12:00:00.000Z",
      "location": "Nhà hàng ABC, Quận 1, TP.HCM",
      "tags": ["lunch", "restaurant"],
      "receipt": "https://example.com/receipt.jpg",
      "status": "active",
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
  "summary": {
    "totalAmount": 500000,
    "totalCount": 1,
    "byCategory": {
      "food": 500000,
      "transport": 0,
      "accommodation": 0
    }
  }
}
```

### Error Responses

- **401**: Token không hợp lệ hoặc đã hết hạn
- **403**: Không có quyền xem chi tiêu của nhóm này
- **404**: Nhóm không tồn tại

---

## GET /api/expenses/:id

Lấy chi tiết chi tiêu.

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

- `id`: Expense ID

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "id": "expense_id",
    "title": "Ăn trưa tại nhà hàng ABC",
    "description": "Bữa trưa cho cả nhóm",
    "amount": 500000,
    "currency": "VND",
    "category": "food",
    "paidBy": {
      "id": "user_id",
      "fullName": "Nguyễn Văn A",
      "avatar": "https://example.com/avatar.jpg",
      "email": "user@example.com"
    },
    "participants": [
      {
        "userId": "user_id_1",
        "user": {
          "id": "user_id_1",
          "fullName": "Nguyễn Văn B",
          "avatar": "https://example.com/avatar2.jpg",
          "email": "user2@example.com"
        },
        "amount": 100000,
        "share": 0.2
      }
    ],
    "expenseDate": "2024-01-01T12:00:00.000Z",
    "location": "Nhà hàng ABC, Quận 1, TP.HCM",
    "tags": ["lunch", "restaurant"],
    "receipt": {
      "url": "https://example.com/receipt.jpg",
      "thumbnail": "https://example.com/receipt_thumb.jpg",
      "uploadedAt": "2024-01-01T00:00:00.000Z"
    },
    "status": "active",
    "createdBy": "user_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "group": {
      "id": "group_id",
      "name": "Nhóm du lịch Đà Lạt",
      "currency": "VND"
    }
  }
}
```

### Error Responses

- **401**: Token không hợp lệ hoặc đã hết hạn
- **403**: Không có quyền xem chi tiêu này
- **404**: Chi tiêu không tồn tại

---

## PUT /api/expenses/:id

Cập nhật chi tiêu.

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

- `id`: Expense ID

### Request Body

```json
{
  "title": "Ăn trưa tại nhà hàng XYZ",
  "description": "Bữa trưa cho cả nhóm - Cập nhật",
  "amount": 600000,
  "category": "food",
  "participants": [
    {
      "userId": "user_id_1",
      "amount": 120000
    },
    {
      "userId": "user_id_2",
      "amount": 120000
    }
  ],
  "expenseDate": "2024-01-01T12:30:00.000Z",
  "location": "Nhà hàng XYZ, Quận 2, TP.HCM",
  "tags": ["lunch", "restaurant", "updated"]
}
```

### Validation Rules

- Chỉ người tạo chi tiêu hoặc admin nhóm mới có quyền cập nhật
- Các validation rules giống như tạo chi tiêu
- Không thể cập nhật chi tiêu đã được thanh toán

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "id": "expense_id",
    "title": "Ăn trưa tại nhà hàng XYZ",
    "description": "Bữa trưa cho cả nhóm - Cập nhật",
    "amount": 600000,
    "currency": "VND",
    "category": "food",
    "paidBy": {
      "id": "user_id",
      "fullName": "Nguyễn Văn A",
      "avatar": "https://example.com/avatar.jpg"
    },
    "participants": [
      {
        "userId": "user_id_1",
        "user": {
          "id": "user_id_1",
          "fullName": "Nguyễn Văn B",
          "avatar": "https://example.com/avatar2.jpg"
        },
        "amount": 120000,
        "share": 0.2
      }
    ],
    "expenseDate": "2024-01-01T12:30:00.000Z",
    "location": "Nhà hàng XYZ, Quận 2, TP.HCM",
    "tags": ["lunch", "restaurant", "updated"],
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Chi tiêu đã được cập nhật"
}
```

### Error Responses

- **400**: Dữ liệu đầu vào không hợp lệ
- **401**: Token không hợp lệ hoặc đã hết hạn
- **403**: Không có quyền cập nhật chi tiêu này
- **404**: Chi tiêu không tồn tại
- **409**: Không thể cập nhật chi tiêu đã được thanh toán

---

## DELETE /api/expenses/:id

Xóa chi tiêu.

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

- `id`: Expense ID

### Success Response (200)

```json
{
  "success": true,
  "message": "Chi tiêu đã được xóa thành công"
}
```

### Error Responses

- **401**: Token không hợp lệ hoặc đã hết hạn
- **403**: Không có quyền xóa chi tiêu này
- **404**: Chi tiêu không tồn tại
- **409**: Không thể xóa chi tiêu đã được thanh toán

### Notes

- Chỉ người tạo chi tiêu hoặc admin nhóm mới có quyền xóa
- Không thể xóa chi tiêu đã được thanh toán
- Tất cả thành viên nhóm sẽ nhận thông báo về việc xóa chi tiêu

---

## POST /api/expenses/:id/upload-receipt

Upload hóa đơn cho chi tiêu.

### Headers

```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

### Path Parameters

- `id`: Expense ID

### Request Body (multipart/form-data)

```
receipt: <file>
```

### File Requirements

- **Max size**: 10MB
- **Supported formats**: jpg, jpeg, png, pdf
- **Dimensions**: 200x200px to 4096x4096px (for images)

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "receipt": {
      "url": "https://example.com/receipts/expense_id_1640995200.jpg",
      "thumbnail": "https://example.com/receipts/thumb_expense_id_1640995200.jpg",
      "uploadedAt": "2024-01-01T00:00:00.000Z",
      "fileSize": 2048576,
      "mimeType": "image/jpeg"
    }
  },
  "message": "Hóa đơn đã được upload thành công"
}
```

### Error Responses

- **400**: File không hợp lệ
- **401**: Token không hợp lệ hoặc đã hết hạn
- **403**: Không có quyền upload hóa đơn cho chi tiêu này
- **404**: Chi tiêu không tồn tại
- **413**: File quá lớn (>10MB)
- **415**: Định dạng file không được hỗ trợ

### Processing Notes

- File sẽ được resize về 800x600px cho thumbnail
- File gốc được giữ nguyên (max 4096x4096px)
- Hóa đơn cũ sẽ bị xóa sau khi upload thành công

---

## DELETE /api/expenses/:id/receipt

Xóa hóa đơn của chi tiêu.

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

- `id`: Expense ID

### Success Response (200)

```json
{
  "success": true,
  "message": "Hóa đơn đã được xóa thành công"
}
```

### Error Responses

- **401**: Token không hợp lệ hoặc đã hết hạn
- **403**: Không có quyền xóa hóa đơn của chi tiêu này
- **404**: Chi tiêu hoặc hóa đơn không tồn tại

---

## GET /api/expenses/:id/participants

Lấy danh sách người tham gia chi tiêu.

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

- `id`: Expense ID

### Success Response (200)

```json
{
  "success": true,
  "data": [
    {
      "userId": "user_id_1",
      "user": {
        "id": "user_id_1",
        "fullName": "Nguyễn Văn B",
        "avatar": "https://example.com/avatar2.jpg",
        "email": "user2@example.com"
      },
      "amount": 100000,
      "share": 0.2,
      "isPaid": false,
      "paidAt": null
    }
  ]
}
```

### Error Responses

- **401**: Token không hợp lệ hoặc đã hết hạn
- **403**: Không có quyền xem thông tin chi tiêu này
- **404**: Chi tiêu không tồn tại
