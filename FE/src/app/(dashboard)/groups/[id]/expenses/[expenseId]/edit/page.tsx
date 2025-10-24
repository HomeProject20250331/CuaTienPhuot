"use client";

import { EditExpenseForm } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditExpensePage({
  params,
}: {
  params: { id: string; expenseId: string };
}) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/groups/${params.id}/expenses`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Chỉnh sửa chi tiêu
          </h1>
          <p className="text-gray-600">Cập nhật thông tin chi tiêu</p>
        </div>
      </div>

      <EditExpenseForm groupId={params.id} expenseId={params.expenseId} />
    </div>
  );
}
