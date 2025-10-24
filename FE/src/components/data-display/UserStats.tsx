"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/api/axios-client";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  Calendar,
  DollarSign,
  PieChart,
  Receipt,
  TrendingUp,
  Users,
} from "lucide-react";

interface UserStatsProps {
  userId: string;
}

interface UserStatsData {
  totalGroups: number;
  totalExpenses: number;
  totalAmountSpent: number;
  totalAmountOwed: number;
  totalAmountToReceive: number;
  averageExpensePerGroup: number;
  mostActiveGroup: {
    id: string;
    name: string;
    expenseCount: number;
    totalAmount: number;
  };
  monthlySpending: Array<{
    month: string;
    amount: number;
  }>;
  expenseByCategory: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: "expense" | "settlement" | "group_join";
    description: string;
    amount?: number;
    date: string;
  }>;
}

export function UserStats({ userId }: UserStatsProps) {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-stats", userId],
    queryFn: async (): Promise<UserStatsData> => {
      const response = await apiClient.get(`/users/${userId}/stats`);
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Không thể tải thống kê</p>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Nhóm tham gia</p>
                <p className="text-2xl font-semibold">{stats.totalGroups}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Receipt className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Chi tiêu</p>
                <p className="text-2xl font-semibold">{stats.totalExpenses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đã chi</p>
                <p className="text-2xl font-semibold">
                  {formatCurrency(stats.totalAmountSpent)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Còn nợ</p>
                <p className="text-2xl font-semibold">
                  {formatCurrency(stats.totalAmountOwed)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Balance Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Tổng quan tài chính</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-green-800">Sẽ nhận được</span>
              <span className="font-semibold text-green-900">
                {formatCurrency(stats.totalAmountToReceive)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-red-800">Còn nợ</span>
              <span className="font-semibold text-red-900">
                {formatCurrency(stats.totalAmountOwed)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-blue-800">Trung bình/nhóm</span>
              <span className="font-semibold text-blue-900">
                {formatCurrency(stats.averageExpensePerGroup)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Most Active Group */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Nhóm hoạt động nhất</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.mostActiveGroup ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{stats.mostActiveGroup.name}</h3>
                  <Badge variant="secondary">
                    {stats.mostActiveGroup.expenseCount} chi tiêu
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  Tổng chi: {formatCurrency(stats.mostActiveGroup.totalAmount)}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Chưa có dữ liệu</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Expense by Category */}
      {stats.expenseByCategory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="w-5 h-5" />
              <span>Chi tiêu theo danh mục</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.expenseByCategory.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm">{category.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {formatCurrency(category.amount)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {category.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Hoạt động gần đây</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentActivity.length > 0 ? (
            <div className="space-y-3">
              {stats.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div>
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(activity.date)}
                    </p>
                  </div>
                  {activity.amount && (
                    <span className="text-sm font-medium">
                      {formatCurrency(activity.amount)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Chưa có hoạt động nào
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
