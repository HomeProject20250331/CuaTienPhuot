# Authentication APIs

## POST /api/auth/register

Đăng ký tài khoản mới.

### Request Body

```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "Nguyễn Văn A",
  "phone": "+84901234567"
}
```

### Validation Rules

- `email`: Required, valid email format, unique
- `password`: Required, min 8 characters, must contain at least 1 uppercase, 1 lowercase, and 1 number
- `fullName`: Required, min 2 characters, max 100 characters
- `phone`: Optional, valid Vietnamese phone format

### Success Response (201)

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "fullName": "Nguyễn Văn A",
      "phone": "+84901234567",
      "avatar": null,
      "isEmailVerified": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  },
  "message": "Đăng ký thành công"
}
```

### Error Responses

- **400**: Dữ liệu đầu vào không hợp lệ
- **409**: Email đã tồn tại
- **422**: Mật khẩu không đủ mạnh

---

## POST /api/auth/login

Đăng nhập vào hệ thống.

### Request Body

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "fullName": "Nguyễn Văn A",
      "phone": "+84901234567",
      "avatar": "https://example.com/avatar.jpg",
      "isEmailVerified": true,
      "lastLoginAt": "2024-01-01T00:00:00.000Z"
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  },
  "message": "Đăng nhập thành công"
}
```

### Error Responses

- **400**: Email hoặc mật khẩu không hợp lệ
- **401**: Thông tin đăng nhập không chính xác
- **423**: Tài khoản bị khóa

---

## POST /api/auth/logout

Đăng xuất khỏi hệ thống.

### Headers

```
Authorization: Bearer <access_token>
```

### Success Response (200)

```json
{
  "success": true,
  "message": "Đăng xuất thành công"
}
```

### Error Responses

- **401**: Token không hợp lệ hoặc đã hết hạn

---

## POST /api/auth/refresh-token

Làm mới access token.

### Request Body

```json
{
  "refreshToken": "jwt_refresh_token"
}
```

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "accessToken": "new_jwt_access_token",
    "refreshToken": "new_jwt_refresh_token"
  },
  "message": "Token đã được làm mới"
}
```

### Error Responses

- **400**: Refresh token không hợp lệ
- **401**: Refresh token đã hết hạn

---

## POST /api/auth/forgot-password

Gửi email reset mật khẩu.

### Request Body

```json
{
  "email": "user@example.com"
}
```

### Success Response (200)

```json
{
  "success": true,
  "message": "Email reset mật khẩu đã được gửi"
}
```

### Error Responses

- **400**: Email không hợp lệ
- **404**: Email không tồn tại trong hệ thống

### Notes

- Email reset sẽ có hiệu lực trong 15 phút
- Chỉ gửi 1 email reset mỗi 5 phút cho cùng 1 email
- Email verification có hiệu lực trong 24 giờ

---

## POST /api/auth/reset-password

Đặt lại mật khẩu mới.

### Request Body

```json
{
  "token": "reset_token_from_email",
  "newPassword": "new_password123"
}
```

### Validation Rules

- `token`: Required, valid reset token
- `newPassword`: Required, min 8 characters, must contain at least 1 uppercase, 1 lowercase, and 1 number

### Success Response (200)

```json
{
  "success": true,
  "message": "Mật khẩu đã được đặt lại thành công"
}
```

### Error Responses

- **400**: Token hoặc mật khẩu không hợp lệ
- **401**: Token đã hết hạn hoặc không tồn tại
- **422**: Mật khẩu mới không đủ mạnh

---

## JWT Token Structure

### Access Token

```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "iat": 1640995200,
  "exp": 1640998800,
  "type": "access"
}
```

### Refresh Token

```json
{
  "sub": "user_id",
  "iat": 1640995200,
  "exp": 1641081600,
  "type": "refresh"
}
```

### Token Expiration

- **Access Token**: 1 giờ
- **Refresh Token**: 7 ngày

### Security Notes

- Tokens được ký bằng JWT secret
- Refresh token được lưu trong database với hash
- Mỗi user chỉ có 1 refresh token active tại 1 thời điểm
- Khi đăng xuất, refresh token sẽ bị vô hiệu hóa
