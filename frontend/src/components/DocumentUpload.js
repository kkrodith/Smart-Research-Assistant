import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  CloudUpload,
  Description,
  PictureAsPdf
} from '@mui/icons-material';
import axios from 'axios';

const DocumentUpload = ({ onUpload }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const uploadFile = async (file) => {
    setIsUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      // Extract session ID from response (assuming it's in the upload timestamp)
      const sessionId = response.data.upload_time.replace(/[-:T]/g, '').replace(/\..+/, '');
      
      onUpload(response.data, sessionId);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload file');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      uploadFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  const getFileIcon = (isDragActive) => {
    if (isDragActive) return <PictureAsPdf sx={{ fontSize: 48, color: 'primary.main' }} />;
    return <CloudUpload sx={{ fontSize: 48, color: 'text.secondary' }} />;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
      <Typography variant="h4" gutterBottom color="primary" sx={{ mb: 2 }}>
        Smart Research Assistant
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
        Upload a research paper, legal document, or technical manual to get started
      </Typography>

      <Paper
        {...getRootProps()}
        sx={{
          p: 6,
          textAlign: 'center',
          cursor: 'pointer',
          border: '2px dashed',
          borderColor: dragActive || isDragActive ? 'primary.main' : 'grey.300',
          backgroundColor: dragActive || isDragActive ? 'action.hover' : 'background.paper',
          transition: 'all 0.3s ease',
          width: '100%',
          maxWidth: 600,
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'action.hover',
          },
        }}
      >
        <input {...getInputProps()} />
        
        {isUploading ? (
          <Box sx={{ py: 2 }}>
            <CircularProgress size={48} sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Processing Document...
            </Typography>
            <Box sx={{ width: '100%', mt: 2 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {uploadProgress}% Complete
              </Typography>
            </Box>
          </Box>
        ) : (
          <>
            {getFileIcon(isDragActive)}
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              {isDragActive ? 'Drop your file here' : 'Drag & Drop your document'}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              or
            </Typography>
            <Button
              variant="contained"
              component="span"
              startIcon={<Description />}
              sx={{ mt: 2 }}
            >
              Choose File
            </Button>
            <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary' }}>
              Supported formats: PDF, TXT (Max 10MB)
            </Typography>
          </>
        )}
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mt: 2, width: '100%', maxWidth: 600 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Features
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
          <Paper sx={{ p: 2, minWidth: 200 }}>
            <Typography variant="subtitle1" color="primary">📄 Auto Summary</Typography>
            <Typography variant="body2">Get a concise summary (≤150 words)</Typography>
          </Paper>
          <Paper sx={{ p: 2, minWidth: 200 }}>
            <Typography variant="subtitle1" color="primary">❓ Ask Anything</Typography>
            <Typography variant="body2">Free-form questions with context</Typography>
          </Paper>
          <Paper sx={{ p: 2, minWidth: 200 }}>
            <Typography variant="subtitle1" color="primary">🧠 Challenge Mode</Typography>
            <Typography variant="body2">Test your comprehension skills</Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default DocumentUpload;