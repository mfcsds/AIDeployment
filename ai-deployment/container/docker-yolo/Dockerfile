# Gunakan Python 3.10 (Stabil untuk YOLOv8)
FROM python:3.10-slim

WORKDIR /app

# --- PERBAIKAN DI SINI ---
# Ganti 'libgl1-mesa-glx' menjadi 'libgl1'
# Paket lama sudah dihapus di Debian versi baru
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# 2. Copy requirements dan install
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# 3. Copy sisa file (best.pt dan main.py)
COPY . .

# 4. Expose Port
EXPOSE 7860

# 5. Jalankan
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]