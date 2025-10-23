# Modal Components

## Base Modal Components

### Modal (`Modal`)

```typescript
// components/modals/Modal.tsx
interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
}

export function Modal({
  open,
  onOpenChange,
  children,
  size = "md",
  className,
}: ModalProps) {
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-full",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(sizeClasses[size], className)}>
        {children}
      </DialogContent>
    </Dialog>
  );
}
```

**Features:**

- Multiple sizes
- Keyboard navigation
- Focus management
- Backdrop click to close
- Escape key to close

### Modal Header (`ModalHeader`)

```typescript
// components/modals/ModalHeader.tsx
interface ModalHeaderProps {
  title: string;
  description?: string;
  onClose?: () => void;
  className?: string;
}

export function ModalHeader({
  title,
  description,
  onClose,
  className,
}: ModalHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="space-y-1">
        <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
        {description && (
          <DialogDescription className="text-sm text-muted-foreground">
            {description}
          </DialogDescription>
        )}
      </div>
      {onClose && (
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
```

**Features:**

- Title và description
- Close button
- Consistent styling
- Accessibility support

### Modal Footer (`ModalFooter`)

```typescript
// components/modals/ModalFooter.tsx
interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div className={cn("flex items-center justify-end gap-2", className)}>
      {children}
    </div>
  );
}
```

**Features:**

- Action buttons
- Consistent spacing
- Responsive design

## Business Modal Components

### Create Group Modal (`CreateGroupModal`)

```typescript
// components/modals/CreateGroupModal.tsx
interface CreateGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (group: Group) => void;
}

interface CreateGroupFormData {
  name: string;
  description: string;
  currency: string;
  avatar?: File;
  settings: {
    allowMemberAddExpense: boolean;
    requireApprovalForExpense: boolean;
    autoCalculateBalances: boolean;
    paymentFormula: string;
  };
}

export function CreateGroupModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateGroupModalProps) {
  const [loading, setLoading] = useState(false);
  const { mutate: createGroup } = useCreateGroup();

  const form = useForm<CreateGroupFormData>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: "",
      description: "",
      currency: "VND",
      settings: {
        allowMemberAddExpense: true,
        requireApprovalForExpense: false,
        autoCalculateBalances: true,
        paymentFormula: "equal_split",
      },
    },
  });

  const onSubmit = async (data: CreateGroupFormData) => {
    setLoading(true);
    try {
      const group = await createGroup(data);
      onSuccess?.(group);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} size="lg">
      <ModalHeader
        title="Tạo nhóm mới"
        description="Tạo nhóm du lịch để quản lý chi tiêu chung"
      />

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            name="name"
            label="Tên nhóm"
            required
            error={form.formState.errors.name?.message}
          >
            <Input placeholder="Nhập tên nhóm" {...form.register("name")} />
          </FormField>

          <FormField
            name="description"
            label="Mô tả"
            error={form.formState.errors.description?.message}
          >
            <Textarea
              placeholder="Mô tả về nhóm du lịch"
              {...form.register("description")}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="currency"
              label="Đơn vị tiền tệ"
              required
              error={form.formState.errors.currency?.message}
            >
              <Select
                options={currencyOptions}
                value={form.watch("currency")}
                onChange={(value) => form.setValue("currency", value)}
              />
            </FormField>

            <FormField
              name="avatar"
              label="Ảnh đại diện"
              error={form.formState.errors.avatar?.message}
            >
              <FileUpload
                accept="image/*"
                maxSize={5 * 1024 * 1024}
                value={form.watch("avatar") ? [form.watch("avatar")] : []}
                onChange={(files) => form.setValue("avatar", files[0])}
                preview
              />
            </FormField>
          </div>

          <FormSection title="Cài đặt nhóm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Cho phép thành viên thêm chi tiêu</Label>
                  <p className="text-sm text-muted-foreground">
                    Thành viên có thể thêm chi tiêu mới
                  </p>
                </div>
                <Switch
                  checked={form.watch("settings.allowMemberAddExpense")}
                  onCheckedChange={(checked) =>
                    form.setValue("settings.allowMemberAddExpense", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Yêu cầu phê duyệt chi tiêu</Label>
                  <p className="text-sm text-muted-foreground">
                    Chi tiêu cần được phê duyệt trước khi áp dụng
                  </p>
                </div>
                <Switch
                  checked={form.watch("settings.requireApprovalForExpense")}
                  onCheckedChange={(checked) =>
                    form.setValue("settings.requireApprovalForExpense", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Tự động tính toán công nợ</Label>
                  <p className="text-sm text-muted-foreground">
                    Tự động cập nhật bảng công nợ khi có chi tiêu mới
                  </p>
                </div>
                <Switch
                  checked={form.watch("settings.autoCalculateBalances")}
                  onCheckedChange={(checked) =>
                    form.setValue("settings.autoCalculateBalances", checked)
                  }
                />
              </div>

              <FormField
                name="settings.paymentFormula"
                label="Công thức chia tiền"
                error={form.formState.errors.settings?.paymentFormula?.message}
              >
                <Select
                  options={paymentFormulaOptions}
                  value={form.watch("settings.paymentFormula")}
                  onChange={(value) =>
                    form.setValue("settings.paymentFormula", value)
                  }
                />
              </FormField>
            </div>
          </FormSection>
        </div>

        <ModalFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button type="submit" loading={loading}>
            Tạo nhóm
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
```

