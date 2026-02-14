"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { AuthProvider } from "@/context/AuthContext";
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

function AdminLayoutInner({ children }: { children: ReactNode }) {
  const { currentUser, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === "/admin" || pathname === "/admin/";

  useEffect(() => {
    if (!currentUser && !isLoginPage) {
      router.push("/admin");
    }
  }, [currentUser, isLoginPage, router]);

  if (isLoginPage) {
    return (
      <div className="fixed inset-0 z-[300] bg-[#0a0a0a]">
        {children}
      </div>
    );
  }

  if (!currentUser) return null;

  const navItems = [
    { href: "/admin/productos", label: "Productos", icon: Package },
    { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart },
    { href: "/admin/destacados", label: "Destacados / Ofertas", icon: Star },
    { href: "/admin/configuracion", label: "Configuración", icon: Settings },
  ];

  return (
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
            const isActive = pathname === item.href;
            return (
              <button
                key={item.href}
                onClick={() => {
                  router.push(item.href);
                  setSidebarOpen(false);
                }}
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
            onClick={() => {
              logout();
              router.push("/admin");
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
          <button
            onClick={() => router.push("/")}
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
            {navItems.find((n) => n.href === pathname)?.label || "Panel de Administración"}
          </h1>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AuthProvider>
  );
}
