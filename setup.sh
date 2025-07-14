#!/bin/bash

echo "🚀 Setting up Smart Research Assistant..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
cd frontend
npm install

# Build React application
echo "🔨 Building React application..."
npm run build

# Go back to root directory
cd ..

# Install Ollama if not already installed
if ! command -v ollama &> /dev/null; then
    echo "📥 Installing Ollama (local AI model runner)..."
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        curl -fsSL https://ollama.ai/install.sh | sh
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "Please install Ollama from: https://ollama.ai/download"
        echo "Or use: brew install ollama"
    else
        echo "Please install Ollama from: https://ollama.ai/download"
    fi
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "⚙️  Creating .env file..."
    cp .env.example .env
fi

# Check if Ollama is running and download default model
echo "🤖 Setting up Ollama..."
if command -v ollama &> /dev/null; then
    # Start Ollama service
    echo "Starting Ollama service..."
    ollama serve &
    sleep 5
    
    # Download the default model
    echo "📥 Downloading llama2 model (this may take a few minutes)..."
    ollama pull llama2
    
    echo "✅ Ollama setup complete!"
else
    echo "⚠️  Ollama not found. Please install it manually:"
    echo "   Visit: https://ollama.ai/download"
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Ensure Ollama is running: ollama serve"
echo "2. Run: ./start.sh"
echo ""
echo "Available models:"
echo "- llama2 (default, good for general tasks)"
echo "- mistral (fast and efficient)"
echo "- codellama (good for technical documents)"
echo ""
echo "Download models with: ollama pull <model-name>"