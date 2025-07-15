#!/usr/bin/env python3
"""
Setup script for OpenAI API key
"""

import os
import sys

def setup_openai_key():
    print("🔧 OpenAI API Key Setup")
    print("=" * 40)
    
    # Check if key already exists
    current_key = os.getenv("OPENAI_API_KEY")
    if current_key and current_key != "your-openai-api-key-here":
        print(f"✅ OpenAI API key already set: {current_key[:10]}...")
        return True
    
    print("📝 To use this app, you need an OpenAI API key:")
    print("1. Visit: https://platform.openai.com/api-keys")
    print("2. Create a free account")
    print("3. Generate an API key")
    print("4. Copy the key below")
    print()
    
    api_key = input("Enter your OpenAI API key: ").strip()
    
    if not api_key:
        print("❌ No API key provided. App will use fallback mode.")
        return False
    
    if api_key == "your-openai-api-key-here":
        print("❌ Please enter your actual API key, not the placeholder.")
        return False
    
    # Set environment variable
    os.environ["OPENAI_API_KEY"] = api_key
    print(f"✅ API key set: {api_key[:10]}...")
    
    # Create .env file
    try:
        with open(".env", "w") as f:
            f.write(f"OPENAI_API_KEY={api_key}\n")
        print("✅ .env file created")
    except Exception as e:
        print(f"⚠️  Could not create .env file: {e}")
    
    return True

if __name__ == "__main__":
    setup_openai_key() 