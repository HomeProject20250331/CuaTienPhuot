# Settlement & Balance APIs

## GET /api/groups/:groupId/balances

Lấy bảng công nợ của nhóm.

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

- `groupId`: Group ID

### Query Parameters

- `userId`: Lọc theo user ID (chỉ hiển thị công nợ liên quan đến user này)
- `status`: Lọc theo trạng thái ("pending" | "settled" | "all")

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "balances": [
      {
        "debtor": {
          "id": "user_id_1",
          "fullName": "Nguyễn Văn A",
          "avatar": "https://example.com/avatar1.jpg"
        },
        "creditor": {
          "id": "user_id_2",
          "fullName": "Nguyễn Văn B",
          "avatar": "https://example.com/avatar2.jpg"
        },
        "amount": 500000,
        "currency": "VND",
        "status": "pending",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "settledAt": null
      }
    ],
    "summary": {
      "totalDebt": 1500000,
      "totalCredit": 1500000,
      "netBalance": 0,
      "pendingCount": 3,
      "settledCount": 0
    },
    "userBalances": [
      {
        "userId": "user_id_1",
        "fullName": "Nguyễn Văn A",
        "avatar": "https://example.com/avatar1.jpg",
        "totalOwed": 500000,
        "totalOwing": 0,
        "netBalance": -500000
      }
    ]
  }
}
```

### Error Responses

- **401**: Token không hợp lệ hoặc đã hết hạn
- **403**: Không có quyền xem công nợ của nhóm này
- **404**: Nhóm không tồn tại

### Notes

- Bảng công nợ được tính toán dựa trên tất cả chi tiêu chưa được thanh toán
- `netBalance` âm = nợ tiền, dương = được nợ tiền
- Chỉ hiển thị các khoản nợ > 0

---

## POST /api/groups/:groupId/settlements

Tạo thanh toán mới.

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

- `groupId`: Group ID

### Request Body

```json
{
  "debtorId": "user_id_1",
  "creditorId": "user_id_2",
  "amount": 500000,
  "description": "Thanh toán tiền ăn trưa",
  "paymentMethod": "bank_transfer",
  "paymentDate": "2024-01-01T00:00:00.000Z",
  "reference": "TXN123456789"
}
```

### Validation Rules

- `debtorId`: Required, user ID của người trả tiền
- `creditorId`: Required, user ID của người nhận tiền
- `amount`: Required, > 0, phải <= số tiền nợ thực tế
- `description`: Optional, max 500 characters
- `paymentMethod`: Required, "cash" | "bank_transfer" | "momo" | "zalopay" | "other"
- `paymentDate`: Optional, ISO 8601 format (default: now)
- `reference`: Optional, max 100 characters (số tham chiếu giao dịch)

### Success Response (201)

```json
{
  "success": true,
  "data": {
    "id": "settlement_id",
    "debtor": {
      "id": "user_id_1",
      "fullName": "Nguyễn Văn A",
      "avatar": "https://example.com/avatar1.jpg"
    },
    "creditor": {
      "id": "user_id_2",
      "fullName": "Nguyễn Văn B",
      "avatar": "https://example.com/avatar2.jpg"
    },
    "amount": 500000,
    "currency": "VND",
    "description": "Thanh toán tiền ăn trưa",
    "paymentMethod": "bank_transfer",
    "paymentDate": "2024-01-01T00:00:00.000Z",
    "reference": "TXN123456789",
    "status": "pending",
    "createdBy": "user_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Thanh toán đã được tạo thành công"
}
```

### Error Responses

- **400**: Dữ liệu đầu vào không hợp lệ
- **401**: Token không hợp lệ hoặc đã hết hạn
- **403**: Không có quyền tạo thanh toán trong nhóm này
- **404**: Nhóm hoặc user không tồn tại
- **422**: Số tiền thanh toán vượt quá số tiền nợ thực tế

---

## GET /api/groups/:groupId/settlements

Lấy lịch sử thanh toán của nhóm.

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

- `groupId`: Group ID

### Query Parameters

- `page`: Số trang (default: 1)
- `limit`: Số items per page (default: 20, max: 100)
- `status`: Lọc theo trạng thái ("pending" | "completed" | "cancelled")
- `debtorId`: Lọc theo người trả tiền
- `creditorId`: Lọc theo người nhận tiền
- `paymentMethod`: Lọc theo phương thức thanh toán
- `dateFrom`: Lọc từ ngày (ISO 8601)
- `dateTo`: Lọc đến ngày (ISO 8601)
- `search`: Tìm kiếm theo description hoặc reference

### Success Response (200)

```json
{
  "success": true,
  "data": [
    {
      "id": "settlement_id",
      "debtor": {
        "id": "user_id_1",
        "fullName": "Nguyễn Văn A",
        "avatar": "https://example.com/avatar1.jpg"
      },
      "creditor": {
        "id": "user_id_2",
        "fullName": "Nguyễn Văn B",
        "avatar": "https://example.com/avatar2.jpg"
      },
      "amount": 500000,
      "currency": "VND",
      "description": "Thanh toán tiền ăn trưa",
      "paymentMethod": "bank_transfer",
      "paymentDate": "2024-01-01T00:00:00.000Z",
      "reference": "TXN123456789",
      "status": "completed",
      "completedAt": "2024-01-01T01:00:00.000Z",
      "createdBy": "user_id",
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
    "byStatus": {
      "pending": 0,
      "completed": 1,
      "cancelled": 0
    },
    "byPaymentMethod": {
      "bank_transfer": 500000,
      "cash": 0,
      "momo": 0
    }
  }
}
```

### Error Responses

- **401**: Token không hợp lệ hoặc đã hết hạn
- **403**: Không có quyền xem lịch sử thanh toán của nhóm này
- **404**: Nhóm không tồn tại

---

## GET /api/settlements/:id

Lấy chi tiết thanh toán.

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

- `id`: Settlement ID

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "id": "settlement_id",
    "debtor": {
      "id": "user_id_1",
      "fullName": "Nguyễn Văn A",
      "avatar": "https://example.com/avatar1.jpg",
      "email": "user1@example.com",
      "phone": "+84901234567"
    },
    "creditor": {
      "id": "user_id_2",
      "fullName": "Nguyễn Văn B",
      "avatar": "https://example.com/avatar2.jpg",
      "email": "user2@example.com",
      "phone": "+84901234568"
    },
    "amount": 500000,
    "currency": "VND",
    "description": "Thanh toán tiền ăn trưa",
    "paymentMethod": "bank_transfer",
    "paymentDate": "2024-01-01T00:00:00.000Z",
    "reference": "TXN123456789",
    "status": "completed",
    "completedAt": "2024-01-01T01:00:00.000Z",
    "completedBy": "user_id_2",
    "createdBy": "user_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T01:00:00.000Z",
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
- **403**: Không có quyền xem thanh toán này
- **404**: Thanh toán không tồn tại

---

## PUT /api/settlements/:id/mark-paid

Đánh dấu thanh toán đã hoàn thành.

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

- `id`: Settlement ID

### Request Body

```json
{
  "completedAt": "2024-01-01T01:00:00.000Z",
  "note": "Đã nhận tiền qua chuyển khoản"
}
```

### Validation Rules

- `completedAt`: Optional, ISO 8601 format (default: now)
- `note`: Optional, max 500 characters
- Chỉ creditor hoặc admin nhóm mới có quyền đánh dấu đã thanh toán

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "id": "settlement_id",
    "status": "completed",
    "completedAt": "2024-01-01T01:00:00.000Z",
    "completedBy": "user_id_2",
    "note": "Đã nhận tiền qua chuyển khoản",
    "updatedAt": "2024-01-01T01:00:00.000Z"
  },
  "message": "Thanh toán đã được đánh dấu hoàn thành"
}
```

### Error Responses

- **400**: Dữ liệu đầu vào không hợp lệ
- **401**: Token không hợp lệ hoặc đã hết hạn
- **403**: Không có quyền đánh dấu thanh toán này
- **404**: Thanh toán không tồn tại
- **409**: Thanh toán đã được hoàn thành hoặc bị hủy

---

## PUT /api/settlements/:id/cancel

Hủy thanh toán.

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

- `id`: Settlement ID

### Request Body

```json
{
  "reason": "Người trả tiền không thể thực hiện thanh toán"
}
```

### Validation Rules

- `reason`: Optional, max 500 characters
- Chỉ debtor, creditor hoặc admin nhóm mới có quyền hủy
- Không thể hủy thanh toán đã hoàn thành

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "id": "settlement_id",
    "status": "cancelled",
    "cancelledAt": "2024-01-01T01:00:00.000Z",
    "cancelledBy": "user_id",
    "reason": "Người trả tiền không thể thực hiện thanh toán",
    "updatedAt": "2024-01-01T01:00:00.000Z"
  },
  "message": "Thanh toán đã được hủy"
}
```

### Error Responses

- **400**: Dữ liệu đầu vào không hợp lệ
- **401**: Token không hợp lệ hoặc đã hết hạn
- **403**: Không có quyền hủy thanh toán này
- **404**: Thanh toán không tồn tại
- **409**: Không thể hủy thanh toán đã hoàn thành

---

## GET /api/groups/:groupId/balances/summary

Lấy tổng quan công nợ của nhóm.

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

- `groupId`: Group ID

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "group": {
      "id": "group_id",
      "name": "Nhóm du lịch Đà Lạt",
      "currency": "VND"
    },
    "overview": {
      "totalExpenses": 5000000,
      "totalSettlements": 2000000,
      "pendingAmount": 3000000,
      "memberCount": 5,
      "activeDebts": 3
    },
    "topDebtors": [
      {
        "userId": "user_id_1",
        "fullName": "Nguyễn Văn A",
        "avatar": "https://example.com/avatar1.jpg",
        "totalOwed": 1000000,
        "debtCount": 2
      }
    ],
    "topCreditors": [
      {
        "userId": "user_id_2",
        "fullName": "Nguyễn Văn B",
        "avatar": "https://example.com/avatar2.jpg",
        "totalOwing": 1500000,
        "creditCount": 3
      }
    ],
    "recentSettlements": [
      {
        "id": "settlement_id",
        "debtor": "Nguyễn Văn A",
        "creditor": "Nguyễn Văn B",
        "amount": 500000,
        "status": "completed",
        "completedAt": "2024-01-01T01:00:00.000Z"
      }
    ]
  }
}
```

