# Cross-Reference Table - CuaTienPhuot SRS

## Tổng quan

Tài liệu này cung cấp bảng tham chiếu để đảm bảo tính nhất quán giữa các phần khác nhau trong SRS. Mọi thay đổi về các thông số kỹ thuật phải được cập nhật ở tất cả các vị trí liên quan.

## 1. Authentication & Security Parameters

| Thông số                     | Giá trị chuẩn                                                | Vị trí trong SRS                                                                                                                                                        | Ghi chú                       |
| ---------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| **Access Token Expiration**  | 1 giờ                                                        | 2-tech-stack-architecture/tech-stack.md<br/>5-api-specifications/auth-apis.md<br/>7-non-functional-requirements/non-functional-requirements.md                          | JWT access token              |
| **Refresh Token Expiration** | 7 ngày                                                       | 2-tech-stack-architecture/tech-stack.md<br/>5-api-specifications/auth-apis.md<br/>7-non-functional-requirements/non-functional-requirements.md                          | JWT refresh token             |
| **Password Policy**          | Tối thiểu 8 ký tự<br/>Bao gồm: 1 chữ hoa, 1 chữ thường, 1 số | 4-user-stories-features/epic1-user-management/user-management.md<br/>5-api-specifications/auth-apis.md<br/>7-non-functional-requirements/non-functional-requirements.md | Không bắt buộc ký tự đặc biệt |
| **bcrypt Salt Rounds**       | 12                                                           | 2-tech-stack-architecture/tech-stack.md<br/>7-non-functional-requirements/non-functional-requirements.md                                                                | Password hashing              |
| **Auto Logout**              | 30 phút không hoạt động                                      | 7-non-functional-requirements/non-functional-requirements.md                                                                                                            | Session timeout               |

## 2. Email & Communication Parameters

| Thông số                      | Giá trị chuẩn  | Vị trí trong SRS                                                                                       | Ghi chú             |
| ----------------------------- | -------------- | ------------------------------------------------------------------------------------------------------ | ------------------- |
| **Email Verification Expiry** | 24 giờ         | 4-user-stories-features/epic1-user-management/user-management.md<br/>5-api-specifications/auth-apis.md | Link xác thực email |
| **Password Reset Expiry**     | 15 phút        | 5-api-specifications/auth-apis.md                                                                      | Link reset mật khẩu |
| **Password Reset Rate Limit** | 1 email/5 phút | 5-api-specifications/auth-apis.md                                                                      | Per email address   |

## 3. File Upload Parameters

| Thông số              | Giá trị chuẩn | Vị trí trong SRS                                                                                                                                                                                                    | Ghi chú             |
| --------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| **Max File Size**     | 5MB           | 2-tech-stack-architecture/tech-stack.md<br/>4-user-stories-features/epic1-user-management/user-management.md<br/>5-api-specifications/auth-apis.md<br/>7-non-functional-requirements/non-functional-requirements.md | Tất cả file uploads |
| **Supported Formats** | JPG, PNG, PDF | 2-tech-stack-architecture/tech-stack.md<br/>4-user-stories-features/epic1-user-management/user-management.md<br/>5-api-specifications/auth-apis.md<br/>7-non-functional-requirements/non-functional-requirements.md | File types allowed  |

## 4. Rate Limiting Parameters

| Thông số                     | Giá trị chuẩn     | Vị trí trong SRS                                                                                                                               | Ghi chú        |
| ---------------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| **Authentication Endpoints** | 5 requests/phút   | 2-tech-stack-architecture/tech-stack.md<br/>5-api-specifications/auth-apis.md<br/>7-non-functional-requirements/non-functional-requirements.md | Per IP address |
| **Other Endpoints**          | 100 requests/phút | 2-tech-stack-architecture/tech-stack.md<br/>5-api-specifications/auth-apis.md<br/>7-non-functional-requirements/non-functional-requirements.md | Per IP address |
| **File Upload**              | 10 requests/phút  | 5-api-specifications/auth-apis.md<br/>7-non-functional-requirements/non-functional-requirements.md                                             | Per IP address |

