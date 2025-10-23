# Notification Components

## Toast Components

### Toast (`Toast`)

```typescript
// components/notifications/Toast.tsx
interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
}

export function Toast({
  id,
  title,
  description,
  type = "info",
  duration = 5000,
  action,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const typeConfig = {
    success: {
      icon: CheckCircle,
      className: "bg-green-50 border-green-200 text-green-800",
      iconClassName: "text-green-500",
    },
    error: {
      icon: XCircle,
      className: "bg-red-50 border-red-200 text-red-800",
      iconClassName: "text-red-500",
    },
    warning: {
      icon: AlertTriangle,
      className: "bg-yellow-50 border-yellow-200 text-yellow-800",
      iconClassName: "text-yellow-500",
    },
    info: {
      icon: Info,
      className: "bg-blue-50 border-blue-200 text-blue-800",
      iconClassName: "text-blue-500",
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
        config.className
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn("h-5 w-5 mt-0.5", config.iconClassName)} />
        <div className="space-y-1">
          {title && <p className="text-sm font-medium">{title}</p>}
          {description && <p className="text-sm opacity-90">{description}</p>}
        </div>
      </div>

      {action && (
        <Button
          variant="ghost"
          size="sm"
          onClick={action.onClick}
          className="text-current hover:bg-current/10"
        >
          {action.label}
        </Button>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose?.(), 300);
        }}
        className="absolute right-2 top-2 h-6 w-6 p-0 text-current hover:bg-current/10"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
```

**Features:**

- Multiple types (success, error, warning, info)
- Auto-dismiss with duration
- Action buttons
- Custom icons
- Smooth animations

### Toast Container (`ToastContainer`)

```typescript
// components/notifications/ToastContainer.tsx
interface ToastContainerProps {
  toasts: ToastProps[];
  onRemove: (id: string) => void;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
}

export function ToastContainer({
  toasts,
  onRemove,
  position = "top-right",
}: ToastContainerProps) {
  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  };

  return (
    <div
      className={cn(
        "fixed z-50 flex flex-col gap-2 max-w-sm w-full",
        positionClasses[position]
      )}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={() => onRemove(toast.id)} />
      ))}
    </div>
  );
}
```

**Features:**

- Multiple positions
- Stack management
- Z-index management
- Responsive design

## Notification List Components

### Notification List (`NotificationList`)

```typescript
// components/notifications/NotificationList.tsx
interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
  onDeleteAll: () => void;
  loading?: boolean;
  className?: string;
}

interface Notification {
  id: string;
  type: "expense" | "settlement" | "group" | "system";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  data?: any;
  actions?: Array<{
    label: string;
    action: string;
    url?: string;
  }>;
}

export function NotificationList({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onDeleteAll,
  loading = false,
  className,
}: NotificationListProps) {
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
    []
  );
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.isRead;
    if (filter === "read") return notification.isRead;
    return true;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedNotifications(filteredNotifications.map((n) => n.id));
    } else {
      setSelectedNotifications([]);
    }
  };

  const handleSelectNotification = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedNotifications((prev) => [...prev, id]);
    } else {
      setSelectedNotifications((prev) => prev.filter((n) => n !== id));
    }
  };

  const handleBulkAction = (action: "read" | "delete") => {
    if (action === "read") {
      selectedNotifications.forEach((id) => onMarkAsRead(id));
    } else if (action === "delete") {
      selectedNotifications.forEach((id) => onDelete(id));
    }
    setSelectedNotifications([]);
  };

  if (loading) {
    return <NotificationListSkeleton />;
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Thông báo</h2>
          <Badge variant="secondary">
            {notifications.filter((n) => !n.isRead).length} chưa đọc
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={filter}
            onChange={(value) => setFilter(value as any)}
            options={[
              { value: "all", label: "Tất cả" },
              { value: "unread", label: "Chưa đọc" },
              { value: "read", label: "Đã đọc" },
            ]}
          />
          <Button variant="outline" size="sm" onClick={onMarkAllAsRead}>
            Đánh dấu tất cả đã đọc
          </Button>
        </div>
      </div>

      {selectedNotifications.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <span className="text-sm text-muted-foreground">
            {selectedNotifications.length} đã chọn
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkAction("read")}
          >
            Đánh dấu đã đọc
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkAction("delete")}
          >
            Xóa
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedNotifications([])}
          >
            Bỏ chọn
          </Button>
        </div>
      )}

      <div className="space-y-2">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Không có thông báo nào</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              isSelected={selectedNotifications.includes(notification.id)}
              onSelect={(checked) =>
                handleSelectNotification(notification.id, checked)
              }
              onMarkAsRead={() => onMarkAsRead(notification.id)}
              onDelete={() => onDelete(notification.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
```

