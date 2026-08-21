from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Optional
import aiosqlite
import json

from app.database import get_db
from app.auth import get_current_user

router = APIRouter(prefix="/api/abandoned-carts", tags=["abandoned-carts"])


class CartItem(BaseModel):
    productId: Optional[int] = None
    name: str
    quantity: int
    price: float


class CartSave(BaseModel):
    clientName: str = ""
    phone: str
    city: str = ""
    address: str = ""
    items: List[CartItem]
    total: float


def row_to_cart(r) -> dict:
    return {
        "id": r["id"],
        "clientName": r["client_name"],
        "phone": r["phone"],
        "city": r["city"],
        "address": r["address"],
        "total": r["total"],
        "recovered": bool(r["recovered"]),
        "createdAt": r["created_at"],
        "updatedAt": r["updated_at"],
        "items": json.loads(r["items"]),
    }


@router.post("")
async def save_cart(c: CartSave, db: aiosqlite.Connection = Depends(get_db)):
    items_json = json.dumps([item.model_dump() for item in c.items])
    cursor = await db.execute(
        "SELECT id FROM abandoned_carts WHERE phone = ? AND recovered = 0",
        (c.phone,),
    )
    row = await cursor.fetchone()
    if row:
        await db.execute(
            """UPDATE abandoned_carts
               SET client_name = ?, city = ?, address = ?, items = ?, total = ?,
                   updated_at = datetime('now'), notified = 0
               WHERE id = ?""",
            (c.clientName, c.city, c.address, items_json, c.total, row["id"]),
        )
        cart_id = row["id"]
    else:
        cursor = await db.execute(
            """INSERT INTO abandoned_carts (client_name, phone, city, address, items, total)
               VALUES (?, ?, ?, ?, ?, ?)""",
            (c.clientName, c.phone, c.city, c.address, items_json, c.total),
        )
        cart_id = cursor.lastrowid
    await db.commit()
    return {"id": cart_id, "ok": True}


@router.get("")
async def get_carts(
    db: aiosqlite.Connection = Depends(get_db),
    _user: dict = Depends(get_current_user),
):
    cursor = await db.execute(
        "SELECT * FROM abandoned_carts WHERE recovered = 0 ORDER BY updated_at DESC"
    )
    rows = await cursor.fetchall()
    return [row_to_cart(r) for r in rows]


@router.delete("/{cart_id}")
async def delete_cart(
    cart_id: int,
    db: aiosqlite.Connection = Depends(get_db),
    _user: dict = Depends(get_current_user),
):
    await db.execute("DELETE FROM abandoned_carts WHERE id = ?", (cart_id,))
    await db.commit()
    return {"ok": True}
