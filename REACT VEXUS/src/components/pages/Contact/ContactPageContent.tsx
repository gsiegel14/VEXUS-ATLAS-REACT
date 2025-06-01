import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  MenuItem,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
  CircularProgress,
  Divider,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Email,
  LocationOn,
  Phone,
  CloudUpload,
  Delete,
  Send,
  AttachFile,
  Launch,
} from '@mui/icons-material';
import { colorTokens, spacingTokens } from '../../../design-system/tokens';
import { contactService, ContactFormData } from '../../../services/contactService';

const subjectOptions = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'research', label: 'Research Collaboration' },
  { value: 'education', label: 'Educational Resources' },
  { value: 'feedback', label: 'Website Feedback' },
  { value: 'other', label: 'Other' },
];

const ContactPageContent: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    institution: '',
    subject: 'general',
    message: '',
    attachments: [],
  });
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    institution?: string;
    subject?: string;
    message?: string;
    attachments?: string[];
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | '', message: string }>({
    type: '',
    message: '',
  });
  const [dragOver, setDragOver] = useState(false);

  const validateForm = (): boolean => {
    const errors: {
      name?: string;
      email?: string;
      institution?: string;
      subject?: string;
      message?: string;
      attachments?: string[];
    } = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }

    // Validate attachments
    if (formData.attachments.length > 0) {
      const attachmentValidation = contactService.validateAttachments(formData.attachments);
      if (!attachmentValidation.valid) {
        errors.attachments = attachmentValidation.errors;
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof ContactFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    // Clear error when user starts typing
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files).filter(file => {
      const validation = contactService.validateAttachment(file);
      return validation.valid;
    });

    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newFiles],
    }));
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    handleFileUpload(event.dataTransfer.files);
  }, [handleFileUpload]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      // Use the contact service to submit the form
      const result = await contactService.submitContactForm(formData);

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: `Thank you for contacting us! Your message has been received (ID: ${result.contactId}). We'll get back to you as soon as possible.`,
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          institution: '',
          subject: 'general',
          message: '',
          attachments: [],
        });
      } else {
        throw new Error(result.error || 'Failed to submit contact form');
      }
    } catch (error) {
      console.error('Contact form submission failed:', error);
      setSubmitStatus({
        type: 'error',
        message: 'There was an error sending your message. Please try again later or contact us directly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h1" 
          component="h1" 
          sx={{ 
            color: colorTokens.primary[500],
            mb: 2,
            fontWeight: 'bold'
          }}
        >
          Contact Us
        </Typography>
        <Typography 
          variant="h5" 
          component="p" 
          sx={{ 
            color: 'text.secondary',
            maxWidth: 600,
            mx: 'auto'
          }}
        >
          Get in touch with the VEXUS ATLAS team
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Contact Form */}
        <Grid item xs={12} md={8}>
          <Card elevation={2}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" component="h2" gutterBottom sx={{ color: colorTokens.primary[500] }}>
                Send us a Message
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ color: 'text.secondary', mb: 3 }}>
                Thank you for your interest in the VEXUS (Venous Excess Ultrasound Score) ATLAS project. Whether you have questions about the VEXUS methodology, are interested in research collaboration, or want to share feedback on our resources, we'd love to hear from you.
              </Typography>

              {submitStatus.message && submitStatus.type && (
                <Alert severity={submitStatus.type as 'success' | 'error'} sx={{ mb: 3 }}>
                  {submitStatus.message}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Name"
                      value={formData.name}
                      onChange={handleInputChange('name')}
                      error={!!formErrors.name}
                      helperText={formErrors.name}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange('email')}
                      error={!!formErrors.email}
                      helperText={formErrors.email}
                      required
                    />
                  </Grid>
                </Grid>

                <TextField
                  fullWidth
                  label="Institution/Organization"
                  value={formData.institution}
                  onChange={handleInputChange('institution')}
                />

                <TextField
                  fullWidth
                  select
                  label="Subject"
                  value={formData.subject}
                  onChange={handleInputChange('subject')}
                >
                  {subjectOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  label="Message"
                  multiline
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange('message')}
                  error={!!formErrors.message}
                  helperText={formErrors.message}
                  required
                />

                {/* File Upload */}
                <Box>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                    Attachments (Optional)
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 3,
                      border: `2px dashed ${dragOver ? colorTokens.primary[500] : colorTokens.neutral[300]}`,
                      backgroundColor: dragOver ? 'rgba(67, 195, 172, 0.05)' : 'transparent',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                    }}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => document.getElementById('file-input')?.click()}
                  >
                    <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body1" gutterBottom>
                      Drag & drop files here, or click to select files
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      (Max 5MB per file. Allowed: JPG, PNG, PDF, TXT)
                    </Typography>
                    <input
                      id="file-input"
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,.pdf,.txt"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileUpload(e.target.files)}
                    />
                  </Paper>

                  {/* File List */}
                  {formData.attachments.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Attached Files:
                      </Typography>
                      <List dense>
                        {formData.attachments.map((file, index) => (
                          <ListItem
                            key={index}
                            sx={{
                              bgcolor: 'grey.50',
                              borderRadius: 1,
                              mb: 1,
                            }}
                            secondaryAction={
                              <IconButton
                                edge="end"
                                onClick={() => removeFile(index)}
                                size="small"
                              >
                                <Delete />
                              </IconButton>
                            }
                          >
                            <ListItemIcon>
                              <AttachFile />
                            </ListItemIcon>
                            <ListItemText
                              primary={file.name}
                              secondary={`${(file.size / 1024).toFixed(1)} KB`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : <Send />}
                  sx={{ mt: 2, alignSelf: 'flex-start' }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Methods */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h4" component="h2" sx={{ color: colorTokens.primary[500] }}>
              Alternative Contact Methods
            </Typography>

            {/* Email */}
            <Card elevation={1}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Email sx={{ color: colorTokens.primary[500], mr: 2, fontSize: 32 }} />
                  <Typography variant="h6">Email</Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  For general inquiries:{' '}
                  <Link href="mailto:info@vexusatlas.com" target="_blank" rel="noopener noreferrer">
                    info@vexusatlas.com
                  </Link>
                </Typography>
                <Typography variant="body2">
                  For research collaboration:{' '}
                  <Link href="mailto:research@vexusatlas.com" target="_blank" rel="noopener noreferrer">
                    research@vexusatlas.com
                  </Link>
                </Typography>
              </CardContent>
            </Card>

            {/* Address */}
            <Card elevation={1}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOn sx={{ color: colorTokens.primary[500], mr: 2, fontSize: 32 }} />
                  <Typography variant="h6">Address</Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  VEXUS ATLAS Research Group<br />
                  Denver Health<br />
                  777 Bannock St<br />
                  Denver, CO 80204
                </Typography>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card elevation={1}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Phone sx={{ color: colorTokens.primary[500], mr: 2, fontSize: 32 }} />
                  <Typography variant="h6">Social Media</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Link
                    href="https://x.com/thevexusatlas"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
                  >
                    <Launch sx={{ mr: 1, fontSize: 16 }} />
                    Twitter/X: @thevexusatlas
                  </Link>
                  <Link
                    href="https://www.instagram.com/thevexusatlas/"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
                  >
                    <Launch sx={{ mr: 1, fontSize: 16 }} />
                    Instagram: @thevexusatlas
                  </Link>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContactPageContent; 