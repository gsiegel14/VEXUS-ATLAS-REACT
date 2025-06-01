# Contact Page Conversion Outline

## Overview
Convert `contact.astro` to a React component with interactive forms, file uploads, and contact information display using Material-UI components.

## Current Structure Analysis
- Contact form with various field types (name, email, subject, message).
- File upload functionality, likely with drag-and-drop support.
- Display section for alternative contact methods (Email, Address, Social Media).
- Form validation for required fields and correct formats (e.g., email).
- Handling of form submission, including success and error states/messages.
- Overall page layout and styling.

## Comprehensive Conversion Framework

### 1. Main Component Architecture & MUI Integration
```jsx
// src/pages/Contact.jsx
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Alert
} from '@mui/material';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import ContactForm from '../components/contact/ContactForm';
import ContactMethods from '../components/contact/ContactMethods';

const Contact = () => {
  const [formSubmissionStatus, setFormSubmissionStatus] = useState({ type: '', message: '' }); // 'success', 'error', or ''

  return (
    <Layout>
      <SEO 
        title="Contact Us - VEXUS ATLAS"
        description="Get in touch with the VEXUS ATLAS team for inquiries, collaborations, or feedback. We look forward to hearing from you."
        keywords="VEXUS contact, VEXUS team, medical research contact, ultrasound project contact"
      />
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
          <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 5 } }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Contact Us
            </Typography>
            <Typography variant="h6" component="p" sx={{ color: 'text.secondary' }}>
              We'd love to hear from you! Reach out for any inquiries or collaborations.
            </Typography>
          </Box>

          {formSubmissionStatus.message && (
            <Alert severity={formSubmissionStatus.type} sx={{ mb: 3 }}>
              {formSubmissionStatus.message}
            </Alert>
          )}

          <Grid container spacing={{ xs: 3, md: 5 }}>
            <Grid item xs={12} md={7}>
              <ContactForm setSubmissionStatus={setFormSubmissionStatus} />
            </Grid>
            <Grid item xs={12} md={5}>
              <ContactMethods />
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Layout>
  );
};

export default Contact;
```

### 2. MUI Component Mapping & Key Components

#### ContactForm Component (MUI Styled)
```jsx
// src/components/contact/ContactForm.jsx
import React, { useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText
} from '@mui/material';
import FileUpload from './FileUpload'; // MUI styled file upload
import { submitContactForm } from '../../services/contactService'; // API service

const subjectOptions = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'collaboration', label: 'Research Collaboration' },
  { value: 'feedback', label: 'Website Feedback' },
  { value: 'technical', label: 'Technical Support' },
  { value: 'other', label: 'Other' }
];

const ContactForm = ({ setSubmissionStatus }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      subject: 'general',
      message: '',
      attachments: []
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFilesChange = useCallback((files) => {
    setValue('attachments', files, { shouldValidate: true });
  }, [setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmissionStatus({ type: '', message: '' });
    try {
      // The `data` object will include `attachments` from react-hook-form state
      await submitContactForm(data);
      setSubmissionStatus({ type: 'success', message: 'Your message has been sent successfully! We will get back to you soon.' });
      reset(); // Clear form on success
    } catch (error) {
      setSubmissionStatus({ type: 'error', message: error.message || 'Failed to send message. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Send us a Message
      </Typography>
      
      <Controller
        name="name"
        control={control}
        rules={{ required: 'Name is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Full Name"
            variant="outlined"
            fullWidth
            required
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        )}
      />

      <Controller
        name="email"
        control={control}
        rules={{
          required: 'Email is required',
          pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' }
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Email Address"
            type="email"
            variant="outlined"
            fullWidth
            required
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        )}
      />

      <Controller
        name="subject"
        control={control}
        rules={{ required: 'Subject is required' }}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.subject} variant="outlined">
            <InputLabel id="subject-select-label">Subject</InputLabel>
            <Select
              {...field}
              labelId="subject-select-label"
              label="Subject"
            >
              {subjectOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
            {errors.subject && <FormHelperText>{errors.subject.message}</FormHelperText>}
          </FormControl>
        )}
      />

      <Controller
        name="message"
        control={control}
        rules={{ required: 'Message is required', minLength: { value: 10, message: 'Message must be at least 10 characters'} }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Your Message"
            multiline
            rows={5}
            variant="outlined"
            fullWidth
            required
            error={!!errors.message}
            helperText={errors.message?.message}
          />
        )}
      />

      <FileUpload onFilesChange={handleFilesChange} control={control} name="attachments" />

      <Button 
        type="submit" 
        variant="contained" 
        color="primary" 
        size="large"
        disabled={isSubmitting}
        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
        sx={{ mt: 1 }}
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </Box>
  );
};

export default ContactForm;
```

