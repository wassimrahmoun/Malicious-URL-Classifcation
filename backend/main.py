from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import joblib
import numpy as np
from urllib.parse import urlparse
import re
import os
from Parse_URL import extract_url_features

app = FastAPI(
    title="URL Classification API",
    description="API for classifying URLs as Malware, Phishing, Defacement, or Benign"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class URLRequest(BaseModel):
    url: str


try:
    model = joblib.load("model/model.pkl")
    scaler = joblib.load("model/scaler.pkl")
    print(f"Model loaded successfully from {"model/model.pkl"}")
except:
    print(f"Model not found at {"model/model.pkl"}. Using placeholder prediction.")
    model = None


    


idx2Label = {0: "Benign", 1: "Phishing", 2: "Defacement", 3: "Malware"}
common_keywords = np.loadtxt(r'C:\Users\OMEN\Desktop\2SC\2SC\Securité\Mini_Project\common_keywords.txt', dtype=str).tolist()

def predict_url_class(url, model = model ):

    features = extract_url_features(url, common_keywords)

    features = np.array(features).reshape(1, -1)
    features = scaler.transform(features)

    y_pred_idx = model.predict(features)
    confidence = float(np.max(y_pred_idx))


    y_pred_idx = np.argmax(y_pred_idx, axis=1)[0]

    y_pred = idx2Label.get(y_pred_idx, y_pred_idx)


    return y_pred , confidence


@app.post("/predict")
async def predict(request: URLRequest):
    prediction_type, confidence = predict_url_class(request.url)
        
    descriptions = {
            "Malware": "This URL likely contains malicious software that can harm your device or steal data.",
            "Phishing": "This URL appears to be a phishing attempt designed to steal your personal information.",
            "Defacement": "This URL points to a website that has likely been compromised and defaced.",
            "Benign": "This URL appears to be safe and does not contain any malicious content."
    }
    return {
            "type": prediction_type,
            "confidence": confidence,
            "description": descriptions[prediction_type]
        }


if __name__ == "__main__":
    os.makedirs("model", exist_ok=True)
    
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
