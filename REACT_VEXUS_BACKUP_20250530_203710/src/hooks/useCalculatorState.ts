import { useReducer, useCallback } from 'react';
import { stepsConfig } from '../config/calculatorConfig';
import { AIService, AIAnalysisResult } from '../services/aiService';

const aiService = new AIService();

export interface CalculatorState {
  currentStep: number;
  scores: Record<string, number | null>;
  images: Record<string, Blob | null>;
  aiAnalysis: Record<string, {
    status: 'idle' | 'processing' | 'success' | 'error';
    result: AIAnalysisResult | null;
    error: string | null;
  }>;
  isSubmittingFeedback: boolean;
  feedbackError: string | null;
}

type CalculatorAction =
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'RESET_CALCULATOR' }
  | { type: 'UPDATE_SCORE'; payload: { veinType: string; score: number } }
  | { type: 'UPLOAD_IMAGE'; payload: { veinType: string; imageFile: Blob } }
  | { type: 'CLEAR_IMAGE'; payload: { veinType: string } }
  | { type: 'ANALYZE_IMAGE_START'; payload: { veinType: string } }
  | { type: 'ANALYZE_IMAGE_SUCCESS'; payload: { veinType: string; result: AIAnalysisResult } }
  | { type: 'ANALYZE_IMAGE_FAILURE'; payload: { veinType: string; error: string } }
  | { type: 'SUBMIT_FEEDBACK_START' }
  | { type: 'SUBMIT_FEEDBACK_SUCCESS' }
  | { type: 'SUBMIT_FEEDBACK_FAILURE'; payload: string };

const initialState: CalculatorState = {
  currentStep: 0,
  scores: stepsConfig.reduce((acc, step) => ({ ...acc, [step.veinType]: null }), {}),
  images: stepsConfig.reduce((acc, step) => ({ ...acc, [step.veinType]: null }), {}),
  aiAnalysis: stepsConfig.reduce((acc, step) => ({ 
    ...acc, 
    [step.veinType]: { status: 'idle', result: null, error: null }
  }), {}),
  isSubmittingFeedback: false,
  feedbackError: null,
};

function calculatorReducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
  switch (action.type) {
    case 'NEXT_STEP':
      // Clear the image for the current step when moving to next step
      const currentStepIndex = state.currentStep;
      const nextStepIndex = Math.min(state.currentStep + 1, stepsConfig.length);
      
      if (currentStepIndex < stepsConfig.length) {
        const currentVeinType = stepsConfig[currentStepIndex].veinType;
        return { 
          ...state, 
          currentStep: nextStepIndex,
          // Clear image for current step when moving to next
          images: { ...state.images, [currentVeinType]: null }
        };
      }
      
      return { ...state, currentStep: nextStepIndex };
    
    case 'PREVIOUS_STEP':
      // Clear the image for the current step when moving to previous step
      const prevCurrentStep = state.currentStep;
      const prevStepIndex = Math.max(state.currentStep - 1, 0);
      
      if (prevCurrentStep < stepsConfig.length) {
        const prevVeinType = stepsConfig[prevCurrentStep].veinType;
        return { 
          ...state, 
          currentStep: prevStepIndex,
          // Clear image for current step when moving to previous
          images: { ...state.images, [prevVeinType]: null }
        };
      }
      
      return { ...state, currentStep: prevStepIndex };
    
    case 'RESET_CALCULATOR':
      return { ...initialState };
    
    case 'UPDATE_SCORE':
      return {
        ...state,
        scores: { ...state.scores, [action.payload.veinType]: action.payload.score },
      };
    
    case 'UPLOAD_IMAGE':
      return {
        ...state,
        images: { ...state.images, [action.payload.veinType]: action.payload.imageFile },
      };
    
    case 'CLEAR_IMAGE':
      return {
        ...state,
        images: { ...state.images, [action.payload.veinType]: null },
        scores: { ...state.scores, [action.payload.veinType]: null },
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
    
    case 'SUBMIT_FEEDBACK_START':
      return { ...state, isSubmittingFeedback: true, feedbackError: null };
    
    case 'SUBMIT_FEEDBACK_SUCCESS':
      return { ...state, isSubmittingFeedback: false };
    
    case 'SUBMIT_FEEDBACK_FAILURE':
      return { ...state, isSubmittingFeedback: false, feedbackError: action.payload };
    
    default:
      return state;
  }
}

export const useCalculatorState = () => {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  const handleNext = useCallback(() => dispatch({ type: 'NEXT_STEP' }), []);
  const handleBack = useCallback(() => dispatch({ type: 'PREVIOUS_STEP' }), []);
  const handleReset = useCallback(() => dispatch({ type: 'RESET_CALCULATOR' }), []);

  const calculateTotalScore = useCallback(() => {
    let total = 0;
    for (const veinType in state.scores) {
      if (state.scores[veinType] !== null) {
        total += state.scores[veinType] as number;
      }
    }
    return total;
  }, [state.scores]);

  const isStepCompleted = useCallback((stepIndex: number) => {
    if (stepIndex >= stepsConfig.length) return true;
    const step = stepsConfig[stepIndex];
    
    // For dropdown steps, check if score is set
    if (step.inputType === 'dropdown') {
      return state.scores[step.veinType] !== null;
    }
    
    // For AI steps, check if either AI analysis was successful OR manual score is set
    return state.aiAnalysis[step.veinType]?.status === 'success' || state.scores[step.veinType] !== null;
  }, [state.scores, state.aiAnalysis]);
  
  const analyzeImage = useCallback(async (veinType: string, imageBlob: Blob) => {
    dispatch({ type: 'ANALYZE_IMAGE_START', payload: { veinType } });
    try {
      const result = await aiService.analyzeVEXUSImage(imageBlob, veinType);
      dispatch({ type: 'ANALYZE_IMAGE_SUCCESS', payload: { veinType, result } });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      dispatch({ type: 'ANALYZE_IMAGE_FAILURE', payload: { veinType, error: errorMessage } });
    }
  }, []);

  const updateScore = useCallback((veinType: string, score: number) => {
    dispatch({ type: 'UPDATE_SCORE', payload: { veinType, score } });
  }, []);

  const uploadImage = useCallback((veinType: string, imageFile: Blob) => {
    dispatch({ type: 'UPLOAD_IMAGE', payload: { veinType, imageFile } });
  }, []);

  const clearImage = useCallback((veinType: string) => {
    dispatch({ type: 'CLEAR_IMAGE', payload: { veinType } });
  }, []);

  return { 
    state, 
    dispatch, 
    calculateTotalScore, 
    handleNext, 
    handleBack, 
    handleReset, 
    isStepCompleted, 
    analyzeImage,
    updateScore,
    uploadImage,
    clearImage
  };
}; 