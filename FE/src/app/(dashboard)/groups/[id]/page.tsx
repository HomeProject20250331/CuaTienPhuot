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
import { useGroup, useGroupMembers } from "@/lib/api";
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  CreditCard,
  DollarSign,
  MoreHorizontal,
  Receipt,
  Settings,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const statusColors = {
  active: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  archived: "bg-gray-100 text-gray-800",
};

const roleColors = {
  admin: "bg-red-100 text-red-800",
  member: "bg-blue-100 text-blue-800",
};

export default function GroupDetailPage() {
  const params = useParams<{ id: string }>();
  const { id } = params;
  const { data: groupData, isLoading: groupLoading } = useGroup(id);
  const { data: membersData, isLoading: membersLoading } = useGroupMembers(id);

  if (groupLoading || membersLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  const group = groupData?.data;
  const members = membersData?.data || [];

  if (!group) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy nhóm
          </h1>
          <p className="text-gray-600 mb-4">
            Nhóm này có thể đã bị xóa hoặc bạn không có quyền truy cập
          </p>
          <Button asChild>
            <Link href="/groups">Quay lại danh sách</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/groups">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
            <p className="text-gray-600">
              {group.description || "Không có mô tả"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge
            className={statusColors[group.status as keyof typeof statusColors]}
          >
            {group.status === "active"
              ? "Hoạt động"
              : group.status === "completed"
              ? "Hoàn thành"
              : "Lưu trữ"}
          </Badge>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thành viên</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members.length}</div>
            <p className="text-xs text-muted-foreground">người</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng chi tiêu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {group.totalExpenses?.toLocaleString() || 0}{" "}
              {group.currency || "VNĐ"}
            </div>
            <p className="text-xs text-muted-foreground">tất cả giao dịch</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Công nợ</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              0 {group.currency || "VNĐ"}
            </div>
            <p className="text-xs text-muted-foreground">chưa thanh toán</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ngày tạo</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(group.createdAt).toLocaleDateString("vi-VN")}
            </div>
            <p className="text-xs text-muted-foreground">
              bởi {group.createdBy?.fullName || "Không xác định"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <Button variant="default" size="sm" className="flex-1">
          Tổng quan
        </Button>
        <Button variant="ghost" size="sm" asChild className="flex-1">
          <Link href={ROUTES.GROUPS.EXPENSES(group._id)}>
            <Receipt className="w-4 h-4 mr-2" />
            Chi tiêu
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild className="flex-1">
          <Link href={ROUTES.GROUPS.BALANCES(group._id)}>
            <CreditCard className="w-4 h-4 mr-2" />
            Cân bằng
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild className="flex-1">
          <Link href={ROUTES.GROUPS.STATS(group._id)}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Thống kê
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild className="flex-1">
          <Link href={ROUTES.GROUPS.SETTINGS(group._id)}>
            <Settings className="w-4 h-4 mr-2" />
            Cài đặt
          </Link>
        </Button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Members */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Thành viên</CardTitle>
              <Button variant="outline" size="sm">
                <UserPlus className="w-4 h-4 mr-2" />
                Mời
              </Button>
            </div>
            <CardDescription>Danh sách thành viên trong nhóm</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {members.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm">
                        {member?.fullName?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{member.fullName}</p>
                      <p className="text-sm text-gray-600">{member.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      className={
                        roleColors[member.role as keyof typeof roleColors]
                      }
                    >
                      {member.role === "admin" ? "Quản trị" : "Thành viên"}
                    </Badge>
                    <p className="text-sm mt-1 text-gray-600">Thành viên</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Expenses */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Chi tiêu gần đây</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href={ROUTES.GROUPS.EXPENSES(group._id)}>Xem tất cả</Link>
              </Button>
            </div>
            <CardDescription>Các giao dịch mới nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-gray-500 text-center py-4">
                Chưa có chi tiêu nào
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
