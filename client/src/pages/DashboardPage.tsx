import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Paper,
} from '@mui/material';
import {
  Email,
  CalendarMonth,
  Phone,
  CheckCircle,
  TrendingUp,
} from '@mui/icons-material';
import { theme } from '@/theme/colors';
import { useBusinessStore } from '@/stores/businessStore';

const DashboardPage: React.FC = () => {
  const { businesses, selectedBusinessId } = useBusinessStore();
  const selectedBusiness = businesses.find((b) => b.id === selectedBusinessId);

  const stats = [
    { label: 'Unread Emails', value: 23, icon: <Email />, color: theme.colors.syntax.blue },
    { label: 'Today\'s Meetings', value: 5, icon: <CalendarMonth />, color: theme.colors.syntax.purple },
    { label: 'Missed Calls', value: 3, icon: <Phone />, color: theme.colors.syntax.red },
    { label: 'Pending Tasks', value: 12, icon: <CheckCircle />, color: theme.colors.syntax.yellow },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Dashboard
      </Typography>

      {selectedBusiness && (
        <Paper
          sx={{
            p: 3,
            mb: 3,
            backgroundColor: theme.colors.background.secondary,
            borderLeft: `4px solid ${selectedBusiness.color}`,
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            {selectedBusiness.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {selectedBusiness.description || 'No description available'}
          </Typography>
        </Paper>
      )}

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows.md,
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: theme.borderRadius.md,
                      backgroundColor: `${stat.color}20`,
                      color: stat.color,
                      mr: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    {stat.label}
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <TrendingUp sx={{ color: theme.colors.accent.primary, mr: 1 }} />
                <Typography variant="h6">Quick Stats</Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Email Response Rate</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    87%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={87}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: theme.colors.background.tertiary,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: theme.colors.syntax.green,
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Tasks Completed</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    64%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={64}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: theme.colors.background.tertiary,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: theme.colors.accent.primary,
                    },
                  }}
                />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Call Answer Rate</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    92%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={92}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: theme.colors.background.tertiary,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: theme.colors.syntax.purple,
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Recent Activity
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { time: '10 min ago', action: 'New email from client@example.com', type: 'email' },
                  { time: '25 min ago', action: 'Missed call from +1 234 567 8900', type: 'call' },
                  { time: '1 hour ago', action: 'Meeting scheduled for tomorrow', type: 'calendar' },
                  { time: '2 hours ago', action: 'Document uploaded: Q4_Report.pdf', type: 'document' },
                ].map((activity, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      p: 2,
                      borderRadius: theme.borderRadius.md,
                      backgroundColor: theme.colors.background.tertiary,
                      borderLeft: `3px solid ${theme.colors.accent.primary}`,
                    }}
                  >
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      {activity.action}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {activity.time}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
