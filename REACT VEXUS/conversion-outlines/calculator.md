# Calculator Page Conversion Outline

## Overview
Convert `calculator.astro` to a React application with AI image recognition, VEXUS scoring, and interactive form handling using Material-UI components.

## Current Structure Analysis
- Multi-step calculator interface for VEXUS scoring
- Image upload functionality for AI analysis (IVC, Hepatic, Portal, Renal)
- AI model integration for image analysis (specific endpoints per vein type)
- Image cropping functionality using Cropper.js
- Modal warnings for HIPAA and Beta feature disclaimers
- Form submissions for feedback or data logging
- Complex state management required for scores, images, current step, and AI results
- Potential for manual override of AI-derived scores

## Comprehensive Conversion Framework

### 1. Main Component Architecture & MUI Integration
```jsx
// src/pages/Calculator.jsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Paper,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import CalculatorStepContent from '../components/calculator/CalculatorStepContent';
import ScoreDisplay from '../components/calculator/ScoreDisplay';
import WarningModal from '../components/calculator/WarningModal';
import FeedbackForm from '../components/calculator/FeedbackForm';
import { useCalculatorState } from '../hooks/useCalculatorState'; // Manages complex state
import { stepsConfig } from '../config/calculatorConfig'; // Configuration for steps

const Calculator = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    state,
    dispatch,
    calculateTotalScore,
    handleNext, 
    handleBack,
    handleReset,
    isStepCompleted
  } = useCalculatorState();

  const [hipaaModalOpen, setHipaaModalOpen] = useState(true);
  const [betaModalOpen, setBetaModalOpen] = useState(true);

  useEffect(() => {
    // Potentially load initial state or show modals
  }, []);

  const totalScore = calculateTotalScore();

  return (
    <Layout>
      <SEO 
        title="VEXUS Score Calculator - VEXUS ATLAS"
        description="Calculate VEXUS score using AI-assisted image analysis or manual input. A tool for medical professionals."
        keywords="VEXUS calculator, VEXUS score, ultrasound, AI, medical calculator, venous congestion"
      />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            VEXUS Score Calculator
          </Typography>
          
          <Stepper activeStep={state.currentStep} orientation={isMobile ? 'vertical' : 'horizontal'} sx={{ mb: 4 }}>
            {stepsConfig.map((step, index) => (
              <Step key={step.id} completed={isStepCompleted(index)}>
                <StepLabel>{step.label}</StepLabel>
                {!isMobile && (
                  <StepContent sx={{ display: state.currentStep === index ? 'block' : 'none' }}>
                    <CalculatorStepContent 
                      stepConfig={step} 
                      scores={state.scores}
                      images={state.images}
                      dispatch={dispatch}
                      isMobile={isMobile}
                    />
                  </StepContent>
                )}
              </Step>
            ))}
          </Stepper>

          {isMobile && state.currentStep < stepsConfig.length && (
             <CalculatorStepContent 
                stepConfig={stepsConfig[state.currentStep]} 
                scores={state.scores}
                images={state.images}
                dispatch={dispatch}
                isMobile={isMobile}
              />
          )}

          {state.currentStep === stepsConfig.length && (
            <ScoreDisplay totalScore={totalScore} scores={state.scores} />
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button disabled={state.currentStep === 0} onClick={handleBack}>
              Back
            </Button>
            {state.currentStep < stepsConfig.length ? (
              <Button variant="contained" onClick={handleNext} disabled={!isStepCompleted(state.currentStep)}>
                {state.currentStep === stepsConfig.length - 1 ? 'Calculate Score' : 'Next'}
              </Button>
            ) : (
              <Button variant="outlined" onClick={handleReset}>
                Reset Calculator
              </Button>
            )}
          </Box>
        </Paper>

        <FeedbackForm sx={{ mt: 4 }} />

        <WarningModal
          open={hipaaModalOpen}
          onClose={() => setHipaaModalOpen(false)}
          title="HIPAA Compliance Reminder"
          content="Ensure no Protected Health Information (PHI) is uploaded. All images should be de-identified before analysis."
        />
        <WarningModal
          open={betaModalOpen}
          onClose={() => setBetaModalOpen(false)}
          title="Beta Feature Disclaimer"
          content="This AI-powered calculator is a beta feature for research and educational purposes. It is not a substitute for clinical judgment."
        />
      </Container>
    </Layout>
  );
};

export default Calculator;
```

