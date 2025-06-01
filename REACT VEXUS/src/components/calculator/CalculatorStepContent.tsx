import React, { useState } from 'react';
import {
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Chip,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
} from '@mui/material';
import { CloudUpload, Edit } from '@mui/icons-material';
import { StepConfig } from '../../config/calculatorConfig';
import { AIAnalysisResult } from '../../services/aiService';
import ImageUpload from './ImageUpload';

interface CalculatorStepContentProps {
  stepConfig: StepConfig;
  score: number | null;
  currentImage: Blob | null;
  aiStatus: 'idle' | 'processing' | 'success' | 'error';
  aiResult: AIAnalysisResult | null;
  aiError: string | null;
  onScoreChange: (veinType: string, score: number) => void;
  onImageUpload: (veinType: string, imageBlob: Blob) => void;
  onImageAnalyze: (veinType: string, imageBlob: Blob) => void;
  onImageClear: (veinType: string) => void;
  isMobile?: boolean;
}

const CalculatorStepContent: React.FC<CalculatorStepContentProps> = ({
  stepConfig,
  score,
  currentImage,
  aiStatus,
  aiResult,
  aiError,
  onScoreChange,
  onImageUpload,
  onImageAnalyze,
  onImageClear,
  isMobile = false,
}) => {
  const { id, title, inputType, options, veinType, instructions } = stepConfig;
  const [inputMethod, setInputMethod] = useState<'ai' | 'manual'>('ai');

  const handleScoreChange = (event: any) => {
    const selectedValue = event.target.value;
    const selectedOption = options?.values.find(val => val.value === selectedValue);
    if (selectedOption) {
      onScoreChange(veinType, selectedOption.score);
    }
  };

  const handleInputMethodChange = (
    event: React.MouseEvent<HTMLElement>,
    newMethod: 'ai' | 'manual',
  ) => {
    if (newMethod !== null) {
      setInputMethod(newMethod);
      // Clear existing data when switching methods
      if (newMethod === 'manual') {
        onImageClear(veinType);
      }
    }
  };

  const getSelectedValue = () => {
    if (score === null) return '';
    // Find the option that matches the current score
    const matchingOption = options?.values.find(val => val.score === score);
    return matchingOption?.value || '';
  };

  const getStepNumber = () => {
    // Extract step number from the title
    const match = title.match(/Step (\d+):/);
    return match ? match[1] : '';
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3, 
        mb: 3, 
        borderLeft: '4px solid',
        borderLeftColor: score !== null ? '#4caf50' : '#2196f3',
        backgroundColor: score !== null ? '#f8fff8' : '#ffffff',
      }}
    >
      {/* Step Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: score !== null ? '#4caf50' : '#2196f3',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            mr: 2,
          }}
        >
          {getStepNumber()}
        </Box>
        <Box>
          <Typography variant="h6" component="h3" gutterBottom>
            {title}
          </Typography>
          {score !== null && (
            <Chip 
              label={`Score: ${score}`} 
              color="success" 
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
          )}
        </Box>
      </Box>

      {/* Instructions */}
      {instructions && (
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mb: 2, fontStyle: 'italic' }}
        >
          {instructions}
        </Typography>
      )}

      {/* Input Type: Dropdown */}
      {inputType === 'dropdown' && options && (
        <FormControl fullWidth margin="normal">
          <InputLabel id={`${id}-label`}>{options.label}</InputLabel>
          <Select
            labelId={`${id}-label`}
            id={id}
            value={getSelectedValue()}
            label={options.label}
            onChange={handleScoreChange}
          >
            <MenuItem value="">
              <em>-- Select --</em>
            </MenuItem>
            {options.values.map((val) => (
              <MenuItem key={val.value} value={val.value}>
                {val.label} ({val.score})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* Input Type: Image AI with Method Selection */}
      {inputType === 'image_ai' && (
        <Box>
          {/* Input Method Selection */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Choose Input Method:
            </Typography>
            <ToggleButtonGroup
              value={inputMethod}
              exclusive
              onChange={handleInputMethodChange}
              aria-label="input method"
              size="small"
              sx={{ mb: 2 }}
            >
              <ToggleButton value="ai" aria-label="ai analysis">
                <CloudUpload sx={{ mr: 1 }} />
                AI Image Analysis
              </ToggleButton>
              <ToggleButton value="manual" aria-label="manual input">
                <Edit sx={{ mr: 1 }} />
                Manual Classification
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* AI Image Upload Method */}
          {inputMethod === 'ai' && (
            <Box>
              <ImageUpload
                veinType={veinType}
                currentImage={currentImage}
                onImageUpload={(imageBlob: Blob) => onImageUpload(veinType, imageBlob)}
                aiStatus={aiStatus}
                aiResult={aiResult}
                aiError={aiError}
                onAnalyze={(veinType: string, imageBlob: Blob) => onImageAnalyze(veinType, imageBlob)}
                onClear={(veinType: string) => onImageClear(veinType)}
                isMobile={isMobile}
              />

              {/* Manual Override after AI Analysis */}
              {(aiResult || aiError) && options && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Manual Override (Optional)
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    You can manually adjust the classification if you disagree with the AI analysis.
                  </Typography>
                  
                  <FormControl fullWidth>
                    <InputLabel id={`${id}-override-label`}>{options.label}</InputLabel>
                    <Select
                      labelId={`${id}-override-label`}
                      id={`${id}-override`}
                      value={getSelectedValue()}
                      label={options.label}
                      onChange={handleScoreChange}
                    >
                      <MenuItem value="">
                        <em>-- Use AI Result --</em>
                      </MenuItem>
                      {options.values.map((val) => (
                        <MenuItem key={val.value} value={val.value}>
                          {val.label} ({val.score})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Show warning for low confidence */}
                  {aiResult && aiResult.confidence < 0.5 && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        <strong>Low Confidence Detected:</strong> The AI confidence is below 50%. 
                        Please verify the result or consider uploading a higher quality image.
                      </Typography>
                    </Alert>
                  )}
                </Box>
              )}
            </Box>
          )}

          {/* Manual Dropdown Method */}
          {inputMethod === 'manual' && options && (
            <Box>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Manual Classification:</strong> Select the classification based on your clinical assessment 
                  of the ultrasound image without AI assistance.
                </Typography>
              </Alert>

              <FormControl fullWidth margin="normal">
                <InputLabel id={`${id}-manual-label`}>{options.label}</InputLabel>
                <Select
                  labelId={`${id}-manual-label`}
                  id={`${id}-manual`}
                  value={getSelectedValue()}
                  label={options.label}
                  onChange={handleScoreChange}
                >
                  <MenuItem value="">
                    <em>-- Select Classification --</em>
                  </MenuItem>
                  {options.values.map((val) => (
                    <MenuItem key={val.value} value={val.value}>
                      {val.label} ({val.score})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </Box>
      )}

      {/* Input Type: Manual Measurement (for future use) */}
      {inputType === 'manual_measurement' && (
        <Box>
          <Typography variant="body2" color="text.secondary">
            Manual measurement input coming soon...
          </Typography>
        </Box>
      )}

      {/* Step Completion Status */}
      {score !== null && (
        <Box sx={{ mt: 2, p: 2, backgroundColor: '#e8f5e8', borderRadius: 1 }}>
          <Typography variant="body2" color="success.main" sx={{ fontWeight: 'bold' }}>
            ✓ Step completed with score: {score}
          </Typography>
          {inputMethod === 'ai' && aiResult && (
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              AI Classification: {aiResult.classification} 
              (Confidence: {(aiResult.confidence * 100).toFixed(1)}%)
            </Typography>
          )}
          {inputMethod === 'manual' && (
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Manual Classification: {getSelectedValue()}
            </Typography>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default CalculatorStepContent; 