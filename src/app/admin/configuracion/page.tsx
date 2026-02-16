"use client";

import { useState } from "react";
import { useSiteConfig, BannerItem } from "@/context/SiteConfigContext";
import { useAuth, AdminUser } from "@/context/AuthContext";
import { Upload, Trash2, GripVertical, Eye, EyeOff, Plus, X, Save, UserPlus, Pencil, Image, Users, FileText, FolderTree, Ticket } from "lucide-react";
import { api, CategoryAPI, CouponAPI } from "@/lib/api";
import { useCategories } from "@/context/CategoriesContext";

type Tab = "banners" | "users" | "footer" | "categories" | "coupons";

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState<Tab>("banners");

  const tabs: { id: Tab; label: string; icon: typeof Image }[] = [
    { id: "banners", label: "Banners", icon: Image },
    { id: "categories", label: "Categor\u00edas", icon: FolderTree },
    { id: "footer", label: "Info del sitio", icon: FileText },
    { id: "users", label: "Usuarios", icon: Users },
    { id: "coupons", label: "Cupones", icon: Ticket },
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
      {activeTab === "categories" && <CategoriesTab />}
      {activeTab === "footer" && <FooterTab />}
      {activeTab === "users" && <UsersTab />}
      {activeTab === "coupons" && <CouponsTab />}
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

function CategoriesTab() {
  const { categories, refresh } = useCategories();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CategoryAPI | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", subcategories: [] as string[], image: "" });
  const [newSub, setNewSub] = useState("");
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", slug: "", subcategories: [], image: "" });
    setNewSub("");
    setShowForm(true);
  };

  const openEdit = (cat: CategoryAPI) => {
    setEditing(cat);
    setForm({ name: cat.name, slug: cat.slug, subcategories: [...cat.subcategories], image: cat.image });
    setNewSub("");
    setShowForm(true);
  };

  const handleSlug = (name: string) => {
    return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (val: string) => {
    setForm({ ...form, name: val, slug: handleSlug(val) });
  };

  const addSubcategory = () => {
    const trimmed = newSub.trim();
    if (!trimmed || form.subcategories.includes(trimmed)) return;
    setForm({ ...form, subcategories: [...form.subcategories, trimmed] });
    setNewSub("");
  };

  const removeSubcategory = (index: number) => {
    setForm({ ...form, subcategories: form.subcategories.filter((_, i) => i !== index) });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSave = async () => {
    if (!form.name) { alert("El nombre es obligatorio"); return; }
    setSaving(true);
    try {
      if (editing) {
        await api.updateCategory(editing.id, { name: form.name, slug: form.slug, subcategories: form.subcategories, image: form.image });
      } else {
        await api.createCategory({ name: form.name, slug: form.slug, subcategories: form.subcategories, image: form.image });
      }
      await refresh();
      setShowForm(false);
    } catch (err) {
      alert("Error al guardar");
    }
    setSaving(false);
  };

  const handleDelete = async (cat: CategoryAPI) => {
    if (!confirm(`¿Eliminar la categoría "${cat.name}"? Los productos que la usen quedarán sin categoría.`)) return;
    try {
      await api.deleteCategory(cat.id);
      await refresh();
    } catch { alert("Error al eliminar"); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#888]">{categories.length} categoría(s)</span>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#dfc070] text-black font-bold px-4 py-2 rounded-lg text-sm cursor-pointer transition-colors"
        >
          <Plus size={16} />
          Nueva categoría
        </button>
      </div>

      <div className="space-y-2">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-[#111] border border-[#222] rounded-xl p-3 flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#1a1a1a] flex-shrink-0">
              {cat.image ? (
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/80x80/111/c9a84c?text=${encodeURIComponent(cat.name.charAt(0))}`; }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#c9a84c] text-lg font-bold">
                  {cat.name.charAt(0)}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-white font-medium text-sm">{cat.name}</div>
              <div className="text-xs text-[#666] truncate">
                /{cat.slug} · {cat.subcategories.length} sub
              </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => openEdit(cat)}
                className="p-2 rounded-lg text-[#666] hover:text-[#c9a84c] hover:bg-white/5 cursor-pointer transition-colors"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => handleDelete(cat)}
                className="p-2 rounded-lg text-[#666] hover:text-red-400 hover:bg-red-400/10 cursor-pointer transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[320] flex items-center justify-center bg-black/70">
          <div className="bg-[#111] border border-[#c9a84c]/20 rounded-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-[#222]">
              <h3 className="text-white font-bold">{editing ? "Editar categoría" : "Nueva categoría"}</h3>
              <button onClick={() => setShowForm(false)} className="text-[#666] hover:text-white cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs text-[#888] mb-1">Nombre</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#888] mb-1">Slug (URL)</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#888] mb-1">Imagen</label>
                {form.image && (
                  <div className="w-16 h-16 rounded bg-[#1a1a1a] overflow-hidden mb-2">
                    <img src={form.image} alt="Preview" className="w-full h-full object-contain" />
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.image.startsWith("data:") ? "(imagen subida)" : form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="URL de imagen o sube un archivo"
                    className="flex-1 bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]"
                    readOnly={form.image.startsWith("data:")}
                  />
                  <label className="flex items-center gap-1 bg-[#222] hover:bg-[#333] border border-[#333] rounded-lg px-3 py-2 text-[#aaa] text-sm cursor-pointer transition-colors">
                    <Upload size={14} />
                    <span>Subir</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#888] mb-1">Subcategorías</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.subcategories.map((sub, i) => (
                    <span key={i} className="flex items-center gap-1 bg-[#1a1a1a] border border-[#333] rounded-full px-3 py-1 text-xs text-white">
                      {sub}
                      <button
                        type="button"
                        onClick={() => removeSubcategory(i)}
                        className="text-[#666] hover:text-red-400 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSub}
                    onChange={(e) => setNewSub(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSubcategory(); } }}
                    placeholder="Nueva subcategoría..."
                    className="flex-1 bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]"
                  />
                  <button
                    type="button"
                    onClick={addSubcategory}
                    className="bg-[#222] hover:bg-[#333] border border-[#333] rounded-lg px-3 py-2 text-[#c9a84c] text-sm cursor-pointer transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-[#222] hover:bg-[#333] text-white py-2.5 rounded-lg text-sm cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-[#c9a84c] hover:bg-[#dfc070] text-black font-bold py-2.5 rounded-lg text-sm cursor-pointer transition-colors disabled:opacity-50"
                >
                  {saving ? "Guardando..." : editing ? "Guardar" : "Crear"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CouponsTab() {
  const [coupons, setCoupons] = useState<CouponAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [formError, setFormError] = useState("");

  const loadCoupons = async () => {
    try {
      const data = await api.getCoupons();
      setCoupons(data);
    } catch {}
    setLoading(false);
  };

  useState(() => { loadCoupons(); });

  const handleSaveCoupon = async () => {
    const trimmedCode = code.trim().toUpperCase();
    if (!trimmedCode) { setFormError("Ingresa un código"); return; }
    const pct = parseInt(discount);
    if (!pct || pct < 1 || pct > 100) { setFormError("El descuento debe ser entre 1% y 100%"); return; }
    const dup = coupons.findIndex((c, i) => c.code.toUpperCase() === trimmedCode && i !== editIndex);
    if (dup >= 0) { setFormError("Ya existe un cupón con ese código"); return; }

    setFormError("");
    setSaving(true);
    const updated = [...coupons];
    if (editIndex !== null) {
      updated[editIndex] = { ...updated[editIndex], code: trimmedCode, discount: pct };
    } else {
      updated.push({ code: trimmedCode, discount: pct, active: true });
    }
    try {
      await api.setCoupons(updated);
      setCoupons(updated);
      setShowForm(false);
      setEditIndex(null);
      setCode("");
      setDiscount("");
    } catch { setFormError("Error al guardar"); }
    setSaving(false);
  };

  const toggleCoupon = async (index: number) => {
    const updated = [...coupons];
    updated[index] = { ...updated[index], active: !updated[index].active };
    try {
      await api.setCoupons(updated);
      setCoupons(updated);
    } catch {}
  };

  const deleteCoupon = async (index: number) => {
    if (!confirm(`¿Eliminar el cupón "${coupons[index].code}"?`)) return;
    const updated = coupons.filter((_, i) => i !== index);
    try {
      await api.setCoupons(updated);
      setCoupons(updated);
    } catch {}
  };

  const openEditCoupon = (index: number) => {
    setEditIndex(index);
    setCode(coupons[index].code);
    setDiscount(String(coupons[index].discount));
    setFormError("");
    setShowForm(true);
  };

  const openCreateCoupon = () => {
    setEditIndex(null);
    setCode("");
    setDiscount("");
    setFormError("");
    setShowForm(true);
  };

  if (loading) return <div className="text-center text-[#888] py-12">Cargando cupones...</div>;

  return (
    <div className="space-y-4 max-w-lg">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#888]">{coupons.length} cupón(es)</span>
        <button
          onClick={openCreateCoupon}
          className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#dfc070] text-black font-bold px-4 py-2 rounded-lg text-sm cursor-pointer transition-colors"
        >
          <Plus size={16} />
          Nuevo cupón
        </button>
      </div>

      <div className="space-y-2">
        {coupons.map((coupon, index) => (
          <div
            key={index}
            className={`bg-[#111] border rounded-xl p-3 flex items-center justify-between transition-colors ${
              coupon.active ? "border-[#222]" : "border-[#222] opacity-50"
            }`}
          >
            <div>
              <div className="text-white font-mono font-bold text-sm tracking-wider">{coupon.code}</div>
              <div className="text-xs text-[#c9a84c] font-medium">{coupon.discount}% de descuento</div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => toggleCoupon(index)}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  coupon.active ? "text-green-400 hover:bg-green-400/10" : "text-[#666] hover:bg-white/10"
                }`}
              >
                {coupon.active ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
              <button
                onClick={() => openEditCoupon(index)}
                className="p-2 rounded-lg text-[#666] hover:text-[#c9a84c] hover:bg-white/5 cursor-pointer transition-colors"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => deleteCoupon(index)}
                className="p-2 rounded-lg text-[#666] hover:text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}

        {coupons.length === 0 && (
          <div className="text-center text-[#666] py-12">No hay cupones. Crea uno para empezar.</div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[320] flex items-center justify-center bg-black/70">
          <div className="bg-[#111] border border-[#c9a84c]/20 rounded-xl w-full max-w-sm mx-4 p-4 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-bold">{editIndex !== null ? "Editar cupón" : "Nuevo cupón"}</h3>
              <button onClick={() => setShowForm(false)} className="text-[#666] hover:text-white cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div>
              <label className="block text-xs text-[#888] mb-1">Código del cupón</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Ej: DESCUENTO10"
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm font-mono tracking-wider focus:outline-none focus:border-[#c9a84c] uppercase"
              />
            </div>

            <div>
              <label className="block text-xs text-[#888] mb-1">Descuento (%)</label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="10"
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 pr-8 text-white text-sm focus:outline-none focus:border-[#c9a84c]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] text-sm">%</span>
              </div>
            </div>

            {formError && <p className="text-red-400 text-sm">{formError}</p>}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 bg-[#222] hover:bg-[#333] text-white py-2.5 rounded-lg text-sm cursor-pointer transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveCoupon}
                disabled={saving}
                className="flex-1 bg-[#c9a84c] hover:bg-[#dfc070] text-black font-bold py-2.5 rounded-lg text-sm cursor-pointer transition-colors disabled:opacity-50"
              >
                {saving ? "Guardando..." : editIndex !== null ? "Guardar" : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
