from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
import aiosqlite

from app.database import get_db
from app.auth import create_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])


class LoginRequest(BaseModel):
    username: str
    password: str


class CreateUserRequest(BaseModel):
    username: str
    password: str
    role: str = "admin"


class UpdateUserRequest(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    role: Optional[str] = None


@router.post("/login")
async def login(req: LoginRequest, db: aiosqlite.Connection = Depends(get_db)):
    cursor = await db.execute(
        "SELECT id, username, password, role FROM users WHERE username = ?",
        (req.username,)
    )
    row = await cursor.fetchone()
    if not row or row["password"] != req.password:
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    token = create_token(row["id"], row["username"], row["role"])
    return {
        "token": token,
        "user": {"id": row["id"], "username": row["username"], "role": row["role"]}
    }


@router.get("/users")
async def get_users(
    db: aiosqlite.Connection = Depends(get_db),
    _user: dict = Depends(get_current_user),
):
    cursor = await db.execute("SELECT id, username, role, created_at FROM users ORDER BY id")
    rows = await cursor.fetchall()
    return [
        {"id": r["id"], "username": r["username"], "role": r["role"], "createdAt": r["created_at"]}
        for r in rows
    ]


@router.post("/users")
async def create_user(
    req: CreateUserRequest,
    db: aiosqlite.Connection = Depends(get_db),
    _user: dict = Depends(get_current_user),
):
    try:
        cursor = await db.execute(
            "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
            (req.username, req.password, req.role)
        )
        await db.commit()
        new_id = cursor.lastrowid
        cursor2 = await db.execute("SELECT created_at FROM users WHERE id = ?", (new_id,))
        row = await cursor2.fetchone()
        return {
            "id": new_id,
            "username": req.username,
            "role": req.role,
            "createdAt": row["created_at"] if row else "",
        }
    except Exception:
        raise HTTPException(status_code=400, detail="El usuario ya existe")


@router.put("/users/{user_id}")
async def update_user(
    user_id: int,
    req: UpdateUserRequest,
    db: aiosqlite.Connection = Depends(get_db),
    _user: dict = Depends(get_current_user),
):
    updates = []
    values = []
    if req.username is not None:
        updates.append("username = ?")
        values.append(req.username)
    if req.password is not None:
        updates.append("password = ?")
        values.append(req.password)
    if req.role is not None:
        updates.append("role = ?")
        values.append(req.role)
    if not updates:
        return {"ok": True}
    values.append(user_id)
    await db.execute(f"UPDATE users SET {', '.join(updates)} WHERE id = ?", values)
    await db.commit()
    return {"ok": True}


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    db: aiosqlite.Connection = Depends(get_db),
    _user: dict = Depends(get_current_user),
):
    await db.execute("DELETE FROM users WHERE id = ?", (user_id,))
    await db.commit()
    return {"ok": True}
