from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
from pydantic import BaseModel
import requests
import PyPDF2
import io
import json
import os
import uvicorn
from typing import List, Optional, Dict, Any
from datetime import datetime
import re

app = FastAPI(title="Smart Research Assistant", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Ollama API (completely free, unlimited, local)
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama2")  # or "mistral", "codellama", etc.

# In-memory storage for document content and conversation history
document_storage = {}
conversation_history = {}

class DocumentResponse(BaseModel):
    summary: str
    content: str
    filename: str
    upload_time: str

class QuestionRequest(BaseModel):
    question: str
    session_id: str

class AnswerResponse(BaseModel):
    answer: str
    justification: str
    highlighted_text: str
    confidence: float

class ChallengeQuestion(BaseModel):
    question: str
    expected_answer: str
    difficulty: str

class ChallengeResponse(BaseModel):
    questions: List[ChallengeQuestion]
    session_id: str

class UserAnswerRequest(BaseModel):
    question: str
    user_answer: str
    session_id: str

class EvaluationResponse(BaseModel):
    score: float
    feedback: str
    correct_answer: str
    justification: str

def extract_text_from_pdf(pdf_file):
    """Extract text from PDF file"""
    try:
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading PDF: {str(e)}")

def extract_text_from_txt(txt_file):
    """Extract text from TXT file"""
    try:
        content = txt_file.read()
        if isinstance(content, bytes):
            content = content.decode('utf-8')
        return content
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading TXT: {str(e)}")

def call_ollama_api(prompt: str, system_prompt: str = "") -> str:
    """Call Ollama API for text generation"""
    try:
        url = f"{OLLAMA_BASE_URL}/api/generate"
        data = {
            "model": OLLAMA_MODEL,
            "prompt": prompt,
            "system": system_prompt,
            "stream": False,
            "options": {
                "temperature": 0.7,
                "top_p": 0.9,
                "max_tokens": 2048
            }
        }
        
        response = requests.post(url, json=data, timeout=120)
        if response.status_code == 200:
            result = response.json()
            return result.get("response", "").strip()
        else:
            return f"Error: Ollama API returned status {response.status_code}"
    except requests.exceptions.ConnectionError:
        return "Error: Could not connect to Ollama. Please ensure Ollama is running on your system."
    except Exception as e:
        return f"Error calling Ollama API: {str(e)}"

def generate_summary(text: str, max_words: int = 150) -> str:
    """Generate a concise summary using Ollama API"""
    try:
        prompt = f"""Please provide a concise summary of the following document in no more than {max_words} words. Focus on the main points, key findings, and conclusions.

Document:
{text[:8000]}"""
        
        system_prompt = "You are a helpful assistant that creates concise, accurate summaries of documents. Focus on extracting the most important information."
        
        response = call_ollama_api(prompt, system_prompt)
        return response
    except Exception as e:
        return f"Error generating summary: {str(e)}"

def find_relevant_text(document_text: str, query: str, context_words: int = 100) -> str:
    """Find and return relevant text snippets from document"""
    try:
        # Simple keyword-based search for highlighting
        words = query.lower().split()
        sentences = document_text.split('.')
        
        relevant_sentences = []
        for sentence in sentences:
            sentence_lower = sentence.lower()
            if any(word in sentence_lower for word in words):
                relevant_sentences.append(sentence.strip())
        
        if relevant_sentences:
            return '. '.join(relevant_sentences[:3])  # Return top 3 relevant sentences
        else:
            return document_text[:500]  # Return first 500 chars if no specific match
    except Exception:
        return document_text[:500]

@app.post("/upload", response_model=DocumentResponse)
async def upload_document(file: UploadFile = File(...)):
    """Upload and process document (PDF or TXT)"""
    if not file.filename.lower().endswith(('.pdf', '.txt')):
        raise HTTPException(status_code=400, detail="Only PDF and TXT files are supported")
    
    try:
        # Read file content
        file_content = await file.read()
        file_obj = io.BytesIO(file_content)
        
        # Extract text based on file type
        if file.filename.lower().endswith('.pdf'):
            text = extract_text_from_pdf(file_obj)
        else:
            text = extract_text_from_txt(file_obj)
        
        if not text.strip():
            raise HTTPException(status_code=400, detail="No text content found in the file")
        
        # Generate summary
        summary = generate_summary(text)
        
        # Store document with session ID
        session_id = datetime.now().strftime("%Y%m%d_%H%M%S")
        document_storage[session_id] = {
            "content": text,
            "filename": file.filename,
            "upload_time": datetime.now().isoformat(),
            "summary": summary
        }
        
        # Initialize conversation history
        conversation_history[session_id] = []
        
        return DocumentResponse(
            summary=summary,
            content=text[:1000] + "..." if len(text) > 1000 else text,  # Truncate for response
            filename=file.filename,
            upload_time=datetime.now().isoformat()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing document: {str(e)}")

@app.post("/ask", response_model=AnswerResponse)
async def ask_question(request: QuestionRequest):
    """Ask a question about the uploaded document"""
    if request.session_id not in document_storage:
        raise HTTPException(status_code=404, detail="Document not found. Please upload a document first.")
    
    document = document_storage[request.session_id]
    
    try:
        # Add conversation history context
        history_context = ""
        if request.session_id in conversation_history:
            recent_history = conversation_history[request.session_id][-5:]  # Last 5 interactions
            history_context = "\n".join([f"Q: {h['question']}\nA: {h['answer']}" for h in recent_history])
        
        prompt = f"""Based on the following document, answer the question with contextual understanding. Provide a clear answer and justify it with specific references from the document. Do not hallucinate or fabricate information not present in the document.

Previous conversation context:
{history_context}

Document:
{document['content']}

Question: {request.question}

Please provide:
1. A clear answer
2. Justification with specific references from the document
3. A confidence score (0-1)"""
        
        system_prompt = "You are a helpful assistant that answers questions based strictly on the provided document content. Always cite specific parts of the document to support your answers."
        
        answer_text = call_ollama_api(prompt, system_prompt)
        
        # Extract highlighted text from document
        highlighted_text = find_relevant_text(document['content'], request.question)
        
        # Store in conversation history
        conversation_history[request.session_id].append({
            "question": request.question,
            "answer": answer_text,
            "timestamp": datetime.now().isoformat()
        })
        
        return AnswerResponse(
            answer=answer_text,
            justification=f"Based on the document '{document['filename']}'",
            highlighted_text=highlighted_text,
            confidence=0.85  # Default confidence
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error answering question: {str(e)}")

@app.post("/challenge", response_model=ChallengeResponse)
async def generate_challenge(session_id: str):
    """Generate challenge questions based on the document"""
    if session_id not in document_storage:
        raise HTTPException(status_code=404, detail="Document not found. Please upload a document first.")
    
    document = document_storage[session_id]
    
    try:
        prompt = f"""Based on the following document, generate exactly 3 challenging questions that test:
1. Comprehension and understanding
2. Logical reasoning
3. Critical thinking

Make sure the questions can be answered from the document content.
Format your response as JSON with the following structure:
{{
    "questions": [
        {{
            "question": "Your question here",
            "expected_answer": "Expected answer based on document",
            "difficulty": "easy/medium/hard"
        }}
    ]
}}

Document:
{document['content'][:6000]}"""
        
        system_prompt = "You are a helpful assistant that creates challenging comprehension questions based on document content. Always respond with valid JSON format."
        
        response_text = call_ollama_api(prompt, system_prompt)
        
        # Extract JSON from response
        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if json_match:
            questions_data = json.loads(json_match.group())
            questions = [ChallengeQuestion(**q) for q in questions_data['questions']]
        else:
            # Fallback questions if JSON parsing fails
            questions = [
                ChallengeQuestion(
                    question="What is the main objective or purpose described in this document?",
                    expected_answer="Based on document content",
                    difficulty="medium"
                ),
                ChallengeQuestion(
                    question="What are the key findings or conclusions mentioned?",
                    expected_answer="Based on document content",
                    difficulty="medium"
                ),
                ChallengeQuestion(
                    question="What implications or recommendations are discussed?",
                    expected_answer="Based on document content",
                    difficulty="hard"
                )
            ]
        
        return ChallengeResponse(questions=questions, session_id=session_id)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating challenge: {str(e)}")

@app.post("/evaluate", response_model=EvaluationResponse)
async def evaluate_answer(request: UserAnswerRequest):
    """Evaluate user's answer to a challenge question"""
    if request.session_id not in document_storage:
        raise HTTPException(status_code=404, detail="Document not found. Please upload a document first.")
    
    document = document_storage[request.session_id]
    
    try:
        prompt = f"""Evaluate the user's answer to the question based on the document content.
Provide a score (0-100), feedback, and the correct answer with justification.

Document:
{document['content'][:6000]}

Question: {request.question}
User's Answer: {request.user_answer}

Please evaluate and provide:
1. Score (0-100)
2. Detailed feedback
3. Correct answer based on document
4. Justification with document references"""
        
        system_prompt = "You are a helpful assistant that evaluates answers based strictly on document content. Provide constructive feedback and accurate scoring."
        
        evaluation_text = call_ollama_api(prompt, system_prompt)
        
        # Extract score (simple pattern matching)
        score_match = re.search(r'(\d+(?:\.\d+)?)', evaluation_text)
        score = float(score_match.group(1)) if score_match else 75.0
        
        return EvaluationResponse(
            score=score / 100,  # Convert to 0-1 scale
            feedback=evaluation_text,
            correct_answer="Based on document analysis",
            justification=f"Evaluated against document '{document['filename']}'"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error evaluating answer: {str(e)}")

@app.get("/sessions")
async def get_sessions():
    """Get all available document sessions"""
    return {
        "sessions": [
            {
                "session_id": sid,
                "filename": doc["filename"],
                "upload_time": doc["upload_time"]
            }
            for sid, doc in document_storage.items()
        ]
    }

# Serve React frontend
@app.get("/")
async def serve_frontend():
    """Serve the React frontend"""
    return FileResponse('frontend/build/index.html')

# Mount static files
if os.path.exists("frontend/build"):
    app.mount("/static", StaticFiles(directory="frontend/build/static"), name="static")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)