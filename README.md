# Smart Research Assistant

A powerful AI-powered application for document analysis, comprehension testing, and intelligent question answering using Ollama (completely free, unlimited, local AI).

## 🌟 Features

### Core Features
- **📄 Document Upload**: Support for PDF and TXT files
- **🤖 Auto Summary**: Generates concise summaries (≤150 words) using AI
- **❓ Ask Anything**: Interactive Q&A with contextual understanding
- **🧠 Challenge Mode**: AI-generated comprehension questions with evaluation

### Bonus Features
- **💾 Memory Handling**: Maintains conversation context across interactions
- **🎯 Answer Highlighting**: Shows relevant document snippets that support answers
- **📊 Progress Tracking**: Visual progress indicators and scoring system
- **🔄 Real-time Updates**: Seamless user experience with loading states

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- Ollama (completely free, unlimited AI models)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-research-assistant
   ```

2. **Run the setup script**
   ```bash
   ./setup.sh
   ```
   This will install Ollama and download the default AI model.

3. **Start the application**
   ```bash
   ./start.sh
   ```

5. **Access the application**
   - Open your browser to: http://localhost:8000
   - API documentation: http://localhost:8000/docs

## 📁 Project Structure

```
smart-research-assistant/
├── app.py                 # FastAPI backend server
├── requirements.txt       # Python dependencies
├── setup.sh              # Setup script
├── start.sh              # Start script
├── .env.example          # Environment variables template
├── context.md            # Project requirements
├── README.md             # This file
└── frontend/             # React frontend
    ├── package.json      # Node.js dependencies
    ├── public/           # Static files
    └── src/              # React components
        ├── App.js        # Main application component
        ├── index.js      # React entry point
        └── components/   # React components
            ├── Header.js
            ├── DocumentUpload.js
            ├── DocumentAnalysis.js
            ├── AskAnything.js
            └── ChallengeMode.js
```

## 🔧 Manual Setup

If you prefer manual setup:

### Backend Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Install and start Ollama
curl -fsSL https://ollama.ai/install.sh | sh
ollama serve &
ollama pull llama2

# Start backend server
python app.py
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Build for production
npm run build

# Or run in development mode
npm start
```

## 🎯 Usage Guide

### 1. Document Upload
- Drag and drop or click to upload PDF/TXT files
- Supported formats: PDF, TXT (max 10MB)
- Auto-generated summary appears immediately

### 2. Ask Anything Mode
- Ask free-form questions about your document
- Get contextual answers with justifications
- View highlighted relevant text snippets
- Memory handling maintains conversation context

### 3. Challenge Mode
- AI generates 3 comprehension questions
- Questions test understanding, logic, and critical thinking
- Get scored feedback on your answers
- Progress tracking with visual indicators

## 🔗 API Endpoints

### Document Management
- `POST /upload` - Upload and process document
- `GET /sessions` - Get available document sessions

### Question & Answer
- `POST /ask` - Ask questions about document
- `POST /challenge` - Generate challenge questions
- `POST /evaluate` - Evaluate user answers

### Static Files
- `GET /` - Serve React frontend
- `GET /static/*` - Serve static assets

## 🛠️ Technical Details

### Backend Technologies
- **FastAPI**: Modern Python web framework
- **Ollama**: Local AI models (completely free & unlimited)
- **PyPDF2**: PDF text extraction
- **Pydantic**: Data validation and settings management

### Frontend Technologies
- **React**: User interface library
- **Material-UI**: Component library with modern design
- **Axios**: HTTP client for API communication
- **React Dropzone**: File upload interface

### Key Features Implementation
- **Memory Handling**: In-memory storage with conversation history
- **Answer Highlighting**: Keyword-based text matching and highlighting
- **Real-time Updates**: WebSocket-like experience with loading states
- **Error Handling**: Comprehensive error handling and user feedback

## 🌐 Deployment

### Local Development
```bash
# Development mode (frontend only)
cd frontend && npm start

# Production mode (integrated)
./start.sh
```

### Remote Deployment
The application is designed for easy deployment:

1. **Ollama Installation**: Install Ollama on your server
2. **Port Configuration**: Default port 8000 (configurable)
3. **Static Files**: Frontend builds to `/frontend/build`
4. **CORS**: Configured for cross-origin requests

### Docker Deployment (Optional)
```dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["python", "app.py"]
```

## 📊 Performance & Limitations

### System Requirements
- **Ollama**: Completely free, unlimited requests
- **RAM**: 4GB+ recommended for AI models
- **File Size**: Max 10MB per document
- **Session Storage**: In-memory (suitable for demo/development)

### Performance Optimizations
- **Chunked Processing**: Large documents processed in chunks
- **Caching**: Document content cached during session
- **Lazy Loading**: Frontend components loaded on demand

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Ollama for providing free, unlimited local AI models
- React and Material-UI for excellent frontend experience
- FastAPI for modern Python web development

## 📞 Support

For issues or questions:
1. Check the API documentation at `/docs`
2. Review the console logs for error details
3. Ensure Ollama is running (`ollama serve`)
4. Verify file format and size requirements

---

**Built with ❤️ for intelligent document analysis and comprehension testing**