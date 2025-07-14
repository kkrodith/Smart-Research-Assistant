import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Box } from '@mui/material';
import DocumentUpload from './components/DocumentUpload';
import DocumentAnalysis from './components/DocumentAnalysis';
import Header from './components/Header';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
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

function App() {
  const [currentDocument, setCurrentDocument] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  const handleDocumentUpload = (documentData, sessionId) => {
    setCurrentDocument(documentData);
    setSessionId(sessionId);
  };

  const handleNewDocument = () => {
    setCurrentDocument(null);
    setSessionId(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header 
        hasDocument={!!currentDocument} 
        onNewDocument={handleNewDocument}
        currentDocument={currentDocument}
      />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ minHeight: '80vh' }}>
          {!currentDocument ? (
            <DocumentUpload onUpload={handleDocumentUpload} />
          ) : (
            <DocumentAnalysis 
              document={currentDocument} 
              sessionId={sessionId}
            />
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;