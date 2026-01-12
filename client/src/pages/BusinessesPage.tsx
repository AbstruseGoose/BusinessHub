import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Chip } from '@mui/material';
import { Business as BusinessIcon } from '@mui/icons-material';
import { useBusinessStore } from '@/stores/businessStore';
import { theme } from '@/theme/colors';

const BusinessesPage: React.FC = () => {
  const { businesses, selectedBusinessId, selectBusiness } = useBusinessStore();

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Businesses
      </Typography>

      <Grid container spacing={3}>
        {businesses.map((business) => (
          <Grid item xs={12} sm={6} md={4} key={business.id}>
            <Card
              onClick={() => selectBusiness(business.id)}
              sx={{
                cursor: 'pointer',
                border: selectedBusinessId === business.id 
                  ? `2px solid ${business.color}` 
                  : `1px solid ${theme.colors.border}`,
                transition: 'all 0.2s',
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
                      p: 2,
                      borderRadius: theme.borderRadius.md,
                      backgroundColor: `${business.color}20`,
                      color: business.color,
                      mr: 2,
                    }}
                  >
                    <BusinessIcon />
                  </Box>
                  {selectedBusinessId === business.id && (
                    <Chip
                      label="Active"
                      size="small"
                      sx={{
                        backgroundColor: business.color,
                        color: '#fff',
                        fontWeight: 600,
                      }}
                    />
                  )}
                </Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  {business.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {business.description || 'No description'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {businesses.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            color: theme.colors.text.secondary,
          }}
        >
          <BusinessIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
          <Typography variant="h6">No businesses available</Typography>
          <Typography variant="body2">
            Contact your administrator to get access to businesses
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default BusinessesPage;
