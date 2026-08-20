from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List
import aiosqlite
import json

from app.database import get_db
from app.auth import get_current_user

router = APIRouter(prefix="/api/config", tags=["config"])


class FooterData(BaseModel):
    cities: List[str]
    schedule: str
    scheduleSub: str
    whatsapp: str
    description: str


class FeaturedIds(BaseModel):
    ids: List[int]


class OfferIds(BaseModel):
    ids: List[int]


class CartSuggestionIds(BaseModel):
    ids: List[int]


class CouponItem(BaseModel):
    code: str
    discount: float
    active: bool


class CouponsData(BaseModel):
    coupons: List[CouponItem]


async def get_config_value(db: aiosqlite.Connection, key: str) -> str:
    cursor = await db.execute("SELECT value FROM config WHERE key = ?", (key,))
    row = await cursor.fetchone()
    return row["value"] if row else "{}"


@router.get("/footer")
async def get_footer(
    db: aiosqlite.Connection = Depends(get_db),
    _user: dict = Depends(get_current_user),
):
    val = await get_config_value(db, "footer")
    return json.loads(val)


@router.put("/footer")
async def update_footer(
    f: FooterData,
    db: aiosqlite.Connection = Depends(get_db),
    _user: dict = Depends(get_current_user),
):
    await db.execute(
        "INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)",
        ("footer", json.dumps(f.model_dump()))
    )
    await db.commit()
    return {"ok": True}


@router.get("/featured")
async def get_featured(
    db: aiosqlite.Connection = Depends(get_db),
    _user: dict = Depends(get_current_user),
):
    val = await get_config_value(db, "featured")
    return json.loads(val)


@router.put("/featured")
async def set_featured(
    data: FeaturedIds,
    db: aiosqlite.Connection = Depends(get_db),
    _user: dict = Depends(get_current_user),
):
    await db.execute(
        "INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)",
        ("featured", json.dumps(data.ids))
    )
    await db.commit()
    return {"ok": True}


@router.get("/offers")
async def get_offers(
    db: aiosqlite.Connection = Depends(get_db),
    _user: dict = Depends(get_current_user),
):
    val = await get_config_value(db, "offers")
    return json.loads(val)


@router.put("/offers")
async def set_offers(
    data: OfferIds,
    db: aiosqlite.Connection = Depends(get_db),
    _user: dict = Depends(get_current_user),
):
    await db.execute(
        "INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)",
        ("offers", json.dumps(data.ids))
    )
    await db.commit()
    return {"ok": True}


@router.get("/cart-suggestions")
async def get_cart_suggestions(
    db: aiosqlite.Connection = Depends(get_db),
    _user: dict = Depends(get_current_user),
):
    val = await get_config_value(db, "cart_suggestions")
    data = json.loads(val)
    return data if isinstance(data, list) else []


@router.put("/cart-suggestions")
async def set_cart_suggestions(
    data: CartSuggestionIds,
    db: aiosqlite.Connection = Depends(get_db),
    _user: dict = Depends(get_current_user),
):
    await db.execute(
        "INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)",
        ("cart_suggestions", json.dumps(data.ids))
    )
    await db.commit()
    return {"ok": True}


@router.get("/coupons")
async def get_coupons(
    db: aiosqlite.Connection = Depends(get_db),
    _user: dict = Depends(get_current_user),
):
    val = await get_config_value(db, "coupons")
    return json.loads(val)


@router.put("/coupons")
async def set_coupons(
    data: CouponsData,
    db: aiosqlite.Connection = Depends(get_db),
    _user: dict = Depends(get_current_user),
):
    await db.execute(
        "INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)",
        ("coupons", json.dumps([c.model_dump() for c in data.coupons]))
    )
    await db.commit()
    return {"ok": True}
