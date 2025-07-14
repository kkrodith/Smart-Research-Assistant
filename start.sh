#!/bin/bash

echo "🚀 Starting Smart Research Assistant..."

# Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo "❌ Ollama not found. Please run ./setup.sh first."
    exit 1
fi

# Check if Ollama is running
if ! curl -s http://localhost:11434/api/version >/dev/null 2>&1; then
    echo "🚀 Starting Ollama service..."
    ollama serve &
    sleep 5
    
    # Wait for Ollama to be ready
    echo "⏳ Waiting for Ollama to be ready..."
    timeout=30
    while [ $timeout -gt 0 ]; do
        if curl -s http://localhost:11434/api/version >/dev/null 2>&1; then
            break
        fi
        sleep 1
        timeout=$((timeout-1))
    done
    
    if [ $timeout -eq 0 ]; then
        echo "❌ Ollama failed to start. Please check your installation."
        exit 1
    fi
fi

# Load environment variables if .env exists
if [ -f .env ]; then
    export $(cat .env | xargs)
fi

# Check if frontend build exists
if [ ! -d "frontend/build" ]; then
    echo "📦 Building React frontend..."
    cd frontend
    npm run build
    cd ..
fi

echo "🌟 Starting backend server..."
echo "   Application: http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo "   Ollama: http://localhost:11434"
echo ""
echo "✅ Using Ollama for AI processing (completely free & unlimited!)"
echo "Press Ctrl+C to stop the server"
echo ""

# Start the FastAPI server
python app.py