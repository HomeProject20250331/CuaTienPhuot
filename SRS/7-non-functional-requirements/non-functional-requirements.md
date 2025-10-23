# Non-Functional Requirements - Ứng dụng CuaTienPhuot

## Tổng quan

Tài liệu này mô tả các yêu cầu phi chức năng (Non-Functional Requirements) cho ứng dụng web chia tiền chi tiêu nhóm du lịch CuaTienPhuot. Các yêu cầu này đảm bảo chất lượng, hiệu suất và trải nghiệm người dùng của hệ thống.

## 1. Performance Requirements (Yêu cầu hiệu suất)

### 1.1 Response Time (Thời gian phản hồi)

#### API Response Time

- **Authentication APIs**: < 200ms
- **CRUD Operations**: < 300ms
- **Complex Queries** (thống kê, báo cáo): < 500ms
- **File Upload** (hóa đơn): < 2s cho file < 5MB
- **Real-time Notifications**: < 100ms

#### Frontend Performance

- **Initial Page Load**: < 2s trên kết nối 3G
- **Subsequent Page Navigation**: < 500ms
- **Component Rendering**: < 100ms
- **Image Loading**: < 1s cho ảnh < 1MB

### 1.2 Throughput (Thông lượng)

- **Concurrent Users**: Hỗ trợ 10,000+ người dùng đồng thời
- **API Requests**: 1,000 requests/second
- **Database Operations**: 5,000 operations/second
- **File Uploads**: 100 uploads/minute

### 1.3 Resource Utilization (Sử dụng tài nguyên)

- **CPU Usage**: < 70% trong điều kiện bình thường
- **Memory Usage**: < 80% RAM available
- **Disk I/O**: < 80% bandwidth
- **Network Bandwidth**: Tối ưu hóa để giảm data transfer

## 2. Security Requirements (Yêu cầu bảo mật)

### 2.1 Authentication & Authorization

#### Authentication

- **Password Policy**:
  - Tối thiểu 8 ký tự
  - Bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
  - Không được trùng với thông tin cá nhân
  - Không được sử dụng lại 5 mật khẩu gần nhất
- **Session Management**:
  - JWT tokens với expiration time 24h
  - Refresh tokens với expiration time 7 ngày
  - Automatic logout sau 30 phút không hoạt động
- **Multi-factor Authentication**: Tùy chọn SMS/Email OTP
- **Rate Limiting**:
  - Authentication endpoints: 5 requests/phút per IP
  - Other endpoints: 100 requests/phút per IP
  - File upload: 10 requests/phút per IP

#### Authorization

- **Role-based Access Control (RBAC)**:
  - Admin: Full access trong nhóm
  - Member: Limited access (chỉ xem và thêm chi tiêu)
- **Resource-level Permissions**:
  - Chỉ admin hoặc người tạo mới có thể sửa/xóa chi tiêu
  - Chỉ admin mới có thể xóa nhóm
  - Chỉ thành viên nhóm mới có thể xem thông tin nhóm

### 2.2 Data Protection

#### Encryption

- **Data in Transit**: HTTPS/TLS 1.3 cho tất cả communications
- **Data at Rest**: AES-256 encryption cho sensitive data
- **Password Storage**: bcrypt với salt rounds >= 12
- **API Keys**: Encrypted storage với rotation policy

#### Data Privacy

- **Personal Information**: Tuân thủ GDPR và Luật An ninh mạng Việt Nam
- **Financial Data**: Không lưu trữ thông tin thẻ tín dụng
- **Data Retention**: Tự động xóa dữ liệu sau 2 năm không hoạt động
- **Data Anonymization**: Anonymize dữ liệu khi export báo cáo

### 2.3 Input Validation & Sanitization

- **SQL Injection Prevention**: Parameterized queries và input validation
- **XSS Protection**: Content Security Policy và input sanitization
- **CSRF Protection**: CSRF tokens cho tất cả state-changing operations
- **Security Headers**:
  - Content Security Policy (CSP)
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - Strict-Transport-Security
  - X-XSS-Protection
- **File Upload Security**:
  - Chỉ cho phép file types: JPG, PNG, PDF
  - Scan malware trước khi upload
  - Giới hạn file size: 5MB

## 3. Scalability Requirements (Yêu cầu khả năng mở rộng)

### 3.1 Horizontal Scaling

#### Backend Scaling

