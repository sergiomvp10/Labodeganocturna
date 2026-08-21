import asyncio
import json
import logging

import aiosqlite

from app.database import DB_PATH
from app.telegram import notify_abandoned_cart

logger = logging.getLogger(__name__)

# Un carrito se considera abandonado si el cliente dejo de tocarlo hace
# ABANDON_MINUTES y nunca completo el pedido.
ABANDON_MINUTES = 20
SWEEP_SECONDS = 300


async def sweep_abandoned_carts() -> None:
    db = await aiosqlite.connect(DB_PATH)
    db.row_factory = aiosqlite.Row
    try:
        cursor = await db.execute(
            f"""SELECT * FROM abandoned_carts
                WHERE recovered = 0 AND notified = 0
                  AND updated_at <= datetime('now', '-{ABANDON_MINUTES} minutes')"""
        )
        carts = await cursor.fetchall()
        for row in carts:
            await notify_abandoned_cart(
                {
                    "id": row["id"],
                    "clientName": row["client_name"],
                    "phone": row["phone"],
                    "city": row["city"],
                    "address": row["address"],
                    "total": row["total"],
                    "items": json.loads(row["items"]),
                }
            )
            await db.execute(
                "UPDATE abandoned_carts SET notified = 1 WHERE id = ?", (row["id"],)
            )
        if carts:
            await db.commit()
    finally:
        await db.close()


async def abandoned_carts_worker() -> None:
    while True:
        try:
            await sweep_abandoned_carts()
        except Exception:
            logger.exception("Fallo el barrido de carritos abandonados")
        await asyncio.sleep(SWEEP_SECONDS)
