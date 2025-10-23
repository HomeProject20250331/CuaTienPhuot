# 3. Database Schema - CuaTienPhuot

## 3.1 Tổng quan Database

**Database Name**: `cuatienphuot`  
**Database Type**: MongoDB (NoSQL) + Redis (Cache)  
**ODM**: Mongoose  
**Cache**: Redis cho session và frequent queries

## 3.2 Collections Schema

### 3.2.1 Users Collection

```javascript
{
  _id: ObjectId,
  email: String, // unique, required
  password: String, // hashed with bcrypt, required
  firstName: String, // required
  lastName: String, // required
  avatar: String, // URL to avatar image
  phone: String, // optional
  dateOfBirth: Date, // optional
  isEmailVerified: Boolean, // default: false
  emailVerificationToken: String, // optional
  passwordResetToken: String, // optional
  passwordResetExpires: Date, // optional
  lastLoginAt: Date,
  createdAt: Date, // default: Date.now
  updatedAt: Date, // default: Date.now
  isActive: Boolean // default: true
}
```

**Indexes:**

- `{ email: 1 }` (unique)
- `{ emailVerificationToken: 1 }`
- `{ passwordResetToken: 1 }`

### 3.2.2 Groups Collection

```javascript
{
  _id: ObjectId,
  name: String, // required
  description: String, // optional
  coverImage: String, // URL to cover image, optional
  currency: String, // default: "VND"
  timezone: String, // default: "Asia/Ho_Chi_Minh"
  settings: {
    allowMemberAddExpense: Boolean, // default: true
    requireApprovalForExpense: Boolean, // default: false
    defaultPaymentFormula: String, // reference to PaymentFormula._id
    notificationSettings: {
      newExpense: Boolean, // default: true
      newMember: Boolean, // default: true
      settlement: Boolean, // default: true
      reminder: Boolean // default: true
    }
  },
  members: [{
    userId: ObjectId, // reference to User._id
    role: String, // "admin" | "member", default: "member"
    joinedAt: Date, // default: Date.now
    isActive: Boolean // default: true
  }],
  inviteCode: String, // unique, auto-generated
  inviteCodeExpires: Date, // default: 7 days from creation
  totalExpenses: Number, // calculated field, default: 0
  totalSettlements: Number, // calculated field, default: 0
  createdAt: Date, // default: Date.now
  updatedAt: Date, // default: Date.now
  createdBy: ObjectId, // reference to User._id
  isActive: Boolean // default: true
}
```

**Indexes:**

- `{ inviteCode: 1 }` (unique)
- `{ "members.userId": 1 }`
- `{ createdBy: 1 }`
- `{ createdAt: -1 }`

### 3.2.3 Expenses Collection

```javascript
{
  _id: ObjectId,
  groupId: ObjectId, // reference to Group._id, required
  title: String, // required
  description: String, // optional
  amount: Number, // required, > 0
  currency: String, // default: "VND"
  category: String, // required, enum: ["food", "transport", "accommodation", "entertainment", "shopping", "other"]
  splitType: String, // "equal", "proportional", "custom", default: "equal"
  paidBy: ObjectId, // reference to User._id, required
  participants: [{
    userId: ObjectId, // reference to User._id
    amount: Number, // amount this user should pay
    isPaid: Boolean, // default: false
    paidAt: Date, // optional
    weight: Number, // for proportional split, default: 1
    customAmount: Number // for custom split amounts
  }],
  receipt: {
    imageUrl: String, // URL to receipt image
    fileName: String, // original filename
    fileSize: Number, // file size in bytes
    uploadedAt: Date
  },
  tags: [String], // optional, for filtering
  location: {
    name: String, // optional
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  expenseDate: Date, // required, default: Date.now
  calculationMetadata: {
    totalParticipants: Number, // number of participants
    baseAmount: Number, // base amount per person
    remainder: Number, // remainder after equal split
    calculationVersion: String, // version of calculation algorithm
    lastCalculatedAt: Date // when calculation was last updated
  },
  createdAt: Date, // default: Date.now
  updatedAt: Date, // default: Date.now
  createdBy: ObjectId, // reference to User._id
  isActive: Boolean // default: true
}
```

