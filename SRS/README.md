# Tài liệu SRS - Ứng dụng CuaTienPhuot

## Tổng quan

Tài liệu Software Requirements Specification (SRS) cho ứng dụng web chia tiền chi tiêu nhóm du lịch CuaTienPhuot.

## Cấu trúc tài liệu

### ✅ Phần 1: Tổng quan dự án

- [Project Overview](./1-project-overview/project-overview.md)
  - Giới thiệu ứng dụng và mục đích
  - Vấn đề cần giải quyết
  - Target users và personas
  - Phạm vi dự án (scope) - Progressive Web App (PWA)
  - Lợi ích dự kiến và success metrics

### ✅ Phần 2: Tech Stack & Architecture

- [Tech Stack](./2-tech-stack-architecture/tech-stack.md)
  - Technology stack chi tiết (NestJS, Next.js, MongoDB, Redis)
  - System architecture
  - Folder structure cho Backend (NestJS) và Frontend (Next.js)
  - Security architecture
  - Performance considerations
  - Deployment strategy

### ✅ Phần 3: Database Schema

- [Database Schema](./3-database-schema/database-schema.md)
  - Chi tiết 7 collections: Users, Groups, Expenses, Settlements, Notifications, PaymentFormulas, CalculationCache
  - Redis Cache Schema cho session và query caching
  - Indexes và relationships
  - Data validation rules
  - Performance optimization
  - Security considerations

### ✅ Phần 4: User Stories & Features

- [User Stories Overview](./4-user-stories-features/user-stories-overview.md)
- [Epic 1: Quản lý người dùng](./4-user-stories-features/epic1-user-management/user-management.md) (7 stories)
- [Epic 2: Quản lý nhóm](./4-user-stories-features/epic2-group-management/group-management.md) (9 stories)
- [Epic 3: Quản lý chi tiêu](./4-user-stories-features/epic3-expense-management/expense-management.md) (9 stories)
- [Epic 4: Tính toán & Thanh toán](./4-user-stories-features/epic4-payment-calculation/payment-calculation.md) (9 stories)
- [Epic 5: Thống kê & Báo cáo](./4-user-stories-features/epic5-statistics-reports/statistics-reports.md) (10 stories)
- [Epic 6: Thông báo](./4-user-stories-features/epic6-notifications/notifications.md) (11 stories)

### ✅ Phần 5: API Specifications

- [API Overview](./5-api-specifications/api-overview.md)
- [Authentication APIs](./5-api-specifications/auth-apis.md)
- [User APIs](./5-api-specifications/user-apis.md)
- [Group APIs](./5-api-specifications/group-apis.md)
- [Expense APIs](./5-api-specifications/expense-apis.md)
- [Settlement APIs](./5-api-specifications/settlement-apis.md)
- [Statistics APIs](./5-api-specifications/statistics-apis.md)
- [Notification APIs](./5-api-specifications/notification-apis.md)

### ✅ Phần 6: Frontend Components Structure

- [Frontend Overview](./6-frontend-components/frontend-overview.md)
- [Pages Structure](./6-frontend-components/pages-structure.md)
- [Layout Components](./6-frontend-components/layout-components.md)
- [Form Components](./6-frontend-components/form-components.md)
- [Data Display Components](./6-frontend-components/data-display-components.md)
- [Modal Components](./6-frontend-components/modal-components.md)
- [Notification Components](./6-frontend-components/notification-components.md)
- [Custom Hooks](./6-frontend-components/custom-hooks.md)
- [Utils & Helpers](./6-frontend-components/utils-helpers.md)

### ✅ Phần 7: Non-Functional Requirements

- [Non-Functional Requirements](./7-non-functional-requirements/non-functional-requirements.md)
  - Performance requirements (API response time, page load time)
  - Security requirements (authentication, authorization, data protection)
  - Scalability requirements (horizontal/vertical scaling)
  - Availability requirements (99.9% uptime)
  - Usability requirements (responsive design, accessibility)
  - Compatibility requirements (browser support, device support)
  - Maintainability requirements (code quality, testing)
  - Compliance requirements (GDPR, Vietnam Cybersecurity Law)

### ✅ Phần 8: Payment Formulas

