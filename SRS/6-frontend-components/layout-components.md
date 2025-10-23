# Layout Components

## Header Components

### Main Header (`Header`)

```typescript
// components/layout/Header.tsx
interface HeaderProps {
  variant?: "landing" | "dashboard";
  user?: User;
}

export function Header({ variant = "landing", user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Logo />
        <Navigation variant={variant} />
        <UserMenu user={user} />
      </div>
    </header>
  );
}
```

**Features:**

- Responsive navigation
- User authentication state
- Logo và branding
- Mobile menu toggle

### Dashboard Header (`DashboardHeader`)

```typescript
// components/layout/DashboardHeader.tsx
interface DashboardHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function DashboardHeader({
  title,
  description,
  actions,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
```

**Features:**

- Page title và description
- Action buttons
- Breadcrumb navigation
- Quick stats

### Group Header (`GroupHeader`)

```typescript
// components/layout/GroupHeader.tsx
interface GroupHeaderProps {
  group: Group;
  onEdit?: () => void;
  onSettings?: () => void;
}

export function GroupHeader({ group, onEdit, onSettings }: GroupHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <GroupAvatar group={group} size="lg" />
        <div>
          <h1 className="text-2xl font-semibold">{group.name}</h1>
          <p className="text-muted-foreground">{group.description}</p>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="secondary">{group.memberCount} thành viên</Badge>
            <Badge variant="outline">
              {formatCurrency(group.totalExpenses)}
            </Badge>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Chỉnh sửa
        </Button>
        <Button variant="outline" onClick={onSettings}>
          <Settings className="h-4 w-4 mr-2" />
          Cài đặt
        </Button>
      </div>
    </div>
  );
}
```

**Features:**

- Group avatar và thông tin
- Member count và total expenses
- Action buttons
- Status badges

## Sidebar Components

### Dashboard Sidebar (`DashboardSidebar`)

```typescript
// components/layout/DashboardSidebar.tsx
interface DashboardSidebarProps {
  user: User;
  groups: Group[];
  currentPath?: string;
}

export function DashboardSidebar({
  user,
  groups,
  currentPath,
}: DashboardSidebarProps) {
  return (
    <aside className="w-64 bg-background border-r">
      <div className="p-4">
        <UserProfile user={user} />
      </div>
      <nav className="p-4">
        <SidebarNavigation currentPath={currentPath} />
        <GroupsSection groups={groups} />
      </nav>
    </aside>
  );
}
```

**Features:**

- User profile section
- Main navigation
- Groups list
- Collapsible sections
- Mobile responsive

### Sidebar Navigation (`SidebarNavigation`)

```typescript
// components/layout/SidebarNavigation.tsx
interface SidebarNavigationProps {
  currentPath?: string;
}

export function SidebarNavigation({ currentPath }: SidebarNavigationProps) {
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Nhóm", href: "/groups", icon: Users },
    { name: "Thông báo", href: "/notifications", icon: Bell },
    { name: "Cài đặt", href: "/settings", icon: Settings },
  ];

  return (
    <nav className="space-y-2">
      {navigation.map((item) => (
        <SidebarNavItem
          key={item.name}
          item={item}
          isActive={currentPath === item.href}
        />
      ))}
    </nav>
  );
}
```

**Features:**

- Navigation items với icons
- Active state highlighting
- Hover effects
- Keyboard navigation

### Groups Section (`GroupsSection`)

```typescript
// components/layout/GroupsSection.tsx
interface GroupsSectionProps {
  groups: Group[];
  currentGroupId?: string;
}

export function GroupsSection({ groups, currentGroupId }: GroupsSectionProps) {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          Nhóm của tôi
        </h3>
        <Button size="sm" variant="ghost">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-1">
        {groups.map((group) => (
          <GroupNavItem
            key={group.id}
            group={group}
            isActive={currentGroupId === group.id}
          />
        ))}
      </div>
    </div>
  );
}
```

**Features:**

- Groups list với avatars
- Active group highlighting
- Quick actions
- Collapsible groups

## Footer Components

### Main Footer (`Footer`)

