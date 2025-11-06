from __future__ import annotations
import os
from typing import Tuple, Dict, Any
import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

MODEL_PATH = os.getenv("MODEL_PATH", os.path.join(os.path.dirname(__file__), "model.joblib"))
DATA_PATH = os.getenv("DATA_PATH", os.path.join(os.path.dirname(__file__), "..", "data", "seed.csv"))

def train_model(data_path: str = DATA_PATH, save_path: str = MODEL_PATH) -> Tuple[Pipeline, Dict[str, Any]]:
    df = pd.read_csv(data_path)
    X = df["interests"].astype(str).values
    y = df["role"].astype(str).values
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    pipe = Pipeline([
        ("tfidf", TfidfVectorizer(ngram_range=(1,2), min_df=1)),
        ("clf", MultinomialNB())
    ])
    pipe.fit(X_train, y_train)
    metrics = {}
    try:
        y_pred = pipe.predict(X_test)
        report = classification_report(y_test, y_pred, output_dict=True, zero_division=0)
        metrics = {
            "accuracy": report.get("accuracy", None),
            "per_class": {k: v for k, v in report.items() if k in set(y)}
        }
    except Exception:
        pass

    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    joblib.dump(pipe, save_path)
    return pipe, metrics

def load_or_train() -> Tuple[Pipeline, Dict[str, Any]]:
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        return model, {}
    return train_model()