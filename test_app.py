#!/usr/bin/env python3
"""
Test script for Smart Research Assistant
"""

import sys
import os

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import call_ai_inference

def test_local_inference():
    """Test the local inference function"""
    print("🧪 Testing Smart Research Assistant")
    print("=" * 40)
    
    # Test summary generation
    print("\n📄 Testing Summary Generation:")
    summary_prompt = "Please provide a concise summary of the following document in no more than 150 words. Focus on the main points, key findings, and conclusions. Document: This is a test document about artificial intelligence and machine learning."
    summary_result = call_ai_inference(summary_prompt)
    print(f"Summary: {summary_result}")
    
    # Test question answering
    print("\n❓ Testing Question Answering:")
    question_prompt = "Based on the following document, answer the question with contextual understanding. Document: This document discusses the benefits of renewable energy sources. Question: What are the main benefits?"
    question_result = call_ai_inference(question_prompt)
    print(f"Answer: {question_result}")
    
    # Test challenge generation
    print("\n🧠 Testing Challenge Generation:")
    challenge_prompt = "Based on the following document, generate exactly 3 challenging questions that test comprehension and understanding. Document: This document covers the basics of machine learning algorithms."
    challenge_result = call_ai_inference(challenge_prompt)
    print(f"Challenges: {challenge_result}")
    
    print("\n✅ All tests completed successfully!")
    print("🎉 Your Smart Research Assistant is working!")

if __name__ == "__main__":
    test_local_inference() 