from __future__ import annotations
import os
from typing import List, Optional, Dict, Any
from fastapi import FastAPI
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
import numpy as np

from .model import load_or_train

PORT = int(os.getenv("PORT", "8001"))
ENV = os.getenv("ENV", "dev")

app = FastAPI(title="CareerCatalyst ML Service", version="0.1.0")

# CORS - configure as needed for your dev origins
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model, metrics = load_or_train()

class ClassifyRequest(BaseModel):
    interests: str = Field(..., description="Comma-separated or free-form text of user interests")

class ClassifyResponse(BaseModel):
    role: str
    probabilities: Dict[str, float]
    metrics: Optional[Dict[str, Any]] = None

@app.get("/health")
def health():
    return {"ok": True, "env": ENV}

@app.post("/classify", response_model=ClassifyResponse)
def classify(req: ClassifyRequest):
    global model
    preds = model.predict([req.interests])[0]
    proba = {}
    if hasattr(model, "predict_proba"):
        # Extract class probabilities
        probs = model.predict_proba([req.interests])[0]
        classes = list(model.classes_)  # type: ignore[attr-defined]
        proba = {str(c): float(p) for c, p in zip(classes, probs)}
    else:
        # Fallback: pseudo-probabilities via decision function or binary heuristic
        proba = {preds: 1.0}
    response = ClassifyResponse(role=str(preds), probabilities=proba, metrics=metrics or None)
    return response

# For local run: uvicorn app.main:app --reload --port 8001