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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/constants/routes";
import { useDeleteGroup, useGroup, useUpdateGroup } from "@/lib/api";
import {
  AlertTriangle,
  ArrowLeft,
  Bell,
  Globe,
  Save,
  Settings,
  Shield,
  Trash2,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function GroupSettingsPage() {
  const params = useParams();
  const groupId = params.id as string;
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const { data: groupData, isLoading } = useGroup(groupId);
  const updateGroupMutation = useUpdateGroup();
  const deleteGroupMutation = useDeleteGroup();

  const group = groupData?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy nhóm
          </h2>
          <p className="text-gray-600">
            Nhóm này có thể đã bị xóa hoặc bạn không có quyền truy cập.
          </p>
          <Link href={ROUTES.GROUPS.LIST}>
            <Button className="mt-4">Quay lại danh sách nhóm</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    try {
      await updateGroupMutation.mutateAsync({
        id: groupId,
        data: formData,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating group:", error);
    }
  };

  const handleDelete = async () => {
    if (
      confirm(
        "Bạn có chắc chắn muốn xóa nhóm này? Hành động này không thể hoàn tác."
      )
    ) {
      try {
        await deleteGroupMutation.mutateAsync(groupId);
        // Redirect to groups list
        window.location.href = ROUTES.GROUPS.LIST;
      } catch (error) {
        console.error("Error deleting group:", error);
      }
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-900">Cài đặt nhóm</h1>
            <p className="text-gray-600">Quản lý thông tin và thành viên</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Hủy
              </Button>
              <Button
                onClick={handleSave}
                disabled={updateGroupMutation.isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                {updateGroupMutation.isPending ? "Đang lưu..." : "Lưu"}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Chỉnh sửa
            </Button>
          )}
        </div>
      </div>

      {/* Group Information */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin nhóm</CardTitle>
          <CardDescription>Cập nhật tên và mô tả nhóm</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên nhóm</Label>
            <Input
              id="name"
              value={isEditing ? formData.name : group.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              disabled={!isEditing}
              placeholder="Nhập tên nhóm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Input
              id="description"
              value={isEditing ? formData.description : group.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              disabled={!isEditing}
              placeholder="Nhập mô tả nhóm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Thành viên ({group.members?.length || 0})</span>
          </CardTitle>
          <CardDescription>Quản lý thành viên trong nhóm</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {group.members?.map((member, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">
                      {member.user?.name?.charAt(0) || "?"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">
                      {member.user?.name || "Không tên"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {member.user?.email || "Không có email"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={member.role === "admin" ? "default" : "secondary"}
                  >
                    {member.role === "admin" ? "Quản trị viên" : "Thành viên"}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <UserMinus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {(!group.members || group.members.length === 0) && (
              <p className="text-gray-500 text-center py-4">
                Chưa có thành viên nào
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Invite Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5" />
            <span>Mời thành viên</span>
          </CardTitle>
          <CardDescription>Thêm thành viên mới vào nhóm</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input placeholder="Nhập email thành viên" />
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Mời
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Thông báo</span>
          </CardTitle>
          <CardDescription>Cài đặt thông báo cho nhóm</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Thông báo chi tiêu mới</p>
                <p className="text-sm text-gray-600">
                  Nhận thông báo khi có chi tiêu mới
                </p>
              </div>
              <Button variant="outline" size="sm">
                Bật
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Thông báo thanh toán</p>
                <p className="text-sm text-gray-600">
                  Nhận thông báo khi có thanh toán
                </p>
              </div>
              <Button variant="outline" size="sm">
                Bật
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Quyền riêng tư</span>
          </CardTitle>
          <CardDescription>Cài đặt quyền riêng tư cho nhóm</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Nhóm công khai</p>
                <p className="text-sm text-gray-600">
                  Cho phép người khác tìm thấy và tham gia nhóm
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Globe className="w-4 h-4 mr-2" />
                Công khai
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            <span>Vùng nguy hiểm</span>
          </CardTitle>
          <CardDescription>
            Các hành động này không thể hoàn tác
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
              <div>
                <p className="font-medium text-red-600">Xóa nhóm</p>
                <p className="text-sm text-gray-600">
                  Xóa vĩnh viễn nhóm và tất cả dữ liệu liên quan
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteGroupMutation.isPending}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {deleteGroupMutation.isPending ? "Đang xóa..." : "Xóa nhóm"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