### 2. MUI Component Mapping & Key Components

#### CalculatorStepContent Component (MUI focused)
```jsx
// src/components/calculator/CalculatorStepContent.jsx
import React from 'react';
import {
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid
} from '@mui/material';
import ImageUpload from './ImageUpload'; // MUI styled image upload

const CalculatorStepContent = ({ stepConfig, scores, images, dispatch, isMobile }) => {
  const { id, title, inputType, options, veinType } = stepConfig;

  const handleScoreChange = (event) => {
    dispatch({ 
      type: 'UPDATE_SCORE', 
      payload: { veinType, score: parseInt(event.target.value, 10) }
    });
  };

  const handleImageUpload = (file) => {
    dispatch({ 
      type: 'UPLOAD_IMAGE', 
      payload: { veinType, imageFile: file }
    });
    // Trigger AI analysis after image upload
    dispatch({ type: 'ANALYZE_IMAGE', payload: { veinType, imageFile: file }});
  };

  return (
    <Box sx={{ my: 2, p: 2, border: '1px dashed grey', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      {inputType === 'dropdown' && (
        <FormControl fullWidth margin="normal">
          <InputLabel id={`${id}-label`}>{options.label}</InputLabel>
          <Select
            labelId={`${id}-label`}
            id={id}
            value={scores[veinType] || ''}
            label={options.label}
            onChange={handleScoreChange}
          >
            {options.values.map((val) => (
              <MenuItem key={val.value} value={val.value}>{val.label} ({val.score} points)</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      {inputType === 'image_ai' && (
        <ImageUpload
          veinType={veinType}
          currentImage={images[veinType]}
          onImageUpload={handleImageUpload}
          aiStatus={scores[`${veinType}_ai_status`]} // e.g., processing, success, error
          aiResult={scores[`${veinType}_ai_result`]} // e.g., the measurement or classification
          dispatch={dispatch} // for manual override if needed
          isMobile={isMobile}
        />
      )}
      {inputType === 'manual_measurement' && (
        <TextField 
          label="Measurement (e.g., mm or cm/s)"
          type="number"
          fullWidth
          margin="normal"
          value={scores[veinType] || ''}
          onChange={handleScoreChange}
          // Add helper text for units
        />
      )}
    </Box>
  );
};

export default CalculatorStepContent;
```