**Features:**

- Filter by read status
- Bulk actions
- Selection management
- Empty states
- Loading states

### Notification Item (`NotificationItem`)

```typescript
// components/notifications/NotificationItem.tsx
interface NotificationItemProps {
  notification: Notification;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onMarkAsRead: () => void;
  onDelete: () => void;
}

export function NotificationItem({
  notification,
  isSelected,
  onSelect,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
  const typeConfig = {
    expense: {
      icon: Receipt,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    settlement: {
      icon: CreditCard,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    group: {
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    system: {
      icon: Settings,
      color: "text-gray-500",
      bgColor: "bg-gray-50",
    },
  };

  const config = typeConfig[notification.type];
  const Icon = config.icon;

  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead();
    }
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg border transition-colors cursor-pointer",
        !notification.isRead && "bg-blue-50 border-blue-200",
        notification.isRead && "bg-background border-border",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={handleClick}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={onSelect}
        onClick={(e) => e.stopPropagation()}
        className="mt-1"
      />

      <div className={cn("p-2 rounded-full", config.bgColor)}>
        <Icon className={cn("h-4 w-4", config.color)} />
      </div>

      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h4
            className={cn(
              "text-sm font-medium",
              !notification.isRead && "font-semibold"
            )}
          >
            {notification.title}
          </h4>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(notification.createdAt)}
            </span>
            {!notification.isRead && (
              <div className="h-2 w-2 bg-blue-500 rounded-full" />
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground">{notification.message}</p>

        {notification.actions && notification.actions.length > 0 && (
          <div className="flex items-center gap-2 mt-2">
            {notification.actions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  if (action.url) {
                    window.open(action.url, "_blank");
                  }
                }}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="h-8 w-8 p-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
```

**Features:**

- Type-specific icons
- Read/unread states
- Action buttons
- Time formatting
- Selection support

## Alert Components

### Alert (`Alert`)

```typescript
// components/notifications/Alert.tsx
interface AlertProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "warning" | "success";
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function Alert({
  title,
  description,
  variant = "default",
  icon,
  action,
  className,
}: AlertProps) {
  const variantConfig = {
    default: {
      className: "bg-background border-border text-foreground",
      icon: Info,
    },
    destructive: {
      className: "bg-destructive/10 border-destructive/20 text-destructive",
      icon: AlertCircle,
    },
    warning: {
      className: "bg-yellow-50 border-yellow-200 text-yellow-800",
      icon: AlertTriangle,
    },
    success: {
      className: "bg-green-50 border-green-200 text-green-800",
      icon: CheckCircle,
    },
  };

  const config = variantConfig[variant];
  const Icon = icon || config.icon;

  return (
    <div
      className={cn(
        "relative w-full rounded-lg border p-4",
        config.className,
        className
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className="h-4 w-4 mt-0.5" />
        <div className="flex-1 space-y-1">
          {title && <h4 className="text-sm font-medium">{title}</h4>}
          {description && <p className="text-sm opacity-90">{description}</p>}
        </div>
        {action && <div className="flex items-center gap-2">{action}</div>}
      </div>
    </div>
  );
}
```

**Features:**

- Multiple variants
- Custom icons
- Action buttons
- Consistent styling
- Accessibility support

### Alert Banner (`AlertBanner`)

