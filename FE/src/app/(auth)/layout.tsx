import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header isAuthenticated={false} />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