#### ImageUpload Component (with MUI & Cropper)
```jsx
// src/components/calculator/ImageUpload.jsx
import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Paper,
  Grid,
  Tooltip
} from '@mui/material';
import { PhotoCamera, Crop, CheckCircleOutline, ErrorOutline, CloudUpload } from '@mui/icons-material';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { useDropzone } from 'react-dropzone';

const ImageUpload = ({ veinType, currentImage, onImageUpload, aiStatus, aiResult, dispatch, isMobile }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const cropperRef = useRef(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setIsCropping(true);
        setCroppedImage(null); // Reset cropped image when new one is uploaded
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false
  });

  const handleCrop = () => {
    if (cropperRef.current?.cropper) {
      cropperRef.current.cropper.getCroppedCanvas().toBlob((blob) => {
        setCroppedImage(URL.createObjectURL(blob));
        onImageUpload(blob); // Pass blob to parent for AI analysis
        setIsCropping(false);
      });
    }
  };

  const handleRecrop = () => {
    setCroppedImage(null);
    setIsCropping(true); // Re-enable cropping UI with the original source
  };

  const handleClearImage = () => {
    setImageSrc(null);
    setCroppedImage(null);
    setIsCropping(false);
    dispatch({ type: 'CLEAR_IMAGE', payload: { veinType } });
  };

  return (
    <Paper elevation={1} sx={{ p: 2, mt: 2, backgroundColor: 'grey.50' }}>
      <Typography variant="subtitle1" gutterBottom>Upload Image for {veinType}</Typography>
      
      {!imageSrc && (
        <Box
          {...getRootProps()}
          sx={{
            border: `2px dashed ${isDragActive ? 'primary.main' : 'grey.400'}`,
            borderRadius: 1,
            p: 3,
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: isDragActive ? 'action.hover' : 'transparent',
            mb: 2
          }}
        >
          <input {...getInputProps()} />
          <CloudUpload sx={{ fontSize: 48, color: 'grey.600' }} />
          <Typography>Drag & drop image, or click to select</Typography>
        </Box>
      )}

      {imageSrc && isCropping && (
        <Box sx={{ mb: 2 }}>
          <Cropper
            ref={cropperRef}
            src={imageSrc}
            style={{ height: isMobile ? 200 : 300, width: '100%' }}
            aspectRatio={16 / 9} // Or dynamic based on veinType if needed
            guides={true}
            viewMode={1}
            responsive={true}
            autoCropArea={0.8}
            checkOrientation={false}
          />
          <Button variant="contained" onClick={handleCrop} startIcon={<Crop />} sx={{ mt: 1, mr: 1 }}>
            Crop & Analyze
          </Button>
          <Button variant="outlined" onClick={handleClearImage} sx={{ mt: 1 }}>Clear</Button>
        </Box>
      )}

      {croppedImage && (
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="subtitle2">Processed Image:</Typography>
          <img src={croppedImage} alt={`${veinType} cropped`} style={{ maxWidth: '100%', maxHeight: isMobile ? 150 : 200, borderRadius: '4px' }} />
          <Grid container spacing={1} justifyContent="center" sx={{mt: 1}}>
            <Grid item><Button variant="outlined" size="small" onClick={handleRecrop}>Re-Crop</Button></Grid>
            <Grid item><Button variant="outlined" size="small" onClick={handleClearImage}>Clear Image</Button></Grid>
          </Grid>
        </Box>
      )}
      
      {/* AI Status and Results */}
      {aiStatus === 'processing' && <CircularProgress size={24} sx={{my:1}} />}
      {aiStatus === 'success' && aiResult && (
        <Alert severity="success" icon={<CheckCircleOutline />}>
          AI Analysis: {aiResult.measurement || aiResult.classification} (Score: {aiResult.score})
          {/* Allow manual override if needed */}
        </Alert>
      )}
      {aiStatus === 'error' && (
        <Alert severity="error" icon={<ErrorOutline />}>
          AI Analysis Failed. Please try again or input manually.
        </Alert>
      )}
    </Paper>
  );
};

export default ImageUpload;
```

