"use client";

import { ReactNode, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import CityModal from "@/components/CityModal";
import AgeVerification from "@/components/AgeVerification";
import PromoBanner from "@/components/PromoBanner";
import FloatingSidebar from "@/components/FloatingSidebar";
import { AuthProvider } from "@/context/AuthContext";
import ProductPageClient from "@/app/producto/[id]/ProductPageClient";
import CategoryPage from "@/components/CategoryPage";

import AdminLoginPage from "@/app/admin/page";
import ProductosPage from "@/app/admin/productos/page";
import PedidosPage from "@/app/admin/pedidos/page";
import DestacadosPage from "@/app/admin/destacados/page";
import ConfiguracionPage from "@/app/admin/configuracion/page";
import {
  Package,
  ShoppingCart,
  Settings,
  Star,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
} from "lucide-react";

type AdminPage = "productos" | "pedidos" | "destacados" | "configuracion";

const PAGE_LABELS: Record<AdminPage, string> = {
  productos: "Productos",
  pedidos: "Pedidos",
  destacados: "Destacados / Ofertas",
  configuracion: "Configuración",
};

function AdminPanel() {
  const [currentUser, setCurrentUser] = useState<{ username: string; role: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState<AdminPage>("productos");
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("lbn_admin_session");
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    }
    setChecked(true);
  }, []);

  if (!checked) return null;

  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-[300] bg-[#0a0a0a]">
        <AuthProvider>
          <AdminLoginPage />
        </AuthProvider>
      </div>
    );
  }

  const navItems: { key: AdminPage; label: string; icon: typeof Package }[] = [
    { key: "productos", label: "Productos", icon: Package },
    { key: "pedidos", label: "Pedidos", icon: ShoppingCart },
    { key: "destacados", label: "Destacados / Ofertas", icon: Star },
    { key: "configuracion", label: "Configuración", icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem("lbn_admin_session");
    localStorage.removeItem("lbn_token");
    setCurrentUser(null);
  };

  const navigate = (key: AdminPage) => {
    setActivePage(key);
    setSidebarOpen(false);
  };

  let pageContent: ReactNode = null;
  if (activePage === "productos") pageContent = <ProductosPage />;
  else if (activePage === "pedidos") pageContent = <PedidosPage />;
  else if (activePage === "destacados") pageContent = <DestacadosPage />;
  else if (activePage === "configuracion") pageContent = <ConfiguracionPage />;

  return (
    <AuthProvider>
      <div className="fixed inset-0 z-[300] bg-[#0a0a0a] flex">
        <aside
          className={`fixed md:static inset-y-0 left-0 z-[310] w-64 bg-[#111] border-r border-[#c9a84c]/20 flex flex-col transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div className="p-4 border-b border-[#c9a84c]/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
              <span className="text-[#c9a84c] font-bold text-sm">Admin</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-[#999] hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            {navItems.map((item) => {
              const isActive = activePage === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => navigate(item.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${
                    isActive
                      ? "bg-[#c9a84c]/20 text-[#c9a84c]"
                      : "text-[#aaa] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="p-3 border-t border-[#c9a84c]/20">
            <div className="px-3 py-2 text-xs text-[#666] mb-2">
              {currentUser.username} ({currentUser.role})
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer"
            >
              <LogOut size={18} />
              Cerrar sesión
            </button>
            <button
              onClick={() => { window.location.href = "/"; }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#aaa] hover:bg-white/5 hover:text-white transition-colors cursor-pointer mt-1"
            >
              <LayoutDashboard size={18} />
              Ir a la tienda
            </button>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-[305] md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-14 bg-[#111] border-b border-[#c9a84c]/20 flex items-center px-4 gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-[#999] hover:text-white cursor-pointer"
            >
              <Menu size={22} />
            </button>
            <h1 className="text-white font-semibold text-lg">
              {PAGE_LABELS[activePage]}
            </h1>
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{pageContent}</main>
        </div>
      </div>
    </AuthProvider>
  );
}

export default function LayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  const productMatch = pathname?.match(/^\/producto\/(\d+)/);
  const productId = productMatch ? productMatch[1] : null;

  const categoryMatch = pathname?.match(/^\/categoria\/([a-z0-9-]+)/);
  const categorySlug = categoryMatch ? categoryMatch[1] : null;

  if (isAdmin) {
    return <AdminPanel />;
  }

  const isGracias = pathname === "/gracias";

  if (isGracias) {
    return <>{children}</>;
  }

  let content: ReactNode = children;
  if (productId) content = <ProductPageClient id={productId} />;
  else if (categorySlug) content = <CategoryPage slug={categorySlug} />;

  return (
    <>
      <AgeVerification />
      <Header />
      <FloatingSidebar />
      <main className="min-h-screen">{content}</main>
      <Footer />
      <PromoBanner />
      <div className="h-10" />
      <CartSidebar />
      <CityModal />
    </>
  );
}
