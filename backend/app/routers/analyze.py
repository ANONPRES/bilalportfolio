"""Analysis API routes."""

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.models.schemas import AnalysisResponse
from app.services.analyzer import get_analyzer

router = APIRouter(tags=["analysis"])

ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/bmp",
}
MAX_UPLOAD_BYTES = 10 * 1024 * 1024  # 10 MB


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_face(file: UploadFile = File(...)) -> AnalysisResponse:
    """
    Analyze an uploaded face photo and return harmony metrics.

    Accepts multipart form uploads under the `file` field.
    """
    content_type = (file.content_type or "").lower()
    if content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Upload a JPG, PNG, WEBP, or BMP image.",
        )

    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    if len(image_bytes) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=400, detail="Image exceeds the 10MB limit.")

    try:
        return get_analyzer().analyze_image_bytes(image_bytes)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {exc}",
        ) from exc
