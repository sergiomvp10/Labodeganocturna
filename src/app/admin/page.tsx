"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const { login, currentUser } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentUser) {
      router.push("/admin/productos");
    }
  }, [currentUser, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Ingresa usuario y contraseña");
      return;
    }
    const success = login(username, password);
    if (success) {
      router.push("/admin/productos");
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="La Bodega Nocturna" className="h-28 w-auto mb-4" />
          <h1 className="text-[#c9a84c] text-xl font-bold">Panel de Administración</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#111] border border-[#c9a84c]/20 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm text-[#aaa] mb-1.5">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c] transition-colors"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="block text-sm text-[#aaa] mb-1.5">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c] transition-colors pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-[#c9a84c] hover:bg-[#dfc070] text-black font-bold py-2.5 rounded-lg transition-colors cursor-pointer text-sm"
          >
            Iniciar Sesión
          </button>
        </form>

        <p className="text-center text-[#444] text-xs mt-6">
          La Bodega Nocturna &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
