"use client";

import { useState, useEffect } from "react";
import { Product } from "@/data/products";
import { useCategories } from "@/context/CategoriesContext";
import { Plus, Pencil, Trash2, Search, X, Upload, ChevronDown, Loader2 } from "lucide-react";
import { api, ProductAPI } from "@/lib/api";

function toProduct(p: ProductAPI): Product {
  return { ...p, originalPrice: p.originalPrice ?? undefined, discount: p.discount ?? undefined };
}

export default function ProductosPage() {
  const { categories } = useCategories();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setError("");
      const data = await api.getProducts();
      setProducts(data.map(toProduct));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar productos");
    }
    setLoaded(true);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !categoryFilter || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      await api.deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch {}
  };

  const handleSave = async (product: Product) => {
    try {
      const payload: ProductAPI = {
        id: product.id,
        name: product.name,
        category: product.category,
        subcategory: product.subcategory,
        price: product.price,
        originalPrice: product.originalPrice || null,
        image: product.image,
        rating: product.rating,
        reviews: product.reviews,
        volume: product.volume,
        brand: product.brand,
        description: product.description,
        inStock: product.inStock,
        featured: product.featured || false,
        discount: product.discount || null,
      };
      if (editingProduct) {
        const updatePayload: Partial<ProductAPI> = { ...payload };
        if (payload.image && payload.image.startsWith("http")) {
          delete updatePayload.image;
        }
        await api.updateProduct(product.id, updatePayload);
      } else {
        await api.createProduct(payload);
      }
      await loadProducts();
    } catch {}
    setShowForm(false);
    setEditingProduct(null);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(price);

  if (!loaded) return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <Loader2 size={32} className="text-[#c9a84c] animate-spin" />
      <p className="text-[#888] text-sm">Cargando productos...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <p className="text-red-400 text-sm">{error}</p>
      <button onClick={loadProducts} className="text-[#c9a84c] text-sm hover:underline cursor-pointer">Reintentar</button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar producto..."
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg pl-9 pr-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]"
            />
          </div>
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c] appearance-none pr-8 cursor-pointer"
            >
              <option value="">Todas</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.name}>{c.name}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#666] pointer-events-none" />
          </div>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#dfc070] text-black font-bold px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
        >
          <Plus size={16} />
          Agregar producto
        </button>
      </div>

      <div className="text-[#666] text-sm">{filtered.length} productos</div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#222] text-[#888]">
              <th className="text-left py-3 px-2 font-medium">Imagen</th>
              <th className="text-left py-3 px-2 font-medium">Nombre</th>
              <th className="text-left py-3 px-2 font-medium hidden md:table-cell">Categoría</th>
              <th className="text-left py-3 px-2 font-medium">Precio</th>
              <th className="text-left py-3 px-2 font-medium hidden md:table-cell">Stock</th>
              <th className="text-right py-3 px-2 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id} className="border-b border-[#1a1a1a] hover:bg-white/[0.02] transition-colors">
                <td className="py-2 px-2">
                  <div className="w-10 h-10 rounded bg-[#1a1a1a] overflow-hidden flex-shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="py-2 px-2">
                  <div className="text-white font-medium">{product.name}</div>
                  <div className="text-[#666] text-xs">{product.brand} · {product.volume}</div>
                </td>
                <td className="py-2 px-2 text-[#aaa] hidden md:table-cell">{product.category}</td>
                <td className="py-2 px-2">
                  <div className="text-[#c9a84c] font-medium">{formatPrice(product.price)}</div>
                  {product.originalPrice && (
                    <div className="text-[#666] text-xs line-through">{formatPrice(product.originalPrice)}</div>
                  )}
                </td>
                <td className="py-2 px-2 hidden md:table-cell">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs ${product.inStock ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                    {product.inStock ? "Disponible" : "Agotado"}
                  </span>
                </td>
                <td className="py-2 px-2 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setShowForm(true);
                      }}
                      className="p-1.5 rounded hover:bg-white/10 text-[#aaa] hover:text-[#c9a84c] transition-colors cursor-pointer"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-1.5 rounded hover:bg-red-500/10 text-[#aaa] hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}

function ProductForm({
  product,
  onSave,
  onClose,
}: {
  product: Product | null;
  onSave: (p: Product) => void;
  onClose: () => void;
}) {
  const { categories } = useCategories();
  const [form, setForm] = useState<Product>(
    product || {
      id: 0,
      name: "",
      category: categories[0]?.name || "",
      subcategory: categories[0]?.subcategories[0] || "",
      price: 0,
      image: "",
      rating: 4.0,
      reviews: 0,
      volume: "750ml",
      brand: "",
      description: "",
      inStock: true,
    }
  );

  const selectedCategory = categories.find((c) => c.name === form.category);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.image) {
      alert("Nombre, precio e imagen son obligatorios");
      return;
    }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[320] flex items-center justify-center bg-black/70">
      <div className="bg-[#111] border border-[#c9a84c]/20 rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-[#222]">
          <h2 className="text-white font-bold">{product ? "Editar Producto" : "Nuevo Producto"}</h2>
          <button onClick={onClose} className="text-[#666] hover:text-white cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs text-[#888] mb-1">Nombre</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#888] mb-1">Categoría</label>
              <select
                value={form.category}
                onChange={(e) => {
                  const cat = categories.find((c) => c.name === e.target.value);
                  setForm({
                    ...form,
                    category: e.target.value,
                    subcategory: cat?.subcategories[0] || "",
                  });
                }}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c] cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-[#888] mb-1">Subcategoría</label>
              <select
                value={form.subcategory}
                onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c] cursor-pointer"
              >
                {selectedCategory?.subcategories.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-[#888] mb-1">Marca</label>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#888] mb-1">Volumen</label>
              <input
                type="text"
                value={form.volume}
                onChange={(e) => setForm({ ...form, volume: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#888] mb-1">Precio (COP)</label>
              <input
                type="number"
                value={form.price || ""}
                onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#888] mb-1">Precio original (opcional)</label>
              <input
                type="number"
                value={form.originalPrice || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    originalPrice: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs text-[#888] mb-1">Descripción</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c] resize-none"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs text-[#888] mb-1">Imagen</label>
              {form.image && (
                <div className="w-16 h-16 rounded bg-[#1a1a1a] overflow-hidden mb-2">
                  <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="URL de imagen o sube un archivo"
                  className="flex-1 bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]"
                />
                <label className="flex items-center gap-1 bg-[#222] hover:bg-[#333] border border-[#333] rounded-lg px-3 py-2 text-[#aaa] text-sm cursor-pointer transition-colors">
                  <Upload size={14} />
                  <span>Subir</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#888] mb-1">Rating</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) || 0 })}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]"
              />
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.inStock}
                  onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                  className="accent-[#c9a84c]"
                />
                <span className="text-sm text-[#aaa]">En stock</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-3 border-t border-[#222]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-[#222] hover:bg-[#333] text-white py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#c9a84c] hover:bg-[#dfc070] text-black font-bold py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
            >
              {product ? "Guardar cambios" : "Crear producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
