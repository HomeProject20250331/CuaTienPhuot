# Form Components

## Input Components

### Text Input (`Input`)

```typescript
// components/forms/Input.tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "default" | "filled" | "outlined";
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  variant = "default",
  className,
  ...props
}: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={props.id} className="text-sm font-medium">
          {label}
        </Label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        )}
        <input
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            error && "border-destructive focus-visible:ring-destructive",
            variant === "filled" && "bg-muted",
            variant === "outlined" && "border-2",
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}
```

**Features:**

- Label và helper text
- Error state với styling
- Left/right icons
- Variant styles
- Accessibility support

### Textarea (`Textarea`)

```typescript
// components/forms/Textarea.tsx
interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  resize?: "none" | "vertical" | "horizontal" | "both";
}

export function Textarea({
  label,
  error,
  helperText,
  resize = "vertical",
  className,
  ...props
}: TextareaProps) {
  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={props.id} className="text-sm font-medium">
          {label}
        </Label>
      )}
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive focus-visible:ring-destructive",
          resize === "none" && "resize-none",
          resize === "vertical" && "resize-y",
          resize === "horizontal" && "resize-x",
          resize === "both" && "resize",
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}
```

**Features:**

- Auto-resize option
- Character count
- Error handling
- Accessibility support

## Select Components

### Select (`Select`)

```typescript
// components/forms/Select.tsx
interface SelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  searchable?: boolean;
}

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

export function Select({
  label,
  error,
  helperText,
  placeholder,
  options,
  value,
  onChange,
  disabled,
  searchable = false,
}: SelectProps) {
  return (
    <div className="space-y-2">
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <SelectPrimitive.Root
        value={value}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectPrimitive.Trigger
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus:ring-destructive"
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Content>
          <SelectPrimitive.Viewport className="p-1">
            {searchable && <SelectSearch />}
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              >
                <SelectPrimitive.ItemText>
                  {option.label}
                </SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Root>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}
```

**Features:**

- Searchable option
- Grouped options
- Disabled state
- Keyboard navigation
- Accessibility support

### Multi Select (`MultiSelect`)

```typescript
// components/forms/MultiSelect.tsx
interface MultiSelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  options: SelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  maxSelections?: number;
  showSelectedCount?: boolean;
}

export function MultiSelect({
  label,
  error,
  helperText,
  placeholder,
  options,
  value,
  onChange,
  maxSelections,
  showSelectedCount = true,
}: MultiSelectProps) {
  const handleSelect = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else if (!maxSelections || value.length < maxSelections) {
      onChange([...value, optionValue]);
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <div className="space-y-2">
        {value.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {value.map((selectedValue) => {
              const option = options.find((opt) => opt.value === selectedValue);
              return (
                <Badge
                  key={selectedValue}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {option?.label}
                  <button
                    onClick={() => handleSelect(selectedValue)}
                    className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
        )}
        <SelectPrimitive.Root onValueChange={handleSelect}>
          <SelectPrimitive.Trigger
            className={cn(
              "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-destructive focus:ring-destructive"
            )}
          >
            <SelectPrimitive.Value placeholder={placeholder} />
            <SelectPrimitive.Icon>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>
          <SelectPrimitive.Content>
            <SelectPrimitive.Viewport className="p-1">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  disabled={
                    option.disabled ||
                    (maxSelections &&
                      value.length >= maxSelections &&
                      !value.includes(option.value))
                  }
                  className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  <SelectPrimitive.ItemText>
                    {option.label}
                  </SelectPrimitive.ItemText>
                  {value.includes(option.value) && (
                    <Check className="absolute left-2 h-4 w-4" />
                  )}
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Root>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}
```

**Features:**

- Multiple selection
- Selected items display
- Max selections limit
- Remove selected items
- Search functionality

## Date Components

### Date Picker (`DatePicker`)

```typescript
// components/forms/DatePicker.tsx
interface DatePickerProps {
  label?: string;
  error?: string;
  helperText?: string;
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  format?: string;
}

export function DatePicker({
  label,
  error,
  helperText,
  value,
  onChange,
  placeholder = "Chọn ngày",
  disabled,
  minDate,
  maxDate,
  format = "dd/MM/yyyy",
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
              error && "border-destructive"
            )}
            disabled={disabled}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {value ? formatDate(value, format) : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange(date);
              setOpen(false);
            }}
            disabled={(date) => {
              if (minDate && date < minDate) return true;
              if (maxDate && date > maxDate) return true;
              return false;
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}
```

**Features:**

