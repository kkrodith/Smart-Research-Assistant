import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Divider,
  Chip,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Description,
  QuestionAnswer,
  Psychology,
  Schedule,
  Close
} from '@mui/icons-material';
import AskAnything from './AskAnything';
import ChallengeMode from './ChallengeMode';

const DocumentAnalysis = ({ document, sessionId, onRemoveDocument }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const formatUploadTime = (uploadTime) => {
    return new Date(uploadTime).toLocaleString();
  };

  const TabPanel = ({ children, value, index }) => (
    <Box hidden={value !== index} sx={{ pt: 3 }}>
      {value === index && children}
    </Box>
  );

  return (
    <Box sx={{ width: '100%' }}>
      {/* Document Summary Section */}
      <Card sx={{ mb: 3, elevation: 3, transition: 'box-shadow 0.3s cubic-bezier(.4,0,.2,1)', '&:hover': { boxShadow: 6 } }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Description sx={{ mr: 1, color: 'primary.main', transition: 'color 0.3s' }} />
            <Typography variant="h5" component="h2">
              Document Summary
            </Typography>
            <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
              <Chip
                icon={<Schedule />}
                label={formatUploadTime(document.upload_time)}
                size="small"
                variant="outlined"
                sx={{ transition: 'background 0.3s, color 0.3s', '&:hover': { bgcolor: 'primary.100', color: 'primary.main' } }}
              />
              {/* Remove (X) button */}
              {onRemoveDocument && (
                <Tooltip title="Remove document">
                  <IconButton size="small" onClick={onRemoveDocument} sx={{ transition: 'background 0.3s', '&:hover': { bgcolor: 'error.light' } }}>
                    <Close />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>File:</strong> {document.filename}
            </Typography>
          </Alert>
          
          <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
              {document.summary}
            </Typography>
          </Paper>
        </CardContent>
      </Card>

      {/* Interaction Modes */}
      <Card sx={{ elevation: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="document interaction modes"
            sx={{ transition: 'background 0.3s' }}
          >
            <Tab
              icon={<QuestionAnswer />}
              label="Ask Anything"
              id="tab-0"
              aria-controls="tabpanel-0"
              sx={{ transition: 'color 0.3s', '&:hover': { color: 'primary.main' } }}
            />
            <Tab
              icon={<Psychology />}
              label="Challenge Me"
              id="tab-1"
              aria-controls="tabpanel-1"
              sx={{ transition: 'color 0.3s', '&:hover': { color: 'primary.main' } }}
            />
          </Tabs>
        </Box>

        <TabPanel value={activeTab} index={0}>
          <AskAnything sessionId={sessionId} />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <ChallengeMode sessionId={sessionId} />
        </TabPanel>
      </Card>
    </Box>
  );
};

export default DocumentAnalysis;