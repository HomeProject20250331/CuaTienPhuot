import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-linear-to-br from-blue-50 to-indigo-100">
      <Header isAuthenticated={false} />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
              Chia tiền du lịch
              <span className="text-primary"> thông minh</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ứng dụng chia tiền chi tiêu nhóm du lịch dễ dàng và chính xác.
              Không còn lo lắng về việc tính toán chi phí khi đi du lịch cùng
              bạn bè.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={ROUTES.AUTH.REGISTER}>
                <Button size="lg" className="w-full sm:w-auto">
                  Bắt đầu ngay
                </Button>
              </Link>
              <Link href={ROUTES.AUTH.LOGIN}>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Đã có tài khoản?
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Chia tiền thông minh</CardTitle>
                <CardDescription>
                  Tự động tính toán và chia tiền theo nhiều cách khác nhau
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Hỗ trợ chia đều, chia theo tỷ lệ, chia theo món ăn và nhiều
                  cách khác.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quản lý nhóm</CardTitle>
                <CardDescription>
                  Tạo và quản lý nhóm du lịch một cách dễ dàng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Mời bạn bè tham gia, quản lý thành viên và theo dõi chi tiêu.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Báo cáo chi tiết</CardTitle>
                <CardDescription>
                  Xem thống kê và báo cáo chi tiết về chi tiêu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Biểu đồ trực quan, xuất báo cáo và theo dõi xu hướng chi tiêu.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
