# Data Display Components

## Table Components

### Data Table (`DataTable`)

```typescript
// components/data-display/DataTable.tsx
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  pagination?: PaginationProps;
  sorting?: SortingProps;
  filtering?: FilteringProps;
  selection?: SelectionProps;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

interface SortingProps {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort: (column: string, order: "asc" | "desc") => void;
}

interface FilteringProps {
  filters: Record<string, any>;
  onFilterChange: (filters: Record<string, any>) => void;
}

interface SelectionProps {
  selectedRows: T[];
  onSelectionChange: (selected: T[]) => void;
  selectable?: boolean;
}

export function DataTable<T>({
  data,
  columns,
  pagination,
  sorting,
  filtering,
  selection,
  loading = false,
  emptyMessage = "Không có dữ liệu",
  className,
}: DataTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<T[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows([...data]);
    } else {
      setSelectedRows([]);
    }
    selection?.onSelectionChange(checked ? data : []);
  };

  const handleSelectRow = (row: T, checked: boolean) => {
    let newSelection: T[];
    if (checked) {
      newSelection = [...selectedRows, row];
    } else {
      newSelection = selectedRows.filter((item) => item !== row);
    }
    setSelectedRows(newSelection);
    selection?.onSelectionChange(newSelection);
  };

  if (loading) {
    return <TableSkeleton />;
  }

  return (
    <div className={cn("space-y-4", className)}>
      {filtering && (
        <TableFilters
          filters={filtering.filters}
          onFilterChange={filtering.onFilterChange}
        />
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {selection?.selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedRows.length === data.length && data.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  className={cn(
                    "cursor-pointer hover:bg-muted/50",
                    sorting?.sortBy === column.id && "bg-muted"
                  )}
                  onClick={() => {
                    if (column.enableSorting !== false) {
                      const newOrder =
                        sorting?.sortBy === column.id &&
                        sorting?.sortOrder === "asc"
                          ? "desc"
                          : "asc";
                      sorting?.onSort(column.id, newOrder);
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {sorting?.sortBy === column.id && (
                      <ArrowUpDown className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selection?.selectable ? 1 : 0)}
                  className="text-center py-8"
                >
                  <div className="flex flex-col items-center gap-2">
                    <FileX className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">{emptyMessage}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow key={index}>
                  {selection?.selectable && (
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.includes(row)}
                        onCheckedChange={(checked) =>
                          handleSelectRow(row, checked as boolean)
                        }
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      {column.cell
                        ? column.cell({
                            row,
                            getValue: () => row[column.accessorKey],
                          })
                        : row[column.accessorKey]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && <TablePagination {...pagination} />}
    </div>
  );
}
```

**Features:**

- Sorting by columns
- Row selection
- Pagination
- Filtering
- Loading states
- Empty states
- Responsive design

### Table Filters (`TableFilters`)

```typescript
// components/data-display/TableFilters.tsx
interface TableFiltersProps {
  filters: Record<string, any>;
  onFilterChange: (filters: Record<string, any>) => void;
  filterConfig: FilterConfig[];
}

interface FilterConfig {
  key: string;
  label: string;
  type: "text" | "select" | "date" | "dateRange";
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export function TableFilters({
  filters,
  onFilterChange,
  filterConfig,
}: TableFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key: string, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    const clearedFilters = Object.keys(filters).reduce((acc, key) => {
      acc[key] = undefined;
      return acc;
    }, {} as Record<string, any>);
    onFilterChange(clearedFilters);
  };

  const activeFiltersCount = Object.values(filters).filter(
    (value) => value !== undefined && value !== ""
  ).length;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Filter className="h-4 w-4" />
        Bộ lọc
        {activeFiltersCount > 0 && (
          <Badge variant="secondary">{activeFiltersCount}</Badge>
        )}
      </Button>

      {activeFiltersCount > 0 && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="h-4 w-4" />
        </Button>
      )}

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-background border rounded-lg shadow-lg z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterConfig.map((config) => (
              <div key={config.key}>
                <Label className="text-sm font-medium">{config.label}</Label>
                {config.type === "text" && (
                  <Input
                    placeholder={config.placeholder}
                    value={filters[config.key] || ""}
                    onChange={(e) =>
                      handleFilterChange(config.key, e.target.value)
                    }
                  />
                )}
                {config.type === "select" && (
                  <Select
                    value={filters[config.key] || ""}
                    onValueChange={(value) =>
                      handleFilterChange(config.key, value)
                    }
                    options={config.options || []}
                    placeholder={config.placeholder}
                  />
                )}
                {config.type === "date" && (
                  <DatePicker
                    value={filters[config.key]}
                    onChange={(date) => handleFilterChange(config.key, date)}
                    placeholder={config.placeholder}
                  />
                )}
                {config.type === "dateRange" && (
                  <DateRangePicker
                    value={filters[config.key]}
                    onChange={(range) => handleFilterChange(config.key, range)}
                    placeholder={config.placeholder}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

**Features:**

- Multiple filter types
- Active filter count
- Clear all filters
- Responsive filter panel
- Real-time filtering

## Card Components

### Data Card (`DataCard`)

```typescript
// components/data-display/DataCard.tsx
interface DataCardProps {
  title?: string;
  description?: string;
  value?: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease" | "neutral";
  };
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  loading?: boolean;
  className?: string;
}

