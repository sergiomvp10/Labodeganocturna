from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import aiosqlite
import json

from app.database import get_db
from app.auth import get_current_user

router = APIRouter(prefix="/api/categories", tags=["categories"])


class CategoryCreate(BaseModel):
    name: str
    slug: str
    subcategories: List[str] = []
    image: str = ""


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    subcategories: Optional[List[str]] = None
    image: Optional[str] = None


def row_to_category(r) -> dict:
    return {
        "id": r["id"],
        "name": r["name"],
        "slug": r["slug"],
        "subcategories": json.loads(r["subcategories"]),
        "image": r["image"],
    }


@router.get("")
async def get_categories(
    db: aiosqlite.Connection = Depends(get_db),
    _user: dict = Depends(get_current_user),
):
    cursor = await db.execute("SELECT * FROM categories ORDER BY id")
    rows = await cursor.fetchall()
    return [row_to_category(r) for r in rows]


@router.post("")
async def create_category(
    c: CategoryCreate,
    db: aiosqlite.Connection = Depends(get_db),
    _user: dict = Depends(get_current_user),
):
    try:
        cursor = await db.execute(
            "INSERT INTO categories (name, slug, subcategories, image) VALUES (?, ?, ?, ?)",
            (c.name, c.slug, json.dumps(c.subcategories), c.image)
        )
        await db.commit()
        return {"id": cursor.lastrowid, "ok": True}
    except Exception:
        raise HTTPException(status_code=400, detail="La categoria ya existe")


@router.put("/{category_id}")
async def update_category(
    category_id: int,
    c: CategoryUpdate,
    db: aiosqlite.Connection = Depends(get_db),
    _user: dict = Depends(get_current_user),
):
    updates = []
    values = []
    data = c.model_dump(exclude_unset=True)
    if "name" in data:
        updates.append("name = ?")
        values.append(data["name"])
    if "slug" in data:
        updates.append("slug = ?")
        values.append(data["slug"])
    if "subcategories" in data:
        updates.append("subcategories = ?")
        values.append(json.dumps(data["subcategories"]))
    if "image" in data:
        updates.append("image = ?")
        values.append(data["image"])
    if not updates:
        return {"ok": True}
    values.append(category_id)
    await db.execute(f"UPDATE categories SET {', '.join(updates)} WHERE id = ?", values)
    await db.commit()
    return {"ok": True}


@router.delete("/{category_id}")
async def delete_category(
    category_id: int,
    db: aiosqlite.Connection = Depends(get_db),
    _user: dict = Depends(get_current_user),
):
    await db.execute("DELETE FROM categories WHERE id = ?", (category_id,))
    await db.commit()
    return {"ok": True}
