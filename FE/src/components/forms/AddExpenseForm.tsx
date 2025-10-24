import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
// import { useCreateExpense } from "@/lib/api/hooks/expenses";
import {
  createExpenseSchema,
  type CreateExpenseFormData,
} from "@/lib/validations/expense";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const CATEGORIES = [
  { value: "food", label: "Ăn uống" },
  { value: "transport", label: "Di chuyển" },
  { value: "accommodation", label: "Chỗ ở" },
  { value: "entertainment", label: "Giải trí" },
  { value: "shopping", label: "Mua sắm" },
  { value: "health", label: "Sức khỏe" },
  { value: "education", label: "Giáo dục" },
  { value: "other", label: "Khác" },
];

interface AddExpenseFormProps {
  groupId: string;
  onSuccess?: () => void;
}

export function AddExpenseForm({ groupId, onSuccess }: AddExpenseFormProps) {
  // const createExpenseMutation = useCreateExpense();

  const form = useForm<CreateExpenseFormData>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      title: "",
      amount: 0,
      description: "",
      category: "",
      date: new Date(),
      participants: [],
      paidBy: "",
      receipt: undefined,
    },
  });

  const onSubmit = async (data: CreateExpenseFormData) => {
    try {
      // await createExpenseMutation.mutateAsync({
      //   groupId,
      //   data: {
      //     title: data.title,
      //     amount: data.amount,
      //     description: data.description,
      //     categoryId: data.category,
      //     paidByUserId: data.paidBy,
      //     participants: data.participants.map((userId) => ({
      //       userId,
      //       amount: data.amount / data.participants.length, // Equal split for now
      //     })),
      //     receipt: data.receipt,
      //   },
      // });
      onSuccess?.();
    } catch (error) {
      // Error handling được xử lý trong mutation
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiêu đề</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tiêu đề chi tiêu" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số tiền</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Danh mục</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả (tùy chọn)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Mô tả chi tiết..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngày chi tiêu</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Chọn ngày"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="participants"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Người tham gia</FormLabel>
              <FormControl>
                <MultiSelect
                  options={[]} // Load from group members
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Chọn người tham gia..."
                  maxSelections={20}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paidBy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Người thanh toán</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn người thanh toán" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>{/* Load from group members */}</SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="receipt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hóa đơn (tùy chọn)</FormLabel>
              <FormControl>
                <FileUpload
                  value={field.value ? [field.value] : []}
                  onChange={(files) => field.onChange(files[0])}
                  accept="image/*"
                  maxSize={5 * 1024 * 1024} // 5MB
                  multiple={false}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          // disabled={createExpenseMutation.isPending}
        >
          {/* {createExpenseMutation.isPending
            ? "Đang thêm chi tiêu..."
            : "Thêm chi tiêu"} */}
          Thêm chi tiêu
        </Button>
      </form>
    </Form>
  );
}
