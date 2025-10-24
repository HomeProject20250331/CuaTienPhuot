"use client";

import { UserStats } from "@/components/data-display";
import {
  AvatarUpload,
  ChangePasswordForm,
  EditProfileForm,
} from "@/components/forms";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth, useCurrentUser } from "@/lib/api/hooks/auth";
import {
  Calendar,
  Key,
  Mail,
  Phone,
  Settings,
  Shield,
  User,
} from "lucide-react";
import { useState } from "react";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const { data: userData, isLoading: userDataLoading } = useCurrentUser();
  console.log(userData);
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "stats">(
    "profile"
  );
  const [isEditing, setIsEditing] = useState(false);
  console.log(user);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600">Không tìm thấy thông tin người dùng</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
          <p className="text-gray-600 mt-1">
            Quản lý thông tin và cài đặt tài khoản của bạn
          </p>
        </div>
      </div>

      {/* Profile Overview Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            {/* Avatar */}
            <div className="shrink-0">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                  onClick={() => setIsEditing(true)}
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {user.name}
                </h2>
                {user.isEmailVerified ? (
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800"
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    Đã xác thực
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800"
                  >
                    Chưa xác thực
                  </Badge>
                )}
              </div>

              <div className="space-y-2 text-gray-600">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Tham gia từ{" "}
                    {new Date(user.createdAt).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-2">
              <Button
                onClick={() => {
                  setActiveTab("profile");
                  setIsEditing(true);
                }}
                variant="outline"
                size="sm"
              >
                <Settings className="w-4 h-4 mr-2" />
                Chỉnh sửa
              </Button>
              <Button
                onClick={() => setActiveTab("password")}
                variant="outline"
                size="sm"
              >
                <Key className="w-4 h-4 mr-2" />
                Đổi mật khẩu
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "profile"
              ? "bg-white text-primary shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Thông tin cá nhân
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "password"
              ? "bg-white text-primary shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Bảo mật
        </button>
        <button
          onClick={() => setActiveTab("stats")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "stats"
              ? "bg-white text-primary shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Thống kê
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "profile" && (
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <EditProfileForm
                  user={user}
                  onCancel={() => setIsEditing(false)}
                  onSuccess={() => setIsEditing(false)}
                />
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Họ và tên
                      </label>
                      <p className="text-gray-900">{user.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <p className="text-gray-900">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Số điện thoại
                      </label>
                      <p className="text-gray-900">
                        {user.phone || "Chưa cập nhật"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Trạng thái email
                      </label>
                      <p className="text-gray-900">
                        {user.isEmailVerified ? "Đã xác thực" : "Chưa xác thực"}
                      </p>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button onClick={() => setIsEditing(true)}>
                      <Settings className="w-4 h-4 mr-2" />
                      Chỉnh sửa thông tin
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "password" && (
          <Card>
            <CardHeader>
              <CardTitle>Đổi mật khẩu</CardTitle>
            </CardHeader>
            <CardContent>
              <ChangePasswordForm />
            </CardContent>
          </Card>
        )}

        {activeTab === "stats" && (
          <div className="space-y-6">
            <UserStats userId={user.id} />
          </div>
        )}
      </div>

      {/* Avatar Upload Modal */}
      {isEditing && (
        <AvatarUpload
          currentAvatar={user.avatar}
          onClose={() => setIsEditing(false)}
          onSuccess={() => setIsEditing(false)}
        />
      )}
    </div>
  );
}
