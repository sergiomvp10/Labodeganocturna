from fastapi import APIRouter, Depends
from pydantic import BaseModel
import aiosqlite
import json

from app.database import get_db

router = APIRouter(prefix="/api/storefront", tags=["storefront"])


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


def row_to_banner(r) -> dict:
    return {
        "id": r["id"],
        "image": r["image"],
        "active": bool(r["active"]),
        "order": r["sort_order"],
    }


def row_to_category(r) -> dict:
    return {
        "id": r["id"],
        "name": r["name"],
        "slug": r["slug"],
        "subcategories": json.loads(r["subcategories"]),
        "image": r["image"],
    }


class CouponValidate(BaseModel):
    code: str


@router.get("/products")
async def storefront_products(db: aiosqlite.Connection = Depends(get_db)):
    cursor = await db.execute("SELECT * FROM products WHERE in_stock = 1 ORDER BY id")
    rows = await cursor.fetchall()
    return [row_to_product(r) for r in rows]


@router.get("/featured")
async def storefront_featured(db: aiosqlite.Connection = Depends(get_db)):
    cursor = await db.execute("SELECT value FROM config WHERE key = 'featured'")
    row = await cursor.fetchone()
    ids = json.loads(row["value"]) if row else []
    if not ids:
        cursor2 = await db.execute(
            "SELECT * FROM products WHERE featured = 1 AND in_stock = 1 ORDER BY id LIMIT 10"
        )
        rows = await cursor2.fetchall()
        return [row_to_product(r) for r in rows]
    placeholders = ",".join("?" for _ in ids)
    cursor2 = await db.execute(
        f"SELECT * FROM products WHERE id IN ({placeholders}) AND in_stock = 1", ids
    )
    rows = await cursor2.fetchall()
    return [row_to_product(r) for r in rows]


@router.get("/offers")
async def storefront_offers(db: aiosqlite.Connection = Depends(get_db)):
    cursor = await db.execute("SELECT value FROM config WHERE key = 'offers'")
    row = await cursor.fetchone()
    ids = json.loads(row["value"]) if row else []
    if not ids:
        cursor2 = await db.execute(
            "SELECT * FROM products WHERE original_price IS NOT NULL AND in_stock = 1 ORDER BY id LIMIT 10"
        )
        rows = await cursor2.fetchall()
        return [row_to_product(r) for r in rows]
    placeholders = ",".join("?" for _ in ids)
    cursor2 = await db.execute(
        f"SELECT * FROM products WHERE id IN ({placeholders}) AND in_stock = 1", ids
    )
    rows = await cursor2.fetchall()
    return [row_to_product(r) for r in rows]


@router.get("/cart-suggestions")
async def storefront_cart_suggestions(db: aiosqlite.Connection = Depends(get_db)):
    cursor = await db.execute("SELECT value FROM config WHERE key = 'cart_suggestions'")
    row = await cursor.fetchone()
    ids = json.loads(row["value"]) if row else []
    if not ids:
        return []
    placeholders = ",".join("?" for _ in ids)
    cursor2 = await db.execute(
        f"SELECT * FROM products WHERE id IN ({placeholders}) AND in_stock = 1", ids
    )
    rows = await cursor2.fetchall()
    products = {r["id"]: row_to_product(r) for r in rows}
    return [products[i] for i in ids if i in products]


@router.get("/banners")
async def storefront_banners(db: aiosqlite.Connection = Depends(get_db)):
    cursor = await db.execute("SELECT * FROM banners WHERE active = 1 ORDER BY sort_order")
    rows = await cursor.fetchall()
    return [row_to_banner(r) for r in rows]


@router.get("/footer")
async def storefront_footer(db: aiosqlite.Connection = Depends(get_db)):
    cursor = await db.execute("SELECT value FROM config WHERE key = 'footer'")
    row = await cursor.fetchone()
    if row:
        return json.loads(row["value"])
    return {
        "cities": ["Duitama", "Tunja", "Sogamoso"],
        "schedule": "Abierto 23 horas al dia",
        "scheduleSub": "Todos los dias del ano",
        "whatsapp": "+57 311 226 0769",
        "description": "Tu licoreria de confianza con servicio a domicilio 23 horas al dia.",
    }


@router.get("/categories")
async def storefront_categories(db: aiosqlite.Connection = Depends(get_db)):
    cursor = await db.execute("SELECT * FROM categories ORDER BY id")
    rows = await cursor.fetchall()
    return [row_to_category(r) for r in rows]


@router.post("/validate-coupon")
async def validate_coupon(req: CouponValidate, db: aiosqlite.Connection = Depends(get_db)):
    cursor = await db.execute("SELECT value FROM config WHERE key = 'coupons'")
    row = await cursor.fetchone()
    coupons = json.loads(row["value"]) if row else []
    for c in coupons:
        if c["code"].upper() == req.code.upper() and c.get("active", True):
            return {"valid": True, "discount": c["discount"], "code": c["code"]}
    return {"valid": False, "discount": 0, "code": req.code}
