import jwt
import os
from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException, Header
from typing import Optional

SECRET_KEY = os.environ.get("JWT_SECRET", "labodega-nocturna-23-secret-key-2026")
ALGORITHM = "HS256"
TOKEN_EXPIRE_DAYS = 30


def create_token(user_id: int, username: str, role: str) -> str:
    payload = {
        "sub": str(user_id),
        "username": username,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(days=TOKEN_EXPIRE_DAYS),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalido")


async def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    if not authorization:
        raise HTTPException(status_code=401, detail="No autorizado")
    token = authorization.replace("Bearer ", "")
    return decode_token(token)