#### FileUpload Component (MUI with react-dropzone)
```jsx
// src/components/contact/FileUpload.jsx
import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Paper,
  Chip
} from '@mui/material';
import { CloudUpload, InsertDriveFile, Delete, AttachFile } from '@mui/icons-material';
import { Controller } from 'react-hook-form';

const FileUpload = ({ onFilesChange, control, name }) => {
  // Local state to manage the display of files, RHF will hold the actual File objects
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles, rejectedFiles, event, field) => {
    const newFiles = [...(field.value || []), ...acceptedFiles];
    field.onChange(newFiles); // Update react-hook-form state
    setUploadedFiles(newFiles.map(file => ({ name: file.name, size: file.size, type: file.type })));
    if (onFilesChange) onFilesChange(newFiles);
  }, [onFilesChange]);

  const removeFile = (fileName, field) => {
    const currentFiles = field.value || [];
    const updatedFiles = currentFiles.filter(file => file.name !== fileName);
    field.onChange(updatedFiles);
    setUploadedFiles(updatedFiles.map(file => ({ name: file.name, size: file.size, type: file.type })));
    if (onFilesChange) onFilesChange(updatedFiles);
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={[]}
      render={({ field, fieldState: { error } }) => {
        const { getRootProps, getInputProps, isDragActive } = useDropzone({
          onDrop: (accepted, rejected, event) => onDrop(accepted, rejected, event, field),
          multiple: true,
          maxSize: 5 * 1024 * 1024, // 5MB limit per file example
          accept: 'image/jpeg, image/png, application/pdf' // Example file types
        });

        return (
          <Paper variant="outlined" sx={{ p: 2, mt:1, backgroundColor: isDragActive ? 'action.hover' : 'transparent' }}>
            <Box
              {...getRootProps()}
              sx={{
                border: `2px dashed ${isDragActive ? 'primary.main' : 'grey.400'}`,
                borderRadius: 1,
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                mb: uploadedFiles.length > 0 ? 2 : 0
              }}
            >
              <input {...getInputProps()} />
              <AttachFile sx={{ fontSize: 36, color: 'grey.600', mb:1 }} />
              <Typography variant="body1">
                Drag & drop files here, or click to select files.
              </Typography>
              <Typography variant="caption" display="block">
                (Max 5MB per file. Allowed types: JPG, PNG, PDF)
              </Typography>
            </Box>
            {error && <Typography color="error" variant="caption" sx={{mt:1}}>{error.message || 'Error with file upload.'}</Typography>}
            {uploadedFiles.length > 0 && (
              <Box mt={2}>
                <Typography variant="subtitle2">Attached Files:</Typography>
                <List dense>
                  {uploadedFiles.map((file, index) => (
                    <ListItem
                      key={file.name + index}
                      secondaryAction=
                        <IconButton edge="end" aria-label="delete" onClick={() => removeFile(file.name, field)}>
                          <Delete />
                        </IconButton>
                      sx={{ 
                        backgroundColor: 'grey.100',
                        borderRadius: 1,
                        mb: 0.5,
                        p: '4px 8px'
                      }}
                    >
                      <ListItemIcon sx={{minWidth: 32}}><InsertDriveFile fontSize="small" /></ListItemIcon>
                      <ListItemText 
                        primary={file.name} 
                        secondary={`${(file.size / 1024).toFixed(1)} KB`}
                        primaryTypographyProps={{variant: 'body2', noWrap: true, maxWidth: 'calc(100% - 50px)'}}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Paper>
        );
      }}
    />
  );
};

export default FileUpload;
```

#### ContactMethods Component (MUI styled)
```jsx
// src/components/contact/ContactMethods.jsx
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Link as MuiLink,
  Grid
} from '@mui/material';
import { Email, LocationOn, GroupWork, X as XIcon, Instagram } from '@mui/icons-material';

const contactMethodsData = [
  {
    icon: <Email color="primary" />,
    title: 'Email Us',
    items: [
      { label: 'General Inquiries:', value: 'info@vexusatlas.com', href: 'mailto:info@vexusatlas.com' },
      { label: 'Research Collaboration:', value: 'research@vexusatlas.com', href: 'mailto:research@vexusatlas.com' }
    ]
  },
  {
    icon: <LocationOn color="primary" />,
    title: 'Our Address',
    items: [
      { label: 'VEXUS ATLAS Research Group' },
      { label: 'Denver Health Medical Center' },
      { label: '777 Bannock St, Denver, CO 80204' }
    ]
  },
  {
    icon: <GroupWork color="primary" />,
    title: 'Connect on Social Media',
    items: [
      { label: 'Twitter/X:', value: '@thevexusatlas', href: 'https://x.com/thevexusatlas', socialIcon: <XIcon /> },
      { label: 'Instagram:', value: '@thevexusatlas', href: 'https://www.instagram.com/thevexusatlas/', socialIcon: <Instagram /> }
    ]
  }
];

const ContactMethods = () => {
  return (
    <Box sx={{ pl: { md: 3 } }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Other Ways to Reach Us
      </Typography>
      <Grid container spacing={2}>
        {contactMethodsData.map((method, index) => (
          <Grid item xs={12} key={index}>
            <Paper elevation={2} sx={{ p: 2.5, display: 'flex', alignItems: 'flex-start' }}>
              <ListItemIcon sx={{ mr: 2, mt: 0.5, minWidth: 'auto' }}>{method.icon}</ListItemIcon>
              <Box>
                <Typography variant="h6" component="h3" gutterBottom>{method.title}</Typography>
                <List dense disablePadding>
                  {method.items.map((item, idx) => (
                    <ListItem key={idx} disableGutters sx={{ py: 0.5, display: 'flex', alignItems: 'center' }}>
                      {item.socialIcon && <ListItemIcon sx={{minWidth: 30}}>{item.socialIcon}</ListItemIcon>}
                      <ListItemText
                        primary={item.label}
                        secondary={item.href ? 
                          <MuiLink href={item.href} target="_blank" rel="noopener noreferrer" underline="hover">
                            {item.value}
                          </MuiLink> : item.value
                        }
                        primaryTypographyProps={{ fontWeight: 'medium', display: item.value ? 'inline' : 'block' }}
                        secondaryTypographyProps={{ color: 'text.primary', display: 'inline', ml: item.value ? 0.5 : 0 }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ContactMethods;
```