## 5. Performance Parameters

| Thông số                    | Giá trị chuẩn | Vị trí trong SRS                                                                                                                                                                                              | Ghi chú                   |
| --------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| **API Response Time**       | < 500ms       | 1-project-overview/project-overview.md<br/>4-user-stories-features/user-stories-overview.md<br/>7-non-functional-requirements/non-functional-requirements.md<br/>9-acceptance-criteria/acceptance-criteria.md | General API               |
| **Authentication APIs**     | < 200ms       | 7-non-functional-requirements/non-functional-requirements.md<br/>9-acceptance-criteria/acceptance-criteria.md                                                                                                 | Login/Register            |
| **CRUD Operations**         | < 300ms       | 7-non-functional-requirements/non-functional-requirements.md<br/>9-acceptance-criteria/acceptance-criteria.md                                                                                                 | Create/Read/Update/Delete |
| **Complex Queries**         | < 500ms       | 7-non-functional-requirements/non-functional-requirements.md<br/>9-acceptance-criteria/acceptance-criteria.md                                                                                                 | Statistics/Reports        |
| **File Upload**             | < 2s          | 7-non-functional-requirements/non-functional-requirements.md<br/>9-acceptance-criteria/acceptance-criteria.md                                                                                                 | For files < 5MB           |
| **Real-time Notifications** | < 100ms       | 7-non-functional-requirements/non-functional-requirements.md<br/>9-acceptance-criteria/acceptance-criteria.md                                                                                                 | WebSocket messages        |
| **Page Load Time**          | < 2s          | 1-project-overview/project-overview.md<br/>7-non-functional-requirements/non-functional-requirements.md<br/>9-acceptance-criteria/acceptance-criteria.md                                                      | Initial page load         |
| **Uptime Target**           | 99.9%         | 1-project-overview/project-overview.md<br/>7-non-functional-requirements/non-functional-requirements.md<br/>9-acceptance-criteria/acceptance-criteria.md                                                      | System availability       |

## 6. Database Parameters

| Thông số             | Giá trị chuẩn           | Vị trí trong SRS                                                                                                                                       | Ghi chú               |
| -------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- |
| **Database Type**    | MongoDB                 | 2-tech-stack-architecture/tech-stack.md<br/>3-database-schema/database-schema.md                                                                       | Primary database      |
| **Cache System**     | Redis                   | 2-tech-stack-architecture/tech-stack.md<br/>3-database-schema/database-schema.md                                                                       | Session & query cache |
| **Connection Pool**  | MongoDB connection pool | 2-tech-stack-architecture/tech-stack.md<br/>7-non-functional-requirements/non-functional-requirements.md                                               | Database connections  |
| **Backup Frequency** | Daily                   | 3-database-schema/database-schema.md<br/>7-non-functional-requirements/non-functional-requirements.md<br/>9-acceptance-criteria/acceptance-criteria.md | Automated backups     |
| **Backup Retention** | 30 days                 | 3-database-schema/database-schema.md<br/>7-non-functional-requirements/non-functional-requirements.md                                                  | Backup storage        |

## 7. Business Logic Parameters

| Thông số             | Giá trị chuẩn    | Vị trí trong SRS                                                                | Ghi chú          |
| -------------------- | ---------------- | ------------------------------------------------------------------------------- | ---------------- |
| **Max Participants** | 50 người         | 8-payment-formulas/payment-formulas.md                                          | Per group        |
| **Min Participants** | 1 người          | 8-payment-formulas/payment-formulas.md                                          | Per expense      |
| **Min Amount**       | 1,000 VNĐ        | 8-payment-formulas/payment-formulas.md                                          | Minimum expense  |
| **Currency**         | VND              | 1-project-overview/project-overview.md<br/>3-database-schema/database-schema.md | Default currency |
| **Timezone**         | Asia/Ho_Chi_Minh | 3-database-schema/database-schema.md                                            | Default timezone |

