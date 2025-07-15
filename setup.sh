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

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "⚙️  Creating .env file..."
    cp .env.example .env
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "2. Run: ./start.sh"
echo ""
echo "Or run manually:"
echo "- Backend: python app.py"
echo "- Frontend: cd frontend && npm start"