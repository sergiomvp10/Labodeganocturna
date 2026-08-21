import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.abandoned_carts import abandoned_carts_worker
from app.database import init_db
from app.routes.auth_routes import router as auth_router
from app.routes.product_routes import router as product_router
from app.routes.order_routes import router as order_router
from app.routes.banner_routes import router as banner_router
from app.routes.category_routes import router as category_router
from app.routes.config_routes import router as config_router
from app.routes.storefront_routes import router as storefront_router
from app.routes.cart_routes import router as cart_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    worker = asyncio.create_task(abandoned_carts_worker())
    try:
        yield
    finally:
        worker.cancel()


app = FastAPI(lifespan=lifespan)

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(auth_router)
app.include_router(product_router)
app.include_router(order_router)
app.include_router(banner_router)
app.include_router(category_router)
app.include_router(config_router)
app.include_router(storefront_router)
app.include_router(cart_router)


@app.get("/healthz")
async def healthz():
    return {"status": "ok"}