export function DataCard({
  title,
  description,
  value,
  change,
  icon,
  actions,
  loading = false,
  className,
}: DataCardProps) {
  if (loading) {
    return <CardSkeleton />;
  }

  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          {title && (
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
          )}
          {value !== undefined && <p className="text-2xl font-bold">{value}</p>}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {icon && <div className="h-8 w-8 text-muted-foreground">{icon}</div>}
      </div>

      {change && (
        <div className="mt-4 flex items-center gap-2">
          <div
            className={cn(
              "flex items-center gap-1 text-sm",
              change.type === "increase" && "text-green-600",
              change.type === "decrease" && "text-red-600",
              change.type === "neutral" && "text-muted-foreground"
            )}
          >
            {change.type === "increase" && <TrendingUp className="h-4 w-4" />}
            {change.type === "decrease" && <TrendingDown className="h-4 w-4" />}
            {change.type === "neutral" && <Minus className="h-4 w-4" />}
            {Math.abs(change.value)}%
          </div>
          <span className="text-sm text-muted-foreground">so với kỳ trước</span>
        </div>
      )}

      {actions && <div className="mt-4 flex items-center gap-2">{actions}</div>}
    </Card>
  );
}
```

**Features:**

- Value display
- Change indicators
- Icon support
- Action buttons
- Loading states
- Responsive design

### Group Card (`GroupCard`)

```typescript
// components/data-display/GroupCard.tsx
interface GroupCardProps {
  group: Group;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  className?: string;
}