## 8. Validation Rules

| Thông số                       | Giá trị chuẩn                | Vị trí trong SRS                                                                                       | Ghi chú                        |
| ------------------------------ | ---------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------ |
| **Email Format**               | Valid email format           | 4-user-stories-features/epic1-user-management/user-management.md<br/>5-api-specifications/auth-apis.md | Email validation               |
| **Full Name Length**           | 2-100 ký tự                  | 4-user-stories-features/epic1-user-management/user-management.md<br/>5-api-specifications/auth-apis.md | Name validation                |
| **Phone Format**               | Vietnamese format (10-11 số) | 4-user-stories-features/epic1-user-management/user-management.md<br/>5-api-specifications/auth-apis.md | Phone validation               |
| **Group Name Length**          | 1-100 ký tự                  | 4-user-stories-features/epic2-group-management/group-management.md                                     | Group name validation          |
| **Group Description Length**   | 0-500 ký tự                  | 4-user-stories-features/epic2-group-management/group-management.md                                     | Group description validation   |
| **Expense Description Length** | 1-200 ký tự                  | 4-user-stories-features/epic3-expense-management/expense-management.md                                 | Expense description validation |

## 9. Error Handling Standards

| Thông số              | Giá trị chuẩn            | Vị trí trong SRS                             | Ghi chú             |
| --------------------- | ------------------------ | -------------------------------------------- | ------------------- |
| **Error Language**    | Tiếng Việt               | 9-acceptance-criteria/acceptance-criteria.md | User-facing errors  |
| **HTTP Status Codes** | Standard REST codes      | 5-api-specifications/api-overview.md         | API error responses |
| **Retry Attempts**    | 3 lần                    | 9-acceptance-criteria/acceptance-criteria.md | Network error retry |
| **Retry Backoff**     | Exponential (1s, 2s, 4s) | 9-acceptance-criteria/acceptance-criteria.md | Retry timing        |

## 10. Compliance & Legal

| Thông số                      | Giá trị chuẩn         | Vị trí trong SRS                                                                                         | Ghi chú               |
| ----------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------- | --------------------- |
| **GDPR Compliance**           | Required              | 7-non-functional-requirements/non-functional-requirements.md<br/>10-risks-mitigation/risks-mitigation.md | Data protection       |
| **Vietnam Cybersecurity Law** | Required              | 7-non-functional-requirements/non-functional-requirements.md<br/>10-risks-mitigation/risks-mitigation.md | Local compliance      |
| **Data Retention**            | 2 năm không hoạt động | 7-non-functional-requirements/non-functional-requirements.md                                             | Auto-delete policy    |
| **Data Localization**         | Vietnam khi có thể    | 7-non-functional-requirements/non-functional-requirements.md                                             | Data storage location |

## Cách sử dụng bảng này

1. **Khi thay đổi thông số**: Cập nhật tất cả các vị trí được liệt kê trong cột "Vị trí trong SRS"
2. **Khi thêm thông số mới**: Thêm vào bảng này và cập nhật tất cả các file liên quan
3. **Khi review SRS**: Sử dụng bảng này để kiểm tra tính nhất quán
4. **Khi implement**: Tham khảo bảng này để đảm bảo tuân thủ chuẩn

## Lưu ý quan trọng

- **Mọi thay đổi** về các thông số trong bảng này phải được **đồng bộ** ở tất cả các vị trí
- **Kiểm tra cross-reference** trước khi commit bất kỳ thay đổi nào
- **Cập nhật bảng này** khi có thông số mới hoặc thay đổi cấu trúc SRS
- **Sử dụng version control** để track các thay đổi về thông số

## Liên hệ

Để cập nhật hoặc thêm thông số mới vào bảng này, vui lòng liên hệ team phát triển và cập nhật tất cả các file liên quan.
