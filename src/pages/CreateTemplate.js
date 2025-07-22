import React, { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { TextField, Button, Container, Typography, Paper, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Reuse the styled components from SendMessage.js or define them here if not globally available
const styledTextField = {
  '& .MuiInputBase-root': {
    borderRadius: 'var(--border-radius-sm)',
    backgroundColor: 'var(--input-bg)',
    transition: 'background-color 0.3s',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'var(--border-color)',
      transition: 'border-color 0.3s',
    },
    '&:hover fieldset': {
      borderColor: 'var(--purple)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--purple)',
      borderWidth: '1px',
    },
  },
};

const styledSelect = {
  ...styledTextField,
  '& .MuiInputBase-root': {
    ...styledTextField['& .MuiInputBase-root'],
    paddingRight: '12px',
  },
};

const CreateTemplate = () => {
  const { t } = useTranslation();
  const [templateName, setTemplateName] = useState('');
  const [templateBody, setTemplateBody] = useState('');
  const [category, setCategory] = useState('UTILITY');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: templateName,
      language: 'en_US',
      category: category,
      components: [{ type: 'BODY', text: templateBody }],
    };

    try {
      const res = await api.post('/whatsapp/create-template', payload);
      toast.success(t('createTemplate.toast_create_success', { name: res.data.name }));
      // Reset form
      setTemplateName('');
      setTemplateBody('');
      setCategory('UTILITY');
    } catch (err) {
      toast.error(err.response?.data?.error?.message || t('createTemplate.toast_create_error'));
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={0} sx={{ p: 4, mt: 4, borderRadius: 'var(--border-radius-lg)', background: 'var(--bg-secondary)', transition: 'background-color 0.3s' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
          {t('createTemplate.title')}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: 'var(--text-secondary)' }}>
          {t('createTemplate.subtitle')}
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label={t('createTemplate.template_name')}
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
            fullWidth
            margin="normal"
            required
            helperText={t('createTemplate.template_name_helper')}
            sx={styledTextField}
          />
          <FormControl fullWidth margin="normal" sx={styledSelect}>
            <InputLabel id="category-select-label">{t('createTemplate.category')}</InputLabel>
            <Select
              labelId="category-select-label"
              value={category}
              label={t('createTemplate.category')}
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="UTILITY">{t('createTemplate.category_utility')}</MenuItem>
              <MenuItem value="MARKETING">{t('createTemplate.category_marketing')}</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label={t('createTemplate.template_body')}
            value={templateBody}
            onChange={(e) => setTemplateBody(e.target.value)}
            fullWidth
            multiline
            rows={6}
            margin="normal"
            required
            helperText={t('createTemplate.template_body_helper')}
            sx={styledTextField}
          />
          <Button 
            type="submit" 
            variant="contained" 
            size="large"
            sx={{ 
              mt: 2, 
              borderRadius: 'var(--border-radius-sm)', 
              color: 'var(--white)',
              background: 'var(--primary-gradient)',
              transition: 'opacity 0.3s',
              '&:hover': {
                opacity: 0.9
              }
            }}
          >
            {t('createTemplate.button')}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateTemplate; 