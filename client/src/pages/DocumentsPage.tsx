import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Folder } from '@mui/icons-material';
import { theme } from '@/theme/colors';

const DocumentsPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Documents
      </Typography>

      <Paper
        sx={{
          p: 8,
          textAlign: 'center',
          backgroundColor: theme.colors.background.secondary,
        }}
      >
        <Folder sx={{ fontSize: 64, mb: 2, color: theme.colors.syntax.yellow }} />
        <Typography variant="h6" sx={{ mb: 1 }}>
          Document Management Coming Soon
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Network drive access will be available here
        </Typography>
      </Paper>
    </Box>
  );
};

export default DocumentsPage;
