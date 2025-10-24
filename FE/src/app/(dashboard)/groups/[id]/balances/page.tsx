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
import { useBalances, useSettlements } from "@/lib/api";
import { ArrowLeft, CheckCircle, Clock, DollarSign, Users } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function GroupBalancesPage() {
  const params = useParams();
  const groupId = params.id as string;

  const { data: balancesData, isLoading: balancesLoading } =
    useBalances(groupId);
  const { data: settlementsData, isLoading: settlementsLoading } =
    useSettlements(groupId);

  if (balancesLoading || settlementsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  const balances = balancesData?.data || [];
  const settlements = settlementsData?.data || [];

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
            <h1 className="text-3xl font-bold text-gray-900">Cân bằng nhóm</h1>
            <p className="text-gray-600">Xem và quản lý các khoản nợ</p>
          </div>
        </div>
        <Button>
          <DollarSign className="w-4 h-4 mr-2" />
          Thanh toán
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng nợ</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {balances
                .reduce((sum, balance) => sum + (balance.amount || 0), 0)
                .toLocaleString()}{" "}
              VNĐ
            </div>
            <p className="text-xs text-muted-foreground">
              Tổng số tiền cần thanh toán
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Số giao dịch</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{balances.length}</div>
            <p className="text-xs text-muted-foreground">
              Số khoản nợ cần xử lý
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã thanh toán</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {settlements.filter((s) => s.status === "confirmed").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Giao dịch đã hoàn thành
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Balances */}
      <Card>
        <CardHeader>
          <CardTitle>Cân bằng giữa các thành viên</CardTitle>
          <CardDescription>
            Danh sách các khoản nợ cần thanh toán
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {balances.map((balance, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">
                      {balance.fromUser?.name?.charAt(0) || "?"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">
                      {balance.fromUser?.name} nợ {balance.toUser?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {balance.description || "Không có mô tả"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">
                    {balance.amount?.toLocaleString() || 0} VNĐ
                  </p>
                  <p className="text-sm text-gray-600">
                    {balance.createdAt
                      ? new Date(balance.createdAt).toLocaleDateString("vi-VN")
                      : "Không xác định"}
                  </p>
                </div>
              </div>
            ))}
            {balances.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                Không có khoản nợ nào
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Settlements */}
      <Card>
        <CardHeader>
          <CardTitle>Thanh toán gần đây</CardTitle>
          <CardDescription>Lịch sử các giao dịch thanh toán</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {settlements.map((settlement, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      settlement.status === "confirmed"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {settlement.status === "confirmed" ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {settlement.fromUser?.name} → {settlement.toUser?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {settlement.description || "Không có mô tả"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">
                    {settlement.amount?.toLocaleString() || 0} VNĐ
                  </p>
                  <p className="text-sm text-gray-600">
                    {settlement.status === "confirmed"
                      ? "Đã xác nhận"
                      : "Chờ xác nhận"}
                  </p>
                </div>
              </div>
            ))}
            {settlements.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                Chưa có giao dịch thanh toán nào
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
