from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from prometheus_fastapi_instrumentator import Instrumentator
from app.api import routes_auth, routes_predict
from app.middleware.logging_middleware import LoggingMiddleware
from app.middleware.cors_middleware import setup_cors
from app.core.exceptions import register_exception_handlers
import os

app= FastAPI(title='Car Price Prediction API')

# SETUP CORS
setup_cors(app)

# LINK MIDDLEWARE
app.add_middleware(LoggingMiddleware)

# SERVE FRONTEND FIRST (before API routes to take precedence)
frontend_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")
if os.path.exists(frontend_path):
    @app.get("/", include_in_schema=False)
    async def serve_frontend():
        return FileResponse(os.path.join(frontend_path, "index.html"))

    @app.get("/auth", include_in_schema=False)
    async def serve_login():
        return FileResponse(os.path.join(frontend_path, "login.html"))

    @app.get("/dashboard", include_in_schema=False)
    async def serve_predict():
        return FileResponse(os.path.join(frontend_path, "predict.html"))

    # Mount static files
    app.mount("/static", StaticFiles(directory=frontend_path), name="static")

# LINK ENDPOINTS (API routes - these won't override the GET routes above)
app.include_router(routes_auth.router, tags=['Auth'])
app.include_router(routes_predict.router, tags=['Prediction'])

# MONITORING
Instrumentator().instrument(app).expose(app)

# ADD EXCEPTION HANDLER
register_exception_handlers(app)