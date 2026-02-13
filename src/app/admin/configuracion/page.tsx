"use client";

import { useState } from "react";
import { useSiteConfig, BannerItem } from "@/context/SiteConfigContext";
import { useAuth, AdminUser } from "@/context/AuthContext";
import { Upload, Trash2, GripVertical, Eye, EyeOff, Plus, X, Save, UserPlus, Pencil, Image, Users, FileText } from "lucide-react";
import { api } from "@/lib/api";

type Tab = "banners" | "users" | "footer";

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState<Tab>("banners");

  const tabs: { id: Tab; label: string; icon: typeof Image }[] = [
    { id: "banners", label: "Banners", icon: Image },
    { id: "footer", label: "Info del sitio", icon: FileText },
    { id: "users", label: "Usuarios", icon: Users },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-[#222] pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === tab.id
                ? "bg-[#c9a84c]/20 text-[#c9a84c]"
                : "text-[#888] hover:text-white hover:bg-white/5"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "banners" && <BannersTab />}
      {activeTab === "footer" && <FooterTab />}
      {activeTab === "users" && <UsersTab />}
    </div>
  );
}

function BannersTab() {
  const { banners, setBanners, refreshBanners } = useSiteConfig();

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        await api.createBanner(reader.result as string, true, banners.length);
        await refreshBanners();
      } catch {}
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleUrlAdd = async () => {
    const url = prompt("Ingresa la URL de la imagen del banner:");
    if (!url) return;
    try {
      await api.createBanner(url, true, banners.length);
      await refreshBanners();
    } catch {}
  };

  const toggleBanner = async (id: string) => {
    const banner = banners.find((b) => b.id === id);
    if (!banner) return;
    try {
      await api.updateBanner(Number(id), { active: !banner.active });
      setBanners(banners.map((b) => (b.id === id ? { ...b, active: !b.active } : b)));
    } catch {}
  };

  const deleteBanner = async (id: string) => {
    if (!confirm("¿Eliminar este banner?")) return;
    try {
      await api.deleteBanner(Number(id));
      setBanners(banners.filter((b) => b.id !== id));
    } catch {}
  };

  const moveBanner = async (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= banners.length) return;
    const updated = [...banners];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    const reordered = updated.map((b, i) => ({ ...b, order: i }));
    setBanners(reordered);
    for (const b of reordered) {
      await api.updateBanner(Number(b.id), { order: b.order }).catch(() => {});
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#dfc070] text-black font-bold px-4 py-2 rounded-lg text-sm cursor-pointer transition-colors">
          <Upload size={16} />
          Subir imagen
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
        <button
          onClick={handleUrlAdd}
          className="flex items-center gap-2 bg-[#222] hover:bg-[#333] text-white px-4 py-2 rounded-lg text-sm cursor-pointer transition-colors border border-[#333]"
        >
          <Plus size={16} />
          Agregar URL
        </button>
      </div>

      <div className="space-y-3">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`bg-[#111] border rounded-xl p-3 flex items-center gap-3 transition-colors ${
              banner.active ? "border-[#222]" : "border-[#222] opacity-50"
            }`}
          >
            <div className="flex flex-col gap-1">
              <button
                onClick={() => moveBanner(index, -1)}
                disabled={index === 0}
                className="text-[#666] hover:text-white disabled:opacity-30 cursor-pointer text-xs"
              >
                ▲
              </button>
              <GripVertical size={16} className="text-[#444]" />
              <button
                onClick={() => moveBanner(index, 1)}
                disabled={index === banners.length - 1}
                className="text-[#666] hover:text-white disabled:opacity-30 cursor-pointer text-xs"
              >
                ▼
              </button>
            </div>

            <div className="w-40 h-16 rounded-lg overflow-hidden bg-[#1a1a1a] flex-shrink-0">
              <img src={banner.image} alt={`Banner ${index + 1}`} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 text-sm text-[#888] truncate">
              Banner {index + 1}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleBanner(banner.id)}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  banner.active
                    ? "text-green-400 hover:bg-green-400/10"
                    : "text-[#666] hover:bg-white/10"
                }`}
              >
                {banner.active ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
              <button
                onClick={() => deleteBanner(banner.id)}
                className="p-2 rounded-lg text-[#666] hover:text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {banners.length === 0 && (
          <div className="text-center text-[#666] py-12">No hay banners. Sube una imagen para empezar.</div>
        )}
      </div>
    </div>
  );
}

function FooterTab() {
  const { footerConfig, setFooterConfig } = useSiteConfig();
  const [form, setForm] = useState(footerConfig);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setFooterConfig(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addCity = () => {
    const city = prompt("Nombre de la ciudad:");
    if (!city) return;
    setForm({ ...form, cities: [...form.cities, city] });
  };

  const removeCity = (index: number) => {
    setForm({ ...form, cities: form.cities.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <label className="block text-sm text-[#888] mb-2 font-medium">Descripción del sitio</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={2}
          className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c] resize-none"
        />
      </div>

      <div>
        <label className="block text-sm text-[#888] mb-2 font-medium">Ciudades</label>
        <div className="space-y-2">
          {form.cities.map((city, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={city}
                onChange={(e) => {
                  const updated = [...form.cities];
                  updated[i] = e.target.value;
                  setForm({ ...form, cities: updated });
                }}
                className="flex-1 bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]"
              />
              <button
                onClick={() => removeCity(i)}
                className="p-2 text-[#666] hover:text-red-400 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          <button
            onClick={addCity}
            className="flex items-center gap-2 text-sm text-[#c9a84c] hover:text-[#dfc070] cursor-pointer"
          >
            <Plus size={14} />
            Agregar ciudad
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm text-[#888] mb-2 font-medium">Horario</label>
        <input
          type="text"
          value={form.schedule}
          onChange={(e) => setForm({ ...form, schedule: e.target.value })}
          className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c] mb-2"
        />
        <input
          type="text"
          value={form.scheduleSub}
          onChange={(e) => setForm({ ...form, scheduleSub: e.target.value })}
          placeholder="Subtítulo (ej: Todos los días del año)"
          className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]"
        />
      </div>

      <div>
        <label className="block text-sm text-[#888] mb-2 font-medium">WhatsApp</label>
        <input
          type="text"
          value={form.whatsapp}
          onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
          className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]"
        />
      </div>

      <button
        onClick={handleSave}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
          saved
            ? "bg-green-500 text-white"
            : "bg-[#c9a84c] hover:bg-[#dfc070] text-black"
        }`}
      >
        <Save size={16} />
        {saved ? "¡Guardado!" : "Guardar cambios"}
      </button>
    </div>
  );
}

