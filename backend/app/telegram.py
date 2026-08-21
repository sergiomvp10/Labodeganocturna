import logging
import os
from urllib.parse import quote

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
            f"{item['quantity']} x {item['name']}  {_format_price(item['price'] * item['quantity'])}"
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
        lines.append("*Domicilio:* GRATIS")
    lines.append(f"*Total:* {_format_price(order['total'])}")
    if order.get("notes"):
        lines.append(f"*Notas:* {order['notes']}")
    return "\n".join(lines)


def whatsapp_link(phone: str, text: str) -> str:
    digits = "".join(c for c in phone if c.isdigit())
    if len(digits) == 10:
        digits = f"57{digits}"
    return f"https://wa.me/{digits}?text={quote(text)}"


def build_abandoned_cart_message(cart: dict) -> str:
    name = cart.get("clientName") or "Sin nombre"
    lines = [
        "\U0001F6D2 *CARRITO ABANDONADO*",
        "",
        f"*Cliente:* {name}",
        f"*Telefono:* {cart['phone']}",
    ]
    if cart.get("city"):
        lines.append(f"*Ciudad:* {cart['city']}")
    if cart.get("address"):
        lines.append(f"*Direccion:* {cart['address']}")
    lines.append("")
    lines.append("*Productos:*")
    for item in cart["items"]:
        lines.append(
            f"{item['quantity']} x {item['name']}  {_format_price(item['price'] * item['quantity'])}"
        )
    lines.append("")
    lines.append(f"*Total:* {_format_price(cart['total'])}")
    recovery = (
        f"Hola{'' if not cart.get('clientName') else ' ' + cart['clientName']}, "
        "vimos que dejaste tu pedido a medias en La Bodega Nocturna 23. "
        "\u00bfQuieres que te lo despachemos ahora?"
    )
    lines.append("")
    lines.append(f"[Escribirle por WhatsApp]({whatsapp_link(cart['phone'], recovery)})")
    return "\n".join(lines)


async def _send_message(text: str, context: str) -> None:
    token = os.environ.get("TELEGRAM_BOT_TOKEN")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID")
    if not token or not chat_id:
        logger.info("Telegram no configurado, no se envia aviso de %s", context)
        return
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            res = await client.post(
                f"{TELEGRAM_API}/bot{token}/sendMessage",
                json={
                    "chat_id": chat_id,
                    "text": text,
                    "parse_mode": "Markdown",
                    "disable_web_page_preview": True,
                },
            )
        if res.status_code != 200:
            logger.error("Telegram respondio %s: %s", res.status_code, res.text)
    except Exception:
        logger.exception("No se pudo enviar el aviso de %s a Telegram", context)


async def notify_new_order(order: dict) -> None:
    await _send_message(build_order_message(order), f"pedido {order['id']}")


async def notify_abandoned_cart(cart: dict) -> None:
    await _send_message(
        build_abandoned_cart_message(cart), f"carrito abandonado {cart['id']}"
    )
