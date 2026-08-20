from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
import aiosqlite

from app.database import get_db
from app.auth import get_current_user

router = APIRouter(prefix="/api/products", tags=["products"])


class ProductCreate(BaseModel):
    name: str
    category: str = ""
    subcategory: str = ""
    price: float = 0
    originalPrice: Optional[float] = None
    image: str = ""
    rating: float = 5.0
    reviews: int = 0
    volume: str = ""
    brand: str = ""
    description: str = ""
    inStock: bool = True
    featured: bool = False
    discount: Optional[str] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    price: Optional[float] = None
    originalPrice: Optional[float] = None
    image: Optional[str] = None
    rating: Optional[float] = None
    reviews: Optional[int] = None
    volume: Optional[str] = None
    brand: Optional[str] = None
    description: Optional[str] = None
    inStock: Optional[bool] = None
    featured: Optional[bool] = None
    discount: Optional[str] = None


def row_to_product(r) -> dict:
    return {
        "id": r["id"],
        "name": r["name"],
        "category": r["category"],
        "subcategory": r["subcategory"],
        "price": r["price"],
        "originalPrice": r["original_price"],
        "image": r["image"],
        "rating": r["rating"],
        "reviews": r["reviews"],
        "volume": r["volume"],
        "brand": r["brand"],
        "description": r["description"],
        "inStock": bool(r["in_stock"]),
        "featured": bool(r["featured"]),
        "discount": r["discount"],
    }


@router.get("/lite")
async def get_products(db: aiosqlite.Connection = Depends(get_db)):
    cursor = await db.execute("SELECT * FROM products ORDER BY id")
    rows = await cursor.fetchall()
    return [row_to_product(r) for r in rows]


@router.get("/{product_id}")
async def get_product(product_id: int, db: aiosqlite.Connection = Depends(get_db)):
    cursor = await db.execute("SELECT * FROM products WHERE id = ?", (product_id,))
    row = await cursor.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return row_to_product(row)


@router.post("")
async def create_product(
    p: ProductCreate,
    db: aiosqlite.Connection = Depends(get_db),
    _user: dict = Depends(get_current_user),
):
    cursor = await db.execute(
        """INSERT INTO products (name, category, subcategory, price, original_price, image,
           rating, reviews, volume, brand, description, in_stock, featured, discount)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (p.name, p.category, p.subcategory, p.price, p.originalPrice, p.image,
         p.rating, p.reviews, p.volume, p.brand, p.description,
         int(p.inStock), int(p.featured), p.discount)
    )
    await db.commit()
    return {"id": cursor.lastrowid, "ok": True}


@router.put("/{product_id}")
async def update_product(
    product_id: int,
    p: ProductUpdate,
    db: aiosqlite.Connection = Depends(get_db),
    _user: dict = Depends(get_current_user),
):
    updates = []
    values = []
    field_map = {
        "name": "name", "category": "category", "subcategory": "subcategory",
        "price": "price", "originalPrice": "original_price", "image": "image",
        "rating": "rating", "reviews": "reviews", "volume": "volume",
        "brand": "brand", "description": "description", "discount": "discount",
    }
    data = p.model_dump(exclude_unset=True)
    for py_field, db_field in field_map.items():
        if py_field in data:
            updates.append(f"{db_field} = ?")
            values.append(data[py_field])
    if "inStock" in data:
        updates.append("in_stock = ?")
        values.append(int(data["inStock"]))
    if "featured" in data:
        updates.append("featured = ?")
        values.append(int(data["featured"]))
    if not updates:
        return {"ok": True}
    values.append(product_id)
    await db.execute(f"UPDATE products SET {', '.join(updates)} WHERE id = ?", values)
    await db.commit()
    return {"ok": True}


@router.delete("/{product_id}")
async def delete_product(
    product_id: int,
    db: aiosqlite.Connection = Depends(get_db),
    _user: dict = Depends(get_current_user),
):
    await db.execute("DELETE FROM products WHERE id = ?", (product_id,))
    await db.commit()
    return {"ok": True}