function UsersTab() {
  const { users, addUser, updateUser, deleteUser, currentUser } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "editor">("editor");
  const [error, setError] = useState("");

  const handleCreate = async () => {
    setError("");
    if (!newUsername || !newPassword) {
      setError("Completa todos los campos");
      return;
    }
    const success = await addUser(newUsername, newPassword, newRole);
    if (!success) {
      setError("El nombre de usuario ya existe");
      return;
    }
    setNewUsername("");
    setNewPassword("");
    setNewRole("editor");
    setShowForm(false);
  };

  const handleUpdate = async () => {
    if (!editingUser) return;
    const data: Partial<AdminUser> & { password?: string } = {};
    if (newUsername) data.username = newUsername;
    if (newPassword) data.password = newPassword;
    data.role = newRole;
    await updateUser(editingUser.id, data);
    setEditingUser(null);
    setNewUsername("");
    setNewPassword("");
  };

  return (
    <div className="space-y-4 max-w-lg">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#888]">{users.length} usuario(s)</span>
        <button
          onClick={() => {
            setEditingUser(null);
            setNewUsername("");
            setNewPassword("");
            setNewRole("editor");
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#dfc070] text-black font-bold px-4 py-2 rounded-lg text-sm cursor-pointer transition-colors"
        >
          <UserPlus size={16} />
          Nuevo usuario
        </button>
      </div>

      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-[#111] border border-[#222] rounded-xl p-3 flex items-center justify-between"
          >
            <div>
              <div className="text-white font-medium text-sm">{user.username}</div>
              <div className="text-xs text-[#666]">
                {user.role === "admin" ? "Administrador" : "Editor"} · Creado {new Date(user.createdAt).toLocaleDateString("es-CO")}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setEditingUser(user);
                  setNewUsername(user.username);
                  setNewPassword("");
                  setNewRole(user.role);
                  setShowForm(true);
                }}
                className="p-2 rounded-lg text-[#666] hover:text-[#c9a84c] hover:bg-white/5 cursor-pointer transition-colors"
              >
                <Pencil size={15} />
              </button>
              {user.id !== currentUser?.id && (
                <button
                  onClick={() => {
                    if (confirm(`¿Eliminar a ${user.username}?`)) deleteUser(user.id);
                  }}
                  className="p-2 rounded-lg text-[#666] hover:text-red-400 hover:bg-red-400/10 cursor-pointer transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[320] flex items-center justify-center bg-black/70">
          <div className="bg-[#111] border border-[#c9a84c]/20 rounded-xl w-full max-w-sm mx-4 p-4 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-bold">{editingUser ? "Editar usuario" : "Nuevo usuario"}</h3>
              <button onClick={() => { setShowForm(false); setEditingUser(null); }} className="text-[#666] hover:text-white cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div>
              <label className="block text-xs text-[#888] mb-1">Usuario</label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#888] mb-1">
                {editingUser ? "Nueva contraseña (dejar vacío para no cambiar)" : "Contraseña"}
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#888] mb-1">Rol</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as "admin" | "editor")}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c] cursor-pointer"
              >
                <option value="admin">Administrador</option>
                <option value="editor">Editor</option>
              </select>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setShowForm(false); setEditingUser(null); }}
                className="flex-1 bg-[#222] hover:bg-[#333] text-white py-2.5 rounded-lg text-sm cursor-pointer transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={editingUser ? handleUpdate : handleCreate}
                className="flex-1 bg-[#c9a84c] hover:bg-[#dfc070] text-black font-bold py-2.5 rounded-lg text-sm cursor-pointer transition-colors"
              >
                {editingUser ? "Guardar" : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
