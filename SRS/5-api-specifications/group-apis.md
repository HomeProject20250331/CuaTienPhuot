# Group Management APIs

## POST /api/groups

Tạo nhóm mới.

### Headers

```
Authorization: Bearer <access_token>
```

### Request Body

```json
{
  "name": "Nhóm du lịch Đà Lạt",
  "description": "Chuyến đi Đà Lạt tháng 3/2024",
  "avatar": "https://example.com/group_avatar.jpg",
  "currency": "VND",
  "settings": {
    "allowMemberAddExpense": true,
    "requireApprovalForExpense": false,
    "autoCalculateBalances": true,
    "paymentFormula": "equal_split"
  }
}
```

### Validation Rules

- `name`: Required, min 2 characters, max 100 characters
- `description`: Optional, max 500 characters
- `avatar`: Optional, valid URL
- `currency`: Required, "VND" | "USD" | "EUR"
- `settings`: Optional object
  - `allowMemberAddExpense`: boolean (default: true)
  - `requireApprovalForExpense`: boolean (default: false)
  - `autoCalculateBalances`: boolean (default: true)
  - `paymentFormula`: "equal_split" | "custom" (default: "equal_split")

### Success Response (201)

```json
{
  "success": true,
  "data": {
    "id": "group_id",
    "name": "Nhóm du lịch Đà Lạt",
    "description": "Chuyến đi Đà Lạt tháng 3/2024",
    "avatar": "https://example.com/group_avatar.jpg",
    "currency": "VND",
    "settings": {
      "allowMemberAddExpense": true,
      "requireApprovalForExpense": false,
      "autoCalculateBalances": true,
      "paymentFormula": "equal_split"
    },
    "memberCount": 1,
    "totalExpenses": 0,
    "totalBalance": 0,
    "createdBy": "user_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Nhóm đã được tạo thành công"
}
```

### Error Responses

- **400**: Dữ liệu đầu vào không hợp lệ
- **401**: Token không hợp lệ hoặc đã hết hạn

---

## GET /api/groups

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
- `search`: Tìm kiếm theo tên nhóm

### Success Response (200)

```json
{
  "success": true,
  "data": [
    {
      "id": "group_id",
      "name": "Nhóm du lịch Đà Lạt",
      "description": "Chuyến đi Đà Lạt tháng 3/2024",
      "avatar": "https://example.com/group_avatar.jpg",
      "currency": "VND",
      "role": "admin",
      "memberCount": 5,
      "totalExpenses": 5000000,
      "totalBalance": 1000000,
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

## GET /api/groups/:id

Lấy chi tiết nhóm.

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

- `id`: Group ID

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "id": "group_id",
    "name": "Nhóm du lịch Đà Lạt",
    "description": "Chuyến đi Đà Lạt tháng 3/2024",
    "avatar": "https://example.com/group_avatar.jpg",
    "currency": "VND",
    "settings": {
      "allowMemberAddExpense": true,
      "requireApprovalForExpense": false,
      "autoCalculateBalances": true,
      "paymentFormula": "equal_split"
    },
    "members": [
      {
        "id": "user_id",
        "email": "user@example.com",
        "fullName": "Nguyễn Văn A",
        "avatar": "https://example.com/avatar.jpg",
        "role": "admin",
        "joinedAt": "2024-01-01T00:00:00.000Z",
        "totalExpenses": 2000000,
        "balance": 500000
      }
    ],
    "statistics": {
      "memberCount": 5,
      "totalExpenses": 5000000,
      "totalBalance": 1000000,
      "expenseCount": 25,
      "lastExpenseAt": "2024-01-01T00:00:00.000Z"
    },
    "createdBy": "user_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Error Responses

- **401**: Token không hợp lệ hoặc đã hết hạn
- **403**: Không có quyền truy cập nhóm này
- **404**: Nhóm không tồn tại

---

## PUT /api/groups/:id

Cập nhật thông tin nhóm.

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

- `id`: Group ID

### Request Body

```json
{
  "name": "Nhóm du lịch Đà Lạt 2024",
  "description": "Chuyến đi Đà Lạt tháng 3/2024 - Cập nhật",
  "avatar": "https://example.com/new_group_avatar.jpg",
  "settings": {
    "allowMemberAddExpense": false,
    "requireApprovalForExpense": true,
    "autoCalculateBalances": true,
    "paymentFormula": "custom"
  }
}
```

### Validation Rules

- Chỉ admin mới có quyền cập nhật
- Các validation rules giống như tạo nhóm

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "id": "group_id",
    "name": "Nhóm du lịch Đà Lạt 2024",
    "description": "Chuyến đi Đà Lạt tháng 3/2024 - Cập nhật",
    "avatar": "https://example.com/new_group_avatar.jpg",
    "currency": "VND",
    "settings": {
      "allowMemberAddExpense": false,
      "requireApprovalForExpense": true,
      "autoCalculateBalances": true,
      "paymentFormula": "custom"
    },
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Nhóm đã được cập nhật"
}
```

