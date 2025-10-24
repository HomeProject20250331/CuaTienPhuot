"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { useGroups } from "@/lib/api";
import { Calendar, DollarSign, Plus, Users } from "lucide-react";
import Link from "next/link";

const statusColors = {
  active: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  archived: "bg-gray-100 text-gray-800",
};

export default function GroupsPage() {
  const { data: groupsData, isLoading: groupsLoading } = useGroups();

  if (groupsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  const groups = groupsData?.data || [];
  const activeGroups = groups.filter(
    (group) => (group as any).status === "active"
  );
  const totalExpenses = groups.reduce(
    (sum, group) => sum + ((group as any).totalExpenses || 0),
    0
  );
  const totalMembers = groups.reduce(
    (sum, group) => sum + (group.members?.length || 0),
    0
  );
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nhóm của tôi</h1>
          <p className="text-gray-600">Quản lý các nhóm du lịch và chi tiêu</p>
        </div>
        <Button asChild>
          <Link href="/groups/create">
            <Plus className="w-4 h-4 mr-2" />
            Tạo nhóm mới
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng nhóm</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">Tổng chi tiêu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalExpenses.toLocaleString()} VNĐ
            </div>
            <p className="text-xs text-muted-foreground">Tất cả các nhóm</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thành viên</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
            <p className="text-xs text-muted-foreground">Tổng thành viên</p>
          </CardContent>
        </Card>
      </div>

      {/* Groups List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Danh sách nhóm</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              Lọc
            </Button>
            <Button variant="outline" size="sm">
              Sắp xếp
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <Card key={group._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <CardDescription>
                      {group.description || "Không có mô tả"}
                    </CardDescription>
                  </div>
                  <Badge
                    className={
                      statusColors[
                        (group as any).status as keyof typeof statusColors
                      ]
                    }
                  >
                    {(group as any).status === "active"
                      ? "Hoạt động"
                      : (group as any).status === "completed"
                      ? "Hoàn thành"
                      : "Lưu trữ"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Thành viên</p>
                    <p className="font-semibold">
                      {group.members?.length || 0} người
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Tổng chi tiêu</p>
                    <p className="font-semibold">
                      {(group as any).totalExpenses?.toLocaleString() || 0}{" "}
                      {group.currency || "VNĐ"}
                    </p>
                  </div>
                </div>

                <div className="text-sm text-foreground">
                  <p>Tạo bởi: {group.createdBy?.fullName || "Unknown"}</p>
                  <p>
                    Tạo ngày:{" "}
                    {new Date(group.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>

                <div className="flex space-x-2">
                  <Button asChild className="flex-1">
                    <Link href={ROUTES.GROUPS.DETAIL(group._id)}>
                      Xem chi tiết
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {groups.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chưa có nhóm nào</h3>
            <p className="text-gray-600 mb-4">
              Tạo nhóm đầu tiên để bắt đầu quản lý chi tiêu du lịch
            </p>
            <Button asChild>
              <Link href="/groups/create">
                <Plus className="w-4 h-4 mr-2" />
                Tạo nhóm mới
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
