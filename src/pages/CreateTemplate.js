import React, { useState } from 'react';
import api from '../services/api';
import { TextField, Button, Container, Typography, Paper, Box, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const CreateTemplate = () => {
  const [templateName, setTemplateName] = useState('');
  const [templateBody, setTemplateBody] = useState('');
  const [category, setCategory] = useState('UTILITY');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse(null);
    setError(null);

    const payload = {
      name: templateName,
      language: 'en_US',
      category: category,
      components: [
        {
          type: 'BODY',
          text: templateBody,
        },
      ],
    };

    try {
      const res = await api.post('/whatsapp/create-template', payload);
      setResponse(res.data);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'An error occurred.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Message Template
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {'Create a new template for your WhatsApp messages. Use placeholders like {{1}}, {{2}} for dynamic content.'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Template Name"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
            fullWidth
            margin="normal"
            required
            helperText="Must be lowercase and use underscores instead of spaces."
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="UTILITY">Utility</MenuItem>
              <MenuItem value="MARKETING">Marketing</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Template Body"
            value={templateBody}
            onChange={(e) => setTemplateBody(e.target.value)}
            fullWidth
            multiline
            rows={6}
            margin="normal"
            required
            helperText="Example: Hello {{1}}, your order {{2}} has been shipped."
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Create Template
          </Button>
        </Box>
        {response && <Alert severity="success" sx={{ mt: 2 }}>Template created successfully! Template ID: {response.id}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Paper>
    </Container>
  );
};

export default CreateTemplate; 