**Indexes:**

- `{ groupId: 1, expenseDate: -1 }`
- `{ groupId: 1, category: 1 }`
- `{ groupId: 1, paidBy: 1 }`
- `{ groupId: 1, splitType: 1 }`
- `{ "participants.userId": 1 }`
- `{ "calculationMetadata.lastCalculatedAt": -1 }`
- `{ createdAt: -1 }`

### 3.2.4 Settlements Collection

```javascript
{
  _id: ObjectId,
  groupId: ObjectId, // reference to Group._id, required
  fromUser: ObjectId, // reference to User._id, required
  toUser: ObjectId, // reference to User._id, required
  amount: Number, // required, > 0
  currency: String, // default: "VND"
  description: String, // optional
  status: String, // "pending" | "completed" | "cancelled", default: "pending"
  paymentMethod: String, // optional: "cash", "bank_transfer", "momo", "zalopay", "other"
  paymentReference: String, // optional, reference number
  calculationData: {
    originalDebt: Number, // original debt amount
    netAmount: Number, // net amount after all calculations
    calculationMethod: String, // method used for calculation
    relatedExpenses: [ObjectId] // related expense IDs
  },
  paidAt: Date, // optional
  createdAt: Date, // default: Date.now
  updatedAt: Date, // default: Date.now
  createdBy: ObjectId, // reference to User._id
  isActive: Boolean // default: true
}
```

**Indexes:**

- `{ groupId: 1, status: 1 }`
- `{ groupId: 1, fromUser: 1 }`
- `{ groupId: 1, toUser: 1 }`
- `{ "calculationData.relatedExpenses": 1 }`
- `{ status: 1, createdAt: -1 }`

