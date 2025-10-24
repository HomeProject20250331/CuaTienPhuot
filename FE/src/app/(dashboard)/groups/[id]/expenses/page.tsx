"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/constants/routes";
import { useExpenses } from "@/lib/api";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Filter,
  MoreHorizontal,
  Plus,
  Receipt,
  Search,
  Tag,
  User,
} from "lucide-react";
import Link from "next/link";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  settled: "bg-green-100 text-green-800",
  disputed: "bg-red-100 text-red-800",
};

const categoryColors = {
  "Ăn uống": "bg-orange-100 text-orange-800",
  "Di chuyển": "bg-blue-100 text-blue-800",
  "Lưu trú": "bg-purple-100 text-purple-800",
  "Mua sắm": "bg-pink-100 text-pink-800",
  "Giải trí": "bg-green-100 text-green-800",
};

export default function GroupExpensesPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: expensesData, isLoading: expensesLoading } = useExpenses(
    params.id
  );

  if (expensesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  const expenses = expensesData?.data || [];
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const pendingExpenses = expenses.filter(
    (expense) => expense.status === "pending"
  );
  const settledExpenses = expenses.filter(
    (expense) => expense.status === "settled"
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={ROUTES.GROUPS.DETAIL(params.id)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Chi tiêu nhóm</h1>
            <p className="text-gray-600">Quản lý chi tiêu trong nhóm</p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/groups/${params.id}/expenses/create`}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm chi tiêu
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng chi tiêu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalExpenses.toLocaleString()} VNĐ
            </div>
            <p className="text-xs text-muted-foreground">tất cả giao dịch</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Chưa thanh toán
            </CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingExpenses.length}</div>
            <p className="text-xs text-muted-foreground">giao dịch</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã thanh toán</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{settledExpenses.length}</div>
            <p className="text-xs text-muted-foreground">giao dịch</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trung bình</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {expenses.length > 0
                ? Math.round(totalExpenses / expenses.length).toLocaleString()
                : 0}{" "}
              VNĐ
            </div>
            <p className="text-xs text-muted-foreground">mỗi giao dịch</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Tìm kiếm</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Tìm chi tiêu..."
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Danh mục</Label>
              <select className="w-full p-2 border rounded-md">
                <option value="">Tất cả danh mục</option>
                <option value="Ăn uống">Ăn uống</option>
                <option value="Di chuyển">Di chuyển</option>
                <option value="Lưu trú">Lưu trú</option>
                <option value="Mua sắm">Mua sắm</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <select className="w-full p-2 border rounded-md">
                <option value="">Tất cả trạng thái</option>
                <option value="pending">Chưa thanh toán</option>
                <option value="settled">Đã thanh toán</option>
                <option value="disputed">Có tranh chấp</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Ngày</Label>
              <Input id="date" type="date" className="w-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expenses List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Danh sách chi tiêu</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Lọc
            </Button>
            <Button variant="outline" size="sm">
              Xuất
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {expenses.map((expense) => (
            <Card
              key={expense.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold">{expense.title}</h3>
                      <Badge
                        className={
                          statusColors[
                            expense.status as keyof typeof statusColors
                          ]
                        }
                      >
                        {expense.status === "pending"
                          ? "Chưa thanh toán"
                          : expense.status === "settled"
                          ? "Đã thanh toán"
                          : "Có tranh chấp"}
                      </Badge>
                      <Badge
                        className={
                          categoryColors[
                            expense.category as keyof typeof categoryColors
                          ]
                        }
                      >
                        {expense.category}
                      </Badge>
                    </div>

                    <p className="text-gray-600 mb-3">
                      {expense.description || "Không có mô tả"}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold">
                          {expense.amount.toLocaleString()}{" "}
                          {expense.currency || "VNĐ"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>Thanh toán: {expense.paidBy.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>
                          {new Date(expense.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Tag className="w-4 h-4 text-gray-400" />
                        <span>
                          Thành viên: {expense.participants?.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      Chỉnh sửa
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {expenses.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chưa có chi tiêu nào</h3>
            <p className="text-gray-600 mb-4">
              Thêm chi tiêu đầu tiên để bắt đầu theo dõi
            </p>
            <Button asChild>
              <Link href={`/groups/${params.id}/expenses/create`}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm chi tiêu
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
