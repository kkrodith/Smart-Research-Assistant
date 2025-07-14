import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Badge
} from '@mui/material';
import {
  Send,
  Clear,
  Highlight,
  Memory,
  QuestionAnswer,
  Psychology
} from '@mui/icons-material';
import axios from 'axios';
import Highlighter from 'react-highlight-words';

const AskAnything = ({ sessionId }) => {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [highlightedText, setHighlightedText] = useState('');
  const [showHighlight, setShowHighlight] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const askQuestion = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    setError('');
    
    const userMessage = {
      type: 'user',
      content: question,
      timestamp: new Date().toISOString()
    };

    setConversation(prev => [...prev, userMessage]);

    try {
      const response = await axios.post('/ask', {
        question: question,
        session_id: sessionId
      });

      const assistantMessage = {
        type: 'assistant',
        content: response.data.answer,
        justification: response.data.justification,
        highlighted_text: response.data.highlighted_text,
        confidence: response.data.confidence,
        timestamp: new Date().toISOString()
      };

      setConversation(prev => [...prev, assistantMessage]);
      setQuestion('');
      
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to get answer');
      // Remove the user message if request failed
      setConversation(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      askQuestion();
    }
  };

  const clearConversation = () => {
    setConversation([]);
    setError('');
    setHighlightedText('');
    setShowHighlight(false);
  };

  const showTextHighlight = (text) => {
    setHighlightedText(text);
    setShowHighlight(true);
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'success';
    if (confidence >= 0.6) return 'warning';
    return 'error';
  };

  const getConfidenceText = (confidence) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  const suggestedQuestions = [
    "What is the main objective of this document?",
    "What are the key findings or conclusions?",
    "What methodology was used?",
    "What are the limitations mentioned?",
    "What future research is suggested?"
  ];

  return (
    <Box sx={{ p: 3, height: '70vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <QuestionAnswer sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" sx={{ flex: 1 }}>
          Ask Anything
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Badge badgeContent={conversation.length} color="primary">
            <Memory />
          </Badge>
          <Tooltip title="Clear conversation">
            <IconButton onClick={clearConversation} size="small">
              <Clear />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Conversation Area */}
      <Box sx={{ flex: 1, overflow: 'auto', mb: 2 }}>
        {conversation.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Psychology sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Ask any question about your document
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              The AI will provide contextual answers with justifications
            </Typography>
            
            {/* Suggested Questions */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Suggested questions:
              </Typography>
              {suggestedQuestions.map((q, index) => (
                <Chip
                  key={index}
                  label={q}
                  variant="outlined"
                  onClick={() => setQuestion(q)}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </Box>
        ) : (
          conversation.map((message, index) => (
            <Paper
              key={index}
              sx={{
                p: 2,
                mb: 2,
                backgroundColor: message.type === 'user' ? 'primary.light' : 'grey.50',
                color: message.type === 'user' ? 'primary.contrastText' : 'text.primary',
                ml: message.type === 'user' ? 4 : 0,
                mr: message.type === 'user' ? 0 : 4,
              }}
            >
              <Typography variant="body1" sx={{ mb: 1 }}>
                {message.content}
              </Typography>
              
              {message.type === 'assistant' && (
                <Box sx={{ mt: 2 }}>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Chip
                      size="small"
                      label={`Confidence: ${getConfidenceText(message.confidence)}`}
                      color={getConfidenceColor(message.confidence)}
                    />
                    <Tooltip title="View highlighted text">
                      <IconButton
                        size="small"
                        onClick={() => showTextHighlight(message.highlighted_text)}
                      >
                        <Highlight />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {message.justification}
                  </Typography>
                </Box>
              )}
            </Paper>
          ))
        )}
        
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress />
          </Box>
        )}
        
        <div ref={messagesEndRef} />
      </Box>

      {/* Highlighted Text Modal */}
      {showHighlight && (
        <Card sx={{ mb: 2, border: 2, borderColor: 'primary.main' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Highlight sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="subtitle1">
                Relevant Text from Document
              </Typography>
              <IconButton
                size="small"
                onClick={() => setShowHighlight(false)}
                sx={{ ml: 'auto' }}
              >
                <Clear />
              </IconButton>
            </Box>
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
              <Highlighter
                searchWords={question.split(' ')}
                textToHighlight={highlightedText}
                highlightClassName="highlight"
                highlightStyle={{ backgroundColor: 'yellow', padding: '0 2px' }}
              />
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Input Area */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          multiline
          maxRows={3}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask a question about the document..."
          disabled={isLoading}
          variant="outlined"
        />
        <Button
          variant="contained"
          onClick={askQuestion}
          disabled={isLoading || !question.trim()}
          startIcon={isLoading ? <CircularProgress size={20} /> : <Send />}
          sx={{ minWidth: 100 }}
        >
          {isLoading ? 'Asking...' : 'Ask'}
        </Button>
      </Box>
    </Box>
  );
};

export default AskAnything;