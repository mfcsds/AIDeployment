import os
import json
import io
import numpy as np
from PIL import Image
from ultralytics import YOLO

# 1. MODEL_FN: Dipanggil sekali saat server menyala untuk load model
def model_fn(model_dir):
    print("Loading model YOLOv8...")
    # Di SageMaker, model artifact diekstrak ke 'model_dir'
    model_path = os.path.join(model_dir, "best.pt")
    
    try:
        model = YOLO(model_path)
        print("Model loaded successfully!")
        return model
    except Exception as e:
        print(f"Error loading model: {e}")
        raise e

# 2. INPUT_FN: Menerima request data (byte gambar)
def input_fn(request_body, request_content_type):
    # Support format gambar umum
    if request_content_type in ['application/x-image', 'image/jpeg', 'image/png']:
        return Image.open(io.BytesIO(request_body))
    else:
        raise ValueError(f"Content type {request_content_type} not supported!")

# 3. PREDICT_FN: Melakukan prediksi (Inti logika Anda ada di sini)
def predict_fn(input_data, model):
    # input_data adalah object Image dari input_fn
    
    # conf=0.25 sesuai kode lama Anda
    results = model.predict(input_data, conf=0.25)
    
    # Format Output (Logic parsing JSON Anda)
    detections = []
    result = results[0]  # Ambil hasil gambar pertama
    
    for box in result.boxes:
        coords = box.xyxy[0].tolist() 
        confidence = float(box.conf[0])
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

# 4. OUTPUT_FN: Mengembalikan hasil sebagai JSON
def output_fn(prediction_output, accept='application/json'):
    return json.dumps(prediction_output), accept