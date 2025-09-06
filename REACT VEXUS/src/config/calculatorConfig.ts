export interface ScoreOption {
  label: string;
  value: string;
  score: number;
}

export interface StepConfig {
  id: string;
  label: string;
  title: string;
  veinType: string;
  inputType: 'dropdown' | 'image_ai' | 'manual_measurement';
  options?: {
    label: string;
    values: ScoreOption[];
  };
  instructions?: string;
}

export const stepsConfig: StepConfig[] = [
  {
    id: 'ivc',
    label: 'IVC Measurement',
    title: 'Step 1: Inferior Vena Cava (IVC)',
    veinType: 'ivc',
    inputType: 'dropdown',
    instructions: 'Select whether IVC is < 2 cm or > 2 cm.',
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
    inputType: 'image_ai',
    instructions: 'Upload your Hepatic Vein ultrasound image. After uploading, you\'ll be able to crop the image to include only the PWD waveform and EKG lead.',
    options: {
      label: 'Hepatic Vein Classification',
      values: [
        { label: 'Hepatic Vein Normal', value: 'HV Normal', score: 0 },
        { label: 'Hepatic Vein Mild', value: 'HV Mild', score: 1 },
        { label: 'Hepatic Vein Severe', value: 'HV Severe', score: 2 },
        { label: 'Confidence of waveform < 50%', value: 'Confidence of waveform < 50%', score: 0 },
      ]
    }
  },
  {
    id: 'portal',
    label: 'Portal Vein',
    title: 'Step 3: Portal Vein Doppler',
    veinType: 'portal',
    inputType: 'image_ai',
    instructions: 'Upload your Portal Vein ultrasound image for AI analysis.',
    options: {
      label: 'Portal Vein Classification',
      values: [
        { label: 'Portal Vein Normal', value: 'PV Normal', score: 0 },
        { label: 'Portal Vein Mild', value: 'PV Mild', score: 1 },
        { label: 'Portal Vein Severe', value: 'PV Severe', score: 2 },
        { label: 'Confidence of waveform < 50%', value: 'Confidence of waveform < 50%', score: 0 },
      ]
    }
  },
  {
    id: 'renal',
    label: 'Renal Vein',
    title: 'Step 4: Intrarenal Vein Doppler',
    veinType: 'renal',
    inputType: 'image_ai',
    instructions: 'Upload your Intrarenal Vein ultrasound image for AI analysis.',
    options: {
      label: 'Renal Vein Classification',
      values: [
        { label: 'Renal Vein Normal', value: 'RV Normal', score: 0 },
        { label: 'Renal Vein Mild', value: 'RV Mild', score: 1 },
        { label: 'Renal Vein Severe', value: 'RV Severe', score: 2 },
        { label: 'Confidence of waveform < 50%', value: 'Confidence of waveform < 50%', score: 0 },
      ]
    }
  }
];

export interface ScoreGrade {
  range: [number, number];
  grade: number;
  description: string;
  color?: string;
}

export const scoreLogic = {
  gradingSystem: [
    { range: [0, 0] as [number, number], grade: 0, description: 'No Venous Congestion', color: '#4caf50' },
    { range: [1, 4] as [number, number], grade: 1, description: 'Mild Venous Congestion', color: '#ff9800' },
    { range: [5, 7] as [number, number], grade: 2, description: 'Moderate Venous Congestion', color: '#f44336' },
    { range: [8, 9] as [number, number], grade: 3, description: 'Severe Venous Congestion', color: '#d32f2f' },
  ],
  maxScore: 9
};

export const getScoreGrade = (totalScore: number): ScoreGrade => {
  for (const grade of scoreLogic.gradingSystem) {
    if (totalScore >= grade.range[0] && totalScore <= grade.range[1]) {
      return grade;
    }
  }
  return scoreLogic.gradingSystem[0]; // Default to no congestion
}; 