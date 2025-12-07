from fastapi import FastAPI, File, UploadFile, HTTPException
from PIL import Image
from ultralytics import YOLO
import io
import json

app = FastAPI(title="YOLOv8 Object Detection API")

# 1. Load Model (best.pt harus ada di folder yang sama)
print("Loading model YOLOv8...")
try:
    model = YOLO("best.pt") 
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")

# 2. Endpoint Prediksi
@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    try:
        # Baca gambar
        image_bytes = await file.read()
        img = Image.open(io.BytesIO(image_bytes))
        
        # --- PREDICTION ---
        # conf=0.25 artinya hanya ambil objek yang keyakinannya > 25%
        results = model.predict(img, conf=0.25)
        
        # --- FORMAT OUTPUT ---
        # Kita harus ekstrak data dari hasil YOLO menjadi JSON
        detections = []
        
        # results[0] adalah hasil untuk gambar pertama (karena kita cuma kirim 1 gambar)
        result = results[0]
        
        # Loop setiap kotak yang terdeteksi
        for box in result.boxes:
            # Ambil koordinat [x1, y1, x2, y2]
            # .tolist() mengubah Tensor menjadi list python biasa
            coords = box.xyxy[0].tolist() 
            
            # Ambil confidence score
            confidence = float(box.conf[0])
            
            # Ambil nama kelas (misal: "cell", "bacteria")
            class_id = int(box.cls[0])
            class_name = result.names[class_id]
            
            detections.append({
                "class": class_name,
                "confidence": round(confidence, 2),
                "box": {
                    "x1": round(coords[0]),
                    "y1": round(coords[1]),
                    "x2": round(coords[2]),
                    "y2": round(coords[3])
                }
            })
            
        return {"detections": detections, "count": len(detections)}

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def home():
    return {"message": "YOLOv8 Object Detection Online! 🕵️"}