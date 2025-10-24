"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth, useGroups } from "@/lib/api";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: groupsData, isLoading: groupsLoading } = useGroups();

  if (groupsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  const groups = groupsData?.data ?? [];
  const totalExpenses = groups.reduce(
    (sum, group) => sum + ((group as any).totalExpenses || 0),
    0
  );
  const activeGroups = groups.filter(
    (group) => (group as any).status === "active"
  );
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-foreground">
            Chào mừng bạn trở lại, {user?.name || "User"}!
          </p>
        </div>
        <Button>Tạo nhóm mới</Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng nhóm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{groups.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeGroups.length} đang hoạt động
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Chi tiêu tháng này
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalExpenses.toLocaleString()} VNĐ
            </div>
            <p className="text-xs text-muted-foreground">tất cả các nhóm</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Công nợ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 VNĐ</div>
            <p className="text-xs text-muted-foreground">Cần thanh toán</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Nhóm gần đây</CardTitle>
            <CardDescription>Các nhóm bạn đang tham gia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {groups.slice(0, 3).map((group) => (
                <div key={group._id} className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">
                      {group.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{group.name}</p>
                    <p className="text-sm text-foreground">
                      {group.members?.length || 0} thành viên •{" "}
                      {(group as any).totalExpenses?.toLocaleString() || 0} VNĐ
                    </p>
                  </div>
                </div>
              ))}
              {groups.length === 0 && (
                <p className="text-foreground text-center py-4">
                  Chưa có nhóm nào
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chi tiêu gần đây</CardTitle>
            <CardDescription>Các giao dịch mới nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-foreground text-center py-4">
                Chưa có chi tiêu nào
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