### 3. State Management Strategy (useCalculatorState Hook)
```jsx
// src/hooks/useCalculatorState.js
import { useReducer, useCallback } from 'react';
import { stepsConfig, scoreLogic } from '../config/calculatorConfig';
import { AIService } from '../services/aiService'; // Ensure AIService is correctly imported

const aiService = new AIService();

const initialState = {
  currentStep: 0,
  scores: stepsConfig.reduce((acc, step) => ({ ...acc, [step.veinType]: null }), {}),
  images: stepsConfig.reduce((acc, step) => ({ ...acc, [step.veinType]: null }), {}),
  aiAnalysis: stepsConfig.reduce((acc, step) => ({ 
    ...acc, 
    [step.veinType]: { status: 'idle', result: null, error: null }
  }), {}), // idle, processing, success, error
  isSubmittingFeedback: false,
  feedbackError: null,
};

function calculatorReducer(state, action) {
  switch (action.type) {
    case 'NEXT_STEP':
      return { ...state, currentStep: Math.min(state.currentStep + 1, stepsConfig.length) };
    case 'PREVIOUS_STEP':
      return { ...state, currentStep: Math.max(state.currentStep - 1, 0) };
    case 'RESET_CALCULATOR':
      return { ...initialState }; // Consider preserving modal states if needed
    case 'UPDATE_SCORE': // For manual inputs or AI confirmed scores
      return {
        ...state,
        scores: { ...state.scores, [action.payload.veinType]: action.payload.score },
      };
    case 'UPLOAD_IMAGE': // Stores the cropped blob/file for potential re-analysis or display
      return {
        ...state,
        images: { ...state.images, [action.payload.veinType]: action.payload.imageFile },
      };
    case 'CLEAR_IMAGE':
      return {
        ...state,
        images: { ...state.images, [action.payload.veinType]: null },
        scores: { ...state.scores, [action.payload.veinType]: null }, // Also clear score if image is cleared
        aiAnalysis: { 
            ...state.aiAnalysis, 
            [action.payload.veinType]: { status: 'idle', result: null, error: null }
        }
      };
    case 'ANALYZE_IMAGE_START':
      return {
        ...state,
        aiAnalysis: { 
          ...state.aiAnalysis, 
          [action.payload.veinType]: { status: 'processing', result: null, error: null }
        },
      };
    case 'ANALYZE_IMAGE_SUCCESS':
      return {
        ...state,
        aiAnalysis: {
          ...state.aiAnalysis,
          [action.payload.veinType]: { status: 'success', result: action.payload.result, error: null },
        },
        // Optionally auto-update score based on AI result here or let user confirm
        scores: { ...state.scores, [action.payload.veinType]: action.payload.result.score },
      };
    case 'ANALYZE_IMAGE_FAILURE':
      return {
        ...state,
        aiAnalysis: {
          ...state.aiAnalysis,
          [action.payload.veinType]: { status: 'error', result: null, error: action.payload.error },
        },
      };
    // Feedback form states
    case 'SUBMIT_FEEDBACK_START':
      return { ...state, isSubmittingFeedback: true, feedbackError: null };
    case 'SUBMIT_FEEDBACK_SUCCESS':
      return { ...state, isSubmittingFeedback: false };
    case 'SUBMIT_FEEDBACK_FAILURE':
      return { ...state, isSubmittingFeedback: false, feedbackError: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export const useCalculatorState = () => {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  const handleNext = useCallback(() => dispatch({ type: 'NEXT_STEP' }), [dispatch]);
  const handleBack = useCallback(() => dispatch({ type: 'PREVIOUS_STEP' }), [dispatch]);
  const handleReset = useCallback(() => dispatch({ type: 'RESET_CALCULATOR' }), [dispatch]);

  const calculateTotalScore = useCallback(() => {
    let total = 0;
    for (const veinType in state.scores) {
      if (state.scores[veinType] !== null) {
        total += parseInt(state.scores[veinType], 10); // Ensure scores are numbers
      }
    }
    return total;
    // Or more complex logic based on scoreLogic config
  }, [state.scores]);

  const isStepCompleted = useCallback((stepIndex) => {
    if (stepIndex >= stepsConfig.length) return true;
    const step = stepsConfig[stepIndex];
    // Check if the score for the current step is filled OR AI analysis is successful
    return state.scores[step.veinType] !== null || state.aiAnalysis[step.veinType]?.status === 'success';
  }, [state.scores, state.aiAnalysis]);
  
  const analyzeImage = useCallback(async (veinType, imageBlob) => {
    dispatch({ type: 'ANALYZE_IMAGE_START', payload: { veinType } });
    try {
      const result = await aiService.analyzeVEXUSImage(imageBlob, veinType);
      // `result` should include the measurement/classification and the derived score
      // e.g., result = { measurement: 'S-wave', score: 1, raw_output: ... }
      dispatch({ type: 'ANALYZE_IMAGE_SUCCESS', payload: { veinType, result } });
    } catch (error) {
      dispatch({ type: 'ANALYZE_IMAGE_FAILURE', payload: { veinType, error: error.message } });
    }
  }, [dispatch]);

  // Expose `analyzeImage` to be called from ImageUpload or CalculatorStepContent
  useEffect(() => {
    stepsConfig.forEach(step => {
      if (state.images[step.veinType] && state.aiAnalysis[step.veinType].status === 'idle') {
         // This is a conceptual placement; actual call might be triggered more directly by user action (e.g., after crop)
         // analyzeImage(step.veinType, state.images[step.veinType]);
      }
    });
  }, [state.images, state.aiAnalysis, analyzeImage]);


  return { state, dispatch, calculateTotalScore, handleNext, handleBack, handleReset, isStepCompleted, analyzeImage };
};
```

### 4. AI Integration & Service Module

#### AIService Module (Error Handling & Robustness)
```javascript
// src/services/aiService.js
export class AIService {
  constructor(timeout = 30000) { // 30 seconds timeout
    this.endpoints = {
      ivc: 'https://your-modal-endpoint-for-ivc/predict', // Example for IVC if it exists
      hepatic: 'https://gsiegel14--vexus-hepatic-endpoint-hepaticmodel-predict.modal.run',
      portal: 'https://gsiegel14--vexus-renal-portal-endpoint-portalmodel-predict.modal.run',
      renal: 'https://gsiegel14--vexus-renal-portal-endpoint-renalmodel-predict.modal.run'
    };
    this.timeout = timeout;
  }

  async analyzeVEXUSImage(imageBlob, veinType) {
    const endpoint = this.endpoints[veinType];
    if (!endpoint) {
      throw new Error(`No AI endpoint configured for vein type: ${veinType}`);
    }

    const formData = new FormData();
    formData.append('file', imageBlob, `${veinType}_upload.png`); // Provide a filename

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        // headers: { 'Authorization': 'Bearer YOUR_API_KEY' } // If auth is needed
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
        throw new Error(`AI analysis failed for ${veinType}: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`);
      }
      
      const result = await response.json();
      // Standardize the result structure if necessary
      // e.g., { measurement: 'D-Wave Dominant', score: 2, details: { ... } }
      if (result && typeof result.score !== 'undefined') {
        return result;
      } else {
        throw new Error('AI response did not include a score or was malformed.');
      }

    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error(`AI analysis for ${veinType} timed out after ${this.timeout / 1000} seconds.`);
      }
      throw error; // Re-throw other errors
    }
  }
}
```

