# Custom Hooks

## Authentication Hooks

### useAuth Hook (`useAuth`)

```typescript
// hooks/useAuth.ts
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

export function useAuth(): AuthState & AuthActions {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.login(credentials);
      setUser(response.user);
      localStorage.setItem("accessToken", response.tokens.accessToken);
      localStorage.setItem("refreshToken", response.tokens.refreshToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.register(userData);
      setUser(response.user);
      localStorage.setItem("accessToken", response.tokens.accessToken);
      localStorage.setItem("refreshToken", response.tokens.refreshToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng ký thất bại");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token");

      const response = await authApi.refreshToken({ refreshToken });
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
    } catch (err) {
      logout();
      throw err;
    }
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.forgotPassword({ email });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gửi email thất bại");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.resetPassword({ token, newPassword });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Đặt lại mật khẩu thất bại"
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const user = await authApi.getMe();
          setUser(user);
        } catch (err) {
          // Token might be expired, try to refresh
          try {
            await refreshToken();
            const user = await authApi.getMe();
            setUser(user);
          } catch (refreshErr) {
            logout();
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshToken,
    forgotPassword,
    resetPassword,
  };
}
```

**Features:**

- Authentication state management
- Token refresh handling
- Error handling
- Persistent login state
- Auto-logout on token expiry

### useUser Hook (`useUser`)

```typescript
// hooks/useUser.ts
interface UserState {
  profile: User | null;
  isLoading: boolean;
  error: string | null;
}

interface UserActions {
  updateProfile: (data: UpdateUserData) => Promise<void>;
  changePassword: (data: ChangePasswordData) => Promise<void>;
  updateAvatar: (file: File) => Promise<void>;
  deleteAvatar: () => Promise<void>;
}

export function useUser(): UserState & UserActions {
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (data: UpdateUserData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedUser = await userApi.updateProfile(data);
      setProfile(updatedUser);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Cập nhật profile thất bại"
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (data: ChangePasswordData) => {
    setIsLoading(true);
    setError(null);
    try {
      await userApi.changePassword(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đổi mật khẩu thất bại");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAvatar = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedUser = await userApi.updateAvatar(file);
      setProfile(updatedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cập nhật avatar thất bại");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAvatar = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedUser = await userApi.deleteAvatar();
      setProfile(updatedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xóa avatar thất bại");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    changePassword,
    updateAvatar,
    deleteAvatar,
  };
}
```

**Features:**

- User profile management
- Avatar handling
- Password change
- Error handling

## Group Management Hooks

### useGroups Hook (`useGroups`)

```typescript
// hooks/useGroups.ts
interface GroupsState {
  groups: Group[];
  isLoading: boolean;
  error: string | null;
  pagination: PaginationInfo;
}

interface GroupsActions {
  createGroup: (data: CreateGroupData) => Promise<Group>;
  updateGroup: (id: string, data: UpdateGroupData) => Promise<Group>;
  deleteGroup: (id: string) => Promise<void>;
  joinGroup: (inviteCode: string) => Promise<Group>;
  leaveGroup: (id: string) => Promise<void>;
  addMember: (groupId: string, email: string) => Promise<void>;
  removeMember: (groupId: string, userId: string) => Promise<void>;
  generateInviteLink: (groupId: string) => Promise<string>;
  refetch: () => Promise<void>;
}

export function useGroups(): GroupsState & GroupsActions {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const fetchGroups = async (params?: GroupQueryParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await groupApi.getGroups(params);
      setGroups(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Lấy danh sách nhóm thất bại"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const createGroup = async (data: CreateGroupData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newGroup = await groupApi.createGroup(data);
      setGroups((prev) => [newGroup, ...prev]);
      return newGroup;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tạo nhóm thất bại");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateGroup = async (id: string, data: UpdateGroupData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedGroup = await groupApi.updateGroup(id, data);
      setGroups((prev) =>
        prev.map((group) => (group.id === id ? updatedGroup : group))
      );
      return updatedGroup;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cập nhật nhóm thất bại");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteGroup = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await groupApi.deleteGroup(id);
      setGroups((prev) => prev.filter((group) => group.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xóa nhóm thất bại");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const joinGroup = async (inviteCode: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const group = await groupApi.joinGroup({ inviteCode });
      setGroups((prev) => [group, ...prev]);
      return group;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tham gia nhóm thất bại");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const leaveGroup = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await groupApi.leaveGroup(id);
      setGroups((prev) => prev.filter((group) => group.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rời nhóm thất bại");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addMember = async (groupId: string, email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await groupApi.addMember(groupId, { email });
      // Refetch groups to get updated member count
      await fetchGroups();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Thêm thành viên thất bại");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeMember = async (groupId: string, userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await groupApi.removeMember(groupId, userId);
      // Refetch groups to get updated member count
      await fetchGroups();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xóa thành viên thất bại");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const generateInviteLink = async (groupId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await groupApi.generateInviteLink(groupId);
      return response.inviteLink;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tạo link mời thất bại");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async () => {
    await fetchGroups();
  };

  // Initial fetch
  useEffect(() => {
    fetchGroups();
  }, []);

  return {
    groups,
    isLoading,
    error,
    pagination,
    createGroup,
    updateGroup,
    deleteGroup,
    joinGroup,
    leaveGroup,
    addMember,
    removeMember,
    generateInviteLink,
    refetch,
  };
}
```