export function GroupCard({
  group,
  onEdit,
  onDelete,
  onView,
  className,
}: GroupCardProps) {
  return (
    <Card
      className={cn(
        "p-6 hover:shadow-md transition-shadow cursor-pointer",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <GroupAvatar group={group} size="lg" />
          <div className="space-y-2">
            <div>
              <h3 className="font-semibold text-lg">{group.name}</h3>
              {group.description && (
                <p className="text-sm text-muted-foreground">
                  {group.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {group.memberCount} thành viên
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                {formatCurrency(group.totalExpenses)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{group.currency}</Badge>
              {group.lastActivity && (
                <Badge variant="outline">
                  {formatRelativeTime(group.lastActivity)}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onView}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
```

**Features:**

- Group information display
- Member count
- Total expenses
- Last activity
- Action buttons
- Hover effects

## Chart Components

### Pie Chart (`PieChart`)

```typescript
// components/data-display/PieChart.tsx
interface PieChartProps {
  data: ChartData[];
  title?: string;
  height?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
  className?: string;
}

interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export function PieChart({
  data,
  title,
  height = 300,
  showLegend = true,
  showTooltip = true,
  className,
}: PieChartProps) {
  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
    "#00ff00",
    "#ff00ff",
    "#00ffff",
    "#ffff00",
    "#ff0000",
    "#0000ff",
  ];

  const chartData = data.map((item, index) => ({
    ...item,
    fill: item.color || colors[index % colors.length],
  }));

  return (
    <div className={cn("space-y-4", className)}>
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      <div className="flex items-center gap-4">
        <div style={{ height, width: height }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart as={RechartsPieChart} data={chartData}>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={height / 2 - 20}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              {showTooltip && <Tooltip />}
            </PieChart>
          </ResponsiveContainer>
        </div>
        {showLegend && (
          <div className="space-y-2">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-sm">{item.name}</span>
                <span className="text-sm text-muted-foreground">
                  {formatCurrency(item.value)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

**Features:**

- Responsive design
- Custom colors
- Legend display
- Tooltip information
- Percentage labels

### Bar Chart (`BarChart`)

```typescript
// components/data-display/BarChart.tsx
interface BarChartProps {
  data: ChartData[];
  xAxisKey: string;
  yAxisKey: string;
  title?: string;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  className?: string;
}

export function BarChart({
  data,
  xAxisKey,
  yAxisKey,
  title,
  height = 300,
  showGrid = true,
  showTooltip = true,
  className,
}: BarChartProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            {showTooltip && <Tooltip />}
            <Bar dataKey={yAxisKey} fill="#8884d8" />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
```

**Features:**

- X/Y axis configuration
- Grid display
- Tooltip information
- Responsive design
- Custom styling

## Avatar Components

### User Avatar (`UserAvatar`)

```typescript
// components/data-display/UserAvatar.tsx
interface UserAvatarProps {
  user: User;
  size?: "sm" | "md" | "lg" | "xl";
  showName?: boolean;
  showStatus?: boolean;
  className?: string;
}

export function UserAvatar({
  user,
  size = "md",
  showName = false,
  showStatus = false,
  className,
}: UserAvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative">
        <Avatar className={sizeClasses[size]}>
          <AvatarImage src={user.avatar} alt={user.fullName} />
          <AvatarFallback>
            {user.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {showStatus && (
          <div
            className={cn(
              "absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background",
              user.isOnline ? "bg-green-500" : "bg-gray-400"
            )}
          />
        )}
      </div>
      {showName && (
        <div className="space-y-1">
          <p className={cn("font-medium", textSizeClasses[size])}>
            {user.fullName}
          </p>
          {user.email && (
            <p className={cn("text-muted-foreground", textSizeClasses[size])}>
              {user.email}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
```

**Features:**

- Multiple sizes
- Fallback initials
- Online status
- Name display
- Email display

### Group Avatar (`GroupAvatar`)

```typescript
// components/data-display/GroupAvatar.tsx
interface GroupAvatarProps {
  group: Group;
  size?: "sm" | "md" | "lg" | "xl";
  showName?: boolean;
  className?: string;
}

export function GroupAvatar({
  group,
  size = "md",
  showName = false,
  className,
}: GroupAvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={group.avatar} alt={group.name} />
        <AvatarFallback>
          {group.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>
      {showName && (
        <div>
          <p className="font-medium">{group.name}</p>
          {group.description && (
            <p className="text-sm text-muted-foreground">{group.description}</p>
          )}
        </div>
      )}
    </div>
  );
}
```

**Features:**

- Group avatar display
- Fallback initials
- Name và description
- Multiple sizes

## Badge Components

### Status Badge (`StatusBadge`)

```typescript
// components/data-display/StatusBadge.tsx
interface StatusBadgeProps {
  status: "active" | "inactive" | "pending" | "completed" | "cancelled";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StatusBadge({
  status,
  size = "md",
  className,
}: StatusBadgeProps) {
  const statusConfig = {
    active: { label: "Hoạt động", color: "bg-green-100 text-green-800" },
    inactive: { label: "Không hoạt động", color: "bg-gray-100 text-gray-800" },
    pending: { label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800" },
    completed: { label: "Hoàn thành", color: "bg-blue-100 text-blue-800" },
    cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-800" },
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-2.5 py-1.5 text-sm",
    lg: "px-3 py-2 text-base",
  };

  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        config.color,
        sizeClasses[size],
        className
      )}
    >
      {config.label}
    </span>
  );
}
```

**Features:**

- Multiple status types
- Color coding
- Size variants
- Consistent styling

## Skeleton Components

### Table Skeleton (`TableSkeleton`)

```typescript
// components/data-display/TableSkeleton.tsx
interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
  className,
}: TableSkeletonProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="rounded-md border">
        <div className="p-4">
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: columns }).map((_, index) => (
              <div key={index} className="h-4 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4 border-t">
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div
                  key={colIndex}
                  className="h-4 bg-muted rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Features:**

- Configurable rows/columns
- Animated loading
- Consistent spacing
- Responsive design

### Card Skeleton (`CardSkeleton`)

```typescript
// components/data-display/CardSkeleton.tsx
interface CardSkeletonProps {
  className?: string;
}

export function CardSkeleton({ className }: CardSkeletonProps) {
  return (
    <div className={cn("p-6 space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          <div className="h-8 w-32 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-8 w-8 bg-muted rounded animate-pulse" />
      </div>
      <div className="h-4 w-16 bg-muted rounded animate-pulse" />
    </div>
  );
}
```

**Features:**

- Animated loading
- Consistent structure
- Responsive design
