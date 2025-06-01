import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  LinearProgress,
  Chip
} from '@mui/material';
import { CheckCircle, Cancel, Quiz as QuizIcon } from '@mui/icons-material';

interface QuizQuestion {
  id: string;
  question: string;
  image?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Section {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: 'primary' | 'secondary' | 'success';
  data: any;
}

interface WaveformQuizProps {
  section: Section;
  onClose: () => void;
  onComplete: (results: any) => void;
}

const WaveformQuiz: React.FC<WaveformQuizProps> = ({ section, onClose, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Sample quiz questions - in a real app, these would come from the section data
  const quizQuestions: QuizQuestion[] = [
    {
      id: 'q1',
      question: `What is the normal pattern for ${section.title.toLowerCase()}?`,
      options: [
        'Continuous, non-pulsatile flow',
        'Triphasic pattern with respiratory variation',
        'Pulsatile pattern with flow reversal',
        'Irregular, chaotic pattern'
      ],
      correctAnswer: section.id === 'hepatic-vein' ? 1 : 0,
      explanation: section.id === 'hepatic-vein' 
        ? 'Normal hepatic veins show a triphasic pattern with minimal pulsatility and respiratory variation.'
        : 'Normal venous flow is typically continuous and non-pulsatile.'
    },
    {
      id: 'q2',
      question: `What indicates mild congestion in ${section.title.toLowerCase()}?`,
      options: [
        'Complete flow reversal',
        'Reduced pulsatility or slight flow changes',
        'Normal pattern unchanged',
        'Chaotic irregular flow'
      ],
      correctAnswer: 1,
      explanation: 'Mild congestion typically presents as reduced pulsatility or slight alterations in normal flow patterns.'
    },
    {
      id: 'q3',
      question: `A VEXUS score of 3 in ${section.title.toLowerCase()} indicates:`,
      options: [
        'Normal flow pattern',
        'Mild congestion',
        'Moderate congestion',
        'Severe congestion with flow abnormalities'
      ],
      correctAnswer: 3,
      explanation: 'A VEXUS score of 3 indicates severe congestion with significant flow abnormalities that may include flow reversal.'
    }
  ];

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = parseInt(value);
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quizQuestions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / quizQuestions.length) * 100);
  };

  const handleComplete = () => {
    const score = calculateScore();
    const results = {
      score,
      totalQuestions: quizQuestions.length,
      correctAnswers: selectedAnswers.filter((answer, index) => answer === quizQuestions[index].correctAnswer).length,
      answers: selectedAnswers,
      completedAt: new Date().toISOString()
    };
    onComplete(results);
  };

  const getScoreColor = (score: number): 'success' | 'warning' | 'error' => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  if (showResults) {
    const score = calculateScore();
    return (
      <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <QuizIcon color="primary" />
            Quiz Results - {section.title}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              {score}%
            </Typography>
            <Chip
              label={score >= 80 ? 'Excellent!' : score >= 60 ? 'Good Job!' : 'Keep Learning!'}
              color={getScoreColor(score)}
              size="medium"
              sx={{ mb: 2 }}
            />
            <Typography variant="body1">
              You answered {selectedAnswers.filter((answer, index) => answer === quizQuestions[index].correctAnswer).length} out of {quizQuestions.length} questions correctly.
            </Typography>
          </Box>

          {/* Question Review */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Review Your Answers
            </Typography>
            {quizQuestions.map((question, index) => {
              const isCorrect = selectedAnswers[index] === question.correctAnswer;
              return (
                <Card key={question.id} sx={{ mb: 2, border: '1px solid', borderColor: isCorrect ? 'success.main' : 'error.main' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                      {isCorrect ? (
                        <CheckCircle color="success" />
                      ) : (
                        <Cancel color="error" />
                      )}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          Question {index + 1}: {question.question}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Your answer: {question.options[selectedAnswers[index]] || 'Not answered'}
                        </Typography>
                        {!isCorrect && (
                          <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                            Correct answer: {question.options[question.correctAnswer]}
                          </Typography>
                        )}
                        <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                          {question.explanation}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined">
            Close
          </Button>
          <Button onClick={handleComplete} variant="contained" color="primary">
            Save Results
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  const currentQ = quizQuestions[currentQuestion];

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <span style={{ fontSize: '1.5rem' }}>{section.icon}</span>
          <Typography variant="h6">
            {section.title} Quiz
          </Typography>
        </Box>
        <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 3 }} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Question {currentQuestion + 1} of {quizQuestions.length}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Card elevation={1}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              {currentQ.question}
            </Typography>
            
            {currentQ.image && (
              <Box sx={{ mb: 3, textAlign: 'center' }}>
                <img
                  src={currentQ.image}
                  alt="Quiz question image"
                  style={{ maxWidth: '100%', height: 'auto', maxHeight: 300 }}
                />
              </Box>
            )}

            <RadioGroup
              value={selectedAnswers[currentQuestion]?.toString() || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
            >
              {currentQ.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={index.toString()}
                  control={<Radio />}
                  label={option}
                  sx={{ mb: 1 }}
                />
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button 
          onClick={handlePrevious} 
          disabled={currentQuestion === 0}
          variant="outlined"
        >
          Previous
        </Button>
        <Button 
          onClick={handleNext}
          disabled={selectedAnswers[currentQuestion] === undefined}
          variant="contained"
        >
          {currentQuestion === quizQuestions.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WaveformQuiz; 