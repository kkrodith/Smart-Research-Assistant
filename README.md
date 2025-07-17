# Smart Research Assistant

Project link:-  [Smart-research-assistant link](https://smart-research-assistant-eozyn757r-huny-chs-projects.vercel.app/)

A powerful AI-powered application for document analysis, comprehension testing, and intelligent question answering using OpenAI's GPT-3.5-turbo (like real PDF summarizers).

[![GitHub](https://img.shields.io/badge/GitHub-View%20on%20GitHub-blue?logo=github)](https://github.com/your-username/Smart-Research-Assistant)
[![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18+-blue?logo=react)](https://reactjs.org)

## 🌟 Features

- **📄 Auto Summary**: Generate concise summaries (≤150 words)
- **❓ Ask Anything**: Free-form questions with contextual understanding
- **🧠 Challenge Mode**: Test comprehension with AI-generated questions
- **📊 Smart Evaluation**: Get detailed feedback on your answers
- **🎯 Document Analysis**: Support for PDF and TXT files

## 🚀 Quick Start

### Prerequisites
- Python 3.11 or higher
- Node.js 16 or higher
- OpenAI API key (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Smart-Research-Assistant
   cd Smart-Research-Assistant
   ```

2. **Set up Python environment**
   ```bash
   python3.11 -m venv venv
   venv\Scripts\activate  # Windows
   # or source venv/bin/activate  # Mac/Linux
   pip install -r requirements.txt
   ```

3. **Get your OpenAI API key**
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a free account
   - Generate an API key
   - Run the setup script:
     ```bash
     python setup_api.py
     ```
   - Or set environment variable manually:
     ```bash
     # Windows
     set OPENAI_API_KEY=your-api-key-here
     
     # Mac/Linux
     export OPENAI_API_KEY=your-api-key-here
     ```

4. **Build frontend**
   ```bash
   cd frontend
   npm install
   npm run build
   cd ..
   ```

5. **Start the application**
   ```bash
   uvicorn app:app --reload
   ```

6. **Open your browser**
   - Visit [http://localhost:8000](http://localhost:8000)
   - Upload a document and start analyzing!

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   React Frontend│    │  FastAPI Backend│    │  OpenAI API     │
│                 │    │                 │    │                 │
│  - Material-UI  │◄──►│  - Document     │◄──►│  - GPT-3.5-turbo│
│  - File Upload  │    │  - Text Extract │    │  - Reliable     │
│  - Chat Interface│   │  - AI Processing │    │  - No Rate Limits│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 Technologies Used

### Frontend Technologies
- **React**: Modern UI framework
- **Material-UI**: Beautiful, responsive components
- **Axios**: HTTP client for API communication

### Backend Technologies
- **FastAPI**: Modern Python web framework
- **OpenAI API**: Industry-standard AI processing (GPT-3.5-turbo)
- **PyPDF2**: PDF text extraction
- **Pydantic**: Data validation and settings management

## 💰 Pricing & Limits

- **OpenAI API**: 
  - Free tier: $5 credit (enough for ~1000 requests)
  - GPT-3.5-turbo: ~$0.002 per 1K tokens
  - No rate limits on paid plans
- **File Size**: Max 10MB per document
- **Session Storage**: In-memory (suitable for demo/development)

## 🚀 Deployment

The application is designed for easy deployment:

1. **Environment Variables**: Set `OPENAI_API_KEY`
2. **Port Configuration**: Default port 8000 (configurable)
3. **Static Files**: Frontend builds to `/frontend/build`

### Docker Deployment
```bash
docker-compose up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## �� Acknowledgments

- OpenAI for powerful AI capabilities
- React and Material-UI for excellent frontend experience
- FastAPI for modern Python web development

## 🔍 Troubleshooting

1. Check the API documentation at `/docs`
2. Review the console logs for error details
3. Ensure your OpenAI API key is correctly configured
4. Verify file format and size requirements

## 📊 Performance

- **Response Time**: < 3 seconds for most requests
- **Accuracy**: High-quality summaries and answers
- **Reliability**: Industry-standard OpenAI API
- **Scalability**: Ready for production deployment