### Error Responses

- **401**: Token không hợp lệ hoặc đã hết hạn
- **403**: Không có quyền xem tổng quan công nợ của nhóm này
- **404**: Nhóm không tồn tại

---

## POST /api/groups/:groupId/balances/optimize

Tối ưu hóa công nợ (giảm số lượng giao dịch).

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

- `groupId`: Group ID

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "originalDebts": 5,
    "optimizedDebts": 3,
    "savings": 2,
    "optimizedBalances": [
      {
        "debtor": {
          "id": "user_id_1",
          "fullName": "Nguyễn Văn A"
        },
        "creditor": {
          "id": "user_id_2",
          "fullName": "Nguyễn Văn B"
        },
        "amount": 500000,
        "currency": "VND"
      }
    ]
  },
  "message": "Công nợ đã được tối ưu hóa"
}
```

### Error Responses

- **401**: Token không hợp lệ hoặc đã hết hạn
- **403**: Không có quyền tối ưu hóa công nợ của nhóm này
- **404**: Nhóm không tồn tại

### Notes

- Thuật toán tối ưu hóa sẽ giảm số lượng giao dịch cần thiết
- Chỉ áp dụng cho các khoản nợ chưa được thanh toán
- Không ảnh hưởng đến lịch sử thanh toán đã hoàn thành