```typescript
// components/layout/Footer.tsx
export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Logo />
            <p className="text-sm text-muted-foreground mt-2">
              Ứng dụng chia tiền du lịch thông minh
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Sản phẩm</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href="/features">Tính năng</Link>
              </li>
              <li>
                <Link href="/pricing">Bảng giá</Link>
              </li>
              <li>
                <Link href="/api">API</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Hỗ trợ</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href="/help">Trợ giúp</Link>
              </li>
              <li>
                <Link href="/contact">Liên hệ</Link>
              </li>
              <li>
                <Link href="/status">Trạng thái</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Pháp lý</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href="/privacy">Chính sách riêng tư</Link>
              </li>
              <li>
                <Link href="/terms">Điều khoản</Link>
              </li>
              <li>
                <Link href="/cookies">Cookies</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © 2024 CuaTienPhuot. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <SocialLinks />
          </div>
        </div>
      </div>
    </footer>
  );
}
```

**Features:**

- Company information
- Navigation links
- Social media links
- Copyright notice
- Responsive layout

## Navigation Components

### Breadcrumb (`Breadcrumb`)

```typescript
// components/layout/Breadcrumb.tsx
interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
          {item.href ? (
            <Link href={item.href} className="hover:text-foreground">
              {item.label}
            </Link>
          ) : (
            <span
              className={item.isActive ? "text-foreground font-medium" : ""}
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
```

**Features:**

- Hierarchical navigation
- Clickable breadcrumb items
- Active state highlighting
- Responsive design

### Tab Navigation (`TabNavigation`)

```typescript
// components/layout/TabNavigation.tsx
interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface Tab {
  id: string;
  label: string;
  href?: string;
  badge?: number;
  disabled?: boolean;
}

export function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
}: TabNavigationProps) {
  return (
    <div className="border-b">
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            disabled={tab.disabled}
            className={cn(
              "py-2 px-1 border-b-2 font-medium text-sm transition-colors",
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300",
              tab.disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {tab.label}
            {tab.badge && (
              <Badge variant="secondary" className="ml-2">
                {tab.badge}
              </Badge>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
```

**Features:**

- Tab navigation với badges
- Active state highlighting
- Disabled state
- Hover effects

## Mobile Components

### Mobile Header (`MobileHeader`)

```typescript
// components/layout/MobileHeader.tsx
interface MobileHeaderProps {
  title: string;
  onMenuClick: () => void;
  actions?: React.ReactNode;
}

export function MobileHeader({
  title,
  onMenuClick,
  actions,
}: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur md:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold truncate">{title}</h1>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
```

**Features:**

- Mobile-optimized header
- Hamburger menu button
- Title display
- Action buttons

### Mobile Sidebar (`MobileSidebar`)

```typescript
// components/layout/MobileSidebar.tsx
interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  groups: Group[];
}

export function MobileSidebar({
  isOpen,
  onClose,
  user,
  groups,
}: MobileSidebarProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-64">
        <div className="p-4">
          <UserProfile user={user} />
        </div>
        <nav className="p-4">
          <SidebarNavigation />
          <GroupsSection groups={groups} />
        </nav>
      </SheetContent>
    </Sheet>
  );
}
```

**Features:**

- Slide-out sidebar
- Touch gestures
- Overlay background
- Close on outside click

## Layout Utilities

### Container (`Container`)

```typescript
// components/layout/Container.tsx
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export function Container({
  children,
  className,
  size = "lg",
}: ContainerProps) {
  const sizeClasses = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    full: "max-w-none",
  };

  return (
    <div
      className={cn(
        "mx-auto px-4 sm:px-6 lg:px-8",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  );
}
```

**Features:**

- Responsive container
- Size variants
- Consistent padding
- Max-width constraints

### Page Layout (`PageLayout`)

```typescript
// components/layout/PageLayout.tsx
interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageLayout({
  children,
  title,
  description,
  actions,
  className,
}: PageLayoutProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {(title || description || actions) && (
        <div className="flex items-center justify-between">
          <div>
            {title && <h1 className="text-2xl font-semibold">{title}</h1>}
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
```

**Features:**

- Consistent page structure
- Optional header section
- Action buttons
- Flexible content area

## Responsive Design

### Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Layout Behavior

- **Mobile**: Stack layout, hamburger menu
- **Tablet**: Sidebar collapse, responsive grid
- **Desktop**: Full sidebar, multi-column layout

### Component Variants

- **Mobile**: Compact, touch-friendly
- **Desktop**: Full-featured, hover states
- **Tablet**: Hybrid approach
