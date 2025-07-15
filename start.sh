#!/bin/bash

echo "🚀 Starting Smart Research Assistant..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please run ./setup.sh first."
    exit 1
fi

# Load environment variables
export $(cat .env | xargs)

# Check if frontend build exists
if [ ! -d "frontend/build" ]; then
    echo "📦 Building React frontend..."
    cd frontend
    npm run build
    cd ..
fi

echo "🌟 Starting backend server..."
echo "   Backend: http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the FastAPI server
python app.py