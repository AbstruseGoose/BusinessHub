import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Phone as PhoneIcon } from '@mui/icons-material';
import { theme } from '@/theme/colors';

const PhonePage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        SIP Phone
      </Typography>

      <Paper
        sx={{
          p: 8,
          textAlign: 'center',
          backgroundColor: theme.colors.background.secondary,
        }}
      >
        <PhoneIcon sx={{ fontSize: 64, mb: 2, color: theme.colors.syntax.green }} />
        <Typography variant="h6" sx={{ mb: 1 }}>
          SIP Softphone Coming Soon
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Business phone functionality will be available here
        </Typography>
      </Paper>
    </Box>
  );
};

export default PhonePage;
