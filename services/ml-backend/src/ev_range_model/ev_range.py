from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List
import torch
import pandas as pd
from joblib import load
from models.model import EvRangeModel
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

# ---------------------
# Load model & scalers
# ---------------------
INPUT_DIM = 27  # your preprocessed feature count

model = EvRangeModel(input_dim=INPUT_DIM)
model.load_state_dict(torch.load("models/feddback_model.pth", map_location="cpu"))
model.eval()

scaler_X = load("models/scaler_X.pkl")
scaler_y = load("models/scaler_y.pkl")

# ---------------------
# FastAPI app setup
# ---------------------
app = FastAPI(
    title="EV Range Prediction API",
    description="Predicts remaining range (km) from EV BMS telemetry sequences.",
    version="1.0.0",
)

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
    "http://localhost:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------
# Pydantic Model
# ---------------------
class EVData(BaseModel):
    pack_voltage_v: float = Field(..., description="Battery pack voltage in volts")
    pack_current_a: float = Field(..., description="Pack current in amperes")
    state_of_charge: float = Field(..., description="Battery state of charge (0-1)")
    state_of_health: float = Field(..., description="Battery state of health (0-1)")
    cell_volt_min_v: float
    cell_volt_max_v: float
    cell_volt_avg_v: float
    cell_temp_min_c: float
    cell_temp_max_c: float
    cell_temp_avg_c: float
    ambient_temp_c: float
    charging_power_kw: float
    peak_power_kw: float
    insulation_resistance_mohm: float
    cycle_count: float
    cell_v_1_v: float
    cell_v_2_v: float
    cell_v_3_v: float
    cell_v_4_v: float
    cell_v_5_v: float
    cell_v_6_v: float
    cell_v_7_v: float
    cell_v_8_v: float
    cell_v_9_v: float
    cell_v_10_v: float
    cell_v_11_v: float
    cell_v_12_v: float


class EVSequence(BaseModel):
    data: List[EVData] = Field(..., description="List of last 50 telemetry rows")


# ---------------------
# Helper function
# ---------------------
def preprocess_input(data: List[EVData]) -> torch.Tensor:
    df = pd.DataFrame([d.dict() for d in data])
    if df.shape[0] != 50:
        raise ValueError(f"Expected 50 timesteps, got {df.shape[0]}")
    X_scaled = scaler_X.transform(df.values)
    return torch.tensor(X_scaled, dtype=torch.float32).unsqueeze(0)  # (1, 50, features)


# ---------------------
# Prediction endpoint
# ---------------------
@app.post("/predict_range")
def predict_range(data: List[EVData]):
    try:
        X_tensor = preprocess_input(data)
        with torch.no_grad():
            y_pred_scaled = model(X_tensor).squeeze().numpy()
            y_pred = scaler_y.inverse_transform(y_pred_scaled.reshape(-1, 1)).flatten()
        return {"predicted_remaining_range_km": float(y_pred[0])}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


if __name__ == "__main__":
    uvicorn.run("ev_range:app", host="0.0.0.0", port=8000, reload=True)
