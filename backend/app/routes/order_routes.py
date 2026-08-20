from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import aiosqlite
import json
import secrets

from app.database import get_db
from app.auth import get_current_user

router = APIRouter(prefix="/api/orders", tags=["orders"])


class OrderItem(BaseModel):
    productId: Optional[int] = None
    name: str
    quantity: int
    price: float


class OrderCreate(BaseModel):
    clientName: str
    phone: str
    city: str
    address: str
    items: List[OrderItem]
    paymentMethod: str
    total: float
    notes: str = ""


class OrderStatusUpdate(BaseModel):
    status: str


def row_to_order(r) -> dict:
    return {
        "id": r["id"],
        "clientName": r["client_name"],
        "phone": r["phone"],
        "city": r["city"],
        "address": r["address"],
        "paymentMethod": r["payment_method"],
        "total": r["total"],
        "status": r["status"],
        "notes": r["notes"],
        "createdAt": r["created_at"],
        "items": json.loads(r["items"]),
    }


@router.get("")
async def get_orders(
    db: aiosqlite.Connection = Depends(get_db),
    _user: dict = Depends(get_current_user),
):
    cursor = await db.execute("SELECT * FROM orders ORDER BY created_at DESC")
    rows = await cursor.fetchall()
    return [row_to_order(r) for r in rows]


async def generate_order_id(db: aiosqlite.Connection) -> str:
    cursor = await db.execute("SELECT id FROM orders")
    used = {r["id"] for r in await cursor.fetchall()}
    free = [f"00{n:03d}" for n in range(1000) if f"00{n:03d}" not in used]
    if not free:
        raise HTTPException(status_code=500, detail="No se pudo generar el numero de pedido")
    return secrets.choice(free)


@router.post("")
async def create_order(o: OrderCreate, db: aiosqlite.Connection = Depends(get_db)):
    order_id = await generate_order_id(db)
    items_json = json.dumps([item.model_dump() for item in o.items])
    await db.execute(
        """INSERT INTO orders (id, client_name, phone, city, address, payment_method, total, notes, items)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (order_id, o.clientName, o.phone, o.city, o.address,
         o.paymentMethod, o.total, o.notes, items_json)
    )
    await db.commit()
    return {"id": order_id, "ok": True}


@router.put("/{order_id}/status")
async def update_order_status(
    order_id: str,
    req: OrderStatusUpdate,
    db: aiosqlite.Connection = Depends(get_db),
    _user: dict = Depends(get_current_user),
):
    await db.execute("UPDATE orders SET status = ? WHERE id = ?", (req.status, order_id))
    await db.commit()
    return {"ok": True}


@router.delete("/{order_id}")
async def delete_order(
    order_id: str,
    db: aiosqlite.Connection = Depends(get_db),
    _user: dict = Depends(get_current_user),
):
    await db.execute("DELETE FROM orders WHERE id = ?", (order_id,))
    await db.commit()
    return {"ok": True}