- **Microservices Architecture**: Tách biệt các services
- **Load Balancing**: Round-robin và health checks
- **Database Sharding**: Theo groupId cho collections lớn
- **Caching Strategy**: Redis cho session và frequently accessed data

#### Frontend Scaling

- **CDN**: Static assets delivery qua CDN
- **Code Splitting**: Lazy loading cho các routes
- **Image Optimization**: WebP format và responsive images
- **Bundle Optimization**: Tree shaking và minification

### 3.2 Vertical Scaling

- **Auto-scaling**: Tự động scale dựa trên CPU và memory usage
- **Resource Monitoring**: Real-time monitoring với alerts
- **Performance Profiling**: Regular performance audits
- **Database Optimization**: Indexing và query optimization

### 3.3 Data Growth Handling

- **Database Partitioning**: Partition theo thời gian cho expenses
- **Archive Strategy**: Move old data to cold storage
- **Backup Strategy**: Daily backups với point-in-time recovery
- **Data Migration**: Zero-downtime migration tools

## 4. Availability Requirements (Yêu cầu tính sẵn sàng)

### 4.1 Uptime Targets

- **Overall System Uptime**: 99.9% (8.77 hours downtime/year)
- **Critical Services**: 99.95% (4.38 hours downtime/year)
- **Planned Maintenance**: Maximum 2 hours/month
- **Recovery Time Objective (RTO)**: < 15 minutes
- **Recovery Point Objective (RPO)**: < 5 minutes

### 4.2 Fault Tolerance

#### Redundancy

- **Multi-region Deployment**: Primary và secondary regions
- **Database Replication**: Master-slave với automatic failover
- **Load Balancer Redundancy**: Multiple load balancers
- **CDN Redundancy**: Multiple CDN providers

#### Disaster Recovery

- **Backup Strategy**:
  - Daily full backups
  - Hourly incremental backups
  - Cross-region backup replication
- **Recovery Procedures**:
  - Automated failover
  - Manual recovery procedures
  - Data integrity verification

### 4.3 Monitoring & Alerting

- **Health Checks**:
  - API endpoint monitoring
  - Database connectivity checks
  - External service dependencies
- **Alerting System**:
  - Real-time alerts cho critical issues
  - Escalation procedures
  - On-call rotation schedule

## 5. Usability Requirements (Yêu cầu khả năng sử dụng)

### 5.1 User Experience

#### Interface Design

- **Responsive Design**: Hoạt động tốt trên desktop, tablet, mobile
- **Accessibility**: WCAG 2.1 AA compliance
- **Internationalization**: Hỗ trợ tiếng Việt và English
- **Progressive Web App**: Offline capabilities cho basic functions

#### Navigation & Usability

- **Intuitive Navigation**: Maximum 3 clicks để access any feature
- **Search Functionality**: Global search trong groups và expenses
- **Keyboard Shortcuts**: Common operations có keyboard shortcuts
- **Help System**: Contextual help và user documentation

### 5.2 Learning Curve

- **Onboarding**: Interactive tutorial cho new users
- **Documentation**: Comprehensive user guides
- **Support**: In-app help và FAQ section
- **Feedback System**: User feedback collection và response

## 6. Compatibility Requirements (Yêu cầu tương thích)

### 6.1 Browser Support

#### Desktop Browsers

- **Chrome**: Version 90+ (2 latest versions)
- **Firefox**: Version 88+ (2 latest versions)
- **Safari**: Version 14+ (2 latest versions)
- **Edge**: Version 90+ (2 latest versions)

#### Mobile Browsers

- **Chrome Mobile**: Version 90+
- **Safari Mobile**: iOS 14+
- **Samsung Internet**: Version 13+
- **Firefox Mobile**: Version 88+

### 6.2 Device Support

#### Screen Resolutions

- **Desktop**: 1024x768 đến 4K
- **Tablet**: 768x1024 đến 1024x1366
- **Mobile**: 320x568 đến 414x896

#### Operating Systems

- **Windows**: Windows 10+
- **macOS**: macOS 10.15+
- **Linux**: Ubuntu 18.04+, CentOS 7+
- **iOS**: iOS 14+
- **Android**: Android 8.0+

## 7. Maintainability Requirements (Yêu cầu khả năng bảo trì)

### 7.1 Code Quality

#### Development Standards

- **Code Coverage**: Minimum 80% test coverage
- **Code Review**: Mandatory peer review cho tất cả changes
- **Documentation**: Comprehensive API và code documentation
- **Linting**: ESLint và Prettier cho frontend, ESLint cho backend

