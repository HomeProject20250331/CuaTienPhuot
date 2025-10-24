import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateGroup } from "@/lib/api/hooks/groups";
import {
  editGroupSchema,
  type EditGroupFormData,
} from "@/lib/validations/group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const CURRENCIES = [
  { value: "VND", label: "Việt Nam Đồng (VND)" },
  { value: "USD", label: "US Dollar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
  { value: "GBP", label: "British Pound (GBP)" },
  { value: "JPY", label: "Japanese Yen (JPY)" },
  { value: "KRW", label: "Korean Won (KRW)" },
  { value: "THB", label: "Thai Baht (THB)" },
  { value: "SGD", label: "Singapore Dollar (SGD)" },
];

interface EditGroupFormProps {
  groupId: string;
  initialData: Partial<EditGroupFormData>;
  onSuccess?: () => void;
}

export function EditGroupForm({
  groupId,
  initialData,
  onSuccess,
}: EditGroupFormProps) {
  const updateGroupMutation = useUpdateGroup();

  const form = useForm<EditGroupFormData>({
    resolver: zodResolver(editGroupSchema),
    defaultValues: {
      name: initialData.name || "",
      description: initialData.description || "",
      currency: initialData.currency || "",
    },
  });

  const onSubmit = async (data: EditGroupFormData) => {
    try {
      await updateGroupMutation.mutateAsync({
        id: groupId,
        data: {
          name: data.name,
          description: data.description,
          currency: data.currency,
        },
      });
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên nhóm</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên nhóm" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả (tùy chọn)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Mô tả về nhóm..."
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
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Đơn vị tiền tệ</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn đơn vị tiền tệ" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit" disabled={updateGroupMutation.isPending}>
            {updateGroupMutation.isPending
              ? "Đang cập nhật..."
              : "Cập nhật nhóm"}
          </Button>
          <Button type="button" variant="outline" onClick={onSuccess}>
            Hủy
          </Button>
        </div>
      </form>
    </Form>
  );
}