**Features:**

- Group CRUD operations
- Member management
- Invite link generation
- Pagination support
- Error handling

### useGroup Hook (`useGroup`)

```typescript
// hooks/useGroup.ts
interface GroupState {
  group: Group | null;
  members: GroupMember[];
  isLoading: boolean;
  error: string | null;
}

interface GroupActions {
  updateGroup: (data: UpdateGroupData) => Promise<Group>;
  deleteGroup: () => Promise<void>;
  addMember: (email: string) => Promise<void>;
  removeMember: (userId: string) => Promise<void>;
  generateInviteLink: () => Promise<string>;
  leaveGroup: () => Promise<void>;
  refetch: () => Promise<void>;
}

export function useGroup(groupId: string): GroupState & GroupActions {
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGroup = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [groupData, membersData] = await Promise.all([
        groupApi.getGroup(groupId),
        groupApi.getGroupMembers(groupId),
      ]);
      setGroup(groupData);
      setMembers(membersData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Lấy thông tin nhóm thất bại"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateGroup = async (data: UpdateGroupData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedGroup = await groupApi.updateGroup(groupId, data);
      setGroup(updatedGroup);
      return updatedGroup;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cập nhật nhóm thất bại");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteGroup = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await groupApi.deleteGroup(groupId);
      setGroup(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xóa nhóm thất bại");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addMember = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await groupApi.addMember(groupId, { email });
      // Refetch members
      const membersData = await groupApi.getGroupMembers(groupId);
      setMembers(membersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Thêm thành viên thất bại");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeMember = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await groupApi.removeMember(groupId, userId);
      // Refetch members
      const membersData = await groupApi.getGroupMembers(groupId);
      setMembers(membersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xóa thành viên thất bại");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const generateInviteLink = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await groupApi.generateInviteLink(groupId);
      return response.inviteLink;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tạo link mời thất bại");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const leaveGroup = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await groupApi.leaveGroup(groupId);
      setGroup(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rời nhóm thất bại");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async () => {
    await fetchGroup();
  };

  // Initial fetch
  useEffect(() => {
    if (groupId) {
      fetchGroup();
    }
  }, [groupId]);

  return {
    group,
    members,
    isLoading,
    error,
    updateGroup,
    deleteGroup,
    addMember,
    removeMember,
    generateInviteLink,
    leaveGroup,
    refetch,
  };
}
```

**Features:**

- Single group management
- Member list management
- Group operations
- Auto-refetch on groupId change

## Expense Management Hooks

### useExpenses Hook (`useExpenses`)

