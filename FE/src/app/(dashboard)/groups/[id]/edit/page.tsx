"use client";

import { EditGroupForm } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { useGroup } from "@/lib/api/hooks/groups";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditGroupPage({ params }: { params: { id: string } }) {
  const { data: group, isLoading } = useGroup(params.id);

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (!group) {
    return <div>Không tìm thấy nhóm</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/groups/${params.id}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chỉnh sửa nhóm</h1>
          <p className="text-gray-600">Cập nhật thông tin nhóm</p>
        </div>
      </div>

      <EditGroupForm
        groupId={params.id}
        initialData={{
          name: group.data?.name || "",
          description: group.data?.description || "",
          currency: group.data?.currency || "",
        }}
      />
    </div>
  );
}