### 3.2.5 Notifications Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId, // reference to User._id, required
  groupId: ObjectId, // reference to Group._id, optional
  type: String, // required, enum: ["new_expense", "new_member", "settlement_request", "settlement_completed", "debt_reminder", "group_invite"]
  title: String, // required
  message: String, // required
  data: {
    // Additional data based on notification type
    expenseId: ObjectId, // for expense-related notifications
    settlementId: ObjectId, // for settlement-related notifications
    amount: Number, // for financial notifications
    fromUser: ObjectId, // for user-related notifications
    groupName: String // for group-related notifications
  },
  isRead: Boolean, // default: false
  readAt: Date, // optional
  createdAt: Date, // default: Date.now
  expiresAt: Date, // optional, for auto-cleanup
  isActive: Boolean // default: true
}
```

**Indexes:**

- `{ userId: 1, isRead: 1, createdAt: -1 }`
- `{ userId: 1, type: 1 }`
- `{ groupId: 1, type: 1 }`
- `{ expiresAt: 1 }` (TTL index)

### 3.2.6 PaymentFormulas Collection

```javascript
{
  _id: ObjectId,
  name: String, // required, e.g., "Chia đều", "Theo tỷ lệ %"
  description: String, // optional
  formula: String, // required, JSON string containing formula logic
  isDefault: Boolean, // default: false
  isActive: Boolean, // default: true
  createdAt: Date, // default: Date.now
  updatedAt: Date, // default: Date.now
  createdBy: ObjectId // reference to User._id
}
```

**Example formula JSON:**

```json
{
  "type": "equal_split",
  "config": {
    "excludePaidBy": true,
    "roundToNearest": 1000
  }
}
```

**Indexes:**

- `{ isDefault: 1 }`
- `{ isActive: 1 }`

### 3.2.7 CalculationCache Collection

```javascript
{
  _id: ObjectId,
  groupId: ObjectId, // reference to Group._id, required
  cacheKey: String, // unique cache key
  calculationType: String, // "settlement", "expense_split", "balance"
  data: Object, // cached calculation result
  expiresAt: Date, // TTL for cache
  createdAt: Date, // default: Date.now
  isActive: Boolean // default: true
}
```

**Indexes:**

- `{ groupId: 1, calculationType: 1 }`
- `{ cacheKey: 1 }` (unique)
- `{ expiresAt: 1 }` (TTL index)

## 3.3 Redis Cache Schema

### 3.3.1 Session Cache

```javascript
// Key pattern: session:{userId}
{
  userId: String,
  sessionData: {
    lastActivity: Date,
    ipAddress: String,
    userAgent: String
  },
  expiresAt: Date // TTL: 24 hours
}
```

### 3.3.2 Query Cache

```javascript
// Key pattern: cache:{queryHash}
{
  queryHash: String,
  result: Object,
  expiresAt: Date // TTL: 1 hour
}
```

### 3.3.3 Real-time Notifications

```javascript
// Key pattern: notifications:{userId}
{
  userId: String,
  notifications: [{
    id: String,
    type: String,
    message: String,
    timestamp: Date
  }]
}
```

## 3.4 Relationships

### 3.4.1 User-Group Relationship

- **Many-to-Many**: Một user có thể tham gia nhiều group, một group có nhiều user
- **Through**: `Group.members` array với role và metadata

### 3.4.2 Group-Expense Relationship

- **One-to-Many**: Một group có nhiều expense
- **Foreign Key**: `Expense.groupId` → `Group._id`

### 3.4.3 User-Expense Relationship

- **Many-to-Many**: Một user có thể tạo/nhận nhiều expense
- **Through**: `Expense.paidBy` và `Expense.participants`

### 3.4.4 Group-Settlement Relationship

- **One-to-Many**: Một group có nhiều settlement
- **Foreign Key**: `Settlement.groupId` → `Group._id`

### 3.4.5 User-Notification Relationship

- **One-to-Many**: Một user có nhiều notification
- **Foreign Key**: `Notification.userId` → `User._id`

## 3.5 Data Validation Rules

### 3.5.1 User Validation

- Email phải unique và valid format
- Password tối thiểu 8 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường, 1 số
- FirstName và LastName không được rỗng

### 3.5.2 Group Validation

- Name không được rỗng và tối đa 100 ký tự
- Currency phải là valid currency code (VND, USD, EUR)
- Members array không được rỗng
- InviteCode phải unique

### 3.5.3 Expense Validation

- Amount phải > 0
- Category phải thuộc enum values
- Participants array không được rỗng
- PaidBy phải là member của group
- Tất cả participants phải là member của group

### 3.5.4 Settlement Validation

- FromUser và ToUser phải khác nhau
- Amount phải > 0
- Status phải thuộc enum values
- FromUser và ToUser phải là member của group

## 3.6 Database Performance Optimization

### 3.6.1 Indexing Strategy

- **Compound Indexes**: Cho các query thường dùng
- **Partial Indexes**: Cho các field có điều kiện
- **TTL Indexes**: Cho data cleanup (notifications)

### 3.6.2 Query Optimization

- **Pagination**: Sử dụng skip/limit cho large datasets
- **Projection**: Chỉ select fields cần thiết
- **Aggregation**: Sử dụng aggregation pipeline cho complex queries

### 3.6.3 Data Archiving

- **Soft Delete**: Sử dụng `isActive` field thay vì xóa thật
- **Data Retention**: Archive old notifications sau 1 năm
- **Backup Strategy**: Daily backup với 30 days retention

## 3.7 Migration Strategy

### 3.7.1 Schema Versioning

- Sử dụng Mongoose schema versioning
- Migration scripts cho breaking changes
- Backward compatibility cho 2 versions

### 3.7.2 Data Migration

- Batch processing cho large datasets
- Progress tracking cho long-running migrations
- Rollback strategy cho failed migrations

## 3.8 Security Considerations

### 3.8.1 Data Encryption

- **At Rest**: MongoDB encryption at rest
- **In Transit**: TLS/SSL cho tất cả connections
- **Application Level**: Encrypt sensitive fields (PII)

### 3.8.2 Access Control

- **Database Users**: Separate users cho read/write operations
- **IP Whitelisting**: Chỉ cho phép specific IPs
- **Audit Logging**: Log tất cả database operations

### 3.8.3 Data Privacy

- **GDPR Compliance**: User có thể request data deletion
- **Data Anonymization**: Anonymize data trong development
- **PII Protection**: Encrypt/mask sensitive personal information
