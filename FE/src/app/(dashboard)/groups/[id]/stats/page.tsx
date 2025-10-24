"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import {
  useStatsByCategory,
  useStatsByMember,
  useStatsSummary,
} from "@/lib/api";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  Calendar,
  DollarSign,
  Download,
  Filter,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function GroupStatsPage() {
  const params = useParams();
  const groupId = params.id as string;

  const { data: summaryData, isLoading: summaryLoading } =
    useStatsSummary(groupId);
  const { data: categoryData, isLoading: categoryLoading } =
    useStatsByCategory(groupId);
  const { data: memberData, isLoading: memberLoading } =
    useStatsByMember(groupId);

  if (summaryLoading || categoryLoading || memberLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải thống kê...</p>
        </div>
      </div>
    );
  }

  const summary = summaryData?.data;
  const categories = categoryData?.data || [];
  const members = memberData?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={ROUTES.GROUPS.DETAIL(groupId)}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Thống kê nhóm</h1>
            <p className="text-gray-600">Phân tích chi tiêu và hoạt động</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Bộ lọc
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Period Selector */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="font-medium">Tháng 1/2024</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                Tháng trước
              </Button>
              <Button variant="outline" size="sm">
                Tháng sau
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng chi tiêu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.totalAmount?.toLocaleString() || 0} VNĐ
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              +12% so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Số giao dịch</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.totalExpenses || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              +3 so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Chi tiêu trung bình
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.totalAmount
                ? (
                    summary.totalAmount / (summary.totalExpenses || 1)
                  ).toLocaleString()
                : 0}{" "}
              VNĐ
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="w-3 h-3 inline mr-1" />
              -5% so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thành viên</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              +1 so với tháng trước
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Chi tiêu theo danh mục</CardTitle>
            <CardDescription>
              Phân bổ chi tiêu theo từng danh mục
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {category.categoryName || "Không tên"}
                    </span>
                    <span className="text-sm text-gray-600">
                      {category.totalAmount?.toLocaleString() || 0} VNĐ (
                      {category.percentage || 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${category.percentage || 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              {categories.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  Chưa có dữ liệu chi tiêu
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Expenses by Member */}
        <Card>
          <CardHeader>
            <CardTitle>Chi tiêu theo thành viên</CardTitle>
            <CardDescription>
              Phân bổ chi tiêu theo từng thành viên
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {members.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm">
                        {member.userName?.charAt(0) || "?"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">
                        {member.userName || "Không tên"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {member.expenseCount || 0} giao dịch
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {member.totalPaid?.toLocaleString() || 0} VNĐ
                    </p>
                    <p className="text-sm text-gray-600">
                      {member.totalPaid && member.totalOwed
                        ? Math.round(
                            (member.totalPaid /
                              (member.totalPaid + member.totalOwed)) *
                              100
                          )
                        : 0}
                      %
                    </p>
                  </div>
                </div>
              ))}
              {members.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  Chưa có dữ liệu thành viên
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
          <CardDescription>Các giao dịch và hoạt động mới nhất</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-500 text-center py-4">
              Chưa có hoạt động nào
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