### Error Responses

- **400**: Dữ liệu đầu vào không hợp lệ
- **401**: Token không hợp lệ hoặc đã hết hạn
- **403**: Không có quyền cập nhật nhóm này
- **404**: Nhóm không tồn tại

---

## DELETE /api/groups/:id

Xóa nhóm.

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

- `id`: Group ID

### Success Response (200)

```json
{
  "success": true,
  "message": "Nhóm đã được xóa thành công"
}
```

### Error Responses

- **401**: Token không hợp lệ hoặc đã hết hạn
- **403**: Chỉ admin mới có quyền xóa nhóm
- **404**: Nhóm không tồn tại
- **409**: Không thể xóa nhóm có chi tiêu hoặc công nợ

### Notes

- Chỉ admin mới có quyền xóa nhóm
- Không thể xóa nhóm có chi tiêu hoặc công nợ chưa thanh toán
- Tất cả thành viên sẽ nhận thông báo về việc xóa nhóm

---

## POST /api/groups/:id/members

Thêm thành viên vào nhóm.

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

- `id`: Group ID

### Request Body

```json
{
  "email": "newmember@example.com",
  "role": "member"
}
```

### Validation Rules

- `email`: Required, valid email, user phải tồn tại trong hệ thống
- `role`: "admin" | "member" (default: "member")
- Chỉ admin mới có quyền thêm thành viên

### Success Response (201)

```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "email": "newmember@example.com",
    "fullName": "Nguyễn Văn B",
    "avatar": "https://example.com/avatar.jpg",
    "role": "member",
    "joinedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Thành viên đã được thêm vào nhóm"
}
```

### Error Responses

- **400**: Dữ liệu đầu vào không hợp lệ
- **401**: Token không hợp lệ hoặc đã hết hạn
- **403**: Không có quyền thêm thành viên
- **404**: Nhóm hoặc user không tồn tại
- **409**: User đã là thành viên của nhóm

---

## DELETE /api/groups/:id/members/:userId

Xóa thành viên khỏi nhóm.

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

- `id`: Group ID
- `userId`: User ID

### Success Response (200)

```json
{
  "success": true,
  "message": "Thành viên đã được xóa khỏi nhóm"
}
```

### Error Responses

- **401**: Token không hợp lệ hoặc đã hết hạn
- **403**: Không có quyền xóa thành viên này
- **404**: Nhóm hoặc thành viên không tồn tại
- **409**: Không thể xóa admin cuối cùng

### Notes

- Chỉ admin mới có quyền xóa thành viên
- Không thể xóa admin cuối cùng
- Thành viên bị xóa sẽ nhận thông báo

---

## GET /api/groups/:id/invite-link

Lấy link mời tham gia nhóm.

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

- `id`: Group ID

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "inviteLink": "https://app.cuatienphuot.com/invite/abc123def456",
    "expiresAt": "2024-01-08T00:00:00.000Z",
    "maxUses": 100,
    "usedCount": 5
  }
}
```

### Error Responses

- **401**: Token không hợp lệ hoặc đã hết hạn
- **403**: Không có quyền tạo link mời
- **404**: Nhóm không tồn tại

### Notes

- Link mời có hiệu lực 7 ngày
- Mỗi link có thể sử dụng tối đa 100 lần
- Chỉ admin mới có quyền tạo link mời

---

## POST /api/groups/join

Tham gia nhóm qua link mời.

### Request Body

```json
{
  "inviteCode": "abc123def456"
}
```

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "groupId": "group_id",
    "groupName": "Nhóm du lịch Đà Lạt",
    "role": "member"
  },
  "message": "Bạn đã tham gia nhóm thành công"
}
```

### Error Responses

- **400**: Mã mời không hợp lệ
- **401**: Token không hợp lệ hoặc đã hết hạn
- **404**: Link mời không tồn tại hoặc đã hết hạn
- **409**: Bạn đã là thành viên của nhóm này

---

## PUT /api/groups/:id/leave

Rời khỏi nhóm.

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

- `id`: Group ID

### Success Response (200)

```json
{
  "success": true,
  "message": "Bạn đã rời khỏi nhóm"
}
```

### Error Responses

- **401**: Token không hợp lệ hoặc đã hết hạn
- **403**: Không thể rời nhóm khi còn công nợ
- **404**: Nhóm không tồn tại

### Notes

- Không thể rời nhóm khi còn công nợ chưa thanh toán
- Admin cuối cùng không thể rời nhóm (phải xóa nhóm)
