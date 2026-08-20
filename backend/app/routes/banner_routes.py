from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
import aiosqlite

from app.database import get_db
from app.auth import get_current_user

router = APIRouter(prefix="/api/banners", tags=["banners"])


class BannerCreate(BaseModel):
    image: str
    active: bool = True
    order: int = 0


class BannerUpdate(BaseModel):
    image: Optional[str] = None
    active: Optional[bool] = None
    order: Optional[int] = None


def row_to_banner(r) -> dict:
    return {
        "id": r["id"],
        "image": r["image"],
        "active": bool(r["active"]),
        "order": r["sort_order"],
    }


@router.get("")
async def get_banners(
    db: aiosqlite.Connection = Depends(get_db),
    _user: dict = Depends(get_current_user),
):
    cursor = await db.execute("SELECT * FROM banners ORDER BY sort_order")
    rows = await cursor.fetchall()
    return [row_to_banner(r) for r in rows]


@router.post("")
async def create_banner(
    b: BannerCreate,
    db: aiosqlite.Connection = Depends(get_db),
    _user: dict = Depends(get_current_user),
):
    cursor = await db.execute(
        "INSERT INTO banners (image, active, sort_order) VALUES (?, ?, ?)",
        (b.image, int(b.active), b.order)
    )
    await db.commit()
    return {"id": cursor.lastrowid, "ok": True}


@router.put("/{banner_id}")
async def update_banner(
    banner_id: int,
    b: BannerUpdate,
    db: aiosqlite.Connection = Depends(get_db),
    _user: dict = Depends(get_current_user),
):
    updates = []
    values = []
    if b.image is not None:
        updates.append("image = ?")
        values.append(b.image)
    if b.active is not None:
        updates.append("active = ?")
        values.append(int(b.active))
    if b.order is not None:
        updates.append("sort_order = ?")
        values.append(b.order)
    if not updates:
        return {"ok": True}
    values.append(banner_id)
    await db.execute(f"UPDATE banners SET {', '.join(updates)} WHERE id = ?", values)
    await db.commit()
    return {"ok": True}


@router.delete("/{banner_id}")
async def delete_banner(
    banner_id: int,
    db: aiosqlite.Connection = Depends(get_db),
    _user: dict = Depends(get_current_user),
):
    await db.execute("DELETE FROM banners WHERE id = ?", (banner_id,))
    await db.commit()
    return {"ok": True}
