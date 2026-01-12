import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { theme } from '@/theme/colors';

const TasksPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Tasks
      </Typography>

      <Paper
        sx={{
          p: 8,
          textAlign: 'center',
          backgroundColor: theme.colors.background.secondary,
        }}
      >
        <CheckCircle sx={{ fontSize: 64, mb: 2, color: theme.colors.syntax.cyan }} />
        <Typography variant="h6" sx={{ mb: 1 }}>
          Task Management Coming Soon
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Task tracking by business and department will be available here
        </Typography>
      </Paper>
    </Box>
  );
};

export default TasksPage;
