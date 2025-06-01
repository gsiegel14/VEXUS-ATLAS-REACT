import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { ExpandMore, Person, Assessment, TrendingUp } from '@mui/icons-material';

interface WaveformCase {
  id: string;
  title: string;
  presentation: string;
  findings: string;
  vexusScore: number;
  outcome: string;
}

interface ClinicalCasesProps {
  cases: WaveformCase[];
}

const ClinicalCases: React.FC<ClinicalCasesProps> = ({ cases }) => {
  const [expandedCase, setExpandedCase] = useState<string | false>(false);

  const handleCaseChange = (caseId: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedCase(isExpanded ? caseId : false);
  };

  const getScoreColor = (score: number): 'success' | 'warning' | 'error' => {
    if (score <= 1) return 'success';
    if (score <= 2) return 'warning';
    return 'error';
  };

  const getScoreDescription = (score: number): string => {
    if (score <= 1) return 'Normal to Mild';
    if (score <= 2) return 'Moderate Congestion';
    return 'Severe Congestion';
  };

  if (!cases || cases.length === 0) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Clinical Cases
        </Typography>
        <Card elevation={1}>
          <CardContent>
            <Typography variant="body1" color="text.secondary">
              Clinical cases will be available soon. Check back for real-world examples 
              of waveform interpretation in various clinical scenarios.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Clinical Cases
      </Typography>

      <Typography variant="body1" paragraph sx={{ lineHeight: 1.6, mb: 3 }}>
        Learn from real clinical scenarios where waveform analysis guided patient management decisions.
      </Typography>

      {cases.map((caseItem) => (
        <Accordion
          key={caseItem.id}
          expanded={expandedCase === caseItem.id}
          onChange={handleCaseChange(caseItem.id)}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
              <Person color="primary" />
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {caseItem.title}
                </Typography>
              </Box>
              <Chip
                label={`VEXUS ${caseItem.vexusScore}`}
                color={getScoreColor(caseItem.vexusScore)}
                size="small"
                sx={{ fontWeight: 'bold' }}
              />
            </Box>
          </AccordionSummary>
          
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Person color="primary" />
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Presentation
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      {caseItem.presentation}
                    </Typography>
                  </CardContent>
                </Card>

                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Assessment color="secondary" />
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Waveform Findings
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      {caseItem.findings}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      VEXUS Assessment
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Chip
                        label={`Score: ${caseItem.vexusScore}`}
                        color={getScoreColor(caseItem.vexusScore)}
                        sx={{ fontWeight: 'bold' }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {getScoreDescription(caseItem.vexusScore)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>

                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <TrendingUp color="success" />
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Clinical Outcome
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      {caseItem.outcome}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Learning Note */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'success.50', borderRadius: 1, border: '1px solid', borderColor: 'success.200' }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
          📋 Case Study Benefits
        </Typography>
        <Typography variant="body2">
          Clinical cases demonstrate the practical application of waveform analysis in real-world scenarios. 
          They illustrate how VEXUS scoring influences clinical decision-making and patient outcomes.
        </Typography>
      </Box>
    </Box>
  );
};

export default ClinicalCases; 