**Features:**

- Form validation
- File upload
- Settings configuration
- Loading states
- Error handling

### Add Expense Modal (`AddExpenseModal`)

```typescript
// components/modals/AddExpenseModal.tsx
interface AddExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  onSuccess?: (expense: Expense) => void;
}

interface AddExpenseFormData {
  title: string;
  description: string;
  amount: number;
  category: string;
  paidBy: string;
  participants: Array<{
    userId: string;
    amount: number;
  }>;
  expenseDate: Date;
  location?: string;
  tags: string[];
  receipt?: File;
}

export function AddExpenseModal({
  open,
  onOpenChange,
  groupId,
  onSuccess,
}: AddExpenseModalProps) {
  const [loading, setLoading] = useState(false);
  const { data: group } = useGroup(groupId);
  const { data: members } = useGroupMembers(groupId);
  const { mutate: createExpense } = useCreateExpense();

  const form = useForm<AddExpenseFormData>({
    resolver: zodResolver(addExpenseSchema),
    defaultValues: {
      title: "",
      description: "",
      amount: 0,
      category: "food",
      paidBy: "",
      participants: [],
      expenseDate: new Date(),
      location: "",
      tags: [],
    },
  });

  const watchedAmount = form.watch("amount");
  const watchedParticipants = form.watch("participants");

  // Auto-calculate participant amounts when total amount changes
  useEffect(() => {
    if (watchedAmount > 0 && watchedParticipants.length > 0) {
      const amountPerPerson = watchedAmount / watchedParticipants.length;
      const newParticipants = watchedParticipants.map((p) => ({
        ...p,
        amount: amountPerPerson,
      }));
      form.setValue("participants", newParticipants);
    }
  }, [watchedAmount, watchedParticipants.length]);

  const onSubmit = async (data: AddExpenseFormData) => {
    setLoading(true);
    try {
      const expense = await createExpense({ groupId, ...data });
      onSuccess?.(expense);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const addParticipant = (userId: string) => {
    const currentParticipants = form.getValues("participants");
    if (!currentParticipants.find((p) => p.userId === userId)) {
      const amountPerPerson = watchedAmount / (currentParticipants.length + 1);
      form.setValue("participants", [
        ...currentParticipants,
        { userId, amount: amountPerPerson },
      ]);
    }
  };

  const removeParticipant = (userId: string) => {
    const currentParticipants = form.getValues("participants");
    const newParticipants = currentParticipants.filter(
      (p) => p.userId !== userId
    );
    const amountPerPerson = watchedAmount / newParticipants.length;
    form.setValue(
      "participants",
      newParticipants.map((p) => ({
        ...p,
        amount: amountPerPerson,
      }))
    );
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} size="lg">
      <ModalHeader
        title="Thêm chi tiêu mới"
        description="Thêm chi tiêu vào nhóm"
      />

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            name="title"
            label="Tiêu đề"
            required
            error={form.formState.errors.title?.message}
          >
            <Input
              placeholder="Nhập tiêu đề chi tiêu"
              {...form.register("title")}
            />
          </FormField>

          <FormField
            name="description"
            label="Mô tả"
            error={form.formState.errors.description?.message}
          >
            <Textarea
              placeholder="Mô tả chi tiết về chi tiêu"
              {...form.register("description")}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="amount"
              label="Số tiền"
              required
              error={form.formState.errors.amount?.message}
            >
              <Input
                type="number"
                placeholder="0"
                {...form.register("amount", { valueAsNumber: true })}
              />
            </FormField>

            <FormField
              name="category"
              label="Danh mục"
              required
              error={form.formState.errors.category?.message}
            >
              <Select
                options={expenseCategoryOptions}
                value={form.watch("category")}
                onChange={(value) => form.setValue("category", value)}
              />
            </FormField>
          </div>

          <FormField
            name="paidBy"
            label="Người trả tiền"
            required
            error={form.formState.errors.paidBy?.message}
          >
            <Select
              options={
                members?.map((member) => ({
                  value: member.id,
                  label: member.fullName,
                })) || []
              }
              value={form.watch("paidBy")}
              onChange={(value) => form.setValue("paidBy", value)}
              placeholder="Chọn người trả tiền"
            />
          </FormField>

          <FormField
            name="participants"
            label="Người tham gia"
            required
            error={form.formState.errors.participants?.message}
          >
            <div className="space-y-2">
              <MultiSelect
                options={
                  members?.map((member) => ({
                    value: member.id,
                    label: member.fullName,
                  })) || []
                }
                value={form.watch("participants").map((p) => p.userId)}
                onChange={(userIds) => {
                  const amountPerPerson = watchedAmount / userIds.length;
                  const participants = userIds.map((userId) => ({
                    userId,
                    amount: amountPerPerson,
                  }));
                  form.setValue("participants", participants);
                }}
                placeholder="Chọn người tham gia"
              />

              {form.watch("participants").map((participant, index) => {
                const member = members?.find(
                  (m) => m.id === participant.userId
                );
                return (
                  <div
                    key={participant.userId}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div className="flex items-center gap-2">
                      <UserAvatar user={member} size="sm" />
                      <span>{member?.fullName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={participant.amount}
                        onChange={(e) => {
                          const newParticipants = [
                            ...form.getValues("participants"),
                          ];
                          newParticipants[index].amount = Number(
                            e.target.value
                          );
                          form.setValue("participants", newParticipants);
                        }}
                        className="w-24"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeParticipant(participant.userId)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="expenseDate"
              label="Ngày chi tiêu"
              error={form.formState.errors.expenseDate?.message}
            >
              <DatePicker
                value={form.watch("expenseDate")}
                onChange={(date) =>
                  form.setValue("expenseDate", date || new Date())
                }
              />
            </FormField>

            <FormField
              name="location"
              label="Địa điểm"
              error={form.formState.errors.location?.message}
            >
              <Input
                placeholder="Nhập địa điểm"
                {...form.register("location")}
              />
            </FormField>
          </div>

          <FormField
            name="tags"
            label="Tags"
            error={form.formState.errors.tags?.message}
          >
            <MultiSelect
              options={expenseTagOptions}
              value={form.watch("tags")}
              onChange={(tags) => form.setValue("tags", tags)}
              placeholder="Chọn tags"
            />
          </FormField>

          <FormField
            name="receipt"
            label="Hóa đơn"
            error={form.formState.errors.receipt?.message}
          >
            <FileUpload
              accept="image/*,application/pdf"
              maxSize={10 * 1024 * 1024}
              value={form.watch("receipt") ? [form.watch("receipt")] : []}
              onChange={(files) => form.setValue("receipt", files[0])}
              preview
            />
          </FormField>
        </div>

        <ModalFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button type="submit" loading={loading}>
            Thêm chi tiêu
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
```

