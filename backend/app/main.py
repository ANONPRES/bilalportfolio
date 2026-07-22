"""FaceHarmony AI FastAPI application entrypoint."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.models.schemas import HealthResponse
from app.routers.analyze import router as analyze_router
from app.services.analyzer import get_analyzer


@asynccontextmanager
async def lifespan(_: FastAPI):
    """Warm up MediaPipe on startup and release resources on shutdown."""
    analyzer = get_analyzer()
    yield
    analyzer.close()


app = FastAPI(
    title="FaceHarmony AI API",
    description=(
        "Educational facial geometry analysis using MediaPipe Face Mesh. "
        "Does not measure beauty or attractiveness."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# Allow localhost and LAN origins so phones on the same Wi-Fi can call the API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_origin_regex=(
        r"https?://("
        r"localhost|127\.0\.0\.1|"
        r"192\.168\.\d{1,3}\.\d{1,3}|"
        r"10\.\d{1,3}\.\d{1,3}\.\d{1,3}|"
        r"172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}"
        r")(:\d+)?"
    ),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze_router)


@app.get("/", response_model=HealthResponse)
@app.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    """Return API health status."""
    return HealthResponse(
        status="ok",
        service="FaceHarmony AI",
        version="1.0.0",
    )