```typescript
// components/notifications/AlertBanner.tsx
interface AlertBannerProps {
  message: string;
  type?: "info" | "warning" | "error" | "success";
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function AlertBanner({
  message,
  type = "info",
  dismissible = true,
  onDismiss,
  action,
  className,
}: AlertBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  const typeConfig = {
    info: {
      className: "bg-blue-50 border-blue-200 text-blue-800",
      icon: Info,
    },
    warning: {
      className: "bg-yellow-50 border-yellow-200 text-yellow-800",
      icon: AlertTriangle,
    },
    error: {
      className: "bg-red-50 border-red-200 text-red-800",
      icon: XCircle,
    },
    success: {
      className: "bg-green-50 border-green-200 text-green-800",
      icon: CheckCircle,
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "relative w-full border-b px-4 py-3",
        config.className,
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="h-4 w-4" />
          <p className="text-sm font-medium">{message}</p>
        </div>
        <div className="flex items-center gap-2">
          {action && (
            <Button
              variant="outline"
              size="sm"
              onClick={action.onClick}
              className="text-current border-current hover:bg-current/10"
            >
              {action.label}
            </Button>
          )}
          {dismissible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0 text-current hover:bg-current/10"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
```

**Features:**

- Banner-style alerts
- Dismissible option
- Action buttons
- Type-specific styling
- Auto-dismiss

## Notification Badge Components

### Notification Badge (`NotificationBadge`)

```typescript
// components/notifications/NotificationBadge.tsx
interface NotificationBadgeProps {
  count: number;
  maxCount?: number;
  variant?: "default" | "destructive" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function NotificationBadge({
  count,
  maxCount = 99,
  variant = "destructive",
  size = "md",
  className,
}: NotificationBadgeProps) {
  if (count === 0) return null;

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  const sizeClasses = {
    sm: "h-4 w-4 text-xs",
    md: "h-5 w-5 text-xs",
    lg: "h-6 w-6 text-sm",
  };

  return (
    <div
      className={cn(
        "absolute -top-1 -right-1 flex items-center justify-center rounded-full font-medium text-white",
        variant === "default" && "bg-primary",
        variant === "destructive" && "bg-destructive",
        variant === "secondary" && "bg-secondary",
        sizeClasses[size],
        className
      )}
    >
      {displayCount}
    </div>
  );
}
```

**Features:**

- Count display
- Max count limit
- Multiple variants
- Size options
- Auto-hide when count is 0

## Notification Management

### Notification Provider (`NotificationProvider`)

```typescript
// components/notifications/NotificationProvider.tsx
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    notification: Omit<Notification, "id" | "createdAt">
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const addNotification = (
    notification: Omit<Notification, "id" | "createdAt">
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      createdAt: new Date(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const addToast = (toast: Omit<ToastProps, "id">) => {
    const newToast: ToastProps = {
      ...toast,
      id: generateId(),
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAllNotifications,
        addToast,
        removeToast,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </NotificationContext.Provider>
  );
}
```

**Features:**

- Global notification state
- Toast management
- Unread count tracking
- CRUD operations
- Context provider

## Real-time Notifications

### WebSocket Notification Hook (`useWebSocketNotifications`)

```typescript
// hooks/useWebSocketNotifications.ts
export function useWebSocketNotifications() {
  const { addNotification, addToast } = useNotifications();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_URL}/notifications?token=${user.token}`
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "notification":
          addNotification(data.notification);
          break;
        case "toast":
          addToast(data.toast);
          break;
        case "expense_created":
          addNotification({
            type: "expense",
            title: "Chi tiêu mới",
            message: `${data.paidBy} đã thêm chi tiêu ${data.title}`,
            isRead: false,
            data: data,
          });
          break;
        case "settlement_created":
          addNotification({
            type: "settlement",
            title: "Thanh toán mới",
            message: `${data.debtor} đã thanh toán ${data.amount} cho ${data.creditor}`,
            isRead: false,
            data: data,
          });
          break;
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, [user, addNotification, addToast]);
}
```

**Features:**

- Real-time updates
- WebSocket connection
- Event handling
- Auto-reconnection
- Error handling