**Features:**

- Complex form with multiple fields
- Dynamic participant management
- Auto-calculation of amounts
- File upload for receipts
- Real-time validation

### Settle Debt Modal (`SettleDebtModal`)

```typescript
// components/modals/SettleDebtModal.tsx
interface SettleDebtModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  debtorId: string;
  creditorId: string;
  amount: number;
  onSuccess?: (settlement: Settlement) => void;
}

interface SettleDebtFormData {
  amount: number;
  description: string;
  paymentMethod: string;
  paymentDate: Date;
  reference?: string;
}

export function SettleDebtModal({
  open,
  onOpenChange,
  groupId,
  debtorId,
  creditorId,
  amount,
  onSuccess,
}: SettleDebtModalProps) {
  const [loading, setLoading] = useState(false);
  const { data: group } = useGroup(groupId);
  const { data: debtor } = useUser(debtorId);
  const { data: creditor } = useUser(creditorId);
  const { mutate: createSettlement } = useCreateSettlement();

  const form = useForm<SettleDebtFormData>({
    resolver: zodResolver(settleDebtSchema),
    defaultValues: {
      amount,
      description: "",
      paymentMethod: "cash",
      paymentDate: new Date(),
      reference: "",
    },
  });

  const onSubmit = async (data: SettleDebtFormData) => {
    setLoading(true);
    try {
      const settlement = await createSettlement({
        groupId,
        debtorId,
        creditorId,
        ...data,
      });
      onSuccess?.(settlement);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} size="md">
      <ModalHeader
        title="Thanh toán công nợ"
        description="Tạo thanh toán để giải quyết công nợ"
      />

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserAvatar user={debtor} size="sm" />
                <span className="font-medium">{debtor?.fullName}</span>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(amount)}
                </div>
                <div className="text-sm text-muted-foreground">nợ</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium">{creditor?.fullName}</span>
                <UserAvatar user={creditor} size="sm" />
              </div>
            </div>
          </div>

          <FormField
            name="amount"
            label="Số tiền thanh toán"
            required
            error={form.formState.errors.amount?.message}
          >
            <Input
              type="number"
              placeholder="0"
              {...form.register("amount", { valueAsNumber: true })}
            />
          </FormField>

          <FormField
            name="description"
            label="Mô tả"
            error={form.formState.errors.description?.message}
          >
            <Textarea
              placeholder="Mô tả về thanh toán"
              {...form.register("description")}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="paymentMethod"
              label="Phương thức thanh toán"
              required
              error={form.formState.errors.paymentMethod?.message}
            >
              <Select
                options={paymentMethodOptions}
                value={form.watch("paymentMethod")}
                onChange={(value) => form.setValue("paymentMethod", value)}
              />
            </FormField>

            <FormField
              name="paymentDate"
              label="Ngày thanh toán"
              required
              error={form.formState.errors.paymentDate?.message}
            >
              <DatePicker
                value={form.watch("paymentDate")}
                onChange={(date) =>
                  form.setValue("paymentDate", date || new Date())
                }
              />
            </FormField>
          </div>

          <FormField
            name="reference"
            label="Số tham chiếu"
            error={form.formState.errors.reference?.message}
          >
            <Input
              placeholder="Số giao dịch, mã tham chiếu..."
              {...form.register("reference")}
            />
          </FormField>
        </div>

        <ModalFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button type="submit" loading={loading}>
            Tạo thanh toán
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
```

