import aiosqlite
import os
import json

DB_PATH = os.environ.get("DB_PATH", "/data/app.db") if os.path.isdir("/data") else "app.db"

async def get_db():
    db = await aiosqlite.connect(DB_PATH)
    db.row_factory = aiosqlite.Row
    await db.execute("PRAGMA journal_mode=WAL")
    await db.execute("PRAGMA foreign_keys=ON")
    try:
        yield db
    finally:
        await db.close()

async def init_db():
    db = await aiosqlite.connect(DB_PATH)
    await db.execute("PRAGMA journal_mode=WAL")
    await db.execute("PRAGMA foreign_keys=ON")

    await db.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'admin',
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL DEFAULT '',
            subcategory TEXT NOT NULL DEFAULT '',
            price REAL NOT NULL DEFAULT 0,
            original_price REAL,
            image TEXT NOT NULL DEFAULT '',
            rating REAL NOT NULL DEFAULT 5.0,
            reviews INTEGER NOT NULL DEFAULT 0,
            volume TEXT NOT NULL DEFAULT '',
            brand TEXT NOT NULL DEFAULT '',
            description TEXT NOT NULL DEFAULT '',
            in_stock INTEGER NOT NULL DEFAULT 1,
            featured INTEGER NOT NULL DEFAULT 0,
            discount TEXT
        );

        CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            client_name TEXT NOT NULL,
            phone TEXT NOT NULL,
            city TEXT NOT NULL,
            address TEXT NOT NULL,
            payment_method TEXT NOT NULL,
            total REAL NOT NULL,
            status TEXT NOT NULL DEFAULT 'pendiente',
            notes TEXT NOT NULL DEFAULT '',
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            items TEXT NOT NULL DEFAULT '[]'
        );

        CREATE TABLE IF NOT EXISTS banners (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image TEXT NOT NULL,
            active INTEGER NOT NULL DEFAULT 1,
            sort_order INTEGER NOT NULL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            subcategories TEXT NOT NULL DEFAULT '[]',
            image TEXT NOT NULL DEFAULT ''
        );

        CREATE TABLE IF NOT EXISTS config (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL DEFAULT '{}'
        );
    """)

    # Seed default admin user if no users exist
    cursor = await db.execute("SELECT COUNT(*) FROM users")
    count = (await cursor.fetchone())[0]
    if count == 0:
        await db.execute(
            "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
            ("admin", "admin123", "superadmin")
        )

    # Seed default config if not present
    for key, default in [
        ("footer", json.dumps({
            "cities": ["Duitama", "Tunja", "Sogamoso"],
            "schedule": "Abierto 23 horas al dia",
            "scheduleSub": "Todos los dias del ano",
            "whatsapp": "+57 311 226 0769",
            "description": "Tu licoreria de confianza con servicio a domicilio 23 horas al dia."
        })),
        ("featured", json.dumps([])),
        ("offers", json.dumps([])),
        ("coupons", json.dumps([])),
    ]:
        await db.execute(
            "INSERT OR IGNORE INTO config (key, value) VALUES (?, ?)",
            (key, default)
        )

    await db.commit()
    await db.close()