### 3. Form Handling, Validation, Submission (MUI Context)

- **Form Handling (`react-hook-form`)**: Use `Controller` for MUI components.
- **Validation**: Leverage `react-hook-form` rules for required fields, email patterns, file size/types.
- **Error Display**: `TextField` `error` and `helperText` props, `FormHelperText` for `Select`.
- **Submission**: Async handler with loading state (`CircularProgress` in `Button`), update main page `Alert` via `setSubmissionStatus` prop.

### 4. File Upload Strategy (MUI & react-dropzone)

- **UI**: `Paper` container with dashed border, `CloudUpload` icon.
- **State**: Manage `attachments` within `react-hook-form` state.
- **Display**: `List` of `ListItem` for uploaded files, with `Delete` `IconButton`.
- **Validation**: `maxSize`, `accept` props in `useDropzone`. `react-hook-form` can also validate `attachments` array (e.g., number of files).

### 5. API Service for Contact Form
```javascript
// src/services/contactService.js
const CONTACT_FORM_ENDPOINT = 'https://your-backend-api.com/contact'; // Replace with actual endpoint

export const submitContactForm = async (data) => {
  const formData = new FormData();

  // Append form fields
  Object.keys(data).forEach(key => {
    if (key !== 'attachments') {
      formData.append(key, data[key]);
    }
  });

  // Append files
  if (data.attachments && data.attachments.length > 0) {
    data.attachments.forEach((file, index) => {
      formData.append(`attachment${index + 1}`, file, file.name);
    });
  }

  const response = await fetch(CONTACT_FORM_ENDPOINT, {
    method: 'POST',
    body: formData,
    // Headers might be needed if your endpoint requires them (e.g., for API keys)
    // headers: {
    //   'Authorization': `Bearer YOUR_API_KEY`
    // },
  });

  if (!response.ok) {
    const errorResult = await response.json().catch(() => ({ message: 'Server error' }));
    throw new Error(errorResult.message || `Form submission failed with status: ${response.status}`);
  }

  return await response.json(); // Or handle empty success response
};
```

### 6. Responsive Design & Accessibility (MUI)

- **Responsive Layout**: `Grid` for form and contact methods. `Container` `maxWidth` and `py/px` responsive spacing.
- **Touch-Friendly**: `react-dropzone` is touch-friendly. Ensure MUI components have adequate tap targets.
- **Accessibility**: Proper `label`s, `InputLabel`, `aria-describedby` for helper/error text. Keyboard navigation for form elements.

### 7. Dependencies Update for MUI

```json
{
  "dependencies": {
    "@mui/material": "^5.x.x",
    "@mui/icons-material": "^5.x.x",
    "@emotion/react": "^11.x.x",
    "@emotion/styled": "^11.x.x",
    "react": "^18.x.x",
    "react-dom": "^18.x.x",
    "react-hook-form": "^7.x.x",
    "react-dropzone": "^14.x.x"
    // axios or native fetch for API calls
  },
  "devDependencies": {
    // ... testing libraries
  }
}
```

### 8. Implementation Priority & Security

- **Implementation Priority**:
  1.  Layout with MUI `Container`, `Paper`, `Grid`.
  2.  MUI `ContactForm` with `react-hook-form` (no file upload initially).
  3.  MUI `ContactMethods` display.
  4.  `FileUpload` component integration with `react-dropzone`.
  5.  Form submission logic (`contactService`) and `Alert` for status.
  6.  Responsive styling and accessibility refinements.
- **Security Considerations**:
  - **File Uploads**: Server-side validation of file types, sizes, and content scanning is crucial. Client-side validation is a first-pass UX improvement only.
  - **Input Sanitization**: Backend should sanitize all inputs before processing or storing.
  - **CSRF Protection**: If using session-based auth, ensure CSRF tokens.
  - **Rate Limiting**: Implement on the backend API to prevent abuse.

This detailed framework for the Contact page provides a clear path to converting it using Material-UI, ensuring a modern, responsive, and accessible user experience. 