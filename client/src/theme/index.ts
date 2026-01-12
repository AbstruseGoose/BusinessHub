import { createTheme } from '@mui/material/styles';
import { theme as customTheme } from './colors';

export const muiTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: customTheme.colors.accent.primary,
      light: customTheme.colors.accent.light,
      dark: customTheme.colors.accent.hover,
    },
    secondary: {
      main: customTheme.colors.syntax.purple,
    },
    background: {
      default: customTheme.colors.background.primary,
      paper: customTheme.colors.background.secondary,
    },
    text: {
      primary: customTheme.colors.text.primary,
      secondary: customTheme.colors.text.secondary,
    },
    error: {
      main: customTheme.colors.status.error,
    },
    warning: {
      main: customTheme.colors.status.warning,
    },
    success: {
      main: customTheme.colors.status.success,
    },
    info: {
      main: customTheme.colors.status.info,
    },
    divider: customTheme.colors.divider,
  },
  typography: {
    fontFamily: customTheme.typography.fontFamily,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: customTheme.colors.text.bright,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: customTheme.colors.text.bright,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: customTheme.colors.text.bright,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: customTheme.colors.text.bright,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: customTheme.colors.text.bright,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      color: customTheme.colors.text.bright,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: customTheme.colors.background.primary,
          scrollbarColor: `${customTheme.colors.accent.primary} ${customTheme.colors.background.secondary}`,
          '&::-webkit-scrollbar': {
            width: '12px',
          },
          '&::-webkit-scrollbar-track': {
            background: customTheme.colors.background.secondary,
          },
          '&::-webkit-scrollbar-thumb': {
            background: customTheme.colors.accent.primary,
            borderRadius: '6px',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: customTheme.colors.background.secondary,
        },
        elevation1: {
          boxShadow: customTheme.shadows.sm,
        },
        elevation2: {
          boxShadow: customTheme.shadows.md,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: customTheme.borderRadius.md,
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: customTheme.shadows.sm,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: customTheme.borderRadius.lg,
          border: `1px solid ${customTheme.colors.border}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: customTheme.colors.background.secondary,
          borderRight: `1px solid ${customTheme.colors.border}`,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: customTheme.colors.background.secondary,
          borderBottom: `1px solid ${customTheme.colors.border}`,
          boxShadow: 'none',
        },
      },
    },
  },
});