### 5. Configuration File for Calculator Logic
```javascript
// src/config/calculatorConfig.js
export const stepsConfig = [
  {
    id: 'ivc',
    label: 'IVC Measurement',
    title: 'Step 1: Inferior Vena Cava (IVC)',
    veinType: 'ivc',
    inputType: 'dropdown', // Or 'image_ai' or 'manual_measurement'
    options: {
      label: 'IVC Diameter (Collapsibility NOT used in VEXUS)',
      values: [
        { label: 'IVC < 2cm', value: '<2cm', score: 0 },
        { label: 'IVC > 2cm', value: '>2cm', score: 1 },
      ]
    }
  },
  {
    id: 'hepatic',
    label: 'Hepatic Vein',
    title: 'Step 2: Hepatic Vein Doppler',
    veinType: 'hepatic',
    inputType: 'image_ai', // Example for AI input
    // AI will return score and measurement/classification
  },
  {
    id: 'portal',
    label: 'Portal Vein',
    title: 'Step 3: Portal Vein Doppler',
    veinType: 'portal',
    inputType: 'image_ai',
  },
  {
    id: 'renal',
    label: 'Renal Vein',
    title: 'Step 4: Intrarenal Vein Doppler',
    veinType: 'renal',
    inputType: 'image_ai',
  }
];

// Defines how to calculate total VEXUS score or grade
export const scoreLogic = {
  gradingSystem: [
    { range: [0, 1], grade: 0, description: 'No Venous Congestion' },
    { range: [2, 4], grade: 1, description: 'Mild Venous Congestion' },
    { range: [5, 7], grade: 2, description: 'Moderate Venous Congestion' },
    { range: [8, 9], grade: 3, description: 'Severe Venous Congestion' }, // Max score for 3 points per category if IVC is 3, and 3 AI categories are max 2 points each = 3 + 2*3 = 9
  ],
  // Add other logic as needed
};
```

### 6. MUI Modals and Feedback Form

#### WarningModal Component
```jsx
// src/components/calculator/WarningModal.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import { WarningAmber } from '@mui/icons-material';

const WarningModal = ({ open, onClose, title, content }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
        <WarningAmber color="warning" sx={{ mr: 1 }} />
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" autoFocus>
          Acknowledge
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WarningModal;
```

#### FeedbackForm Component (MUI Styled)
```jsx
// src/components/calculator/FeedbackForm.jsx
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Rating // For user satisfaction
} from '@mui/material';

const FeedbackForm = ({ sx }) => {
  const { control, handleSubmit, formState: { errors }, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' }); // 'success' or 'error'

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });
    try {
      // Replace with actual feedback submission logic
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      console.log('Feedback submitted:', data);
      setSubmitStatus({ type: 'success', message: 'Thank you for your feedback!' });
      reset(); // Clear form on successful submission
    } catch (error) {
      setSubmitStatus({ type: 'error', message: error.message || 'Failed to submit feedback. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ ...sx, mt: 4, p:3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>Submit Feedback</Typography>
      
      <Controller
        name="name"
        control={control}
        defaultValue=""
        rules={{ maxLength: { value: 50, message: 'Name too long' } }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Name (Optional)"
            fullWidth
            margin="normal"
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        )}
      />

      <Controller
        name="email"
        control={control}
        defaultValue=""
        rules={{ pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' } }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Email (Optional)"
            type="email"
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        )}
      />

      <Controller
        name="feedback"
        control={control}
        defaultValue=""
        rules={{ required: 'Feedback message is required', minLength: {value: 10, message: 'Feedback too short'} }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Your Feedback"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            required
            error={!!errors.feedback}
            helperText={errors.feedback?.message}
          />
        )}
      />
      
      <Box sx={{my: 2}}>
        <Typography component="legend">Overall Satisfaction (Optional)</Typography>
        <Controller
            name="satisfaction"
            control={control}
            defaultValue={0}
            render={({ field: { onChange, value } }) => (
                <Rating name="satisfaction-rating" value={Number(value)} onChange={onChange} />
            )}
        />
      </Box>

      {submitStatus.message && (
        <Alert severity={submitStatus.type} sx={{ mb: 2 }}>{submitStatus.message}</Alert>
      )}

      <Button 
        type="submit" 
        variant="contained" 
        color="secondary"
        disabled={isSubmitting}
        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
      >
        {isSubmitting ? 'Submitting...' : 'Send Feedback'}
      </Button>
    </Box>
  );
};

export default FeedbackForm;
```

