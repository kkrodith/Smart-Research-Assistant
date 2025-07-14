# Deployment Guide - Smart Research Assistant

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Smart Research Assistant                     │
│                         Architecture                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   React Frontend│    │  FastAPI Backend│    │     Ollama      │
│                 │    │                 │    │   (Local AI)    │
│  - Material-UI  │◄──►│  - Document     │◄──►│                 │
│  - File Upload  │    │    Processing   │    │  - Text Analysis│
│  - Chat Interface│    │  - Session Mgmt │    │  - Question Gen │
│  - Progress UI  │    │  - API Endpoints│    │  - Evaluation   │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│  Static Files   │    │  In-Memory      │    │  Local Models   │
│  - HTML/CSS/JS  │    │  Storage        │    │  - Unlimited    │
│  - Built Assets │    │  - Documents    │    │  - No API Keys  │
│  - Images       │    │  - Conversations│    │  - High Quality │
│                 │    │  - Sessions     │    │  - Offline Ready│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Deployment Methods

### Method 1: Quick Start (Recommended)

```bash
# 1. Clone and setup
git clone <your-repo-url>
cd smart-research-assistant
./setup.sh

# 2. Wait for Ollama model download (automatic)

# 3. Start application
./start.sh
```

**Access:** http://localhost:8000

### Method 2: Docker Deployment

```bash
# Build and run with Docker
docker-compose up --build

# Or run detached
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Method 3: Manual Deployment

```bash
# Backend
pip install -r requirements.txt
# Install and start Ollama
curl -fsSL https://ollama.ai/install.sh | sh
ollama serve &
ollama pull llama2
python app.py

# Frontend (separate terminal)
cd frontend
npm install
npm run build
# Backend serves the built files
```

## 🌐 Production Deployment

### Cloud Platform Deployment

#### 1. Heroku Deployment

```bash
# Install Heroku CLI
# Create Heroku app
heroku create smart-research-assistant

# Add Ollama buildpack (custom)
heroku buildpacks:add https://github.com/heroku-community/heroku-buildpack-ollama

# Deploy
git push heroku main
```

**Heroku Configuration:**
- Add `Procfile`: `web: python app.py`
- Runtime: `python-3.9.x`
- Buildpacks: Node.js + Python

#### 2. Railway Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway login
railway init
railway up

# Ollama will be installed automatically via Dockerfile
```

#### 3. Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Note: Vercel may have limitations with Ollama due to serverless nature
# Consider using Railway or traditional VPS for Ollama deployment
```

### VPS/Server Deployment

#### 1. Ubuntu/Debian Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y python3 python3-pip nodejs npm nginx

# Clone repository
git clone <your-repo-url>
cd smart-research-assistant

# Setup application
./setup.sh

# Configure systemd service
sudo cp smart-research-assistant.service /etc/systemd/system/
sudo systemctl enable smart-research-assistant
sudo systemctl start smart-research-assistant

# Configure Nginx
sudo cp nginx.conf /etc/nginx/sites-available/smart-research-assistant
sudo ln -s /etc/nginx/sites-available/smart-research-assistant /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 2. Docker on VPS

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Deploy
git clone <your-repo-url>
cd smart-research-assistant
docker-compose up -d
```

## 🔧 Configuration Files

### Systemd Service File

```ini
# /etc/systemd/system/smart-research-assistant.service
[Unit]
Description=Smart Research Assistant
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/smart-research-assistant
ExecStartPre=/usr/bin/ollama serve
ExecStart=/usr/bin/python3 app.py
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### Nginx Configuration

```nginx
# /etc/nginx/sites-available/smart-research-assistant
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support (if needed)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Static files
    location /static/ {
        alias /var/www/smart-research-assistant/frontend/build/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # File upload size
    client_max_body_size 10M;
}
```

## 📊 Monitoring & Logging

### Application Monitoring

```python
# Add to app.py for monitoring
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
```

### Health Checks

```bash
# API Health Check
curl -f http://localhost:8000/sessions || exit 1

# Docker Health Check (already included in Dockerfile)
docker-compose ps
```

### Log Management

```bash
# View application logs
tail -f app.log

# Docker logs
docker-compose logs -f smart-research-assistant

# Systemd logs
sudo journalctl -u smart-research-assistant -f
```

## 🔒 Security Considerations

### Local AI Security

```bash
# Ollama runs locally - no API keys to secure
# Ensure Ollama is not exposed to public internet
# Use firewall rules to restrict Ollama port (11434)

# Block external access to Ollama
sudo ufw deny 11434
```

### API Security

```python
# Add rate limiting (optional)
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/upload")
@limiter.limit("5/minute")
async def upload_document(request: Request, file: UploadFile = File(...)):
    # ... existing code
```

### HTTPS Configuration

```nginx
# SSL configuration for production
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # ... rest of configuration
}
```

## 📈 Performance Optimization

### Frontend Optimization

```bash
# Build with optimizations
cd frontend
npm run build

# Serve with compression
# (handled by FastAPI StaticFiles)
```

### Backend Optimization

```python
# Add caching for expensive operations
from functools import lru_cache

@lru_cache(maxsize=100)
def cached_summary_generation(text_hash):
    # ... implementation
```

### Database Upgrade (Optional)

```python
# Replace in-memory storage with persistent storage
import sqlite3
# or
import redis

# For production, consider:
# - PostgreSQL
# - MongoDB
# - Redis for caching
```

## 🚨 Troubleshooting

### Common Issues

1. **Ollama Connection Issues**
   ```bash
   # Check if Ollama is running
   curl http://localhost:11434/api/version
   
   # Start Ollama if not running
   ollama serve &
   
   # Check available models
   ollama list
   
   # Download model if missing
   ollama pull llama2
   ```

2. **Port Conflicts**
   ```bash
   # Check port usage
   lsof -i :8000
   
   # Change port in app.py
   uvicorn.run(app, host="0.0.0.0", port=8080)
   ```

3. **Frontend Build Issues**
   ```bash
   # Clear cache and rebuild
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

### Performance Issues

```bash
# Monitor resource usage
htop
docker stats

# Check application logs
tail -f app.log
```

## 🔄 Updates & Maintenance

### Application Updates

```bash
# Pull latest changes
git pull origin main

# Update dependencies
pip install -r requirements.txt
cd frontend && npm install

# Rebuild frontend
npm run build

# Restart services
sudo systemctl restart smart-research-assistant
# or
docker-compose restart
```

### Backup Strategy

```bash
# Backup configuration
cp .env .env.backup
cp docker-compose.yml docker-compose.yml.backup

# For persistent data (if implemented)
# mysqldump / pg_dump / redis-cli SAVE
```

## 📱 Mobile & Responsive Access

The application is fully responsive and works on:
- Desktop browsers
- Mobile devices
- Tablets
- Touch interfaces

## 🌍 Multi-language Support (Future)

```python
# Add to app.py for internationalization
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📞 Support & Contact

For deployment issues:
1. Check logs first
2. Verify Ollama is running and accessible
3. Test API endpoints manually
4. Review network/firewall settings

**Need help?** Create an issue in the repository with:
- Deployment method used
- Error messages
- System specifications
- Configuration details (without sensitive data)

---

**Ready to deploy? Choose your preferred method and follow the instructions above!** 🚀