```typescript
// hooks/useExpenses.ts
interface ExpensesState {
  expenses: Expense[];
  isLoading: boolean;
  error: string | null;
  pagination: PaginationInfo;
  filters: ExpenseFilters;
}

interface ExpensesActions {
  createExpense: (data: CreateExpenseData) => Promise<Expense>;
  updateExpense: (id: string, data: UpdateExpenseData) => Promise<Expense>;
  deleteExpense: (id: string) => Promise<void>;
  uploadReceipt: (id: string, file: File) => Promise<void>;
  deleteReceipt: (id: string) => Promise<void>;
  setFilters: (filters: Partial<ExpenseFilters>) => void;
  clearFilters: () => void;
  refetch: () => Promise<void>;
}

export function useExpenses(groupId: string): ExpensesState & ExpensesActions {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFiltersState] = useState<ExpenseFilters>({
    category: "",
    paidBy: "",
    participant: "",
    dateFrom: null,
    dateTo: null,
    minAmount: null,
    maxAmount: null,
    search: "",
  });

  const fetchExpenses = async (params?: ExpenseQueryParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await expenseApi.getExpenses(groupId, {
        ...params,
        ...filters,
      });
      setExpenses(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Lấy danh sách chi tiêu thất bại"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const createExpense = async (data: CreateExpenseData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newExpense = await expenseApi.createExpense(groupId, data);
      setExpenses((prev) => [newExpense, ...prev]);
      return newExpense;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tạo chi tiêu thất bại");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateExpense = async (id: string, data: UpdateExpenseData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedExpense = await expenseApi.updateExpense(id, data);
      setExpenses((prev) =>
        prev.map((expense) => (expense.id === id ? updatedExpense : expense))
      );
      return updatedExpense;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Cập nhật chi tiêu thất bại"
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteExpense = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await expenseApi.deleteExpense(id);
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xóa chi tiêu thất bại");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadReceipt = async (id: string, file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      await expenseApi.uploadReceipt(id, file);
      // Refetch to get updated expense with receipt
      await fetchExpenses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload hóa đơn thất bại");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteReceipt = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await expenseApi.deleteReceipt(id);
      // Refetch to get updated expense without receipt
      await fetchExpenses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xóa hóa đơn thất bại");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const setFilters = (newFilters: Partial<ExpenseFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFiltersState({
      category: "",
      paidBy: "",
      participant: "",
      dateFrom: null,
      dateTo: null,
      minAmount: null,
      maxAmount: null,
      search: "",
    });
  };

  const refetch = async () => {
    await fetchExpenses();
  };

  // Initial fetch
  useEffect(() => {
    if (groupId) {
      fetchExpenses();
    }
  }, [groupId]);

  // Refetch when filters change
  useEffect(() => {
    if (groupId) {
      fetchExpenses();
    }
  }, [filters]);

  return {
    expenses,
    isLoading,
    error,
    pagination,
    filters,
    createExpense,
    updateExpense,
    deleteExpense,
    uploadReceipt,
    deleteReceipt,
    setFilters,
    clearFilters,
    refetch,
  };
}
```

**Features:**

- Expense CRUD operations
- Receipt management
- Filtering and search
- Pagination support
- Auto-refetch on filter changes

## Settlement Management Hooks

### useSettlements Hook (`useSettlements`)

```typescript
// hooks/useSettlements.ts
interface SettlementsState {
  settlements: Settlement[];
  balances: Balance[];
  isLoading: boolean;
  error: string | null;
  pagination: PaginationInfo;
}

interface SettlementsActions {
  createSettlement: (data: CreateSettlementData) => Promise<Settlement>;
  markAsPaid: (id: string) => Promise<void>;
  cancelSettlement: (id: string) => Promise<void>;
  optimizeBalances: () => Promise<Balance[]>;
  refetch: () => Promise<void>;
}

export function useSettlements(
  groupId: string
): SettlementsState & SettlementsActions {
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const fetchSettlements = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [settlementsData, balancesData] = await Promise.all([
        settlementApi.getSettlements(groupId),
        settlementApi.getBalances(groupId),
      ]);
      setSettlements(settlementsData.data);
      setBalances(balancesData.balances);
      setPagination(settlementsData.pagination);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Lấy thông tin thanh toán thất bại"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const createSettlement = async (data: CreateSettlementData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newSettlement = await settlementApi.createSettlement(groupId, data);
      setSettlements((prev) => [newSettlement, ...prev]);
      // Refetch balances to get updated debt information
      const balancesData = await settlementApi.getBalances(groupId);
      setBalances(balancesData.balances);
      return newSettlement;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tạo thanh toán thất bại");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const markAsPaid = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await settlementApi.markAsPaid(id);
      setSettlements((prev) =>
        prev.map((settlement) =>
          settlement.id === id
            ? { ...settlement, status: "completed" }
            : settlement
        )
      );
      // Refetch balances to get updated debt information
      const balancesData = await settlementApi.getBalances(groupId);
      setBalances(balancesData.balances);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Đánh dấu đã thanh toán thất bại"
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSettlement = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await settlementApi.cancelSettlement(id);
      setSettlements((prev) =>
        prev.map((settlement) =>
          settlement.id === id
            ? { ...settlement, status: "cancelled" }
            : settlement
        )
      );
      // Refetch balances to get updated debt information
      const balancesData = await settlementApi.getBalances(groupId);
      setBalances(balancesData.balances);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hủy thanh toán thất bại");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const optimizeBalances = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const optimizedBalances = await settlementApi.optimizeBalances(groupId);
      setBalances(optimizedBalances);
      return optimizedBalances;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Tối ưu hóa công nợ thất bại"
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async () => {
    await fetchSettlements();
  };

  // Initial fetch
  useEffect(() => {
    if (groupId) {
      fetchSettlements();
    }
  }, [groupId]);

  return {
    settlements,
    balances,
    isLoading,
    error,
    pagination,
    createSettlement,
    markAsPaid,
    cancelSettlement,
    optimizeBalances,
    refetch,
  };
}
```

**Features:**

- Settlement management
- Balance tracking
- Payment status updates
- Balance optimization
- Auto-refetch on changes

## Statistics Hooks

### useStatistics Hook (`useStatistics`)