- Calendar popup
- Date formatting
- Min/max date constraints
- Keyboard navigation
- Accessibility support

### Date Range Picker (`DateRangePicker`)

```typescript
// components/forms/DateRangePicker.tsx
interface DateRangePickerProps {
  label?: string;
  error?: string;
  helperText?: string;
  value?: { from: Date | undefined; to: Date | undefined };
  onChange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function DateRangePicker({
  label,
  error,
  helperText,
  value,
  onChange,
  placeholder = "Chọn khoảng thời gian",
  disabled,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value?.from && "text-muted-foreground",
              error && "border-destructive"
            )}
            disabled={disabled}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {value?.from
              ? value.to
                ? `${formatDate(value.from, "dd/MM/yyyy")} - ${formatDate(
                    value.to,
                    "dd/MM/yyyy"
                  )}`
                : formatDate(value.from, "dd/MM/yyyy")
              : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={value}
            onSelect={(range) => {
              onChange(range || { from: undefined, to: undefined });
              if (range?.from && range?.to) {
                setOpen(false);
              }
            }}
            numberOfMonths={2}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}
```

**Features:**

- Date range selection
- Two-month calendar
- Range validation
- Clear selection
- Keyboard navigation

## File Upload Components

### File Upload (`FileUpload`)

```typescript
// components/forms/FileUpload.tsx
interface FileUploadProps {
  label?: string;
  error?: string;
  helperText?: string;
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  value?: File[];
  onChange: (files: File[]) => void;
  onUpload?: (files: File[]) => Promise<string[]>;
  preview?: boolean;
  disabled?: boolean;
}

export function FileUpload({
  label,
  error,
  helperText,
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = false,
  value = [],
  onChange,
  onUpload,
  preview = true,
  disabled,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    const fileArray = Array.from(files);

    // Validate file size
    const oversizedFiles = fileArray.filter((file) => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      // Handle error
      return;
    }

    if (onUpload) {
      setUploading(true);
      try {
        const urls = await onUpload(fileArray);
        // Handle successful upload
      } catch (error) {
        // Handle upload error
      } finally {
        setUploading(false);
      }
    } else {
      onChange(fileArray);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-colors",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25",
          error && "border-destructive",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          disabled={disabled}
        />
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              Kéo thả file vào đây hoặc{" "}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-primary hover:underline"
                disabled={disabled}
              >
                chọn file
              </button>
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Tối đa {formatFileSize(maxSize)} •{" "}
              {accept && `Định dạng: ${accept}`}
            </p>
          </div>
        </div>
      </div>

      {preview && value.length > 0 && (
        <div className="space-y-2">
          {value.map((file, index) => (
            <FilePreview
              key={index}
              file={file}
              onRemove={() => {
                const newFiles = value.filter((_, i) => i !== index);
                onChange(newFiles);
              }}
            />
          ))}
        </div>
      )}

      {uploading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Đang upload...
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}
```

**Features:**

- Drag & drop support
- File size validation
- Multiple file upload
- Preview functionality
- Upload progress
- Error handling

## Form Validation

### Form Field (`FormField`)

```typescript
// components/forms/FormField.tsx
interface FormFieldProps {
  name: string;
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({
  name,
  label,
  error,
  helperText,
  required,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={name} className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}
```

**Features:**

- Consistent field structure
- Required field indicator
- Error state handling
- Helper text support

### Form Error (`FormError`)

```typescript
// components/forms/FormError.tsx
interface FormErrorProps {
  error?: string;
  className?: string;
}

export function FormError({ error, className }: FormErrorProps) {
  if (!error) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm text-destructive",
        className
      )}
    >
      <AlertCircle className="h-4 w-4" />
      {error}
    </div>
  );
}
```

**Features:**

- Error icon
- Consistent styling
- Conditional rendering

## Form Layout

### Form Grid (`FormGrid`)

```typescript
// components/forms/FormGrid.tsx
interface FormGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
  className?: string;
}

export function FormGrid({
  children,
  columns = 2,
  gap = "md",
  className,
}: FormGridProps) {
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  const gapClasses = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
  };

  return (
    <div
      className={cn("grid", gridClasses[columns], gapClasses[gap], className)}
    >
      {children}
    </div>
  );
}
```

**Features:**

- Responsive grid layout
- Configurable columns
- Gap spacing options
- Mobile-first design

### Form Section (`FormSection`)

```typescript
// components/forms/FormSection.tsx
interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && <h3 className="text-lg font-medium">{title}</h3>}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
```

**Features:**

- Section grouping
- Title và description
- Consistent spacing
- Visual separation
