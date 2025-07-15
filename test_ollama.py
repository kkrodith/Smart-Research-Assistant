#!/usr/bin/env python3
"""
Test script to verify Ollama is working correctly.
Run this before starting the main application.
"""

import requests
import json
import time

def test_ollama_connection():
    """Test if Ollama is running and accessible"""
    try:
        response = requests.get("http://localhost:11434/api/version", timeout=5)
        if response.status_code == 200:
            print("✅ Ollama is running")
            return True
        else:
            print(f"❌ Ollama returned status code: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to Ollama. Is it running?")
        print("   Start with: ollama serve")
        return False
    except Exception as e:
        print(f"❌ Error connecting to Ollama: {e}")
        return False

def test_ollama_models():
    """Check available models"""
    try:
        # This endpoint may not exist in all Ollama versions, so we'll try a generation instead
        return test_ollama_generation()
    except Exception as e:
        print(f"⚠️  Could not check models: {e}")
        return True  # Continue anyway

def test_ollama_generation():
    """Test if Ollama can generate text"""
    try:
        print("🧪 Testing text generation...")
        
        data = {
            "model": "llama2",
            "prompt": "Hello, respond with just 'Hi there!'",
            "stream": False,
            "options": {
                "temperature": 0.1,
                "max_tokens": 10
            }
        }
        
        response = requests.post(
            "http://localhost:11434/api/generate", 
            json=data, 
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            generated_text = result.get("response", "").strip()
            print(f"✅ Text generation working: '{generated_text}'")
            return True
        else:
            print(f"❌ Generation failed with status: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.Timeout:
        print("❌ Generation request timed out")
        print("   This might indicate the model is not downloaded or is very slow")
        return False
    except Exception as e:
        print(f"❌ Generation test failed: {e}")
        return False

def check_model_availability():
    """Check if llama2 model is available"""
    print("📥 Checking if llama2 model is available...")
    print("   If not available, download with: ollama pull llama2")
    
    # Try a simple generation to see if model exists
    try:
        data = {
            "model": "llama2",
            "prompt": "test",
            "stream": False,
            "options": {"max_tokens": 1}
        }
        
        response = requests.post(
            "http://localhost:11434/api/generate", 
            json=data, 
            timeout=10
        )
        
        if response.status_code == 200:
            print("✅ llama2 model is available")
            return True
        elif "model not found" in response.text.lower():
            print("❌ llama2 model not found")
            print("   Download with: ollama pull llama2")
            return False
        else:
            print(f"⚠️  Unexpected response: {response.status_code}")
            return True  # Continue anyway
            
    except Exception as e:
        print(f"⚠️  Could not check model availability: {e}")
        return True  # Continue anyway

def main():
    print("🔍 Testing Ollama setup for Smart Research Assistant")
    print("=" * 50)
    
    # Test connection
    if not test_ollama_connection():
        print("\n❌ Ollama connection failed. Please:")
        print("1. Install Ollama: curl -fsSL https://ollama.ai/install.sh | sh")
        print("2. Start Ollama: ollama serve")
        print("3. Run this test again")
        return False
    
    # Check model availability
    if not check_model_availability():
        print("\n❌ Model not available. Please:")
        print("1. Download model: ollama pull llama2")
        print("2. Run this test again")
        return False
    
    # Test generation
    if not test_ollama_generation():
        print("\n❌ Text generation failed")
        return False
    
    print("\n" + "=" * 50)
    print("🎉 All tests passed! Ollama is ready for the application.")
    print("   Start the app with: ./start.sh")
    return True

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)