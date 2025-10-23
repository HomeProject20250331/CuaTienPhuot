import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Chào mừng bạn trở lại!</p>
        </div>
        <Button>Tạo nhóm mới</Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng nhóm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">+1 từ tháng trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Chi tiêu tháng này
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,500,000 VNĐ</div>
            <p className="text-xs text-muted-foreground">+10% từ tháng trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Công nợ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">150,000 VNĐ</div>
            <p className="text-xs text-muted-foreground">Cần thanh toán</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Nhóm gần đây</CardTitle>
            <CardDescription>Các nhóm bạn đang tham gia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold">T</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Trip Đà Nẵng</p>
                  <p className="text-sm text-gray-600">
                    5 thành viên • 2,500,000 VNĐ
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold">H</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Hà Nội Food Tour</p>
                  <p className="text-sm text-gray-600">
                    3 thành viên • 800,000 VNĐ
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chi tiêu gần đây</CardTitle>
            <CardDescription>Các giao dịch mới nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Ăn tối tại nhà hàng</p>
                  <p className="text-sm text-gray-600">Trip Đà Nẵng</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">500,000 VNĐ</p>
                  <p className="text-sm text-gray-600">Hôm qua</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Taxi sân bay</p>
                  <p className="text-sm text-gray-600">Trip Đà Nẵng</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">200,000 VNĐ</p>
                  <p className="text-sm text-gray-600">2 ngày trước</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
