# FaceHarmony AI

Educational facial geometry analysis powered by **MediaPipe Face Mesh**, **Next.js 15**, and **FastAPI**.

FaceHarmony AI evaluates measurable facial proportions and symmetry from an uploaded photo. It produces an educational harmony report — **not** a beauty, attractiveness, or worth score.

## Features

- Modern dark glassmorphic landing page
- Drag-and-drop upload + camera capture
- 468-point MediaPipe Face Mesh landmark detection
- Metrics: symmetry, facial thirds/fifths, eyes, nose, lips, jaw, chin, golden-ratio approximation, width/height balance
- Weighted overall harmony score
- Animated results with Recharts radar + breakdown cards
- Toggleable facial overlays (landmarks, symmetry, thirds, fifths, golden ratio, measurements)
- Neutral personalized insights
- Local browser history with side-by-side comparison

## Project structure

```text
FaceHarmony-AI/
├── backend/                 # FastAPI + MediaPipe + OpenCV
│   ├── app/
│   │   ├── main.py
│   │   ├── models/
│   │   ├── routers/
│   │   ├── services/
│   │   └── utils/
│   └── requirements.txt
├── frontend/                # Next.js 15 + TypeScript + Tailwind + Framer Motion
│   └── src/
└── README.md
```

## Requirements

- Node.js 20+
- Python 3.10+
- npm

## Backend setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### Analyze endpoint

`POST /analyze` — multipart form field `file`

Example response:

```json
{
  "overall": 89,
  "symmetry": 92,
  "golden_ratio": 86,
  "eyes": 91,
  "nose": 82,
  "lips": 88,
  "jaw": 84,
  "chin": 90,
  "thirds": 87,
  "fifths": 85,
  "recommendations": ["Your facial thirds are well balanced.", "..."]
}
```

## Frontend setup

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

App: [http://localhost:3000](http://localhost:3000)

Set the API base URL in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Overall score weights

| Metric | Weight |
|---|---|
| Symmetry | 25% |
| Golden Ratio | 15% |
| Facial Thirds | 15% |
| Facial Fifths | 10% |
| Jaw Definition | 10% |
| Eyes | 10% |
| Nose | 5% |
| Lips | 5% |
| Chin | 5% |

## Disclaimer

This software analyzes facial geometry for educational and research-oriented exploration only. It does **not** objectively measure beauty and should not be used to judge appearance.

## License

MIT
