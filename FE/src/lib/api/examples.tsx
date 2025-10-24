/**
 * Ví dụ sử dụng React Query Hooks
 * Hướng dẫn cách sử dụng các custom hooks cho API
 */

"use client";

import {
  useAddMember,
  useAuth,
  useBalances,
  useCreateExpense,
  useCreateExpenseCategory,
  useCreateGroup,
  useCreateSettlement,
  useDeleteGroup,
  useExpenseCategories,
  useExpenses,
  useGroups,
  useMarkNotificationAsRead,
  useNotifications,
  useRemoveMember,
  useSettlements,
  useStatsSummary,
  useUpdateGroup,
} from "@/lib/api";
import { useState } from "react";

// Ví dụ component sử dụng Auth hooks
export function AuthExample() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (!isAuthenticated) {
    return <div>Chưa đăng nhập</div>;
  }

  return (
    <div>
      <h2>Xin chào, {user?.name}!</h2>
      <p>Email: {user?.email}</p>
    </div>
  );
}

// Ví dụ component sử dụng Groups hooks
export function GroupsExample() {
  const {
    data: groups,
    isLoading,
    error,
  } = useGroups({
    page: 1,
    limit: 10,
  });

  if (isLoading) {
    return <div>Đang tải danh sách nhóm...</div>;
  }

  if (error) {
    return <div>Lỗi: {(error as any)?.message}</div>;
  }

  return (
    <div>
      <h2>Danh sách nhóm</h2>
      {groups?.data?.map((group) => (
        <div key={group.id}>
          <h3>{group.name}</h3>
          <p>{group.description}</p>
        </div>
      ))}
    </div>
  );
}

// Ví dụ component sử dụng Expenses hooks
export function ExpensesExample({ groupId }: { groupId: string }) {
  const { data: expenses, isLoading } = useExpenses(groupId, {
    page: 1,
    limit: 20,
  });

  if (isLoading) {
    return <div>Đang tải chi tiêu...</div>;
  }

  return (
    <div>
      <h2>Chi tiêu nhóm</h2>
      {expenses?.data?.map((expense) => (
        <div key={expense.id}>
          <h3>{expense.title}</h3>
          <p>
            Số tiền: {expense.amount} {expense.currency}
          </p>
          <p>Người trả: {expense.paidBy.name}</p>
        </div>
      ))}
    </div>
  );
}

// Ví dụ component sử dụng Balances hooks
export function BalancesExample({ groupId }: { groupId: string }) {
  const { data: balances, isLoading } = useBalances(groupId);

  if (isLoading) {
    return <div>Đang tải bảng công nợ...</div>;
  }

  return (
    <div>
      <h2>Bảng công nợ</h2>
      {balances?.data?.map((balance) => (
        <div key={balance.userId}>
          <h3>{balance.user.name}</h3>
          <p>Công nợ: {balance.balance} VNĐ</p>
        </div>
      ))}
    </div>
  );
}

// Ví dụ component sử dụng Mutations
export function CreateGroupExample() {
  const createGroupMutation = useCreateGroup();

  const handleCreateGroup = async () => {
    try {
      const response = await createGroupMutation.mutateAsync({
        name: "Nhóm du lịch mới",
        description: "Nhóm đi du lịch cùng nhau",
        currency: "VNĐ",
      });

      if (response.success) {
        console.log("Tạo nhóm thành công:", response.data);
      }
    } catch (error) {
      console.error("Tạo nhóm thất bại:", error);
    }
  };

  return (
    <button
      onClick={handleCreateGroup}
      disabled={createGroupMutation.isPending}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
    >
      {createGroupMutation.isPending ? "Đang tạo..." : "Tạo nhóm mới"}
    </button>
  );
}

