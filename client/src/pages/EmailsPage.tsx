import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Email as EmailIcon } from '@mui/icons-material';
import { theme } from '@/theme/colors';

const EmailsPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Email Management
      </Typography>

      <Paper
        sx={{
          p: 8,
          textAlign: 'center',
          backgroundColor: theme.colors.background.secondary,
        }}
      >
        <EmailIcon sx={{ fontSize: 64, mb: 2, color: theme.colors.syntax.blue }} />
        <Typography variant="h6" sx={{ mb: 1 }}>
          Email Integration Coming Soon
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Proton Mail proxy integration will be available here
        </Typography>
      </Paper>
    </Box>
  );
};

export default EmailsPage;
