# Statistics & Reports APIs

## GET /api/groups/:groupId/stats/summary

Lấy tổng quan thống kê của nhóm.

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

- `groupId`: Group ID

### Query Parameters

- `period`: Khoảng thời gian ("7d" | "30d" | "90d" | "1y" | "all")
- `dateFrom`: Ngày bắt đầu (ISO 8601)
- `dateTo`: Ngày kết thúc (ISO 8601)

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "group": {
      "id": "group_id",
      "name": "Nhóm du lịch Đà Lạt",
      "currency": "VND",
      "memberCount": 5
    },
    "period": {
      "from": "2024-01-01T00:00:00.000Z",
      "to": "2024-01-31T23:59:59.999Z"
    },
    "overview": {
      "totalExpenses": 15000000,
      "totalSettlements": 12000000,
      "pendingAmount": 3000000,
      "expenseCount": 25,
      "settlementCount": 8,
      "averageExpense": 600000,
      "largestExpense": 2000000,
      "smallestExpense": 50000
    },
    "trends": {
      "expensesGrowth": 15.5,
      "settlementsGrowth": 22.3,
      "activeMembers": 5,
      "newMembers": 0
    },
    "topSpenders": [
      {
        "userId": "user_id_1",
        "fullName": "Nguyễn Văn A",
        "avatar": "https://example.com/avatar1.jpg",
        "totalSpent": 5000000,
        "expenseCount": 10,
        "averageExpense": 500000
      }
    ],
    "recentActivity": [
      {
        "type": "expense",
        "title": "Ăn trưa tại nhà hàng ABC",
        "amount": 500000,
        "user": "Nguyễn Văn A",
        "createdAt": "2024-01-01T12:00:00.000Z"
      }
    ]
  }
}
```

### Error Responses

- **401**: Token không hợp lệ hoặc đã hết hạn
- **403**: Không có quyền xem thống kê của nhóm này
- **404**: Nhóm không tồn tại

---

## GET /api/groups/:groupId/stats/by-category

Lấy thống kê chi tiêu theo danh mục.

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

- `groupId`: Group ID

### Query Parameters

- `period`: Khoảng thời gian ("7d" | "30d" | "90d" | "1y" | "all")
- `dateFrom`: Ngày bắt đầu (ISO 8601)
- `dateTo`: Ngày kết thúc (ISO 8601)
- `chartType`: Loại biểu đồ ("pie" | "bar" | "donut")

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
    "period": {
      "from": "2024-01-01T00:00:00.000Z",
      "to": "2024-01-31T23:59:59.999Z"
    },
    "categories": [
      {
        "category": "food",
        "name": "Ăn uống",
        "amount": 6000000,
        "percentage": 40.0,
        "expenseCount": 15,
        "averageExpense": 400000,
        "color": "#FF6B6B"
      },
      {
        "category": "transport",
        "name": "Di chuyển",
        "amount": 4500000,
        "percentage": 30.0,
        "expenseCount": 8,
        "averageExpense": 562500,
        "color": "#4ECDC4"
      },
      {
        "category": "accommodation",
        "name": "Lưu trú",
        "amount": 3000000,
        "percentage": 20.0,
        "expenseCount": 2,
        "averageExpense": 1500000,
        "color": "#45B7D1"
      },
      {
        "category": "entertainment",
        "name": "Giải trí",
        "amount": 1500000,
        "percentage": 10.0,
        "expenseCount": 5,
        "averageExpense": 300000,
        "color": "#96CEB4"
      }
    ],
    "total": {
      "amount": 15000000,
      "expenseCount": 30
    },
    "chart": {
      "type": "pie",
      "data": [
        {
          "label": "Ăn uống",
          "value": 6000000,
          "color": "#FF6B6B"
        }
      ]
    }
  }
}
```

### Error Responses

- **401**: Token không hợp lệ hoặc đã hết hạn
- **403**: Không có quyền xem thống kê của nhóm này
- **404**: Nhóm không tồn tại

---

## GET /api/groups/:groupId/stats/by-member

Lấy thống kê chi tiêu theo thành viên.

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

- `groupId`: Group ID

### Query Parameters

