import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  TextField, Button, Container, Typography, Paper, Box, Alert,
  FormControl, InputLabel, Select, MenuItem, FormGroup, FormControlLabel, Switch
} from '@mui/material';

const SendMessage = () => {
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
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
          setError('Failed to fetch templates.');
        }
      };
      fetchTemplates();
    }
  }, [isTemplate]);

  const handleTemplateChange = (e) => {
    const templateName = e.target.value;
    setSelectedTemplate(templateName);
    // Reset params when template changes
    setTemplateParams({});
  };
  
  const handleParamChange = (e) => {
    const { name, value } = e.target;
    setTemplateParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse(null);
    setError(null);
    try {
      let payload;
      if (isTemplate) {
        payload = {
          to,
          type: 'template',
          template: {
            name: selectedTemplate,
            language: { code: 'en_US' },
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
      setResponse(res.data);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'An error occurred.');
    }
  };
  
  const currentTemplate = templates.find(t => t.name === selectedTemplate);
  const variableCount = currentTemplate?.components.find(c => c.type === 'BODY')?.text?.match(/{{(\d+)}}/g)?.length || 0;

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Send WhatsApp Message
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={isTemplate} onChange={(e) => setIsTemplate(e.target.checked)} />}
            label="Use Template"
          />
        </FormGroup>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Recipient Phone Number"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            fullWidth
            margin="normal"
            required
            placeholder="e.g., 15550001234"
          />

          {isTemplate ? (
            <>
              <FormControl fullWidth margin="normal">
                <InputLabel id="template-select-label">Template</InputLabel>
                <Select
                  labelId="template-select-label"
                  value={selectedTemplate}
                  label="Template"
                  onChange={handleTemplateChange}
                >
                  {templates.map((template) => (
                    <MenuItem key={template.id} value={template.name}>
                      {template.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {[...Array(variableCount)].map((_, i) => (
                  <TextField
                      key={i}
                      label={`Variable ${i + 1}`}
                      name={`param${i}`}
                      value={templateParams[`param${i}`] || ''}
                      onChange={handleParamChange}
                      fullWidth
                      margin="normal"
                  />
              ))}
            </>
          ) : (
            <TextField
              label="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              fullWidth
              multiline
              rows={4}
              margin="normal"
              required
            />
          )}

          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Send Message
          </Button>
        </Box>
        {response?.success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Message sent successfully! Message ID: {response.data?.messages?.[0]?.id || 'N/A'}
          </Alert>
        )}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Paper>
    </Container>
  );
};

export default SendMessage; 