### 7. Performance, Error Handling, Testing (MUI Context)

- **Performance Optimizations**:
  - `React.memo` for `CalculatorStepContent` and other presentational components.
  - `useCallback` for handlers passed to memoized components.
  - MUI `ImageList` with virtualization for large sets of images if applicable (not in current design).
  - Debounce AI calls if triggered by typing (not applicable here, but for text inputs).
  - Optimize Cropper.js usage, ensuring it doesn't cause unnecessary re-renders.
  - Use MUI Skeletons during loading states for better UX.
- **Error Handling**:
  - Use MUI `Alert` components for user-friendly error messages from AI or form submissions.
  - Implement global error boundaries that render a fallback MUI-styled UI.
  - Specific error states in `useCalculatorState` for AI calls.
- **Testing Strategy**:
  - Unit test `calculatorReducer` logic thoroughly.
  - Mock `AIService` for testing `useCalculatorState` and AI-dependent components.
  - Use `@testing-library/react` to test MUI component interactions (stepper, form inputs, modals).
  - Test Cropper.js interactions by mocking its methods or verifying blob output.
  - End-to-end tests covering the full multi-step calculation process.

### 8. Dependencies Update for MUI & Advanced Features

```json
{
  "dependencies": {
    "@mui/material": "^5.x.x",
    "@mui/icons-material": "^5.x.x",
    "@emotion/react": "^11.x.x",
    "@emotion/styled": "^11.x.x",
    "react": "^18.x.x",
    "react-dom": "^18.x.x",
    "react-cropper": "^2.1.8", // Ensure latest compatible version
    "cropperjs": "^1.5.13", // Peer dependency for react-cropper
    "react-hook-form": "^7.x.x",
    "react-dropzone": "^14.x.x",
    "axios": "^1.x.x" // Or use native fetch
  },
  "devDependencies": {
    "@testing-library/react": "^13.x.x",
    "@testing-library/jest-dom": "^5.x.x",
    "@testing-library/user-event": "^14.x.x",
    "jest-axe": "^7.x.x"
  }
}
```

### 9. Implementation Priority & Security (MUI Context)

- **Implementation Priority**:
  1.  Core layout with MUI Stepper and `useCalculatorState` foundation.
  2.  MUI-styled `ImageUpload` component with Dropzone and basic Cropper.js.
  3.  AI Service integration and `aiAnalysis` state updates.
  4.  Score calculation logic and `ScoreDisplay` component.
  5.  MUI `Dialog` for HIPAA/Beta warnings.
  6.  MUI `FeedbackForm` with `react-hook-form`.
  7.  Refine error states with MUI `Alerts`.
  8.  Performance optimizations (memoization, Skeletons).
- **Security Considerations**:
  - File upload validation: Use `react-dropzone` `accept` prop and server-side validation for type/size.
  - Input sanitization: MUI TextFields generally handle this, but be cautious with `dangerouslySetInnerHTML` if used (not recommended).
  - API communication: Use HTTPS for AI service endpoints. Consider API keys/tokens if services require auth, managed server-side or via environment variables.
  - HIPAA: Re-iterate de-identification of images; UI warnings are good, but technical safeguards (if possible on client, e.g., simple PHI pattern check before upload) or server-side checks are better if feasible. Client-side is limited.

This enhanced outline provides a more robust framework for converting the `calculator.astro` page using Material-UI, focusing on component structure, state management, and AI integration within the MUI ecosystem. 