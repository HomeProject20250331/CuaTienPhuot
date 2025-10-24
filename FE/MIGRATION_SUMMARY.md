# Migration từ Cookies sang localStorage

## Tóm tắt thay đổi

Đã chuyển đổi hoàn toàn từ việc sử dụng cookies sang localStorage cho authentication.

## Các file đã thay đổi

### 1. Tạo mới

- `src/lib/auth/localStorage.ts` - Utilities cho localStorage authentication

### 2. Cập nhật

- `src/lib/actions/auth.ts` - Loại bỏ logic cookies, chỉ trả về data cho client-side
- `src/lib/api/axios-client.ts` - Chuyển từ authCookies sang authStorage
- `src/lib/api/hooks/auth.ts` - Cập nhật useAuth để sử dụng localStorage
- `src/components/forms/LoginForm.tsx` - Chuyển từ server actions sang React Query mutations
- `src/components/forms/RegisterForm.tsx` - Chuyển từ server actions sang React Query mutations
- `src/components/auth/LogoutButton.tsx` - Sử dụng localStorage và React Query
- `middleware.ts` - Đơn giản hóa vì không thể truy cập localStorage

### 3. Xóa

- `src/lib/auth/cookies.ts` - Không còn cần thiết
- `src/hooks/useCookies.ts` - Không còn cần thiết

## Các thay đổi chính

### Authentication Storage

- **Trước**: Sử dụng cookies với `cookies-next`
- **Sau**: Sử dụng localStorage với custom utilities

### Form Handling

- **Trước**: Server Actions với `useActionState`
- **Sau**: React Query mutations với `useMutation`

### Token Management

- **Trước**: Cookies với httpOnly và secure flags
- **Sau**: localStorage với client-side management

### Middleware

- **Trước**: Kiểm tra cookies trong middleware
- **Sau**: Đơn giản hóa, authentication được handle ở client-side

## Lợi ích

1. **Đơn giản hóa**: Không cần quản lý cookies phức tạp
2. **Client-side control**: Toàn quyền kiểm soát authentication state
3. **Performance**: Không cần server-side cookie parsing
4. **Flexibility**: Dễ dàng thêm/bớt authentication logic

## Lưu ý

- Middleware không thể truy cập localStorage, nên authentication guard được handle ở client-side
- Cần đảm bảo localStorage được clear khi logout
- SSR compatibility có thể bị ảnh hưởng, cần test kỹ