- `period`: Khoảng thời gian ("7d" | "30d" | "90d" | "1y" | "all")
- `dateFrom`: Ngày bắt đầu (ISO 8601)
- `dateTo`: Ngày kết thúc (ISO 8601)
- `sortBy`: Sắp xếp theo ("totalSpent" | "expenseCount" | "averageExpense" | "balance")
- `order`: Thứ tự sắp xếp ("asc" | "desc")

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
    "period": {
      "from": "2024-01-01T00:00:00.000Z",
      "to": "2024-01-31T23:59:59.999Z"
    },
    "members": [
      {
        "userId": "user_id_1",
        "fullName": "Nguyễn Văn A",
        "avatar": "https://example.com/avatar1.jpg",
        "email": "user1@example.com",
        "role": "admin",
        "statistics": {
          "totalSpent": 5000000,
          "totalPaid": 3000000,
          "totalOwed": 2000000,
          "expenseCount": 10,
          "averageExpense": 500000,
          "largestExpense": 1000000,
          "balance": -2000000
        },
        "categories": [
          {
            "category": "food",
            "amount": 3000000,
            "expenseCount": 8
          }
        ]
      }
    ],
    "summary": {
      "totalMembers": 5,
      "activeMembers": 5,
      "totalSpent": 15000000,
      "averagePerMember": 3000000,
      "topSpender": {
        "userId": "user_id_1",
        "fullName": "Nguyễn Văn A",
        "amount": 5000000
      }
    }
  }
}
```

### Error Responses

- **401**: Token không hợp lệ hoặc đã hết hạn
- **403**: Không có quyền xem thống kê của nhóm này
- **404**: Nhóm không tồn tại

---

## GET /api/groups/:groupId/stats/by-time

Lấy thống kê chi tiêu theo thời gian.

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

- `groupId`: Group ID

### Query Parameters

- `period`: Khoảng thời gian ("7d" | "30d" | "90d" | "1y" | "all")
- `dateFrom`: Ngày bắt đầu (ISO 8601)
- `dateTo`: Ngày kết thúc (ISO 8601)
- `granularity`: Độ chi tiết ("day" | "week" | "month" | "year")
- `chartType`: Loại biểu đồ ("line" | "bar" | "area")

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
    "period": {
      "from": "2024-01-01T00:00:00.000Z",
      "to": "2024-01-31T23:59:59.999Z"
    },
    "granularity": "day",
    "timeline": [
      {
        "date": "2024-01-01",
        "amount": 500000,
        "expenseCount": 2,
        "categories": {
          "food": 300000,
          "transport": 200000
        }
      },
      {
        "date": "2024-01-02",
        "amount": 800000,
        "expenseCount": 3,
        "categories": {
          "food": 500000,
          "entertainment": 300000
        }
      }
    ],
    "summary": {
      "totalAmount": 15000000,
      "totalExpenses": 30,
      "averagePerDay": 500000,
      "peakDay": {
        "date": "2024-01-15",
        "amount": 2000000
      },
      "trends": {
        "growth": 15.5,
        "volatility": 25.3
      }
    },
    "chart": {
      "type": "line",
      "data": [
        {
          "date": "2024-01-01",
          "amount": 500000
        }
      ]
    }
  }
}
```

### Error Responses

- **401**: Token không hợp lệ hoặc đã hết hạn
- **403**: Không có quyền xem thống kê của nhóm này
- **404**: Nhóm không tồn tại

---

## GET /api/groups/:groupId/stats/expenses

Lấy danh sách chi tiêu với thống kê.

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

- `groupId`: Group ID

### Query Parameters

- `page`: Số trang (default: 1)
- `limit`: Số items per page (default: 20, max: 100)
- `period`: Khoảng thời gian ("7d" | "30d" | "90d" | "1y" | "all")
- `dateFrom`: Ngày bắt đầu (ISO 8601)
- `dateTo`: Ngày kết thúc (ISO 8601)
- `category`: Lọc theo danh mục
- `paidBy`: Lọc theo người trả tiền
- `participant`: Lọc theo người tham gia
- `minAmount`: Lọc theo số tiền tối thiểu
- `maxAmount`: Lọc theo số tiền tối đa
- `sortBy`: Sắp xếp theo ("amount" | "date" | "category")
- `order`: Thứ tự sắp xếp ("asc" | "desc")

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
  "statistics": {
    "totalAmount": 500000,
    "totalCount": 1,
    "averageAmount": 500000,
    "byCategory": {
      "food": 500000
    },
    "byMember": {
      "user_id": 500000
    }
  }
}
```

### Error Responses

- **401**: Token không hợp lệ hoặc đã hết hạn
- **403**: Không có quyền xem thống kê của nhóm này
- **404**: Nhóm không tồn tại

---

## POST /api/groups/:groupId/export

Export báo cáo thống kê.

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

- `groupId`: Group ID

### Request Body

```json
{
  "format": "pdf",
  "type": "comprehensive",
  "period": {
    "from": "2024-01-01T00:00:00.000Z",
    "to": "2024-01-31T23:59:59.999Z"
  },
  "sections": ["summary", "byCategory", "byMember", "byTime", "expenses"],
  "includeCharts": true,
  "includeReceipts": false
}
```

### Validation Rules

- `format`: Required, "pdf" | "excel" | "csv"
- `type`: Required, "summary" | "detailed" | "comprehensive"
- `period`: Optional object
  - `from`: ISO 8601 format
  - `to`: ISO 8601 format
- `sections`: Optional array, các phần cần export
- `includeCharts`: Optional boolean (default: true)
- `includeReceipts`: Optional boolean (default: false)

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "exportId": "export_id",
    "status": "processing",
    "format": "pdf",
    "type": "comprehensive",
    "estimatedTime": 30,
    "downloadUrl": null,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Báo cáo đang được tạo, bạn sẽ nhận được thông báo khi hoàn thành"
}
```

