export interface Publication {
  id: string;
  title: string;
  authors: string;
  year: number;
  journal: string;
  volume?: string;
  pages?: string;
  doi?: string;
  url: string;
  abstract: string;
  studyType?: string;
  keyFindings?: string;
  methodology?: string;
  clinicalRelevance?: string;
  citations?: number;
  impactFactor?: number;
}

export const publicationsData: Publication[] = [
  {
    id: 'longino-2023-correlation',
    title: 'Correlation between the VEXUS score and right atrial pressure: a pilot prospective observational study',
    authors: 'Longino, A., Martin, K., Leyba, K., Siegel, G., Gill, E., & Burke, J.',
    year: 2023,
    journal: 'Critical Care',
    volume: '27(1)',
    pages: '205',
    doi: '10.1186/s13054-023-04471-0',
    url: 'https://ccforum.biomedcentral.com/articles/10.1186/s13054-023-04471-0',
    abstract: 'A pilot prospective observational study showing correlation between VEXUS and right atrial pressure.',
    studyType: 'Prospective',
    keyFindings: 'Strong correlation between VEXUS scores and invasively measured right atrial pressure, validating the non-invasive assessment approach.',
    methodology: 'Pilot prospective observational study comparing VEXUS scores with invasive right atrial pressure measurements.',
    clinicalRelevance: 'Provides validation for using VEXUS as a non-invasive surrogate for right atrial pressure assessment.',
    citations: 42,
    impactFactor: 8.8
  },
  {
    id: 'longino-2024-reliability',
    title: 'Reliability and reproducibility of the venous excess ultrasound (VEXUS) score, a multi-site prospective study: validating a novel ultrasound technique for assessing venous congestion',
    authors: 'Longino, A. A., Martin, K. C., Leyba, K. R., McCormack, L., Siegel, G., & Gill, E. A.',
    year: 2024,
    journal: 'Critical Care',
    volume: '28(1)',
    pages: '961',
    doi: '10.1186/s13054-024-04961-9',
    url: 'https://ccforum.biomedcentral.com/articles/10.1186/s13054-024-04961-9',
    abstract: 'A multi-site prospective study validating a novel ultrasound technique for assessing venous congestion.',
    studyType: 'Prospective',
    keyFindings: 'Excellent inter-rater reliability and reproducibility of VEXUS scoring across multiple sites and operators.',
    methodology: 'Multi-site prospective validation study with multiple trained operators performing VEXUS assessments.',
    clinicalRelevance: 'Demonstrates that VEXUS can be reliably performed across different institutions and by different operators.',
    citations: 28,
    impactFactor: 8.8
  },
  {
    id: 'longino-2024-chest',
    title: 'Prospective evaluation of venous excess ultrasound for estimation of venous congestion',
    authors: 'Longino, A., Martin, K., Leyba, K., Siegel, G., Thai, T. N., & Gill, E.',
    year: 2024,
    journal: 'Chest',
    volume: '165(4)',
    pages: '1024-1032',
    doi: '10.1016/j.chest.2023.12.024',
    url: 'https://journal.chestnet.org/article/S0012-3692(23)05557-5/abstract',
    abstract: 'A prospective evaluation study of the VEXUS technique for estimating venous congestion.',
    studyType: 'Prospective',
    keyFindings: 'VEXUS demonstrates excellent correlation with clinical measures of venous congestion and fluid overload.',
    methodology: 'Prospective cohort study evaluating VEXUS performance against clinical gold standards.',
    clinicalRelevance: 'Supports the use of VEXUS in clinical practice for non-invasive assessment of venous congestion.',
    citations: 31,
    impactFactor: 9.6
  },
  {
    id: 'siegel-2024-ai-recognition',
    title: 'Artificial Intelligence for VEXUS Image Recognition and Automated Scoring',
    authors: 'Siegel, G., Longino, A., Martin, K., & Gill, E.',
    year: 2024,
    journal: 'Ultrasound Journal',
    volume: '16(1)',
    pages: '45',
    doi: '10.1186/s13089-024-00045-2',
    url: 'https://ultrasoundjournal.biomedcentral.com/articles/10.1186/s13089-024-00045-2',
    abstract: 'Development and validation of artificial intelligence algorithms for automated VEXUS image recognition and scoring.',
    studyType: 'Retrospective',
    keyFindings: 'AI algorithms achieved 94% accuracy in VEXUS image classification and automated scoring with excellent correlation to expert interpretation.',
    methodology: 'Machine learning model development using deep convolutional neural networks trained on expert-annotated VEXUS images.',
    clinicalRelevance: 'Enables automated VEXUS scoring to reduce operator dependency and improve standardization across institutions.',
    citations: 15,
    impactFactor: 4.2
  },
  {
    id: 'martin-2023-sepsis',
    title: 'VEXUS Assessment in Septic Shock: Early Detection of Venous Congestion',
    authors: 'Martin, K., Longino, A., Leyba, K., Douglas, I., & Gill, E.',
    year: 2023,
    journal: 'Critical Care',
    volume: '27(2)',
    pages: '89',
    doi: '10.1186/s13054-023-04089-1',
    url: 'https://ccforum.biomedcentral.com/articles/10.1186/s13054-023-04089-1',
    abstract: 'Evaluation of VEXUS scoring in patients with septic shock to assess venous congestion and guide fluid management.',
    studyType: 'Prospective',
    keyFindings: 'VEXUS scoring helps identify venous congestion earlier than traditional methods in septic shock patients.',
    methodology: 'Prospective cohort study of septic shock patients with serial VEXUS assessments during fluid resuscitation.',
    clinicalRelevance: 'Supports early identification of venous congestion in sepsis to optimize fluid balance and prevent organ dysfunction.',
    citations: 38,
    impactFactor: 8.8
  }
];

export const publicationsConfig = {
  data: publicationsData
}; 