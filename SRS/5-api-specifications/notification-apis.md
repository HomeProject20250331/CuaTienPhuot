# Notification APIs

## GET /api/notifications

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
- `priority`: Lọc theo độ ưu tiên ("low" | "medium" | "high" | "urgent")
- `dateFrom`: Lọc từ ngày (ISO 8601)
- `dateTo`: Lọc đến ngày (ISO 8601)

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
      "description": "Nguyễn Văn A đã thêm chi tiêu 'Ăn trưa tại nhà hàng ABC' với số tiền 500,000 VND",
      "priority": "medium",
      "isRead": false,
      "data": {
        "groupId": "group_id",
        "groupName": "Nhóm du lịch Đà Lạt",
        "expenseId": "expense_id",
        "expenseTitle": "Ăn trưa tại nhà hàng ABC",
        "amount": 500000,
        "currency": "VND",
        "paidBy": {
          "id": "user_id",
          "fullName": "Nguyễn Văn A",
          "avatar": "https://example.com/avatar.jpg"
        }
      },
      "actions": [
        {
          "label": "Xem chi tiết",
          "action": "view_expense",
          "url": "/groups/group_id/expenses/expense_id"
        },
        {
          "label": "Đánh dấu đã đọc",
          "action": "mark_read",
          "url": "/api/notifications/notification_id/read"
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "readAt": null,
      "expiresAt": "2024-01-08T00:00:00.000Z"
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
    "unreadCount": 5,
    "totalCount": 25,
    "byType": {
      "expense": 3,
      "settlement": 1,
      "group": 1,
      "system": 0
    },
    "byPriority": {
      "low": 2,
      "medium": 2,
      "high": 1,
      "urgent": 0
    }
  }
}
```

### Error Responses

- **401**: Token không hợp lệ hoặc đã hết hạn

---

## GET /api/notifications/:id

Lấy chi tiết thông báo.

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

- `id`: Notification ID

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "id": "notification_id",
    "type": "expense",
    "title": "Chi tiêu mới",
    "message": "Bạn có chi tiêu mới trong nhóm 'Nhóm du lịch Đà Lạt'",
    "description": "Nguyễn Văn A đã thêm chi tiêu 'Ăn trưa tại nhà hàng ABC' với số tiền 500,000 VND",
    "priority": "medium",
    "isRead": false,
    "data": {
      "groupId": "group_id",
      "groupName": "Nhóm du lịch Đà Lạt",
      "expenseId": "expense_id",
      "expenseTitle": "Ăn trưa tại nhà hàng ABC",
      "amount": 500000,
      "currency": "VND",
      "paidBy": {
        "id": "user_id",
        "fullName": "Nguyễn Văn A",
        "avatar": "https://example.com/avatar.jpg",
        "email": "user@example.com"
      },
      "participants": [
        {
          "userId": "user_id_1",
          "fullName": "Nguyễn Văn B",
          "amount": 100000
        }
      ]
    },
    "actions": [
      {
        "label": "Xem chi tiết",
        "action": "view_expense",
        "url": "/groups/group_id/expenses/expense_id"
      },
      {
        "label": "Đánh dấu đã đọc",
        "action": "mark_read",
        "url": "/api/notifications/notification_id/read"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "readAt": null,
    "expiresAt": "2024-01-08T00:00:00.000Z"
  }
}
```

### Error Responses

- **401**: Token không hợp lệ hoặc đã hết hạn
- **403**: Không có quyền xem thông báo này
- **404**: Thông báo không tồn tại

---

## PUT /api/notifications/:id/read

Đánh dấu thông báo đã đọc.

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

- `id`: Notification ID

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "id": "notification_id",
    "isRead": true,
    "readAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Thông báo đã được đánh dấu đã đọc"
}
```

### Error Responses

- **401**: Token không hợp lệ hoặc đã hết hạn
- **403**: Không có quyền đánh dấu thông báo này
- **404**: Thông báo không tồn tại

---

## PUT /api/notifications/read-all

Đánh dấu tất cả thông báo đã đọc.

### Headers

```
Authorization: Bearer <access_token>
```

### Request Body

```json
{
  "type": "expense",
  "dateFrom": "2024-01-01T00:00:00.000Z",
  "dateTo": "2024-01-31T23:59:59.999Z"
}
```

### Validation Rules

- `type`: Optional, lọc theo loại thông báo
- `dateFrom`: Optional, ISO 8601 format
- `dateTo`: Optional, ISO 8601 format

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "markedCount": 5,
    "totalCount": 25
  },
  "message": "5 thông báo đã được đánh dấu đã đọc"
}
```

### Error Responses

- **400**: Dữ liệu đầu vào không hợp lệ
- **401**: Token không hợp lệ hoặc đã hết hạn

---

## DELETE /api/notifications/:id

Xóa thông báo.

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

- `id`: Notification ID

### Success Response (200)

```json
{
  "success": true,
  "message": "Thông báo đã được xóa thành công"
}
```

### Error Responses

- **401**: Token không hợp lệ hoặc đã hết hạn
- **403**: Không có quyền xóa thông báo này
- **404**: Thông báo không tồn tại

---

## DELETE /api/notifications/delete-all

Xóa tất cả thông báo.

### Headers

```
Authorization: Bearer <access_token>
```

### Request Body

```json
{
  "type": "expense",
  "isRead": true,
  "dateFrom": "2024-01-01T00:00:00.000Z",
  "dateTo": "2024-01-31T23:59:59.999Z"
}
```

