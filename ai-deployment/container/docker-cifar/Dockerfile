# 1. Ganti Base Image ke Python 3.12 (Versi Slim)
FROM python:3.12-slim

# 2. Tentukan folder kerja di dalam container
WORKDIR /app

# 3. Copy file requirements dulu
COPY requirements.txt .

# 4. Install library yang dibutuhkan
# PENTING: Python 3.12 butuh TensorFlow versi 2.16 ke atas.
# Pip akan otomatis mencari versi yang kompatibel.
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# 5. Copy sisa file (model dan main.py) ke dalam container
COPY . .

# 6. Buka Port 7860 (Standar Hugging Face Spaces)
EXPOSE 7860

# 7. Perintah dijalankan
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]