**Features:**

- Debt visualization
- Payment method selection
- Reference tracking
- Date selection
- Amount validation

## Utility Modal Components

### Confirm Dialog (`ConfirmDialog`)

```typescript
// components/modals/ConfirmDialog.tsx
interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  onConfirm: () => void;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  variant = "default",
  onConfirm,
  loading = false,
}: ConfirmDialogProps) {
  const handleConfirm = async () => {
    await onConfirm();
    onOpenChange(false);
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} size="sm">
      <ModalHeader title={title} description={description} />

      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <p className="text-sm text-muted-foreground">
            Hành động này không thể hoàn tác. Bạn có chắc chắn muốn tiếp tục?
          </p>
        </div>

        <ModalFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {cancelText}
          </Button>
          <Button
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={handleConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  );
}
```

**Features:**

- Confirmation dialog
- Destructive variant
- Loading states
- Custom text
- Warning message

### Receipt Viewer Modal (`ReceiptViewerModal`)

```typescript
// components/modals/ReceiptViewerModal.tsx
interface ReceiptViewerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receipt: {
    url: string;
    thumbnail?: string;
    name: string;
    size: number;
    type: string;
  };
}

export function ReceiptViewerModal({
  open,
  onOpenChange,
  receipt,
}: ReceiptViewerModalProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleImageLoad = () => {
    setLoading(false);
  };

  const handleImageError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} size="xl">
      <ModalHeader
        title="Xem hóa đơn"
        description={receipt.name}
        onClose={() => onOpenChange(false)}
      />

      <div className="space-y-4">
        <div className="relative bg-muted rounded-lg overflow-hidden">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}

          {error ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <FileX className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Không thể hiển thị hóa đơn
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => window.open(receipt.url, "_blank")}
              >
                <Download className="h-4 w-4 mr-2" />
                Tải xuống
              </Button>
            </div>
          ) : (
            <img
              src={receipt.url}
              alt={receipt.name}
              className="w-full h-auto max-h-[600px] object-contain"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Kích thước: {formatFileSize(receipt.size)}</span>
            <span>Loại: {receipt.type}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(receipt.url, "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Mở trong tab mới
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const link = document.createElement("a");
                link.href = receipt.url;
                link.download = receipt.name;
                link.click();
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Tải xuống
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
```

**Features:**

- Image viewer
- Error handling
- Download functionality
- File information
- Loading states

## Modal Management

### Modal Provider (`ModalProvider`)

```typescript
// components/modals/ModalProvider.tsx
interface ModalContextType {
  openModal: (modal: ModalConfig) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
}

interface ModalConfig {
  id: string;
  component: React.ComponentType<any>;
  props?: any;
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modals, setModals] = useState<ModalConfig[]>([]);

  const openModal = (modal: ModalConfig) => {
    setModals((prev) => [...prev, modal]);
  };

  const closeModal = (id: string) => {
    setModals((prev) => prev.filter((modal) => modal.id !== id));
  };

  const closeAllModals = () => {
    setModals([]);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal, closeAllModals }}>
      {children}
      {modals.map((modal) => {
        const ModalComponent = modal.component;
        return (
          <ModalComponent
            key={modal.id}
            open={true}
            onOpenChange={(open: boolean) => {
              if (!open) closeModal(modal.id);
            }}
            {...modal.props}
          />
        );
      })}
    </ModalContext.Provider>
  );
}
```

**Features:**

- Dynamic modal management
- Multiple modals
- Global modal state
- Easy modal opening/closing