### Validation Rules

- `type`: Optional, lọc theo loại thông báo
- `isRead`: Optional, lọc theo trạng thái đọc
- `dateFrom`: Optional, ISO 8601 format
- `dateTo`: Optional, ISO 8601 format

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "deletedCount": 10,
    "totalCount": 25
  },
  "message": "10 thông báo đã được xóa"
}
```

### Error Responses

- **400**: Dữ liệu đầu vào không hợp lệ
- **401**: Token không hợp lệ hoặc đã hết hạn

---

## GET /api/notifications/summary

Lấy tổng quan thông báo.

### Headers

```
Authorization: Bearer <access_token>
```

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "unreadCount": 5,
    "totalCount": 25,
    "byType": {
      "expense": {
        "total": 15,
        "unread": 3
      },
      "settlement": {
        "total": 5,
        "unread": 1
      },
      "group": {
        "total": 3,
        "unread": 1
      },
      "system": {
        "total": 2,
        "unread": 0
      }
    },
    "byPriority": {
      "low": {
        "total": 10,
        "unread": 2
      },
      "medium": {
        "total": 12,
        "unread": 2
      },
      "high": {
        "total": 2,
        "unread": 1
      },
      "urgent": {
        "total": 1,
        "unread": 0
      }
    },
    "recentActivity": [
      {
        "type": "expense",
        "title": "Chi tiêu mới",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

### Error Responses

- **401**: Token không hợp lệ hoặc đã hết hạn

---

## POST /api/notifications/preferences

Cập nhật cài đặt thông báo.

### Headers

```
Authorization: Bearer <access_token>
```

### Request Body

```json
{
  "email": {
    "enabled": true,
    "expense": true,
    "settlement": true,
    "group": true,
    "system": false
  },
  "push": {
    "enabled": true,
    "expense": true,
    "settlement": true,
    "group": false,
    "system": true
  },
  "sms": {
    "enabled": false,
    "expense": false,
    "settlement": true,
    "group": false,
    "system": false
  },
  "frequency": "immediate",
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

### Validation Rules

- `email`: Optional object
  - `enabled`: boolean
  - `expense`: boolean
  - `settlement`: boolean
  - `group`: boolean
  - `system`: boolean
- `push`: Optional object (same structure as email)
- `sms`: Optional object (same structure as email)
- `frequency`: "immediate" | "daily" | "weekly"
- `quietHours`: Optional object
  - `enabled`: boolean
  - `start`: HH:mm format
  - `end`: HH:mm format

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "email": {
      "enabled": true,
      "expense": true,
      "settlement": true,
      "group": true,
      "system": false
    },
    "push": {
      "enabled": true,
      "expense": true,
      "settlement": true,
      "group": false,
      "system": true
    },
    "sms": {
      "enabled": false,
      "expense": false,
      "settlement": true,
      "group": false,
      "system": false
    },
    "frequency": "immediate",
    "quietHours": {
      "enabled": true,
      "start": "22:00",
      "end": "08:00"
    }
  },
  "message": "Cài đặt thông báo đã được cập nhật"
}
```

### Error Responses

- **400**: Dữ liệu đầu vào không hợp lệ
- **401**: Token không hợp lệ hoặc đã hết hạn

---

## GET /api/notifications/preferences

Lấy cài đặt thông báo hiện tại.

### Headers

```
Authorization: Bearer <access_token>
```

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "email": {
      "enabled": true,
      "expense": true,
      "settlement": true,
      "group": true,
      "system": false
    },
    "push": {
      "enabled": true,
      "expense": true,
      "settlement": true,
      "group": false,
      "system": true
    },
    "sms": {
      "enabled": false,
      "expense": false,
      "settlement": true,
      "group": false,
      "system": false
    },
    "frequency": "immediate",
    "quietHours": {
      "enabled": true,
      "start": "22:00",
      "end": "08:00"
    }
  }
}
```

### Error Responses

- **401**: Token không hợp lệ hoặc đã hết hạn

---

## Notification Types

### Expense Notifications

- **expense_created**: Chi tiêu mới được tạo
- **expense_updated**: Chi tiêu được cập nhật
- **expense_deleted**: Chi tiêu bị xóa
- **expense_receipt_uploaded**: Hóa đơn được upload

### Settlement Notifications

- **settlement_created**: Thanh toán mới được tạo
- **settlement_completed**: Thanh toán hoàn thành
- **settlement_cancelled**: Thanh toán bị hủy
- **balance_reminder**: Nhắc nhở công nợ

### Group Notifications

- **group_created**: Nhóm mới được tạo
- **group_updated**: Nhóm được cập nhật
- **group_deleted**: Nhóm bị xóa
- **member_added**: Thành viên mới được thêm
- **member_removed**: Thành viên bị xóa
- **member_left**: Thành viên rời nhóm
- **invite_sent**: Lời mời được gửi

### System Notifications

- **system_maintenance**: Bảo trì hệ thống
- **feature_update**: Cập nhật tính năng
- **security_alert**: Cảnh báo bảo mật
- **account_verification**: Xác thực tài khoản

### Notification Priority

- **low**: Thông tin chung
- **medium**: Hoạt động quan trọng
- **high**: Cần chú ý
- **urgent**: Khẩn cấp

### Notification Expiration

- Thông báo sẽ tự động hết hạn sau 30 ngày
- Thông báo urgent không tự động hết hạn
- User có thể xóa thông báo bất kỳ lúc nào
