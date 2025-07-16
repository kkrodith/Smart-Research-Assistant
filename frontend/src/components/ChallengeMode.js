import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Divider,
  LinearProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Psychology,
  Refresh,
  Send,
  CheckCircle,
  Cancel,
  Score,
  TrendingUp
} from '@mui/icons-material';
import axios from 'axios';

const ChallengeMode = ({ sessionId }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState('');
  const [challengeCompleted, setChallengeCompleted] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL;

  const generateQuestions = async () => {
    setIsLoading(true);
    setError('');
    setResults([]);
    setCurrentQuestionIndex(0);
    setChallengeCompleted(false);

    try {
      const response = await axios.post(`${apiUrl}/challenge`, { session_id: sessionId });
      setQuestions(response.data.questions);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate questions');
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim()) return;

    setIsEvaluating(true);
    setError('');

    try {
      const response = await axios.post(`${apiUrl}/evaluate`, {
        question: questions[currentQuestionIndex].question,
        user_answer: userAnswer,
        session_id: sessionId
      });

      const result = {
        question: questions[currentQuestionIndex].question,
        userAnswer: userAnswer,
        evaluation: response.data,
        difficulty: questions[currentQuestionIndex].difficulty
      };

      setResults(prev => [...prev, result]);
      setUserAnswer('');

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setChallengeCompleted(true);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to evaluate answer');
    } finally {
      setIsEvaluating(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'info';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 0.8) return 'success';
    if (score >= 0.6) return 'warning';
    return 'error';
  };

  const getScoreText = (score) => {
    if (score >= 0.8) return 'Excellent';
    if (score >= 0.6) return 'Good';
    return 'Needs Improvement';
  };

  const calculateOverallScore = () => {
    if (results.length === 0) return 0;
    const totalScore = results.reduce((sum, result) => sum + result.evaluation.score, 0);
    return totalScore / results.length;
  };

  const resetChallenge = () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setResults([]);
    setChallengeCompleted(false);
    setError('');
  };

  useEffect(() => {
    generateQuestions();
  }, [sessionId]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
        <CircularProgress size={48} sx={{ mb: 2 }} />
        <Typography variant="h6">Generating challenge questions...</Typography>
      </Box>
    );
  }

  if (questions.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Psychology sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Challenge Mode
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Test your understanding with AI-generated questions
        </Typography>
        <Button
          variant="contained"
          onClick={generateQuestions}
          startIcon={<Refresh />}
        >
          Generate Questions
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Psychology sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" sx={{ flex: 1 }}>
          Challenge Mode
        </Typography>
        <Tooltip title="Generate new questions">
          <IconButton onClick={resetChallenge} size="small">
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Progress Stepper */}
      <Stepper activeStep={currentQuestionIndex} sx={{ mb: 3 }}>
        {questions.map((question, index) => (
          <Step key={index}>
            <StepLabel>
              Question {index + 1}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {!challengeCompleted ? (
        /* Current Question */
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ flex: 1 }}>
                Question {currentQuestionIndex + 1} of {questions.length}
              </Typography>
              <Chip
                label={questions[currentQuestionIndex].difficulty}
                color={getDifficultyColor(questions[currentQuestionIndex].difficulty)}
                size="small"
              />
            </Box>
            
            <Typography variant="body1" sx={{ mb: 3, fontWeight: 500 }}>
              {questions[currentQuestionIndex].question}
            </Typography>
            
            <TextField
              fullWidth
              multiline
              rows={4}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here..."
              variant="outlined"
              disabled={isEvaluating}
              sx={{ mb: 2 }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Progress: {currentQuestionIndex + 1} / {questions.length}
              </Typography>
              <Button
                variant="contained"
                onClick={submitAnswer}
                disabled={isEvaluating || !userAnswer.trim()}
                startIcon={isEvaluating ? <CircularProgress size={20} /> : <Send />}
              >
                {isEvaluating ? 'Evaluating...' : 'Submit Answer'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        /* Challenge Completed - Results */
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
              <Typography variant="h6">
                Challenge Completed!
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Score sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ mr: 2 }}>
                Overall Score:
              </Typography>
              <Chip
                label={`${Math.round(calculateOverallScore() * 100)}% - ${getScoreText(calculateOverallScore())}`}
                color={getScoreColor(calculateOverallScore())}
              />
            </Box>
            
            <LinearProgress
              variant="determinate"
              value={calculateOverallScore() * 100}
              sx={{ mb: 2, height: 8, borderRadius: 1 }}
            />
            
            <Button
              variant="contained"
              onClick={resetChallenge}
              startIcon={<Refresh />}
              sx={{ mt: 2 }}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Results Display */}
      {results.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Results
          </Typography>
          {results.map((result, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ flex: 1 }}>
                    Question {index + 1}
                  </Typography>
                  <Chip
                    label={result.difficulty}
                    color={getDifficultyColor(result.difficulty)}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={`${Math.round(result.evaluation.score * 100)}%`}
                    color={getScoreColor(result.evaluation.score)}
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Q: {result.question}
                </Typography>
                
                <Paper sx={{ p: 2, mb: 2, backgroundColor: 'grey.50' }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Your Answer:</strong>
                  </Typography>
                  <Typography variant="body2">
                    {result.userAnswer}
                  </Typography>
                </Paper>
                
                <Divider sx={{ mb: 2 }} />
                
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Feedback:</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {result.evaluation.feedback}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default ChallengeMode;