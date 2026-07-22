"""MediaPipe Face Mesh facial harmony analysis service."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, List, Optional, Tuple

import cv2
import mediapipe as mp
import numpy as np

from app.models.schemas import (
    AnalysisGuides,
    AnalysisResponse,
    LandmarkPoint,
    MetricDetail,
)
from app.utils.geometry import (
    clamp,
    distance,
    mean_point,
    midpoint,
    score_from_ratio,
    score_from_symmetry_error,
)

Point = Tuple[float, float]

# MediaPipe Face Mesh landmark indices used for proportional analysis.
LM = {
    "forehead": 10,
    "chin": 152,
    "left_cheek": 234,
    "right_cheek": 454,
    "nose_tip": 1,
    "nose_bridge": 6,
    "nose_bottom": 2,
    "left_ala": 98,
    "right_ala": 327,
    "left_eye_outer": 33,
    "left_eye_inner": 133,
    "right_eye_inner": 362,
    "right_eye_outer": 263,
    "left_eye_top": 159,
    "left_eye_bottom": 145,
    "right_eye_top": 386,
    "right_eye_bottom": 374,
    "brow_left": 70,
    "brow_right": 300,
    "brow_center": 9,
    "mouth_left": 61,
    "mouth_right": 291,
    "upper_lip": 13,
    "lower_lip": 14,
    "philtrum": 164,
    "left_jaw": 172,
    "right_jaw": 397,
    "left_gonion": 58,
    "right_gonion": 288,
    "subnasale": 94,
}


# Weighted contribution to overall harmony score.
WEIGHTS = {
    "symmetry": 0.25,
    "golden_ratio": 0.15,
    "thirds": 0.15,
    "fifths": 0.10,
    "jaw": 0.10,
    "eyes": 0.10,
    "nose": 0.05,
    "lips": 0.05,
    "chin": 0.05,
}


@dataclass
class FaceGeometry:
    """Collected landmark-derived measurements used across scoring helpers."""

    points: Dict[str, Point]
    face_width: float
    face_height: float
    all_landmarks: List[LandmarkPoint]


class FaceHarmonyAnalyzer:
    """
    Detects facial landmarks and computes educational harmony metrics.

    This analyzer measures geometric relationships only. It does not estimate
    attractiveness, beauty, or social value.
    """

    def __init__(self) -> None:
        """Initialize MediaPipe Face Mesh detector."""
        self._mp_face_mesh = mp.solutions.face_mesh
        self._face_mesh = self._mp_face_mesh.FaceMesh(
            static_image_mode=True,
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5,
        )

    def close(self) -> None:
        """Release MediaPipe resources."""
        self._face_mesh.close()

    def analyze_image_bytes(self, image_bytes: bytes) -> AnalysisResponse:
        """
        Decode an uploaded image and return a full harmony analysis.

        Raises:
            ValueError: If the image cannot be decoded or no face is detected.
        """
        image = self._decode_image(image_bytes)
        return self.analyze_bgr_image(image)

    def analyze_bgr_image(self, image: np.ndarray) -> AnalysisResponse:
        """Run Face Mesh detection and score facial proportions on a BGR image."""
        height, width = image.shape[:2]
        rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = self._face_mesh.process(rgb)

        if not results.multi_face_landmarks:
            raise ValueError(
                "No face detected. Please upload a clear, front-facing photo "
                "with good lighting."
            )

        face_landmarks = results.multi_face_landmarks[0]
        geometry = self._extract_geometry(face_landmarks, width, height)
        metrics = self._compute_metrics(geometry)
        overall = self._weighted_overall(metrics)
        recommendations = self._build_recommendations(metrics)
        guides = self._build_guides(geometry)

        return AnalysisResponse(
            overall=round(overall, 1),
            symmetry=round(metrics["symmetry"].score, 1),
            golden_ratio=round(metrics["golden_ratio"].score, 1),
            eyes=round(metrics["eyes"].score, 1),
            nose=round(metrics["nose"].score, 1),
            lips=round(metrics["lips"].score, 1),
            jaw=round(metrics["jaw"].score, 1),
            chin=round(metrics["chin"].score, 1),
            thirds=round(metrics["thirds"].score, 1),
            fifths=round(metrics["fifths"].score, 1),
            face_width_height=round(metrics["face_width_height"].score, 1),
            recommendations=recommendations,
            metrics=metrics,
            landmarks=geometry.all_landmarks,
            guides=guides,
            image_width=width,
            image_height=height,
        )

    def _decode_image(self, image_bytes: bytes) -> np.ndarray:
        """Decode raw image bytes into an OpenCV BGR array."""
        arr = np.frombuffer(image_bytes, dtype=np.uint8)
        image = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        if image is None:
            raise ValueError("Unable to decode image. Use JPG, PNG, or WEBP.")
        return image

    def _landmark_xy(self, landmark: Any, width: int, height: int) -> Point:
        """Convert a normalized MediaPipe landmark into pixel coordinates."""
        return (float(landmark.x * width), float(landmark.y * height))

    def _extract_geometry(
        self,
        face_landmarks: Any,
        width: int,
        height: int,
    ) -> FaceGeometry:
        """Map key landmarks and compute face bounding measurements."""
        lm = face_landmarks.landmark
        points: Dict[str, Point] = {
            name: self._landmark_xy(lm[idx], width, height)
            for name, idx in LM.items()
        }

        all_landmarks: List[LandmarkPoint] = [
            LandmarkPoint(
                x=float(landmark.x),
                y=float(landmark.y),
                z=float(landmark.z),
                index=i,
            )
            for i, landmark in enumerate(lm)
        ]

        face_width = distance(points["left_cheek"], points["right_cheek"])
        face_height = distance(points["forehead"], points["chin"])
        if face_width <= 0 or face_height <= 0:
            raise ValueError("Could not compute valid face dimensions.")

        return FaceGeometry(
            points=points,
            face_width=face_width,
            face_height=face_height,
            all_landmarks=all_landmarks,
        )

    def _compute_metrics(self, geometry: FaceGeometry) -> Dict[str, MetricDetail]:
        """Calculate and normalize all facial harmony metrics."""
        p = geometry.points
        fw = geometry.face_width
        fh = geometry.face_height

        symmetry = self._score_symmetry(geometry)
        thirds = self._score_thirds(geometry)
        fifths = self._score_fifths(geometry)
        eyes = self._score_eyes(geometry)
        nose = self._score_nose(geometry)
        lips = self._score_lips(geometry)
        jaw = self._score_jaw(geometry)
        chin = self._score_chin(geometry)
        width_height = self._score_width_height(geometry)
        golden = self._score_golden_ratio(geometry)

        return {
            "symmetry": symmetry,
            "thirds": thirds,
            "fifths": fifths,
            "eyes": eyes,
            "nose": nose,
            "lips": lips,
            "jaw": jaw,
            "chin": chin,
            "face_width_height": width_height,
            "golden_ratio": golden,
            "nose_width": MetricDetail(
                score=nose.score,
                label="Nose Width Ratio",
                explanation=nose.explanation,
                raw_ratio=nose.raw_ratio,
            ),
            "nose_length": MetricDetail(
                score=score_from_ratio(
                    distance(p["nose_bridge"], p["nose_bottom"]) / fh,
                    0.22,
                    0.25,
                ),
                label="Nose Length Ratio",
                explanation="Nose length is compared to overall face height.",
                raw_ratio=distance(p["nose_bridge"], p["nose_bottom"]) / fh,
            ),
            "lip_proportion": MetricDetail(
                score=lips.score,
                label="Lip Proportion",
                explanation=lips.explanation,
                raw_ratio=lips.raw_ratio,
            ),
            "proportional_balance": MetricDetail(
                score=clamp(
                    (
                        thirds.score
                        + fifths.score
                        + width_height.score
                        + golden.score
                    )
                    / 4.0
                ),
                label="Overall Proportional Balance",
                explanation=(
                    "Combines vertical thirds, horizontal fifths, face shape, "
                    "and golden-ratio approximations into one balance signal."
                ),
            ),
        }

    def _score_symmetry(self, geometry: FaceGeometry) -> MetricDetail:
        """Score left/right facial landmark mirroring relative to the midline."""
        p = geometry.points
        midline_x = midpoint(p["forehead"], p["chin"])[0]
        pairs = [
            ("left_cheek", "right_cheek"),
            ("left_eye_outer", "right_eye_outer"),
            ("left_eye_inner", "right_eye_inner"),
            ("left_ala", "right_ala"),
            ("mouth_left", "mouth_right"),
            ("left_jaw", "right_jaw"),
            ("brow_left", "brow_right"),
        ]

        errors: List[float] = []
        for left_key, right_key in pairs:
            left = p[left_key]
            right = p[right_key]
            left_offset = abs(left[0] - midline_x)
            right_offset = abs(right[0] - midline_x)
            errors.append(abs(left_offset - right_offset) / geometry.face_width)

            left_y = left[1]
            right_y = right[1]
            errors.append(abs(left_y - right_y) / geometry.face_height)

        mean_error = float(np.mean(errors))
        score = score_from_symmetry_error(mean_error)
        explanation = (
            "Left and right facial landmarks are closely mirrored."
            if score >= 85
            else "Mild left/right geometric differences are present, which is common."
            if score >= 70
            else "Symmetry analysis shows moderate deviation from the facial midline."
        )
        return MetricDetail(
            score=score,
            label="Facial Symmetry",
            explanation=explanation,
            raw_ratio=mean_error,
        )

    def _score_thirds(self, geometry: FaceGeometry) -> MetricDetail:
        """Score classical facial thirds (forehead, midface, lower face)."""
        p = geometry.points
        brow_y = mean_point([p["brow_left"], p["brow_right"], p["brow_center"]])[1]
        top = p["forehead"][1]
        nose_base = p["nose_bottom"][1]
        chin = p["chin"][1]

        upper = abs(brow_y - top)
        middle = abs(nose_base - brow_y)
        lower = abs(chin - nose_base)
        total = upper + middle + lower
        if total <= 0:
            return MetricDetail(
                score=50.0,
                label="Facial Thirds",
                explanation="Unable to measure facial thirds reliably.",
            )

        ratios = [upper / total, middle / total, lower / total]
        ideal = 1.0 / 3.0
        deviation = float(np.mean([abs(r - ideal) for r in ratios]))
        score = clamp(100.0 - deviation * 350.0, 35.0, 100.0)
        explanation = (
            "Your facial thirds are well balanced."
            if score >= 85
            else "Facial thirds are reasonably balanced with slight variation."
            if score >= 70
            else "Vertical facial thirds differ more than the classical equal split."
        )
        return MetricDetail(
            score=score,
            label="Facial Thirds",
            explanation=explanation,
            raw_ratio=deviation,
        )

    def _score_fifths(self, geometry: FaceGeometry) -> MetricDetail:
        """Score classical facial fifths across the face width."""
        p = geometry.points
        left_face = p["left_cheek"][0]
        right_face = p["right_cheek"][0]
        left_eye_outer = p["left_eye_outer"][0]
        left_eye_inner = p["left_eye_inner"][0]
        right_eye_inner = p["right_eye_inner"][0]
        right_eye_outer = p["right_eye_outer"][0]

        segments = [
            abs(left_eye_outer - left_face),
            abs(left_eye_inner - left_eye_outer),
            abs(right_eye_inner - left_eye_inner),
            abs(right_eye_outer - right_eye_inner),
            abs(right_face - right_eye_outer),
        ]
        total = sum(segments)
        if total <= 0:
            return MetricDetail(
                score=50.0,
                label="Facial Fifths",
                explanation="Unable to measure facial fifths reliably.",
            )

        ratios = [s / total for s in segments]
        ideal = 0.2
        deviation = float(np.mean([abs(r - ideal) for r in ratios]))
        score = clamp(100.0 - deviation * 320.0, 35.0, 100.0)
        explanation = (
            "Horizontal facial fifths align closely with classical proportions."
            if score >= 85
            else "Facial fifths are generally proportional with minor variation."
            if score >= 70
            else "Horizontal fifths differ from an even five-part division."
        )
        return MetricDetail(
            score=score,
            label="Facial Fifths",
            explanation=explanation,
            raw_ratio=deviation,
        )

    def _score_eyes(self, geometry: FaceGeometry) -> MetricDetail:
        """Score eye spacing relative to individual eye width."""
        p = geometry.points
        left_eye_w = distance(p["left_eye_outer"], p["left_eye_inner"])
        right_eye_w = distance(p["right_eye_outer"], p["right_eye_inner"])
        avg_eye_w = (left_eye_w + right_eye_w) / 2.0
        inner_spacing = distance(p["left_eye_inner"], p["right_eye_inner"])
        if avg_eye_w <= 0:
            return MetricDetail(
                score=50.0,
                label="Eye Spacing",
                explanation="Unable to measure eye spacing reliably.",
            )

        ratio = inner_spacing / avg_eye_w
        # Classical guideline: intercanthal distance ≈ one eye width.
        score = score_from_ratio(ratio, 1.0, tolerance=0.28)
        explanation = (
            "Eye spacing is proportional relative to eye width."
            if score >= 85
            else "Eye spacing is near the common one-eye-width guideline."
            if score >= 70
            else "Eye spacing differs from the classical one-eye-width reference."
        )
        return MetricDetail(
            score=score,
            label="Eyes",
            explanation=explanation,
            raw_ratio=ratio,
        )

    def _score_nose(self, geometry: FaceGeometry) -> MetricDetail:
        """Score nose width and length relative to facial references."""
        p = geometry.points
        nose_width = distance(p["left_ala"], p["right_ala"])
        intercanthal = distance(p["left_eye_inner"], p["right_eye_inner"])
        nose_length = distance(p["nose_bridge"], p["nose_bottom"])
        midface = abs(p["nose_bottom"][1] - mean_point([p["brow_left"], p["brow_right"]])[1])

        width_ratio = nose_width / intercanthal if intercanthal else 1.0
        length_ratio = nose_length / midface if midface else 1.0
        width_score = score_from_ratio(width_ratio, 1.0, tolerance=0.30)
        length_score = score_from_ratio(length_ratio, 0.75, tolerance=0.35)
        score = (width_score * 0.55) + (length_score * 0.45)
        explanation = (
            "Nose width and length relate closely to nearby facial references."
            if score >= 85
            else "Nose proportions are within a common geometric range."
            if score >= 70
            else "Nose width or length differs from nearby reference spans."
        )
        return MetricDetail(
            score=score,
            label="Nose",
            explanation=explanation,
            raw_ratio=width_ratio,
        )

    def _score_lips(self, geometry: FaceGeometry) -> MetricDetail:
        """Score lip width and vertical lip proportion."""
        p = geometry.points
        mouth_width = distance(p["mouth_left"], p["mouth_right"])
        nose_width = distance(p["left_ala"], p["right_ala"])
        upper = abs(p["upper_lip"][1] - p["philtrum"][1])
        lower = abs(p["lower_lip"][1] - p["upper_lip"][1])
        lip_height = upper + lower + 1e-6

        width_ratio = mouth_width / nose_width if nose_width else 1.5
        vertical_ratio = lower / lip_height
        width_score = score_from_ratio(width_ratio, 1.5, tolerance=0.35)
        vertical_score = score_from_ratio(vertical_ratio, 0.55, tolerance=0.35)
        score = (width_score * 0.5) + (vertical_score * 0.5)
        explanation = (
            "Lip proportions are balanced relative to nose width and lip height."
            if score >= 85
            else "Lip proportions fall near common geometric references."
            if score >= 70
            else "Lip width or vertical proportion differs from reference ratios."
        )
        return MetricDetail(
            score=score,
            label="Lips",
            explanation=explanation,
            raw_ratio=width_ratio,
        )

    def _score_jaw(self, geometry: FaceGeometry) -> MetricDetail:
        """Score jaw definition using jaw angle width relative to cheek width."""
        p = geometry.points
        jaw_width = distance(p["left_gonion"], p["right_gonion"])
        cheek_width = geometry.face_width
        chin_to_jaw = (
            distance(p["chin"], p["left_gonion"]) + distance(p["chin"], p["right_gonion"])
        ) / 2.0
        ratio = jaw_width / cheek_width if cheek_width else 0.85
        taper = chin_to_jaw / geometry.face_height if geometry.face_height else 0.35
        width_score = score_from_ratio(ratio, 0.86, tolerance=0.18)
        taper_score = score_from_ratio(taper, 0.34, tolerance=0.30)
        score = (width_score * 0.6) + (taper_score * 0.4)
        explanation = (
            "Jaw contour shows clear definition relative to cheek width."
            if score >= 85
            else "Jawline is slightly softer than the classical cheek-to-jaw reference."
            if score >= 70
            else "Jaw width and taper differ from common geometric references."
        )
        return MetricDetail(
            score=score,
            label="Jaw Definition",
            explanation=explanation,
            raw_ratio=ratio,
        )

    def _score_chin(self, geometry: FaceGeometry) -> MetricDetail:
        """Score chin projection using lower-third depth cues."""
        p = geometry.points
        nose_tip = p["nose_tip"]
        chin = p["chin"]
        subnasale = p["subnasale"]
        lower_third = abs(chin[1] - subnasale[1])
        projection = abs(chin[0] - nose_tip[0]) / geometry.face_width
        lower_ratio = lower_third / geometry.face_height if geometry.face_height else 0.3
        projection_score = score_from_ratio(projection, 0.04, tolerance=1.2, floor=40.0)
        lower_score = score_from_ratio(lower_ratio, 0.32, tolerance=0.30)
        # Chin projection from frontal photos is limited; weigh lower-third more.
        score = (lower_score * 0.7) + (projection_score * 0.3)
        explanation = (
            "Chin position and lower-face height relate well to nearby landmarks."
            if score >= 85
            else "Chin projection cues are near average for a frontal photograph."
            if score >= 70
            else "Chin and lower-third measurements differ from reference proportions."
        )
        return MetricDetail(
            score=score,
            label="Chin Projection",
            explanation=explanation,
            raw_ratio=lower_ratio,
        )

    def _score_width_height(self, geometry: FaceGeometry) -> MetricDetail:
        """Score overall face width-to-height ratio."""
        ratio = geometry.face_width / geometry.face_height
        # Many faces fall near ~0.75 width/height in frontal photos.
        score = score_from_ratio(ratio, 0.75, tolerance=0.22)
        explanation = (
            "Face width-to-height ratio is close to a balanced oval reference."
            if score >= 85
            else "Face shape ratio is within a common frontal-photo range."
            if score >= 70
            else "Face width-height ratio differs from the balanced oval reference."
        )
        return MetricDetail(
            score=score,
            label="Face Width-Height Ratio",
            explanation=explanation,
            raw_ratio=ratio,
        )

    def _score_golden_ratio(self, geometry: FaceGeometry) -> MetricDetail:
        """Approximate golden-ratio relationships across facial spans."""
        p = geometry.points
        phi = 1.6180339887
        face_ratio = geometry.face_height / geometry.face_width
        eye_to_mouth = abs(
            mean_point([p["left_eye_inner"], p["right_eye_inner"]])[1]
            - mean_point([p["upper_lip"], p["lower_lip"]])[1]
        )
        mouth_to_chin = abs(p["chin"][1] - mean_point([p["upper_lip"], p["lower_lip"]])[1])
        eye_mouth_ratio = eye_to_mouth / mouth_to_chin if mouth_to_chin else phi

        face_score = score_from_ratio(face_ratio, phi / 1.2, tolerance=0.25)
        # Secondary phi check between midface segments.
        segment_score = score_from_ratio(eye_mouth_ratio, phi * 0.7, tolerance=0.40)
        score = (face_score * 0.65) + (segment_score * 0.35)
        explanation = (
            "Key facial spans approximate golden-ratio relationships."
            if score >= 85
            else "Golden-ratio approximation is moderately aligned."
            if score >= 70
            else "Golden-ratio guides differ from measured facial spans."
        )
        return MetricDetail(
            score=score,
            label="Golden Ratio Approximation",
            explanation=explanation,
            raw_ratio=face_ratio,
        )

    def _weighted_overall(self, metrics: Dict[str, MetricDetail]) -> float:
        """Compute the weighted overall harmony score."""
        total = 0.0
        for key, weight in WEIGHTS.items():
            total += metrics[key].score * weight
        return clamp(total)

    def _build_recommendations(self, metrics: Dict[str, MetricDetail]) -> List[str]:
        """Generate neutral, educational suggestions from metric scores."""
        tips: List[str] = []

        mapping = [
            ("thirds", "Your facial thirds are well balanced.", "Facial thirds show mild variation from an equal split."),
            ("fifths", "Facial fifths are evenly distributed.", "Horizontal fifths differ slightly from an even division."),
            ("symmetry", "Facial symmetry is closely balanced.", "Mild asymmetry is present and is common in natural faces."),
            ("eyes", "Eye spacing is proportional.", "Eye spacing differs from the classical one-eye-width guideline."),
            ("nose", "Nose proportions relate well to nearby features.", "Nose width or length differs from nearby reference spans."),
            ("lips", "Lip proportions are balanced.", "Lip proportions differ from common geometric references."),
            ("jaw", "Jaw definition aligns with cheek width references.", "Jawline is slightly softer than average geometric references."),
            ("chin", "Chin and lower-face height are proportionally related.", "Chin projection cues differ from frontal reference proportions."),
            ("golden_ratio", "Golden-ratio approximations align with measured spans.", "Golden-ratio guides are only loosely matched by measured spans."),
        ]

        for key, high_msg, mid_msg in mapping:
            score = metrics[key].score
            if score >= 85:
                tips.append(high_msg)
            elif score >= 70:
                tips.append(mid_msg)
            else:
                tips.append(metrics[key].explanation)

        tips.append(
            "These observations describe geometry only and are not beauty judgments."
        )
        return tips

    def _build_guides(self, geometry: FaceGeometry) -> AnalysisGuides:
        """Build overlay guide coordinates in pixel space for frontend scaling."""
        p = geometry.points

        # Store absolute pixel coords; frontend scales with image_width/height.
        forehead = p["forehead"]
        chin = p["chin"]
        left = p["left_cheek"]
        right = p["right_cheek"]
        brow_y = mean_point([p["brow_left"], p["brow_right"], p["brow_center"]])[1]
        nose_y = p["nose_bottom"][1]

        symmetry_line = [
            {"x": midpoint(forehead, chin)[0], "y": forehead[1]},
            {"x": midpoint(forehead, chin)[0], "y": chin[1]},
        ]

        thirds = [
            {"y": forehead[1], "label": "hairline"},
            {"y": brow_y, "label": "brow"},
            {"y": nose_y, "label": "nose base"},
            {"y": chin[1], "label": "chin"},
        ]

        face_left = left[0]
        face_right = right[0]
        span = face_right - face_left
        fifths = [
            {"x": face_left + span * i / 5.0, "label": f"fifth-{i}"}
            for i in range(6)
        ]

        # Golden rectangle approximation around the face bounds.
        golden_ratio = [
            {
                "type": "rect",
                "x": left[0],
                "y": forehead[1],
                "width": right[0] - left[0],
                "height": chin[1] - forehead[1],
            },
            {
                "type": "phi_line",
                "x1": left[0],
                "y1": forehead[1] + (chin[1] - forehead[1]) / 1.618,
                "x2": right[0],
                "y2": forehead[1] + (chin[1] - forehead[1]) / 1.618,
            },
        ]

        measurements = [
            {
                "label": "face_width",
                "x1": left[0],
                "y1": midpoint(left, right)[1],
                "x2": right[0],
                "y2": midpoint(left, right)[1],
            },
            {
                "label": "face_height",
                "x1": midpoint(forehead, chin)[0],
                "y1": forehead[1],
                "x2": midpoint(forehead, chin)[0],
                "y2": chin[1],
            },
            {
                "label": "eye_spacing",
                "x1": p["left_eye_inner"][0],
                "y1": p["left_eye_inner"][1],
                "x2": p["right_eye_inner"][0],
                "y2": p["right_eye_inner"][1],
            },
            {
                "label": "nose_width",
                "x1": p["left_ala"][0],
                "y1": p["left_ala"][1],
                "x2": p["right_ala"][0],
                "y2": p["right_ala"][1],
            },
            {
                "label": "mouth_width",
                "x1": p["mouth_left"][0],
                "y1": p["mouth_left"][1],
                "x2": p["mouth_right"][0],
                "y2": p["mouth_right"][1],
            },
        ]

        return AnalysisGuides(
            symmetry_line=symmetry_line,
            thirds=thirds,
            fifths=fifths,
            golden_ratio=golden_ratio,
            measurements=measurements,
        )


# Module-level singleton used by API routes.
analyzer: Optional[FaceHarmonyAnalyzer] = None


def get_analyzer() -> FaceHarmonyAnalyzer:
    """Return a process-wide FaceHarmonyAnalyzer instance."""
    global analyzer
    if analyzer is None:
        analyzer = FaceHarmonyAnalyzer()
    return analyzer
