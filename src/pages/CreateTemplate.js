import React, { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { TextField, Button, Container, Typography, Paper, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

// Reuse the styled components from SendMessage.js or define them here if not globally available
const styledTextField = {
  '& .MuiInputBase-root': {
    borderRadius: 'var(--border-radius-sm)',
    backgroundColor: 'var(--off-white)',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#E0E0E0',
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
      toast.success(`Template '${res.data.name}' created successfully!`);
      // Reset form
      setTemplateName('');
      setTemplateBody('');
      setCategory('UTILITY');
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'An error occurred while creating the template.');
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={0} sx={{ p: 4, mt: 4, borderRadius: 'var(--border-radius-lg)', background: 'var(--white)' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
          Yeni Mesaj Şablonu Oluştur
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {'Dinamik içerik için {{1}}, {{2}} gibi değişkenler kullanın.'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Şablon Adı"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
            fullWidth
            margin="normal"
            required
            helperText="Boşluk yerine alt çizgi (_) kullanın ve sadece küçük harf içermelidir."
            sx={styledTextField}
          />
          <FormControl fullWidth margin="normal" sx={styledSelect}>
            <InputLabel id="category-select-label">Kategori</InputLabel>
            <Select
              labelId="category-select-label"
              value={category}
              label="Kategori"
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="UTILITY">Fonksiyonel (Utility)</MenuItem>
              <MenuItem value="MARKETING">Pazarlama (Marketing)</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Şablon İçeriği"
            value={templateBody}
            onChange={(e) => setTemplateBody(e.target.value)}
            fullWidth
            multiline
            rows={6}
            margin="normal"
            required
            helperText="Örnek: Merhaba {{1}}, {{2}} numaralı siparişiniz kargoya verildi."
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
            Şablonu Oluştur
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateTemplate; 