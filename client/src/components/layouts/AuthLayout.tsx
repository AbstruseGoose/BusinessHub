import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { theme } from '@/theme/colors';

const AuthLayout: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background.primary,
        backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(97, 175, 239, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(152, 195, 121, 0.05) 0%, transparent 50%)
        `,
      }}
    >
      <Container maxWidth="sm">
        <Outlet />
      </Container>
    </Box>
  );
};

export default AuthLayout;
