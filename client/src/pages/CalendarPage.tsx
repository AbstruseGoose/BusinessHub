import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { CalendarMonth } from '@mui/icons-material';
import { theme } from '@/theme/colors';

const CalendarPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Calendar
      </Typography>

      <Paper
        sx={{
          p: 8,
          textAlign: 'center',
          backgroundColor: theme.colors.background.secondary,
        }}
      >
        <CalendarMonth sx={{ fontSize: 64, mb: 2, color: theme.colors.syntax.purple }} />
        <Typography variant="h6" sx={{ mb: 1 }}>
          Calendar Integration Coming Soon
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Calendar management will be available here
        </Typography>
      </Paper>
    </Box>
  );
};

export default CalendarPage;
