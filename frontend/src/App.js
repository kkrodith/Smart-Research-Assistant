// To use your backend API, set REACT_APP_API_URL in your .env file (e.g., https://your-backend.onrender.com)
// Example usage: const apiUrl = process.env.REACT_APP_API_URL;

import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Box, IconButton, Tooltip } from '@mui/material';
import DocumentUpload from './components/DocumentUpload';
import DocumentAnalysis from './components/DocumentAnalysis';
import Header from './components/Header';
import HistoryIcon from '@mui/icons-material/History';
import DeleteIcon from '@mui/icons-material/Delete';

function App() {
  const [currentDocument, setCurrentDocument] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [history, setHistory] = useState([]); // [{document, sessionId}]
  const [darkMode, setDarkMode] = useState(false);
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#2196f3',
      },
      secondary: {
        main: '#f50057',
      },
      background: {
        default: darkMode ? '#181818' : '#f5f5f5',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 500,
      },
    },
  });

  const handleDocumentUpload = (documentData, sessionId) => {
    setCurrentDocument(documentData);
    setSessionId(sessionId); // Save sessionId for all future requests
    setHistory(prev => [{ document: documentData, sessionId }, ...prev.filter(h => h.sessionId !== sessionId)]);
  };

  const handleNewDocument = () => {
    setCurrentDocument(null);
    setSessionId(null);
  };

  const handleRemoveDocument = (removeSessionId) => {
    setHistory(prev => prev.filter(h => h.sessionId !== removeSessionId));
    if (sessionId === removeSessionId) {
      setCurrentDocument(null);
      setSessionId(null);
    }
  };

  const handleSelectHistory = (item) => {
    setCurrentDocument(item.document);
    setSessionId(item.sessionId);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header 
        hasDocument={!!currentDocument} 
        onNewDocument={handleNewDocument}
        currentDocument={currentDocument}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ minHeight: '80vh', display: 'flex', flexDirection: 'row', background: 'linear-gradient(135deg, #e0e7ff 0%, #f5f7fa 100%)', borderRadius: 4, boxShadow: 3 }}>
          {/* History Sidebar */}
          <Box sx={{ width: 100, mr: 2, maxHeight: '80vh', overflowY: 'auto', bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1, transition: 'width 0.3s cubic-bezier(.4,0,.2,1)', '&:hover': { width: 140, boxShadow: 3 } }}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
              <HistoryIcon color="primary" />
            </Box>
            {history.length === 0 && (
              <Box sx={{ color: 'text.secondary', fontSize: 14, textAlign: 'center' }}>No documents yet.</Box>
            )}
            {history.map((item, idx) => (
              <Box key={item.sessionId} sx={{ display: 'flex', alignItems: 'center', mb: 1, p: 1, bgcolor: sessionId === item.sessionId ? 'primary.light' : 'background.paper', borderRadius: 1, cursor: 'pointer', transition: 'all 0.3s cubic-bezier(.4,0,.2,1)', '&:hover': { bgcolor: 'primary.100', transform: 'scale(1.04)' } }}>
                <Box onClick={() => handleSelectHistory(item)} sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13, textAlign: 'center' }}>
                  {item.document.filename}
                </Box>
                <Tooltip title="Remove from history">
                  <IconButton size="small" onClick={() => handleRemoveDocument(item.sessionId)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            ))}
          </Box>
          {/* Main Content */}
          <Box sx={{ flex: 1 }}>
            {!currentDocument ? (
              <DocumentUpload onUpload={handleDocumentUpload} />
            ) : (
              <DocumentAnalysis 
                document={currentDocument} 
                sessionId={sessionId}
                onRemoveDocument={() => handleRemoveDocument(sessionId)}
              />
            )}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
