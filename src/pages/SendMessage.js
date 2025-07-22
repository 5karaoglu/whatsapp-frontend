import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  TextField, Button, Container, Typography, Paper, Box,
  FormControl, InputLabel, Select, MenuItem, FormGroup, FormControlLabel, Switch
} from '@mui/material';

// Custom styles for MUI components to match our new design system
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

const styledSwitch = {
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: 'var(--purple)',
    '&:hover': {
      backgroundColor: 'rgba(104, 34, 220, 0.08)',
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: 'var(--purple)',
  },
};

const SendMessage = () => {
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');
  const [isTemplate, setIsTemplate] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [templateParams, setTemplateParams] = useState({});

  useEffect(() => {
    if (isTemplate) {
      const fetchTemplates = async () => {
        try {
          const { data } = await api.get('/whatsapp/templates');
          setTemplates(data.data || []);
        } catch (err) {
          toast.error('Failed to fetch templates.');
        }
      };
      fetchTemplates();
    }
  }, [isTemplate]);

  const handleTemplateChange = (e) => {
    const templateName = e.target.value;
    setSelectedTemplate(templateName);
    setTemplateParams({});
  };
  
  const handleParamChange = (e) => {
    const { name, value } = e.target;
    setTemplateParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let payload;
      if (isTemplate) {
        payload = {
          to, type: 'template',
          template: {
            name: selectedTemplate, language: { code: 'en_US' },
            components: [{
              type: 'body',
              parameters: Object.values(templateParams).map(p => ({ type: 'text', text: p }))
            }]
          },
        };
      } else {
        payload = { to, type: 'text', text: { body: message } };
      }
      const res = await api.post('/whatsapp/send-message', payload);
      toast.success(`Message sent successfully! ID: ${res.data?.data?.messages?.[0]?.id || 'N/A'}`);
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'An error occurred.');
    }
  };
  
  const currentTemplate = templates.find(t => t.name === selectedTemplate);
  const variableCount = currentTemplate?.components.find(c => c.type === 'BODY')?.text?.match(/{{(\d+)}}/g)?.length || 0;

  return (
    <Container maxWidth="md">
      <Paper elevation={0} sx={{ p: 4, mt: 4, borderRadius: 'var(--border-radius-lg)', background: 'var(--white)' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 3 }}>
          Mesaj Gönder
        </Typography>
        <FormGroup sx={{ mb: 2 }}>
          <FormControlLabel
            control={<Switch sx={styledSwitch} checked={isTemplate} onChange={(e) => setIsTemplate(e.target.checked)} />}
            label="Şablon Kullan"
          />
        </FormGroup>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Alıcı Telefon Numarası"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            fullWidth
            margin="normal"
            required
            placeholder="Örn: 905551234567"
            sx={styledTextField}
          />

          {isTemplate ? (
            <>
              <FormControl fullWidth margin="normal" sx={styledSelect}>
                <InputLabel id="template-select-label">Şablon</InputLabel>
                <Select
                  labelId="template-select-label"
                  value={selectedTemplate}
                  label="Şablon"
                  onChange={handleTemplateChange}
                  displayEmpty
                >
                  {templates.length === 0 ? (
                    <MenuItem disabled value="">
                      <em>Kullanılabilir şablon bulunamadı.</em>
                    </MenuItem>
                  ) : (
                    templates.map((template) => (
                      <MenuItem key={template.id} value={template.name}>
                        {template.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
              {[...Array(variableCount)].map((_, i) => (
                  <TextField
                      key={i}
                      label={`Değişken ${i + 1}`}
                      name={`param${i}`}
                      value={templateParams[`param${i}`] || ''}
                      onChange={handleParamChange}
                      fullWidth
                      margin="normal"
                      sx={styledTextField}
                  />
              ))}
            </>
          ) : (
            <TextField
              label="Mesajınız"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              fullWidth
              multiline
              rows={4}
              margin="normal"
              required
              sx={styledTextField}
            />
          )}

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
            Mesajı Gönder
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SendMessage; 