### Error Responses

- **400**: Dữ liệu đầu vào không hợp lệ
- **401**: Token không hợp lệ hoặc đã hết hạn
- **403**: Không có quyền export báo cáo của nhóm này
- **404**: Nhóm không tồn tại
- **429**: Quá nhiều request export, vui lòng thử lại sau

---

## GET /api/exports/:exportId

Lấy trạng thái export.

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

- `exportId`: Export ID

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "id": "export_id",
    "status": "completed",
    "format": "pdf",
    "type": "comprehensive",
    "fileSize": 2048576,
    "downloadUrl": "https://example.com/exports/export_id.pdf",
    "expiresAt": "2024-01-08T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "completedAt": "2024-01-01T00:01:00.000Z"
  }
}
```

### Error Responses

- **401**: Token không hợp lệ hoặc đã hết hạn
- **403**: Không có quyền xem export này
- **404**: Export không tồn tại

### Export Status

- **processing**: Đang xử lý
- **completed**: Hoàn thành
- **failed**: Thất bại
- **expired**: Đã hết hạn

---

## GET /api/groups/:groupId/stats/insights

Lấy insights và phân tích chi tiêu.

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

- `groupId`: Group ID

### Query Parameters

- `period`: Khoảng thời gian ("7d" | "30d" | "90d" | "1y" | "all")

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
    "insights": [
      {
        "type": "spending_pattern",
        "title": "Mẫu chi tiêu",
        "description": "Nhóm chi tiêu nhiều nhất vào cuối tuần",
        "severity": "info",
        "data": {
          "weekendSpending": 8000000,
          "weekdaySpending": 7000000,
          "difference": 14.3
        }
      },
      {
        "type": "category_anomaly",
        "title": "Chi tiêu bất thường",
        "description": "Chi tiêu ăn uống tăng 50% so với tháng trước",
        "severity": "warning",
        "data": {
          "category": "food",
          "currentMonth": 6000000,
          "previousMonth": 4000000,
          "increase": 50.0
        }
      },
      {
        "type": "member_balance",
        "title": "Cân bằng thành viên",
        "description": "Có 2 thành viên có số dư nợ cao",
        "severity": "warning",
        "data": {
          "highDebtMembers": 2,
          "totalMembers": 5,
          "averageDebt": 1000000
        }
      }
    ],
    "recommendations": [
      {
        "type": "settlement_optimization",
        "title": "Tối ưu hóa thanh toán",
        "description": "Có thể giảm 2 giao dịch thanh toán bằng cách tối ưu hóa",
        "action": "optimize_settlements",
        "data": {
          "currentSettlements": 5,
          "optimizedSettlements": 3,
          "savings": 2
        }
      }
    ],
    "trends": {
      "spendingTrend": "increasing",
      "settlementTrend": "stable",
      "memberActivity": "high"
    }
  }
}
```

### Error Responses

- **401**: Token không hợp lệ hoặc đã hết hạn
- **403**: Không có quyền xem insights của nhóm này
- **404**: Nhóm không tồn tại

### Insight Types

- **spending_pattern**: Mẫu chi tiêu
- **category_anomaly**: Chi tiêu bất thường theo danh mục
- **member_balance**: Cân bằng thành viên
- **settlement_efficiency**: Hiệu quả thanh toán
- **budget_alert**: Cảnh báo ngân sách