- [Payment Formulas](./8-payment-formulas/payment-formulas.md)
  - Equal Split (chia đều) với xử lý số dư
  - Proportional Split (chia theo tỷ lệ)
  - Item-based Split (chia theo món)
  - Settlement Algorithm (thuật toán tối ưu hóa giao dịch)
  - Currency Conversion (chuyển đổi tiền tệ)
  - Tax và Service Charges
  - Validation và Error Handling
  - Performance Optimization với caching
  - Testing Formulas
  - Database schema hỗ trợ calculation metadata

### ✅ Phần 9: Acceptance Criteria

- [Acceptance Criteria](./9-acceptance-criteria/acceptance-criteria.md)
  - 54 tiêu chí chấp nhận chi tiết với format Given-When-Then
  - User Management (6 criteria)
  - Group Management (6 criteria)
  - Expense Management (8 criteria)
  - Payment Calculation (3 criteria)
  - Statistics & Reports (3 criteria)
  - Notifications (11 criteria)
  - Mobile Responsive (3 criteria)
  - Security (3 criteria)
  - Performance (3 criteria)
  - Error Handling (3 criteria)
  - Accessibility (3 criteria)
  - Integration Testing (2 criteria)
  - Data Migration (2 criteria)
  - Monitoring & Analytics (2 criteria)

### ✅ Phần 10: Risks & Mitigation

- [Risks & Mitigation](./10-risks-mitigation/risks-mitigation.md)
  - Technical Risks (9 risks): Performance, Security, Scalability, Data
  - Business Risks (6 risks): Market, Financial, Operational
  - Compliance & Legal Risks (2 risks): GDPR, Vietnam Cybersecurity Law
  - Technology Risks (2 risks): Technology Stack, Integration
  - Risk Monitoring & Management
  - Contingency Plans
  - Risk Communication
  - Success Metrics

## Trạng thái hoàn thành

- ✅ **Phần 1**: Tổng quan dự án - Hoàn thành
- ✅ **Phần 2**: Tech Stack & Architecture - Hoàn thành
- ✅ **Phần 3**: Database Schema - Hoàn thành
- ✅ **Phần 4**: User Stories & Features - Hoàn thành (55 User Stories)
- ✅ **Phần 5**: API Specifications - Hoàn thành (8 API modules)
- ✅ **Phần 6**: Frontend Components Structure - Hoàn thành (9 component modules)
- ✅ **Phần 7**: Non-Functional Requirements - Hoàn thành
- ✅ **Phần 8**: Payment Formulas - Hoàn thành
- ✅ **Phần 9**: Acceptance Criteria - Hoàn thành (54 criteria)
- ✅ **Phần 10**: Risks & Mitigation - Hoàn thành (19 risks)

## Cách sử dụng

1. **Đọc tổng quan**: Bắt đầu với Phần 1 để hiểu mục đích và phạm vi dự án
2. **Setup môi trường**: Tham khảo Phần 2 để setup development environment
3. **Thiết kế database**: Sử dụng Phần 3 để implement database schema
4. **Phát triển tính năng**: Tham khảo Phần 4 (User Stories) để implement theo từng Epic
5. **API Development**: Sử dụng Phần 5 để implement backend APIs
6. **Frontend Development**: Tham khảo Phần 6 để xây dựng UI components
7. **Quality Assurance**: Áp dụng Phần 7 (Non-functional requirements) và Phần 9 (Acceptance criteria)
8. **Payment Logic**: Implement Phần 8 (Payment formulas) cho tính toán chia tiền
9. **Risk Management**: Tham khảo Phần 10 để quản lý rủi ro trong quá trình phát triển

## Tổng kết dự án

Dự án CuaTienPhuot đã có đầy đủ tài liệu SRS hoàn chỉnh với:

- **55 User Stories** chi tiết
- **8 API modules** với specifications đầy đủ (đã đồng bộ với user stories)
- **9 Frontend component modules**
- **54 Acceptance Criteria** với format Given-When-Then
- **19 Risk assessments** với mitigation strategies
- **Comprehensive payment formulas** và algorithms với database schema hỗ trợ
- **Non-functional requirements** chi tiết cho performance, security, scalability
- **Progressive Web App (PWA)** strategy với offline capabilities
- **Redis caching** cho performance optimization
- **Enhanced security** với rate limiting và security headers

## Liên hệ

Để có thêm thông tin hoặc cập nhật tài liệu, vui lòng liên hệ team phát triển.
