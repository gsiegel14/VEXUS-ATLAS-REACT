export interface WaveformImage {
  src: string;
  title: string;
  description: string;
  grade: string;
  features: string[];
  analysis?: string;
  clinicalCorrelation?: string;
  alt: string;
}

export interface WaveformModule {
  title: string;
  description: string;
  keyPoints?: string[];
  images?: WaveformImage[];
  cases?: WaveformCase[];
  criteria?: GradingCriteria[];
}

export interface WaveformCase {
  id: string;
  title: string;
  presentation: string;
  findings: string;
  vexusScore: number;
  outcome: string;
}

export interface GradingCriteria {
  grade: number;
  pattern: string;
  description: string;
}

export interface WaveformSectionData {
  basics: WaveformModule;
  normal: WaveformModule;
  abnormal: WaveformModule;
  grading: WaveformModule;
  cases: WaveformModule;
  keyPoints: string[];
  clinicalTip: string;
}

export const waveformConfig = {
  data: {
    hepatic: {
      basics: {
        title: "Hepatic Vein Anatomy",
        description: "Understanding hepatic venous drainage and normal flow patterns",
        keyPoints: [
          "Three main hepatic veins: right, middle, left",
          "Normal triphasic waveform pattern",
          "Respiratory variation considerations",
          "Optimal imaging windows and techniques"
        ]
      },
      normal: {
        title: "Normal Hepatic Patterns",
        description: "Recognizing healthy hepatic venous flow patterns",
        images: [
          {
            src: "/images/waveforms/hepatic-normal-pattern.png",
            title: "Normal Triphasic Pattern",
            description: "Classic hepatic vein waveform showing three distinct phases",
            grade: "normal",
            features: ["Antegrade flow", "Minimal pulsatility", "Respiratory variation"],
            analysis: "This waveform demonstrates normal hepatic venous flow with characteristic triphasic pattern. Note the smooth, continuous flow with minimal pulsatility and appropriate respiratory variation.",
            clinicalCorrelation: "Normal hepatic venous flow indicates adequate venous drainage and absence of significant congestion.",
            alt: "Normal hepatic vein waveform showing triphasic pattern"
          },
          {
            src: "/images/waveforms/hepatic-normal-asvd.png",
            title: "Normal ASVD Pattern",
            description: "Normal hepatic vein flow with atrial systolic velocity difference pattern",
            grade: "normal",
            features: ["Clear ASVD", "Triphasic pattern", "Normal pulsatility"],
            analysis: "Normal hepatic vein flow showing clear atrial systolic velocity difference (ASVD) pattern with appropriate pulsatility.",
            clinicalCorrelation: "Normal ASVD pattern suggests adequate venous drainage and normal cardiac function.",
            alt: "Normal hepatic vein waveform showing ASVD pattern"
          }
        ]
      },
      abnormal: {
        title: "Abnormal Hepatic Patterns",
        description: "Identifying pathological hepatic venous flow changes",
        images: [
          {
            src: "/images/waveforms/hepatic-mild-congestion.png",
            title: "Mild Congestion Pattern",
            description: "Early signs of venous congestion with reduced pulsatility",
            grade: "mild",
            features: ["Reduced pulsatility", "Blunted waveform", "Maintained flow"],
            analysis: "Waveform shows early signs of congestion with reduced pulsatility compared to normal. Flow remains antegrade but pattern is blunted.",
            clinicalCorrelation: "May indicate early fluid overload or beginning venous congestion.",
            alt: "Hepatic vein waveform showing mild congestion with reduced pulsatility"
          },
          {
            src: "/images/waveforms/hepatic-severe-reversal.png",
            title: "Severe Congestion with Flow Reversal",
            description: "Marked congestion with flow reversal indicating severe venous hypertension",
            grade: "severe",
            features: ["Flow reversal", "Marked pulsatility", "Irregular pattern"],
            analysis: "Severe venous congestion with retrograde flow components and irregular pulsatile pattern indicating significant venous hypertension.",
            clinicalCorrelation: "Indicates severe venous congestion requiring immediate clinical attention and intervention.",
            alt: "Hepatic vein waveform showing severe congestion with flow reversal"
          }
        ]
      },
      grading: {
        title: "VEXUS Grading System",
        description: "How hepatic vein patterns correlate with VEXUS scores",
        criteria: [
          { grade: 0, pattern: "Normal triphasic", description: "Clear three-phase pattern with minimal pulsatility" },
          { grade: 1, pattern: "Mild blunting", description: "Reduced but present pulsatility, maintained antegrade flow" },
          { grade: 2, pattern: "Severe blunting", description: "Markedly reduced pulsatility, monophasic appearance" },
          { grade: 3, pattern: "Reversed flow", description: "Retrograde flow components, irregular pulsatile pattern" }
        ]
      },
      cases: {
        title: "Clinical Cases",
        description: "Real-world examples and case studies",
        cases: [
          {
            id: "case-hv-1",
            title: "ICU Patient with Fluid Overload",
            presentation: "72-year-old patient in ICU with progressive fluid retention after cardiac surgery",
            findings: "Hepatic vein shows severely blunted waveform pattern with minimal pulsatility",
            vexusScore: 2,
            outcome: "Guided diuresis based on VEXUS assessment led to improved venous flow pattern"
          },
          {
            id: "case-hv-2",
            title: "Heart Failure Exacerbation",
            presentation: "65-year-old with CHF presenting with acute decompensation",
            findings: "Hepatic vein demonstrates flow reversal with irregular pulsatile pattern",
            vexusScore: 3,
            outcome: "Aggressive decongestion therapy initiated based on VEXUS findings"
          }
        ]
      },
      keyPoints: [
        "Normal hepatic veins show triphasic flow pattern",
        "Congestion causes progressive blunting of waveform",
        "Severe congestion may show flow reversal",
        "Respiratory variation is important indicator",
        "Pattern correlates with right heart pressures"
      ],
      clinicalTip: "Focus on pattern recognition and correlation with clinical context. Pay attention to respiratory variation and overall flow direction."
    },
    portal: {
      basics: {
        title: "Portal Vein Anatomy",
        description: "Understanding portal venous system and flow characteristics",
        keyPoints: [
          "Hepatopetal (toward liver) flow direction",
          "Continuous, low-velocity flow pattern",
          "Respiratory variation assessment",
          "Optimal Doppler angle and settings"
        ]
      },
      normal: {
        title: "Normal Portal Patterns",
        description: "Recognizing healthy portal venous flow",
        images: [
          {
            src: "/images/waveforms/portal-normal-flow.png",
            title: "Normal Continuous Flow",
            description: "Typical portal vein flow showing continuous hepatopetal direction",
            grade: "normal",
            features: ["Continuous flow", "Hepatopetal direction", "Minimal pulsatility"],
            analysis: "Normal portal vein flow with continuous, low-velocity pattern toward the liver.",
            clinicalCorrelation: "Normal portal flow indicates adequate hepatic perfusion and absence of portal hypertension.",
            alt: "Normal portal vein waveform showing continuous hepatopetal flow"
          }
        ]
      },
      abnormal: {
        title: "Abnormal Portal Patterns",
        description: "Identifying pathological portal flow changes",
        images: [
          {
            src: "/images/waveforms/portal-mild-pulsatile.png",
            title: "Mild Pulsatile Portal Flow",
            description: "Early abnormal pulsatile pattern in portal vein",
            grade: "mild",
            features: ["Mild pulsatility", "Maintained direction", "Flow variation"],
            analysis: "Mild pulsatile portal flow pattern suggesting early transmission of elevated right heart pressures.",
            clinicalCorrelation: "Early sign of venous congestion that may progress if not addressed.",
            alt: "Portal vein waveform showing mild pulsatile pattern"
          },
          {
            src: "/images/waveforms/portal-severe-pulsatile.png",
            title: "Severe Pulsatile Portal Flow",
            description: "Marked abnormal pulsatile pattern indicating significant venous congestion",
            grade: "severe",
            features: ["Severe pulsatility", "Irregular pattern", "Marked flow variation"],
            analysis: "Severe pulsatile portal flow pattern indicating significant transmission of elevated right heart pressures.",
            clinicalCorrelation: "Severe pulsatile portal flow indicates significant venous congestion and elevated central venous pressure.",
            alt: "Portal vein waveform showing severe pulsatile pattern"
          }
        ]
      },
      grading: {
        title: "Portal Flow Assessment",
        description: "Grading portal vein flow abnormalities",
        criteria: [
          { grade: 0, pattern: "Continuous flow", description: "Normal continuous hepatopetal flow" },
          { grade: 1, pattern: "Mild pulsatility", description: "Slight pulsatile component but maintained direction" },
          { grade: 2, pattern: "Moderate pulsatility", description: "Clear pulsatile pattern with flow variation" },
          { grade: 3, pattern: "Severe pulsatility", description: "Marked pulsatility with potential flow reversal" }
        ]
      },
      cases: {
        title: "Portal Vein Cases",
        description: "Clinical examples of portal flow assessment",
        cases: [
          {
            id: "case-pv-1",
            title: "Post-operative Fluid Management",
            presentation: "Post-surgical patient with unclear volume status",
            findings: "Portal vein shows increased pulsatility suggesting fluid overload",
            vexusScore: 2,
            outcome: "Diuretic therapy guided by portal flow normalization"
          }
        ]
      },
      keyPoints: [
        "Normal portal flow is continuous and hepatopetal",
        "Pulsatility indicates venous congestion",
        "Flow direction should always be toward liver",
        "Respiratory variation is usually minimal",
        "Pattern changes correlate with CVP elevation"
      ],
      clinicalTip: "Look for any pulsatile component in portal flow - this is always abnormal and indicates significant venous congestion."
    },
    renal: {
      basics: {
        title: "Renal Vein Anatomy",
        description: "Understanding renal venous drainage and flow patterns",
        keyPoints: [
          "Continuous venous flow toward IVC",
          "Monophasic or slightly phasic pattern",
          "Respiratory variation assessment",
          "Bilateral assessment importance"
        ]
      },
      normal: {
        title: "Normal Renal Patterns",
        description: "Recognizing healthy renal venous flow",
        images: [
          {
            src: "/images/waveforms/renal-normal-continuous.png",
            title: "Normal Continuous Flow",
            description: "Typical renal vein flow showing continuous pattern",
            grade: "normal",
            features: ["Continuous flow", "Minimal pulsatility", "Stable velocity"],
            analysis: "Normal renal vein flow with continuous, stable pattern indicating adequate venous drainage.",
            clinicalCorrelation: "Normal renal venous flow suggests appropriate kidney perfusion and absence of congestion.",
            alt: "Normal renal vein waveform showing continuous flow pattern"
          }
        ]
      },
      abnormal: {
        title: "Abnormal Renal Patterns",
        description: "Identifying pathological renal flow changes",
        images: [
          {
            src: "/images/waveforms/renal-mild-biphasic.png",
            title: "Mild Biphasic Pattern",
            description: "Early abnormal biphasic pattern indicating mild renal congestion",
            grade: "mild",
            features: ["Biphasic pattern", "Mild pulsatility", "Flow variation"],
            analysis: "Mild biphasic renal vein flow suggesting early transmission of elevated venous pressures to renal circulation.",
            clinicalCorrelation: "Early sign of renal congestion that may precede clinical manifestations.",
            alt: "Renal vein waveform showing mild biphasic pattern"
          },
          {
            src: "/images/waveforms/renal-severe-monophasic.png",
            title: "Severe Monophasic Pattern",
            description: "Abnormal monophasic pattern indicating severe renal congestion",
            grade: "severe",
            features: ["Monophasic pattern", "Severe pulsatility", "Irregular flow"],
            analysis: "Severe monophasic renal vein flow indicating significant venous congestion and impaired renal drainage.",
            clinicalCorrelation: "Severe pattern indicates significant renal congestion and may correlate with acute kidney injury.",
            alt: "Renal vein waveform showing severe monophasic pattern"
          }
        ]
      },
      grading: {
        title: "Renal Flow Assessment",
        description: "Grading renal vein flow abnormalities",
        criteria: [
          { grade: 0, pattern: "Continuous flow", description: "Normal continuous venous flow" },
          { grade: 1, pattern: "Mild pulsatility", description: "Slight pulsatile component" },
          { grade: 2, pattern: "Moderate pulsatility", description: "Clear pulsatile pattern" },
          { grade: 3, pattern: "Severe pulsatility", description: "Marked pulsatility with flow reversal" }
        ]
      },
      cases: {
        title: "Renal Congestion Cases",
        description: "Clinical examples of renal flow assessment",
        cases: [
          {
            id: "case-rv-1",
            title: "Acute Kidney Injury in CHF",
            presentation: "Patient with heart failure and rising creatinine",
            findings: "Renal veins show pulsatile flow pattern bilaterally",
            vexusScore: 2,
            outcome: "Decongestion therapy prioritized over diuretic reduction"
          }
        ]
      },
      keyPoints: [
        "Normal renal flow is continuous and non-pulsatile",
        "Pulsatility indicates renal congestion",
        "Bilateral assessment provides better evaluation",
        "Flow patterns correlate with renal function",
        "Important marker for cardio-renal syndrome"
      ],
      clinicalTip: "Renal vein pulsatility is a sensitive marker of renal congestion and may appear before clinical signs of volume overload."
    }
  }
};

export default waveformConfig; 