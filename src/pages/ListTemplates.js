import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
  Container, Typography, Paper, Box, CircularProgress, Chip, Grid, Button, Skeleton
} from '@mui/material';
import { Link } from 'react-router-dom';

const statusColors = {
  APPROVED: 'success',
  PENDING: 'warning',
  REJECTED: 'error',
};

const SkeletonCard = () => (
  <Paper 
    elevation={0} 
    sx={{ 
      p: 3, 
      borderRadius: 'var(--border-radius-lg)', 
      background: 'var(--white)',
      height: '100%'
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
      <Skeleton variant="text" width="40%" />
      <Skeleton variant="rectangular" width={70} height={24} sx={{ borderRadius: '16px' }} />
    </Box>
    <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
    <Skeleton variant="text" width="25%" />
  </Paper>
);

const ListTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/whatsapp/templates');
        setTemplates(data.data || []);
      } catch (err) {
        toast.error(err.response?.data?.error?.message || 'Failed to fetch templates.');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const renderEmptyState = () => (
    <Paper 
      elevation={0} 
      sx={{ 
        textAlign: 'center', 
        p: 4, 
        mt: 4, 
        borderRadius: 'var(--border-radius-lg)',
        border: '2px dashed var(--grey)'
      }}
    >
      <Typography variant="h6" gutterBottom>
        Henüz şablon oluşturmadınız.
      </Typography>
      <Typography color="textSecondary" sx={{ mb: 3 }}>
        Mesajlaşmaya başlamak için ilk şablonunuzu oluşturun.
      </Typography>
      <Button 
        component={Link} 
        to="/create-template" 
        variant="contained"
        sx={{
          borderRadius: 'var(--border-radius-sm)', 
          color: 'var(--white)',
          background: 'var(--primary-gradient)',
        }}
      >
        Şimdi Oluştur
      </Button>
    </Paper>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Mesaj Şablonları
        </Typography>
      </Box>

      {loading && (
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <SkeletonCard />
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && templates.length === 0 && renderEmptyState()}

      {!loading && templates.length > 0 && (
        <Grid container spacing={3}>
          {templates.map((template) => (
            <Grid item key={template.id} xs={12} sm={6} md={4}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  borderRadius: 'var(--border-radius-lg)', 
                  background: 'var(--white)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="body2" sx={{ color: 'var(--dark-grey)', textTransform: 'uppercase' }}>
                      {template.category}
                    </Typography>
                    <Chip 
                      label={template.status} 
                      color={statusColors[template.status] || 'default'}
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 1 }}>
                    {template.name}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'var(--dark-grey)', mt: 2 }}>
                  Dil: {template.language}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ListTemplates; 