// Ví dụ component tạo chi tiêu
export function CreateExpenseExample({ groupId }: { groupId: string }) {
  const createExpenseMutation = useCreateExpense();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  const handleCreateExpense = async () => {
    if (!title || !amount) return;

    try {
      const response = await createExpenseMutation.mutateAsync({
        groupId,
        data: {
          title,
          amount: parseFloat(amount),
          categoryId: "1", // ID của category
          paidByUserId: "current-user-id", // ID của người trả tiền
          participants: [], // Danh sách người tham gia
        },
      });

      if (response.success) {
        console.log("Tạo chi tiêu thành công:", response.data);
        setTitle("");
        setAmount("");
      }
    } catch (error) {
      console.error("Tạo chi tiêu thất bại:", error);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded">
      <h3>Tạo chi tiêu mới</h3>
      <input
        type="text"
        placeholder="Tiêu đề chi tiêu"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Số tiền"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button
        onClick={handleCreateExpense}
        disabled={createExpenseMutation.isPending || !title || !amount}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
      >
        {createExpenseMutation.isPending ? "Đang tạo..." : "Tạo chi tiêu"}
      </button>
    </div>
  );
}

// Ví dụ component hiển thị settlements
export function SettlementsExample({ groupId }: { groupId: string }) {
  const { data: settlements, isLoading } = useSettlements(groupId);
  const createSettlementMutation = useCreateSettlement();

  const handleCreateSettlement = async (
    fromUserId: string,
    toUserId: string,
    amount: number
  ) => {
    try {
      const response = await createSettlementMutation.mutateAsync({
        groupId,
        data: {
          fromUserId,
          toUserId,
          amount,
          description: "Thanh toán công nợ",
        },
      });

      if (response.success) {
        console.log("Tạo thanh toán thành công:", response.data);
      }
    } catch (error) {
      console.error("Tạo thanh toán thất bại:", error);
    }
  };

  if (isLoading) {
    return <div>Đang tải thanh toán...</div>;
  }

  return (
    <div className="space-y-4">
      <h3>Thanh toán đề xuất</h3>
      {settlements?.data?.map((settlement) => (
        <div key={settlement.id} className="p-3 border rounded">
          <p>
            {settlement.fromUser.name} nợ {settlement.toUser.name}:{" "}
            {settlement.amount} VNĐ
          </p>
          <button
            onClick={() =>
              handleCreateSettlement(
                settlement.fromUserId,
                settlement.toUserId,
                settlement.amount
              )
            }
            disabled={createSettlementMutation.isPending}
            className="mt-2 px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 disabled:opacity-50"
          >
            Tạo thanh toán
          </button>
        </div>
      ))}
    </div>
  );
}

// Ví dụ component thống kê
export function StatisticsExample({ groupId }: { groupId: string }) {
  const { data: stats, isLoading } = useStatsSummary(groupId);

  if (isLoading) {
    return <div>Đang tải thống kê...</div>;
  }

  return (
    <div className="space-y-4">
      <h3>Thống kê nhóm</h3>
      {stats?.data && (
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 rounded">
            <p className="text-sm text-gray-600">Tổng chi tiêu</p>
            <p className="text-lg font-bold">{stats.data.totalExpenses} VNĐ</p>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <p className="text-sm text-gray-600">Số giao dịch</p>
            <p className="text-lg font-bold">{stats.data.totalExpenses}</p>
          </div>
          <div className="p-3 bg-yellow-50 rounded">
            <p className="text-sm text-gray-600">Thành viên</p>
            <p className="text-lg font-bold">{stats.data.totalMembers}</p>
          </div>
          <div className="p-3 bg-red-50 rounded">
            <p className="text-sm text-gray-600">Thành viên hoạt động</p>
            <p className="text-lg font-bold">{stats.data.activeMembers}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Ví dụ component thông báo
export function NotificationsExample() {
  const { data: notifications, isLoading } = useNotifications();
  const markAsReadMutation = useMarkNotificationAsRead();

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsReadMutation.mutateAsync(notificationId);
    } catch (error) {
      console.error("Đánh dấu đã đọc thất bại:", error);
    }
  };

  if (isLoading) {
    return <div>Đang tải thông báo...</div>;
  }

  return (
    <div className="space-y-4">
      <h3>Thông báo</h3>
      {notifications?.data?.map((notification) => (
        <div
          key={notification.id}
          className={`p-3 border rounded ${
            notification.isRead ? "bg-gray-50" : "bg-blue-50"
          }`}
        >
          <p className="font-medium">{notification.title}</p>
          <p className="text-sm text-gray-600">{notification.message}</p>
          <p className="text-xs text-gray-500">
            {new Date(notification.createdAt).toLocaleString()}
          </p>
          {!notification.isRead && (
            <button
              onClick={() => handleMarkAsRead(notification.id)}
              className="mt-2 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
            >
              Đánh dấu đã đọc
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

// Ví dụ component tổng hợp
export function DashboardExample() {
  const { user, isAuthenticated } = useAuth();
  const { data: groups } = useGroups({ limit: 5 });

  if (!isAuthenticated) {
    return <div>Vui lòng đăng nhập</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Dashboard - {user?.name}</h1>

      {/* Thông báo */}
      <div className="bg-white p-4 rounded-lg shadow">
        <NotificationsExample />
      </div>

      {/* Tạo nhóm mới */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Tạo nhóm mới</h2>
        <CreateGroupExample />
      </div>

      {/* Danh sách nhóm */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Nhóm của bạn</h2>
        {groups?.data?.map((group) => (
          <div key={group.id} className="border p-4 rounded mb-4">
            <h3 className="text-lg font-medium">{group.name}</h3>
            <p className="text-gray-600 mb-4">{group.description}</p>

            {/* Thống kê nhóm */}
            <StatisticsExample groupId={group.id} />

            {/* Chi tiêu */}
            <div className="mt-4">
              <ExpensesExample groupId={group.id} />
            </div>

            {/* Bảng công nợ */}
            <div className="mt-4">
              <BalancesExample groupId={group.id} />
            </div>

            {/* Thanh toán đề xuất */}
            <div className="mt-4">
              <SettlementsExample groupId={group.id} />
            </div>

            {/* Tạo chi tiêu */}
            <div className="mt-4">
              <CreateExpenseExample groupId={group.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Ví dụ component sử dụng tất cả hooks
export function CompleteExample() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { data: groups, isLoading: groupsLoading } = useGroups();
  const { data: notifications } = useNotifications();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Đang tải...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center p-8">
        Vui lòng đăng nhập để sử dụng ứng dụng
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Cửa Tiền Phượt</h1>
          <p className="text-gray-600">Xin chào, {user?.name}!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Thông báo */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Thông báo</h2>
              <NotificationsExample />
            </div>

            {/* Tạo nhóm */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Tạo nhóm mới</h2>
              <CreateGroupExample />
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-2">
            {groupsLoading ? (
              <div className="text-center p-8">Đang tải danh sách nhóm...</div>
            ) : (
              <div className="space-y-6">
                {groups?.data?.map((group) => (
                  <div
                    key={group.id}
                    className="bg-white p-6 rounded-lg shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{group.name}</h3>
                        <p className="text-gray-600">{group.description}</p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {group.memberCount} thành viên
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Thống kê */}
                      <div>
                        <StatisticsExample groupId={group.id} />
                      </div>

                      {/* Bảng công nợ */}
                      <div>
                        <BalancesExample groupId={group.id} />
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      {/* Chi tiêu */}
                      <ExpensesExample groupId={group.id} />

                      {/* Thanh toán đề xuất */}
                      <SettlementsExample groupId={group.id} />

                      {/* Tạo chi tiêu */}
                      <CreateExpenseExample groupId={group.id} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Ví dụ component quản lý nhóm
export function GroupManagementExample({ groupId }: { groupId: string }) {
  const updateGroupMutation = useUpdateGroup();
  const deleteGroupMutation = useDeleteGroup();
  const addMemberMutation = useAddMember();
  const removeMemberMutation = useRemoveMember();
  const [newMemberEmail, setNewMemberEmail] = useState("");

  const handleUpdateGroup = async () => {
    try {
      const response = await updateGroupMutation.mutateAsync({
        id: groupId,
        data: {
          name: "Tên nhóm đã cập nhật",
          description: "Mô tả đã cập nhật",
        },
      });

      if (response.success) {
        console.log("Cập nhật nhóm thành công:", response.data);
      }
    } catch (error) {
      console.error("Cập nhật nhóm thất bại:", error);
    }
  };

  const handleDeleteGroup = async () => {
    if (confirm("Bạn có chắc chắn muốn xóa nhóm này?")) {
      try {
        const response = await deleteGroupMutation.mutateAsync(groupId);
        if (response.success) {
          console.log("Xóa nhóm thành công");
        }
      } catch (error) {
        console.error("Xóa nhóm thất bại:", error);
      }
    }
  };

  const handleAddMember = async () => {
    if (!newMemberEmail) return;

    try {
      const response = await addMemberMutation.mutateAsync({
        groupId,
        data: { email: newMemberEmail },
      });

      if (response.success) {
        console.log("Thêm thành viên thành công:", response.data);
        setNewMemberEmail("");
      }
    } catch (error) {
      console.error("Thêm thành viên thất bại:", error);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded">
      <h3>Quản lý nhóm</h3>

      <div className="space-y-2">
        <button
          onClick={handleUpdateGroup}
          disabled={updateGroupMutation.isPending}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {updateGroupMutation.isPending
            ? "Đang cập nhật..."
            : "Cập nhật thông tin nhóm"}
        </button>

        <button
          onClick={handleDeleteGroup}
          disabled={deleteGroupMutation.isPending}
          className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          {deleteGroupMutation.isPending ? "Đang xóa..." : "Xóa nhóm"}
        </button>
      </div>

      <div className="space-y-2">
        <input
          type="email"
          placeholder="Email thành viên mới"
          value={newMemberEmail}
          onChange={(e) => setNewMemberEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleAddMember}
          disabled={addMemberMutation.isPending || !newMemberEmail}
          className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {addMemberMutation.isPending ? "Đang thêm..." : "Thêm thành viên"}
        </button>
      </div>
    </div>
  );
}

// Ví dụ component quản lý danh mục chi tiêu
export function ExpenseCategoriesExample({ groupId }: { groupId: string }) {
  const { data: categories, isLoading } = useExpenseCategories(groupId);
  const createCategoryMutation = useCreateExpenseCategory();
  const [categoryName, setCategoryName] = useState("");
  const [categoryColor, setCategoryColor] = useState("#3B82F6");

  const handleCreateCategory = async () => {
    if (!categoryName) return;

    try {
      const response = await createCategoryMutation.mutateAsync({
        groupId,
        data: {
          name: categoryName,
          color: categoryColor,
        },
      });

      if (response.success) {
        console.log("Tạo danh mục thành công:", response.data);
        setCategoryName("");
        setCategoryColor("#3B82F6");
      }
    } catch (error) {
      console.error("Tạo danh mục thất bại:", error);
    }
  };

  if (isLoading) {
    return <div>Đang tải danh mục...</div>;
  }

  return (
    <div className="space-y-4 p-4 border rounded">
      <h3>Danh mục chi tiêu</h3>

      {/* Tạo danh mục mới */}
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Tên danh mục"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <div className="flex items-center space-x-2">
          <label className="text-sm">Màu:</label>
          <input
            type="color"
            value={categoryColor}
            onChange={(e) => setCategoryColor(e.target.value)}
            className="w-8 h-8 border rounded"
          />
        </div>
        <button
          onClick={handleCreateCategory}
          disabled={createCategoryMutation.isPending || !categoryName}
          className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
        >
          {createCategoryMutation.isPending ? "Đang tạo..." : "Tạo danh mục"}
        </button>
      </div>

      {/* Danh sách danh mục */}
      <div className="space-y-2">
        {categories?.data?.map((category) => (
          <div
            key={category.id}
            className="flex items-center space-x-2 p-2 border rounded"
          >
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: category.color }}
            />
            <span className="flex-1">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Ví dụ component sử dụng tất cả tính năng
export function AllFeaturesExample() {
  const { user, isAuthenticated } = useAuth();
  const { data: groups } = useGroups();

  if (!isAuthenticated) {
    return <div className="text-center p-8">Vui lòng đăng nhập</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Cửa Tiền Phượt - Demo Tất Cả Tính Năng
        </h1>
        <p className="text-gray-600">Xin chào, {user?.name}!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cột trái - Thông tin chung */}
        <div className="space-y-6">
          {/* Thông báo */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Thông báo</h2>
            <NotificationsExample />
          </div>

          {/* Tạo nhóm */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Tạo nhóm mới</h2>
            <CreateGroupExample />
          </div>
        </div>

        {/* Cột phải - Danh sách nhóm */}
        <div className="space-y-6">
          {groups?.data?.map((group) => (
            <div key={group.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{group.name}</h3>
                  <p className="text-gray-600">{group.description}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {group.memberCount} thành viên
                </span>
              </div>

              <div className="space-y-4">
                {/* Thống kê */}
                <StatisticsExample groupId={group.id} />

                {/* Quản lý nhóm */}
                <GroupManagementExample groupId={group.id} />

                {/* Danh mục chi tiêu */}
                <ExpenseCategoriesExample groupId={group.id} />

                {/* Chi tiêu */}
                <ExpensesExample groupId={group.id} />

                {/* Bảng công nợ */}
                <BalancesExample groupId={group.id} />

                {/* Thanh toán đề xuất */}
                <SettlementsExample groupId={group.id} />

                {/* Tạo chi tiêu */}
                <CreateExpenseExample groupId={group.id} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