```typescript
// hooks/useStatistics.ts
interface StatisticsState {
  summary: StatisticsSummary | null;
  byCategory: CategoryStatistics[];
  byMember: MemberStatistics[];
  byTime: TimeStatistics[];
  isLoading: boolean;
  error: string | null;
}

interface StatisticsActions {
  fetchSummary: (period?: StatisticsPeriod) => Promise<void>;
  fetchByCategory: (period?: StatisticsPeriod) => Promise<void>;
  fetchByMember: (period?: StatisticsPeriod) => Promise<void>;
  fetchByTime: (period?: StatisticsPeriod) => Promise<void>;
  exportReport: (
    format: ExportFormat,
    period?: StatisticsPeriod
  ) => Promise<string>;
  refetch: () => Promise<void>;
}

export function useStatistics(
  groupId: string
): StatisticsState & StatisticsActions {
  const [summary, setSummary] = useState<StatisticsSummary | null>(null);
  const [byCategory, setByCategory] = useState<CategoryStatistics[]>([]);
  const [byMember, setByMember] = useState<MemberStatistics[]>([]);
  const [byTime, setByTime] = useState<TimeStatistics[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async (period?: StatisticsPeriod) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await statisticsApi.getSummary(groupId, period);
      setSummary(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Lấy thống kê tổng quan thất bại"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchByCategory = async (period?: StatisticsPeriod) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await statisticsApi.getByCategory(groupId, period);
      setByCategory(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Lấy thống kê theo danh mục thất bại"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchByMember = async (period?: StatisticsPeriod) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await statisticsApi.getByMember(groupId, period);
      setByMember(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Lấy thống kê theo thành viên thất bại"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchByTime = async (period?: StatisticsPeriod) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await statisticsApi.getByTime(groupId, period);
      setByTime(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Lấy thống kê theo thời gian thất bại"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const exportReport = async (
    format: ExportFormat,
    period?: StatisticsPeriod
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const exportId = await statisticsApi.exportReport(
        groupId,
        format,
        period
      );
      return exportId;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export báo cáo thất bại");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async () => {
    await Promise.all([
      fetchSummary(),
      fetchByCategory(),
      fetchByMember(),
      fetchByTime(),
    ]);
  };

  // Initial fetch
  useEffect(() => {
    if (groupId) {
      refetch();
    }
  }, [groupId]);

  return {
    summary,
    byCategory,
    byMember,
    byTime,
    isLoading,
    error,
    fetchSummary,
    fetchByCategory,
    fetchByMember,
    fetchByTime,
    exportReport,
    refetch,
  };
}
```

**Features:**

- Multiple statistics views
- Export functionality
- Period-based filtering
- Comprehensive data fetching

## Notification Hooks

### useNotifications Hook (`useNotifications`)

```typescript
// hooks/useNotifications.ts
interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  pagination: PaginationInfo;
}

interface NotificationsActions {
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  deleteAllNotifications: () => Promise<void>;
  updatePreferences: (preferences: NotificationPreferences) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useNotifications(): NotificationsState & NotificationsActions {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const fetchNotifications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await notificationApi.getNotifications();
      setNotifications(response.data);
      setUnreadCount(response.summary.unreadCount);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lấy thông báo thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đánh dấu đã đọc thất bại");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const markAllAsRead = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Đánh dấu tất cả đã đọc thất bại"
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNotification = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await notificationApi.deleteNotification(id);
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xóa thông báo thất bại");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAllNotifications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await notificationApi.deleteAllNotifications();
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Xóa tất cả thông báo thất bại"
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = async (preferences: NotificationPreferences) => {
    setIsLoading(true);
    setError(null);
    try {
      await notificationApi.updatePreferences(preferences);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Cập nhật cài đặt thông báo thất bại"
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async () => {
    await fetchNotifications();
  };

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    pagination,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    updatePreferences,
    refetch,
  };
}
```

**Features:**

- Notification management
- Read status tracking
- Bulk operations
- Preferences management
- Real-time updates

## Utility Hooks

### useLocalStorage Hook (`useLocalStorage`)

```typescript
// hooks/useLocalStorage.ts
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}
```

**Features:**

- Type-safe localStorage
- Automatic serialization
- Error handling
- Initial value support

### useDebounce Hook (`useDebounce`)

```typescript
// hooks/useDebounce.ts
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

**Features:**

- Debounced value updates
- Configurable delay
- Cleanup on unmount

### useIntersectionObserver Hook (`useIntersectionObserver`)

```typescript
// hooks/useIntersectionObserver.ts
export function useIntersectionObserver(
  elementRef: RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, options]);

  return isIntersecting;
}
```

**Features:**

- Intersection observer API
- Configurable options
- Cleanup on unmount
- State management
