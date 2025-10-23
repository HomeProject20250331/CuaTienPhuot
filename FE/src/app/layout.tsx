import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
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
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="min-h-screen flex flex-col">
          <Header isAuthenticated={false} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
