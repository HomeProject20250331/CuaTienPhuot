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
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateGroup } from "@/lib/api/hooks/groups";
import {
  createGroupSchema,
  type CreateGroupFormData,
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

interface CreateGroupFormProps {
  onSuccess?: () => void;
}

export function CreateGroupForm({ onSuccess }: CreateGroupFormProps) {
  const createGroupMutation = useCreateGroup();

  const form = useForm<CreateGroupFormData>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: "",
      description: "",
      currency: "",
      members: [],
    },
  });

  const onSubmit = async (data: CreateGroupFormData) => {
    try {
      await createGroupMutation.mutateAsync({
        name: data.name,
        description: data.description,
        currency: data.currency,
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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

        <FormField
          control={form.control}
          name="members"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thành viên</FormLabel>
              <FormControl>
                <MultiSelect
                  options={[]} // Load from API
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Chọn thành viên..."
                  maxSelections={20}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={createGroupMutation.isPending}
        >
          {createGroupMutation.isPending ? "Đang tạo nhóm..." : "Tạo nhóm"}
        </Button>
      </form>
    </Form>
  );
}