#### Testing Strategy

- **Unit Tests**: Jest cho frontend và backend
- **Integration Tests**: API testing với Supertest
- **E2E Tests**: Playwright cho critical user flows
- **Performance Tests**: Load testing với Artillery

### 7.2 Deployment & DevOps

#### CI/CD Pipeline

- **Automated Testing**: Run tests trên mọi commit
- **Automated Deployment**: Blue-green deployment strategy
- **Environment Management**: Dev, Staging, Production environments
- **Rollback Capability**: Quick rollback trong case of issues

#### Monitoring & Logging

- **Application Logging**: Structured logging với correlation IDs
- **Error Tracking**: Sentry integration cho error monitoring
- **Performance Monitoring**: APM tools cho performance tracking
- **Business Metrics**: Custom metrics cho business KPIs

## 8. Compliance Requirements (Yêu cầu tuân thủ)

### 8.1 Legal Compliance

#### Data Protection

- **GDPR Compliance**: EU General Data Protection Regulation
- **Vietnam Cybersecurity Law**: Luật An ninh mạng Việt Nam
- **Data Localization**: Lưu trữ dữ liệu trong Vietnam khi có thể

#### Financial Regulations

- **PCI DSS**: Payment Card Industry Data Security Standard
- **SOX Compliance**: Sarbanes-Oxley Act compliance
- **Audit Trail**: Comprehensive audit logging cho financial transactions

### 8.2 Industry Standards

#### Security Standards

- **ISO 27001**: Information Security Management
- **OWASP Top 10**: Web Application Security Risks
- **NIST Cybersecurity Framework**: Cybersecurity best practices

#### Quality Standards

- **ISO 9001**: Quality Management Systems
- **CMMI Level 3**: Capability Maturity Model Integration
- **Agile Methodology**: Scrum/Kanban development process

## 9. Performance Metrics & KPIs

### 9.1 Technical Metrics

- **API Response Time**: Average < 300ms, 95th percentile < 500ms
- **Page Load Time**: Average < 2s, 95th percentile < 3s
- **Error Rate**: < 0.1% cho all operations
- **Uptime**: > 99.9% monthly uptime

### 9.2 Business Metrics

- **User Engagement**: Daily active users, session duration
- **Feature Adoption**: Usage rate của các features
- **User Satisfaction**: NPS score > 50
- **Support Tickets**: < 5% users submit support tickets monthly

## 10. Risk Assessment & Mitigation

### 10.1 Technical Risks

#### Performance Risks

- **Risk**: Database performance degradation với large datasets
- **Mitigation**: Database optimization, caching, archiving strategy

#### Security Risks

- **Risk**: Data breach hoặc unauthorized access
- **Mitigation**: Multi-layer security, regular security audits, penetration testing

#### Scalability Risks

- **Risk**: System không handle được traffic spikes
- **Mitigation**: Auto-scaling, load testing, capacity planning

### 10.2 Business Risks

#### User Adoption Risks

- **Risk**: Low user adoption rate
- **Mitigation**: User research, iterative UX improvements, marketing strategy

#### Data Loss Risks

- **Risk**: Data loss due to system failures
- **Mitigation**: Comprehensive backup strategy, disaster recovery procedures

## 11. Testing Requirements

### 11.1 Performance Testing

- **Load Testing**: Test với expected user load
- **Stress Testing**: Test beyond normal capacity
- **Volume Testing**: Test với large datasets
- **Spike Testing**: Test sudden traffic increases

### 11.2 Security Testing

- **Penetration Testing**: Quarterly security assessments
- **Vulnerability Scanning**: Automated vulnerability scans
- **Code Security Review**: Security-focused code reviews
- **Dependency Scanning**: Regular dependency vulnerability checks

### 11.3 Usability Testing

- **User Acceptance Testing**: Regular UAT với real users
- **Accessibility Testing**: WCAG compliance testing
- **Cross-browser Testing**: Testing trên multiple browsers
- **Mobile Testing**: Testing trên various mobile devices

## Kết luận

Các Non-Functional Requirements này đảm bảo rằng ứng dụng CuaTienPhuot không chỉ đáp ứng các chức năng cần thiết mà còn đảm bảo chất lượng, hiệu suất, bảo mật và trải nghiệm người dùng tốt nhất. Việc tuân thủ các yêu cầu này sẽ giúp ứng dụng có thể scale và maintain trong dài hạn.
