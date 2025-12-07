from fastapi import FastAPI, File, UploadFile, HTTPException
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import sys

# 1. Inisialisasi Aplikasi
app = FastAPI(title="CIFAR-10 Docker API")

# 2. Load Model
print("Sedang memuat model...")
try:
    model = tf.keras.models.load_model('model_cifar10.h5')
    print("Model berhasil dimuat!")
except Exception as e:
    print(f"Error memuat model: {e}")
    sys.exit(1) # Matikan server jika model gagal load

class_names = ['airplane', 'automobile', 'bird', 'cat', 'deer',
               'dog', 'frog', 'horse', 'ship', 'truck']

# 3. Fungsi Bantu (Preprocessing)
def prepare_image(image_bytes):
    try:
        img = Image.open(io.BytesIO(image_bytes))
        
        # --- PERBAIKAN PENTING DI SINI ---
        # Paksa ubah ke RGB (3 channel) agar PNG transparan tidak bikin error
        img = img.convert("RGB") 
        
        img = img.resize((32, 32))           
        img_array = np.array(img) / 255.0    
        img_array = np.expand_dims(img_array, axis=0) 
        return img_array
    except Exception as e:
        print(f"Error saat memproses gambar: {e}")
        return None

# 4. Endpoint Prediksi
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        # Baca file gambar
        image_bytes = await file.read()
        
        # Proses gambar
        processed_image = prepare_image(image_bytes)
        
        if processed_image is None:
            raise HTTPException(status_code=400, detail="File bukan gambar yang valid")
        
        # Prediksi
        prediction = model.predict(processed_image)
        score = tf.nn.softmax(prediction[0])
        
        top_class_idx = np.argmax(score)
        result = {
            "class": class_names[top_class_idx],
            "confidence": float(score[top_class_idx])
        }
        return result
        
    except Exception as e:
        # Ini akan mencetak error asli ke Log Hugging Face
        print(f"CRITICAL ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def home():
    return {"message": "Server AI CIFAR-10 Online! 🚀"}