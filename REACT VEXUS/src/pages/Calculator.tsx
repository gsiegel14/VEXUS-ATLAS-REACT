import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Container,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  useTheme,
  useMediaQuery,
  LinearProgress,
  Alert,
  Fab,
} from '@mui/material';
import { 
  NavigateNext, 
  NavigateBefore, 
  Refresh, 
  Assessment
} from '@mui/icons-material';

import BaseLayout from '../components/templates/BaseLayout/BaseLayout';
import { useCalculatorState } from '../hooks/useCalculatorState';
import { stepsConfig } from '../config/calculatorConfig';
import CalculatorStepContent from '../components/calculator/CalculatorStepContent';
import ScoreDisplay from '../components/calculator/ScoreDisplay';
import WarningModal from '../components/calculator/WarningModal';
import { AIService } from '../services/aiService';

const Calculator: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const {
    state,
    calculateTotalScore,
    handleNext,
    handleBack,
    handleReset,
    isStepCompleted,
    analyzeImage,
    updateScore,
    uploadImage,
    clearImage,
  } = useCalculatorState();

  const [hipaaModalOpen, setHipaaModalOpen] = useState(true);
  const [betaModalOpen, setBetaModalOpen] = useState(false);
  const [hasAcknowledgedHIPAA, setHasAcknowledgedHIPAA] = useState(false);
  const [hasAcknowledgedBeta, setHasAcknowledgedBeta] = useState(false);

  const totalScore = calculateTotalScore();
  const isOnResultsStep = state.currentStep >= stepsConfig.length;
  const canProceed = isStepCompleted(state.currentStep);

  useEffect(() => {
    // Show modals in sequence
    if (!hasAcknowledgedHIPAA) {
      setHipaaModalOpen(true);
    } else if (!hasAcknowledgedBeta) {
      setBetaModalOpen(true);
    }
    
    // Test endpoints when component mounts - don't block rendering if this fails
    const testEndpoints = async () => {
      try {
        const aiService = new AIService();
        await aiService.testAllEndpoints();
        console.log('✅ AI endpoints tested successfully');
      } catch (error) {
        console.warn('⚠️ AI endpoint testing failed:', error);
        // Component should still render even if endpoint testing fails
      }
    };
    
    testEndpoints();
  }, [hasAcknowledgedHIPAA, hasAcknowledgedBeta]);

  const handleHipaaConfirm = () => {
    setHasAcknowledgedHIPAA(true);
    setHipaaModalOpen(false);
    setBetaModalOpen(true);
  };

  const handleBetaConfirm = () => {
    setHasAcknowledgedBeta(true);
    setBetaModalOpen(false);
  };

  const handleModalCancel = () => {
    setHipaaModalOpen(false);
    setBetaModalOpen(false);
    // Could redirect user away or show a different message
  };

  const handleNextStep = () => {
    if (isOnResultsStep) {
      handleReset();
    } else {
      handleNext();
    }
  };

  const getProgressValue = () => {
    return (state.currentStep / stepsConfig.length) * 100;
  };

  const getCurrentStep = () => {
    if (isOnResultsStep) return null;
    return stepsConfig[state.currentStep];
  };

  const currentStep = getCurrentStep();

  return (
    <BaseLayout pageTitle="VEXUS Score Calculator" containerMaxWidth="lg">
      <Helmet>
        <title>VEXUS Score Calculator - AI Image Recognition | VEXUS ATLAS</title>
        <meta 
          name="description" 
          content="Calculate VEXUS (Venous Excess UltraSound) scores with AI-based ultrasound image recognition. Upload ultrasound images for hepatic, portal, and renal veins for analysis." 
        />
        <meta 
          name="keywords" 
          content="VEXUS, ultrasound, venous excess, calculator, medical, AI, image recognition, hepatic vein, portal vein, renal vein" 
        />
        
        {/* OpenGraph Meta Tags */}
        <meta property="og:title" content="VEXUS Score Calculator | AI-Based Recognition" />
        <meta property="og:description" content="Calculate VEXUS (Venous Excess UltraSound) scores with AI-based ultrasound image recognition. Upload images for instant analysis." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="VEXUS ATLAS" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="VEXUS Score Calculator | AI-Based Recognition" />
        <meta name="twitter:description" content="Calculate VEXUS (Venous Excess UltraSound) scores with AI-based ultrasound image recognition. Upload images for instant analysis." />
      </Helmet>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <Assessment sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              AI Image Recognition & Scoring
            </Typography>
          </Box>
          
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2, maxWidth: 800, mx: 'auto' }}>
            This is an <strong>AI-based image recognition tool</strong> designed to assist in VEXUS waveform interpretation. 
            It is not a substitute for clinical judgment.
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', maxWidth: 800, mx: 'auto' }}>
            If you receive an incorrect prediction, please let us know after troubleshooting your image. 
            We are continuously improving our AI models.
          </Typography>
        </Box>

        {/* Progress Bar */}
        {!isOnResultsStep && (
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Progress: Step {state.currentStep + 1} of {stepsConfig.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round(getProgressValue())}% Complete
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={getProgressValue()} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: '#e0e0e0',
              }}
            />
          </Box>
        )}

        {/* Stepper for Desktop */}
        {!isMobile && !isOnResultsStep && (
          <Stepper activeStep={state.currentStep} alternativeLabel sx={{ mb: 4 }}>
            {stepsConfig.map((step, index) => (
              <Step key={step.id} completed={isStepCompleted(index)}>
                <StepLabel
                  StepIconProps={{
                    style: { 
                      color: isStepCompleted(index) ? '#4caf50' : 
                             index === state.currentStep ? '#2196f3' : '#ccc',
                      fontSize: '1.5rem'
                    }
                  }}
                >
                  <Typography variant="caption" display="block">
                    {step.label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        )}

        {/* Main Content */}
        <Paper elevation={3} sx={{ overflow: 'hidden' }}>
          {/* Current Step Content */}
          {currentStep && (
            <Box sx={{ p: { xs: 2, md: 4 } }}>
              <CalculatorStepContent
                stepConfig={currentStep}
                score={state.scores[currentStep.veinType]}
                currentImage={state.images[currentStep.veinType]}
                aiStatus={state.aiAnalysis[currentStep.veinType]?.status || 'idle'}
                aiResult={state.aiAnalysis[currentStep.veinType]?.result || null}
                aiError={state.aiAnalysis[currentStep.veinType]?.error || null}
                onScoreChange={updateScore}
                onImageUpload={uploadImage}
                onImageAnalyze={analyzeImage}
                onImageClear={clearImage}
                isMobile={isMobile}
              />
            </Box>
          )}

          {/* Results Display */}
          {isOnResultsStep && (
            <Box sx={{ p: { xs: 2, md: 4 } }}>
              <ScoreDisplay 
                totalScore={totalScore}
                scores={state.scores}
              />
            </Box>
          )}

          {/* Navigation */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              p: { xs: 2, md: 3 },
              borderTop: '1px solid',
              borderColor: 'divider',
              backgroundColor: '#f5f5f5'
            }}
          >
            <Button
              disabled={state.currentStep === 0 && !isOnResultsStep}
              onClick={handleBack}
              startIcon={<NavigateBefore />}
              variant="outlined"
              size="large"
            >
              {isOnResultsStep ? 'Back to Calculator' : 'Back'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              {!isOnResultsStep && !canProceed && (
                <Typography variant="caption" color="text.secondary">
                  Complete this step to continue
                </Typography>
              )}
            </Box>

            <Button
              onClick={handleNextStep}
              disabled={!isOnResultsStep && !canProceed}
              endIcon={isOnResultsStep ? <Refresh /> : <NavigateNext />}
              variant="contained"
              size="large"
              color={isOnResultsStep ? 'secondary' : 'primary'}
            >
              {isOnResultsStep 
                ? 'Start New Calculation' 
                : state.currentStep === stepsConfig.length - 1 
                  ? 'Calculate Score' 
                  : 'Next Step'
              }
            </Button>
          </Box>
        </Paper>

        {/* Floating Action Button for Mobile */}
        {isMobile && !isOnResultsStep && (
          <Fab
            color="primary"
            sx={{ 
              position: 'fixed', 
              bottom: 16, 
              right: 16,
              display: canProceed ? 'flex' : 'none'
            }}
            onClick={handleNextStep}
          >
            {state.currentStep === stepsConfig.length - 1 ? <Assessment /> : <NavigateNext />}
          </Fab>
        )}

        {/* Educational Note */}
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>For Educational Use:</strong> This calculator is designed for educational and research purposes. 
            All clinical decisions should be made by qualified healthcare professionals using validated methods 
            and appropriate clinical judgment.
          </Typography>
        </Alert>
      </Container>

      {/* Warning Modals */}
      <WarningModal
        open={hipaaModalOpen}
        onClose={handleModalCancel}
        onConfirm={handleHipaaConfirm}
        type="hipaa"
      />
      
      <WarningModal
        open={betaModalOpen}
        onClose={handleModalCancel}
        onConfirm={handleBetaConfirm}
        type="beta"
      />
    </BaseLayout>
  );
};

export default Calculator; 