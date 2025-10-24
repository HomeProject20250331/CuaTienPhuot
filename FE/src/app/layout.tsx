import { QueryProvider } from "@/lib/api";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CuaTienPhuot - Chia tiền du lịch thông minh",
  description: "Ứng dụng chia tiền chi tiêu nhóm du lịch dễ dàng và chính xác",
  keywords: ["chia tiền", "du lịch", "nhóm", "chi tiêu", "công nợ"],
  authors: [{ name: "CuaTienPhuot Team" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} font-sans antialiased`}>
        <QueryProvider>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">{children}</main>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
