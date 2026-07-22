"""Smoke tests for FaceHarmony AI geometry helpers and API health."""

from fastapi.testclient import TestClient

from app.main import app
from app.utils.geometry import clamp, score_from_ratio, score_from_symmetry_error


def test_clamp() -> None:
    """Clamp should keep values inside the requested bounds."""
    assert clamp(150) == 100
    assert clamp(-5) == 0
    assert clamp(42) == 42


def test_score_helpers() -> None:
    """Ratio and symmetry scorers should peak near ideal values."""
    assert score_from_ratio(1.0, 1.0) >= 95
    assert score_from_symmetry_error(0.0) >= 95
    assert score_from_ratio(2.0, 1.0) < score_from_ratio(1.1, 1.0)


def test_health_endpoint() -> None:
    """Health endpoint should report a healthy service."""
    client = TestClient(app)
    response = client.get("/health")
    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "ok"
    assert payload["service"] == "FaceHarmony AI"
