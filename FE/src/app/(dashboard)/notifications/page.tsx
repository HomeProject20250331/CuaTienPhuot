"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNotifications } from "@/lib/api";
import {
  AlertCircle,
  Bell,
  Calendar,
  Check,
  CheckCheck,
  Filter,
  Search,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";

const typeIcons = {
  info: Bell,
  success: Check,
  warning: AlertCircle,
  error: X,
};

const typeColors = {
  info: "bg-blue-100 text-blue-800",
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  error: "bg-red-100 text-red-800",
};

export default function NotificationsPage() {
  const { data: notificationsData, isLoading: notificationsLoading } =
    useNotifications();

  if (notificationsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  const notifications = notificationsData?.data || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Thông báo</h1>
          <p className="text-gray-600">
            {unreadCount > 0
              ? `${unreadCount} thông báo chưa đọc`
              : "Tất cả thông báo đã được đọc"}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <CheckCheck className="w-4 h-4 mr-2" />
            Đánh dấu tất cả đã đọc
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng thông báo
            </CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
            <p className="text-xs text-muted-foreground">tất cả</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chưa đọc</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCount}</div>
            <p className="text-xs text-muted-foreground">thông báo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ưu tiên cao</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                notifications.filter((n) => n.type === "error" && !n.isRead)
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground">thông báo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hôm nay</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                notifications.filter((n) => {
                  const today = new Date().toDateString();
                  const notificationDate = new Date(n.createdAt).toDateString();
                  return today === notificationDate;
                }).length
              }
            </div>
            <p className="text-xs text-muted-foreground">thông báo</p>
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
                  placeholder="Tìm thông báo..."
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Loại</Label>
              <select className="w-full p-2 border rounded-md">
                <option value="">Tất cả loại</option>
                <option value="expense">Chi tiêu</option>
                <option value="member">Thành viên</option>
                <option value="payment">Thanh toán</option>
                <option value="settings">Cài đặt</option>
                <option value="report">Báo cáo</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <select className="w-full p-2 border rounded-md">
                <option value="">Tất cả</option>
                <option value="unread">Chưa đọc</option>
                <option value="read">Đã đọc</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Ưu tiên</Label>
              <select className="w-full p-2 border rounded-md">
                <option value="">Tất cả</option>
                <option value="high">Cao</option>
                <option value="normal">Bình thường</option>
                <option value="low">Thấp</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Danh sách thông báo</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Lọc
            </Button>
            <Button variant="outline" size="sm">
              <Trash2 className="w-4 h-4 mr-2" />
              Xóa đã đọc
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => {
            const IconComponent =
              typeIcons[notification.type as keyof typeof typeIcons] || Bell;

            return (
              <Card
                key={notification.id}
                className={`hover:shadow-md transition-shadow ${
                  !notification.isRead ? "border-l-4 border-l-primary" : ""
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        typeColors[notification.type as keyof typeof typeColors]
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                            <Badge
                              className={
                                typeColors[
                                  notification.type as keyof typeof typeColors
                                ]
                              }
                            >
                              {notification.type === "info"
                                ? "Thông tin"
                                : notification.type === "success"
                                ? "Thành công"
                                : notification.type === "warning"
                                ? "Cảnh báo"
                                : "Lỗi"}
                            </Badge>
                            <Badge
                              className={
                                notification.type === "error"
                                  ? "bg-red-100 text-red-800"
                                  : notification.type === "warning"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : notification.type === "success"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              }
                            >
                              {notification.type === "error"
                                ? "Quan trọng"
                                : notification.type === "warning"
                                ? "Cảnh báo"
                                : notification.type === "success"
                                ? "Thành công"
                                : "Thông tin"}
                            </Badge>
                          </div>

                          <p className="text-gray-600 mb-2">
                            {notification.message}
                          </p>

                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>
                              {notification.category === "group"
                                ? "Nhóm"
                                : notification.category === "expense"
                                ? "Chi tiêu"
                                : notification.category === "settlement"
                                ? "Thanh toán"
                                : "Hệ thống"}
                            </span>
                            <span>•</span>
                            <span>
                              {new Date(notification.createdAt).toLocaleString(
                                "vi-VN"
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {!notification.isRead && (
                            <Button variant="ghost" size="sm">
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={notification.data?.actionUrl || "#"}>
                              Xem
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {notifications.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Chưa có thông báo nào
            </h3>
            <p className="text-gray-600 mb-4">
              Bạn sẽ nhận được thông báo khi có hoạt động mới
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
