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
import { useLogin } from "@/lib/api/hooks/auth";
import { authStorage } from "@/lib/auth/localStorage";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export function LoginForm() {
  const loginMutation = useLogin();
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  // Handle redirect when login is successful
  useEffect(() => {
    if (
      loginMutation.isSuccess &&
      loginMutation.data?.success &&
      loginMutation.data.data
    ) {
      const { user, accessToken, refreshToken } = loginMutation.data.data;

      // Store in localStorage
      authStorage.setTokens(accessToken, refreshToken);
      authStorage.setUser(user);

      console.log("Login successful, redirecting to dashboard");
      router.push("/dashboard");
    }
  }, [loginMutation.isSuccess, loginMutation.data, router]);

  const onSubmit = async (data: LoginFormData) => {
    loginMutation.mutate({
      email: data.email,
      password: data.password,
      rememberMe: data.remember,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          name="remember"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm text-foreground cursor-pointer">
                  Ghi nhớ đăng nhập
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
        {loginMutation.error && (
          <div className="text-red-500 text-sm text-center">
            {loginMutation.error.message || "Đăng nhập thất bại"}
          </div>
        )}
        <Button
          type="submit"
          className="w-full h-11 text-base font-medium"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </form>
    </Form>
  );
}
