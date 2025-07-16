# FROM node:16-alpine AS frontend-builder

# # Build frontend
# WORKDIR /app/frontend
# COPY frontend/package*.json ./
# RUN npm ci --only=production
# COPY frontend/ ./
# RUN npm run build

# Python backend
FROM python:3.9-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Python requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY app.py .
COPY context.md .

# Copy frontend build from previous stage
# COPY --from=frontend-builder /app/frontend/build ./frontend/build

# Create a non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/sessions || exit 1

# Start command
CMD ["python", "app.py"]