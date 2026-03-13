# CareerCatalyst — ML Microservice (FastAPI)

A minimal FastAPI service that classifies user interests into one of three roles:
**student**, **freelancer**, or **employee** using `MultinomialNB` + `TfidfVectorizer`.

## Run locally

```bash
python -m venv .venv
# Windows
. .venv/Scripts/activate
# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

- Swagger UI: http://127.0.0.1:8001/docs
- Health check: http://127.0.0.1:8001/health

## Example

```bash
curl -X POST http://127.0.0.1:8001/classify   -H "Content-Type: application/json"   -d '{"interests":"python, machine learning, hackathons, internships"}'
```

## Project structure
```
ml-service/
  app/
    main.py           # FastAPI app + endpoint
    model.py          # Training + model persistence
  data/
    seed.csv          # Seed labeled data
  requirements.txt
  README.md
```

## Notes
- The model trains automatically on first run using `data/seed.csv` and persists to `app/model.joblib`.
- Update `CORS_ORIGINS` via env var to restrict in production.
- Replace `data/seed.csv` with a larger labeled dataset for better accuracy.