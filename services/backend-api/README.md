# dashboard-backend

## Backend

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run dev
```

The documentation is available at `http://localhost:3000/scalar`

## Android App

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run start
```

and

```bash
bun run android
```

## ML Model

To install dependencies:

```bash
pip install -r requirements.txt
```

To run:

```bash
cd src/ev_range_model/
python3 ev_range.py
```

The model will be running on `http://localhost:8000/predict_range` via a `POST` request.

**Sample Request**
Payload: [Payload](https://pastebin.com/raw/vGaESVrR)

**Sample Response**

```json
{
  "predicted_range_km": 350.5
}
```

## Frontend

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run dev
```

The frontend will be available at `http://localhost:3001`
