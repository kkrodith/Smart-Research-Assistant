import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Description,
  Upload,
  Info,
  GitHub,
  Brightness4,
  Brightness7,
  Close
} from '@mui/icons-material';

const Header = ({ hasDocument, onNewDocument, currentDocument, darkMode, setDarkMode }) => {
  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <Description sx={{ mr: 1 }} />
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
            Smart Research Assistant
          </Typography>
          {hasDocument && currentDocument && (
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              <Chip
                label={currentDocument.filename}
                color="secondary"
                variant="outlined"
                size="small"
                sx={{ 
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.5)',
                  maxWidth: 200,
                  '& .MuiChip-label': {
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap'
                  }
                }}
              />
              {/* Remove (X) button */}
              <Tooltip title="Remove document">
                <IconButton color="inherit" onClick={onNewDocument} size="small">
                  <Close />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>
        {/* Dark mode toggle */}
        <Tooltip title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
          <IconButton color="inherit" onClick={() => setDarkMode(d => !d)}>
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Project Info">
          <IconButton
            color="inherit"
            onClick={() => window.open('https://github.com/your-username/Smart-Research-Assistant', '_blank')}
          >
            <Info />
          </IconButton>
        </Tooltip>
        {hasDocument && (
          <Button
            color="inherit"
            startIcon={<Upload />}
            onClick={onNewDocument}
            variant="outlined"
            sx={{
              borderColor: 'rgba(255,255,255,0.5)',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.8)',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            New Document
          </Button>
        )}
        <Tooltip title="View on GitHub">
          <IconButton
            color="inherit"
            onClick={() => window.open('https://github.com/your-username/Smart-Research-Assistant', '_blank')}
          >
            <GitHub />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default Header;