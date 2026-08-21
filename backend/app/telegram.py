import logging
import os

import httpx

logger = logging.getLogger(__name__)

TELEGRAM_API = "https://api.telegram.org"


def _format_price(value: float) -> str:
    return f"${value:,.0f}".replace(",", ".")


def build_order_message(order: dict) -> str:
    lines = [
        "\U0001F6A8 *NUEVO PEDIDO*",
        "",
        f"*Pedido:* #{order['id']}",
        f"*Cliente:* {order['clientName']}",
        f"*Telefono:* {order['phone']}",
        f"*Ciudad:* {order['city']}",
        f"*Direccion:* {order['address']}",
        f"*Pago:* {order['paymentMethod']}",
        "",
        "*Productos:*",
    ]
    for item in order["items"]:
        lines.append(
            f"- {item['quantity']} x {item['name']} - {_format_price(item['price'] * item['quantity'])}"
        )
    lines.append("")
    subtotal = order.get("subtotal") or sum(i["price"] * i["quantity"] for i in order["items"])
    lines.append(f"*Subtotal:* {_format_price(subtotal)}")
    discount = order.get("discount") or 0
    if discount:
        lines.append(f"*Descuento:* -{_format_price(discount)}")
    shipping = order.get("shipping") or 0
    if shipping:
        lines.append(f"*Domicilio:* {_format_price(shipping)}")
    else:
        lines.append("*Domicilio:* GRATIS (pedido mayor a $200.000)")
    lines.append(f"*Total:* {_format_price(order['total'])}")
    if order.get("notes"):
        lines.append(f"*Notas:* {order['notes']}")
    return "\n".join(lines)


async def notify_new_order(order: dict) -> None:
    token = os.environ.get("TELEGRAM_BOT_TOKEN")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID")
    if not token or not chat_id:
        logger.info("Telegram no configurado, no se envia aviso del pedido %s", order["id"])
        return
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            res = await client.post(
                f"{TELEGRAM_API}/bot{token}/sendMessage",
                json={
                    "chat_id": chat_id,
                    "text": build_order_message(order),
                    "parse_mode": "Markdown",
                },
            )
        if res.status_code != 200:
            logger.error("Telegram respondio %s: %s", res.status_code, res.text)
    except Exception:
        logger.exception("No se pudo enviar el aviso del pedido %s a Telegram", order["id"])
