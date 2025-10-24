"use client";

import { AddExpenseForm } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AddExpensePage({ params }: { params: { id: string } }) {
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
          <h1 className="text-3xl font-bold text-gray-900">Thêm chi tiêu</h1>
          <p className="text-gray-600">Thêm chi tiêu mới vào nhóm</p>
        </div>
      </div>

      <AddExpenseForm groupId={params.id} />
    </div>
  );
}
