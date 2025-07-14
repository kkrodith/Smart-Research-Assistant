# Ollama Setup Guide for Smart Research Assistant

## 🚀 Why Ollama?

**Ollama is completely FREE and UNLIMITED** - no API keys, no quotas, no restrictions!

- ✅ **Free Forever**: No API costs or usage limits
- ✅ **Local Processing**: Your documents stay private on your machine  
- ✅ **Offline Capable**: Works without internet connection
- ✅ **High Quality**: State-of-the-art AI models
- ✅ **Easy Setup**: Simple installation and management

## 📥 Quick Installation

### Linux (including WSL)
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### macOS
```bash
# Option 1: Download from website
open https://ollama.ai/download

# Option 2: Using Homebrew
brew install ollama
```

### Windows
1. Download from: https://ollama.ai/download
2. Run the installer
3. Ollama will be available in your terminal

## 🤖 Model Selection

### Recommended Models for Document Analysis

| Model | Size | Speed | Quality | Best For |
|-------|------|-------|---------|----------|
| **llama2** | 3.8GB | Medium | High | General documents, research papers |
| **mistral** | 4.1GB | Fast | High | Technical documents, code analysis |
| **neural-chat** | 4.1GB | Fast | Good | Conversational Q&A |
| **codellama** | 3.8GB | Medium | High | Technical manuals, code docs |

### Download Models
```bash
# Download the default model (recommended)
ollama pull llama2

# Or try other models
ollama pull mistral
ollama pull neural-chat
ollama pull codellama
```

## 🔧 Setup & Testing

### 1. Start Ollama Service
```bash
ollama serve
```
*Keep this terminal open while using the app*

### 2. Test Installation
```bash
# Test the setup
python test_ollama.py

# Or test manually
ollama run llama2 "Hello, can you help me analyze documents?"
```

### 3. Configure Smart Research Assistant
```bash
# Edit .env file to change model (optional)
nano .env

# Change OLLAMA_MODEL to your preferred model:
OLLAMA_MODEL=mistral  # or llama2, neural-chat, etc.
```

## 🚀 Quick Start Commands

```bash
# Complete setup in 3 commands:
./setup.sh          # Installs everything
ollama serve &       # Start Ollama in background
./start.sh           # Start the application
```

## 🔍 Troubleshooting

### Ollama Not Starting
```bash
# Check if port 11434 is in use
lsof -i :11434

# Kill existing Ollama processes
pkill ollama

# Restart Ollama
ollama serve
```

### Model Not Found
```bash
# List available models
ollama list

# Download missing model
ollama pull llama2

# Check disk space (models are 3-4GB each)
df -h
```

### Slow Performance
```bash
# Check system resources
htop

# Try a smaller/faster model
ollama pull neural-chat
# Update .env file: OLLAMA_MODEL=neural-chat
```

### Connection Issues
```bash
# Test Ollama API
curl http://localhost:11434/api/version

# Check firewall settings
sudo ufw status

# Restart Ollama with verbose logging
ollama serve --verbose
```

## 💡 Pro Tips

### 1. **Model Management**
```bash
# See all available models online
ollama search

# Remove unused models to save space
ollama rm old-model-name

# Update models
ollama pull llama2  # Downloads latest version
```

### 2. **Performance Optimization**
```bash
# Use GPU acceleration (if available)
ollama serve --gpu

# Adjust concurrent requests
export OLLAMA_NUM_PARALLEL=2

# Set memory limits
export OLLAMA_MAX_LOADED_MODELS=1
```

### 3. **Model Switching**
You can easily switch models without restarting the app:
1. Edit `.env` file: `OLLAMA_MODEL=mistral`
2. Restart the Smart Research Assistant
3. The app will use the new model automatically

### 4. **Development Mode**
```bash
# Run Ollama with debug output
OLLAMA_DEBUG=1 ollama serve

# Monitor resource usage
watch -n 1 'ps aux | grep ollama'
```

## 📊 Model Comparison

### For Different Document Types

**Research Papers & Academic Documents:**
- **Best**: `llama2` - Excellent comprehension and analysis
- **Alternative**: `mistral` - Faster, still very good

**Technical Documentation:**
- **Best**: `codellama` - Specialized for technical content  
- **Alternative**: `mistral` - Good general performance

**Legal Documents:**
- **Best**: `llama2` - Better with formal language
- **Alternative**: `neural-chat` - Good conversation flow

**General Documents:**
- **Best**: `mistral` - Fast and efficient
- **Alternative**: `llama2` - More thorough analysis

## 🔄 Switching from Other AI Services

If you were using other AI APIs:

### From OpenAI/ChatGPT
- Ollama models provide similar quality
- No API costs or rate limits
- Better privacy (local processing)

### From Google Gemini
- No more quota exceeded errors
- Faster responses (local processing)
- Works offline

### From Anthropic Claude
- Similar reasoning capabilities
- No subscription required
- Full control over model selection

## 🆘 Getting Help

1. **Check Ollama Status**
   ```bash
   curl http://localhost:11434/api/version
   ```

2. **Test Model Response**
   ```bash
   python test_ollama.py
   ```

3. **Review Logs**
   ```bash
   # Ollama logs
   ollama logs
   
   # App logs  
   tail -f app.log
   ```

4. **Community Resources**
   - Ollama GitHub: https://github.com/ollama/ollama
   - Ollama Discord: https://discord.gg/ollama
   - Documentation: https://ollama.ai/docs

## 🎯 Next Steps

Once Ollama is running:

1. ✅ **Start the app**: `./start.sh`
2. ✅ **Upload a document**: Go to http://localhost:8000
3. ✅ **Test features**: Try summary, Q&A, and challenge mode
4. ✅ **Experiment**: Try different models for different document types

---

**🎉 Enjoy unlimited, free AI-powered document analysis!**