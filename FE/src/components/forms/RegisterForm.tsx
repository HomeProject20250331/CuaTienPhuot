import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRegister } from "@/lib/api/hooks/auth";
import { authStorage } from "@/lib/auth/localStorage";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export function RegisterForm() {
  const registerMutation = useRegister();
  const router = useRouter();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  // Handle redirect when register is successful
  useEffect(() => {
    if (
      registerMutation.isSuccess &&
      registerMutation.data?.success &&
      registerMutation.data.data
    ) {
      const { user, accessToken, refreshToken } = registerMutation.data.data;

      // Store in localStorage
      authStorage.setTokens(accessToken, refreshToken);
      authStorage.setUser(user);

      console.log("Register successful, redirecting to dashboard");
      router.push("/dashboard");
    }
  }, [registerMutation.isSuccess, registerMutation.data, router]);

  const onSubmit = async (data: RegisterFormData) => {
    registerMutation.mutate({
      name: data.name,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      acceptTerms: data.acceptTerms,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-foreground">
                Họ và tên
              </FormLabel>
              <FormControl>
                <Input placeholder="Nhập họ và tên" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-foreground">
                Email
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-foreground">
                Mật khẩu
              </FormLabel>
              <FormControl>
                <Input type="password" placeholder="Nhập mật khẩu" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-foreground">
                Xác nhận mật khẩu
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="acceptTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm text-foreground cursor-pointer">
                  Tôi đồng ý với{" "}
                  <a
                    href="/terms"
                    className="text-primary hover:text-primary/80 hover:underline font-medium"
                  >
                    điều khoản sử dụng
                  </a>
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
        {registerMutation.error && (
          <div className="text-red-500 text-sm text-center">
            {registerMutation.error.message || "Đăng ký thất bại"}
          </div>
        )}
        <Button
          type="submit"
          className="w-full h-11 text-base font-medium"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? "Đang đăng ký..." : "Đăng ký"}
        </Button>
      </form>
    </Form>
  );
}
