import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  Button,
  Link,
  Grid,
  DialogTitle,
  Divider,
} from '@mui/material';
import { Close, ZoomIn, Launch } from '@mui/icons-material';

interface Reference {
  id: string;
  number: number;
  title: string;
  authors: string;
  journal: string;
  url: string;
}

const references: Reference[] = [
  {
    id: 'ref1',
    number: 1,
    title: 'Systemic Venous Congestion Reviewed',
    authors: 'Banjade P, Subedi A, Ghamande S, Surani S, Sharma M',
    journal: 'Cureus. Aug 2023;15(8):e43716',
    url: 'https://doi.org/10.7759/cureus.43716'
  },
  {
    id: 'ref2',
    number: 2,
    title: 'Elevated central venous pressure is associated with increased mortality and acute kidney injury in critically ill patients',
    authors: 'Chen CY, Zhou Y, Wang P, Qi EY, Gu WJ',
    journal: 'Crit Care. Mar 5 2020;24(1):80',
    url: 'https://doi.org/10.1186/s13054-020-2770-5'
  },
  {
    id: 'ref3',
    number: 3,
    title: 'Peripheral Edema, Central Venous Pressure, and Risk of AKI in Critical Illness',
    authors: 'Chen KP, Cavender S, Lee J, et al',
    journal: 'Clin J Am Soc Nephrol. Apr 7 2016;11(4):602-8',
    url: 'https://doi.org/10.2215/CJN.08080715'
  },
  {
    id: 'ref4',
    number: 4,
    title: 'The emerging concept of fluid tolerance: A position paper',
    authors: 'Kattan E, Castro R, Miralles-Aguiar F, Hernandez G, Rola P',
    journal: 'J Crit Care. Oct 2022;71:154070',
    url: 'https://doi.org/10.1016/j.jcrc.2022.154070'
  },
  {
    id: 'ref5',
    number: 5,
    title: 'Fluid Overload and Mortality in Adult Critical Care Patients-A Systematic Review and Meta-Analysis of Observational Studies',
    authors: 'Messmer AS, Zingg C, Muller M, Gerber JL, Schefold JC, Pfortmueller CA',
    journal: 'Crit Care Med. Dec 2020;48(12):1862-1870',
    url: 'https://doi.org/10.1097/CCM.0000000000004617'
  },
  {
    id: 'ref6',
    number: 6,
    title: 'Fluid Volume Overload and Congestion in Heart Failure: Time to Reconsider Pathophysiology and How Volume Is Assessed',
    authors: 'Miller WL',
    journal: 'Circ Heart Fail. Aug 2016;9(8):e002922',
    url: 'https://doi.org/10.1161/CIRCHEARTFAILURE.115.002922'
  },
  {
    id: 'ref7',
    number: 7,
    title: 'Quantifying systemic congestion with Point-Of-Care ultrasound: development of the venous excess ultrasound grading system',
    authors: 'Beaubien-Souligny W, Rola P, Haycock K, et al',
    journal: 'Ultrasound J. Apr 9 2020;12(1):16',
    url: 'https://doi.org/10.1186/s13089-020-00163-w'
  },
  {
    id: 'ref8',
    number: 8,
    title: 'Prospective Evaluation of Venous Excess Ultrasound (VEXUS) for Estimation of Venous Congestion',
    authors: 'Longino A, Martin K, Leyba K, et al',
    journal: 'Chest. Oct 7 2023',
    url: 'https://doi.org/10.1016/j.chest.2023.09.029'
  },
  {
    id: 'ref9',
    number: 9,
    title: 'Combination of Inferior Vena Cava Diameter, Hepatic Venous Flow, and Portal Vein Pulsatility Index: Venous Excess Ultrasound Score (VEXUS Score) in Predicting Acute Kidney Injury in Patients with Cardiorenal Syndrome',
    authors: 'Bhardwaj V, Vikneswaran G, Rola P, et al',
    journal: 'Indian J Crit Care Med. Sep 2020;24(9):783-789',
    url: 'https://doi.org/10.5005/jp-journals-10071-23570'
  },
  {
    id: 'ref10',
    number: 10,
    title: 'Assessment of venous congestion with venous excess ultrasound score in the prognosis of acute heart failure in the emergency department: a prospective study',
    authors: 'Landi I, Guerritore L, Iannaccone A, Ricotti A, Rola P, Garrone M',
    journal: 'Eur Heart J Open. Sep 2024;4(5):oeae050',
    url: 'https://doi.org/10.1093/ehjopen/oeae050'
  }
];

const gradingData = [
  { grade: 0, ivc: '≤ 2 cm', hepatic: 'Normal S > D', portal: 'Normal Phasic', intrarenal: 'Continuous' },
  { grade: 1, ivc: '2–2.5 cm', hepatic: 'Slight Reduction in S', portal: 'Mild Pulsatility', intrarenal: 'Slight Interruption' },
  { grade: 2, ivc: '>= 2.5 cm', hepatic: 'S < D / Reversal', portal: 'Marked Pulsatility', intrarenal: 'Intermittent or Biphasic' },
  { grade: 3, ivc: '>= 2.5 cm + Minimal Collapse', hepatic: 'Severe Abnormal Flow', portal: 'To-and-Fro or Reversal', intrarenal: 'Reversal' }
];

const CitationLink: React.FC<{ refNumber: number }> = ({ refNumber }) => (
  <Box
    component="sup"
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      ml: 0.5,
      mr: 0.25,
      minWidth: 20,
      height: 20,
      borderRadius: '50%',
      backgroundColor: '#9e9e9e', // Light grey circle
      color: 'white', // White number
      fontSize: '0.75em',
      fontWeight: 'bold',
      textDecoration: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: '#757575', // Darker grey on hover
        transform: 'scale(1.1)'
      }
    }}
    onClick={() => {
      const element = document.getElementById(`ref${refNumber}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }}
  >
    {refNumber}
  </Box>
);

// Enhanced Image Information Table Component
const ImageInfoTable: React.FC<{ 
  title: string; 
  imageSrc: string; 
  data: Array<{ label: string; value: string; description?: string }>;
  onImageClick: (src: string) => void;
}> = ({ title, imageSrc, data, onImageClick }) => (
  <Box sx={{ mb: 4 }}>
    <Typography 
      variant="h4" 
      gutterBottom 
      sx={{ 
        fontFamily: 'Europa, sans-serif', 
        color: '#424242', 
        mb: 3,
        fontSize: '1.8rem',
        fontWeight: 'bold'
      }}
    >
      {title}
    </Typography>
    
    {/* Stack vertically: Image first, then table */}
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Image Section - Larger */}
      <Box sx={{ textAlign: 'center' }}>
        <Card 
          sx={{ 
            cursor: 'pointer', 
            transition: 'all 0.3s ease',
            border: '1px solid #e0e0e0',
            position: 'relative',
            display: 'inline-block',
            maxWidth: '100%',
            '&:hover': { 
              transform: 'scale(1.02)',
              boxShadow: 4
            } 
          }} 
          onClick={() => onImageClick(imageSrc)}
        >
          <Box 
            component="img" 
            src={imageSrc} 
            alt={title} 
            sx={{ 
              width: '100%', 
              maxWidth: 800,
              height: 'auto',
              display: 'block'
            }} 
          />
          <IconButton 
            sx={{ 
              position: 'absolute', 
              top: 8, 
              right: 8, 
              bgcolor: 'rgba(255,255,255,0.8)',
              color: '#616161',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)'
              }
            }}
          >
            <ZoomIn />
          </IconButton>
        </Card>
      </Box>
      
      {/* Information Table Section - Full width */}
      <Box>
        <TableContainer component={Paper} elevation={2} sx={{ border: '1px solid #e0e0e0' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#ffffff' }}>
                <TableCell sx={{ 
                  color: '#424242', 
                  fontWeight: 'bold',
                  fontFamily: 'Europa, sans-serif',
                  width: '25%'
                }}>
                  Parameter
                </TableCell>
                <TableCell sx={{ 
                  color: '#424242', 
                  fontWeight: 'bold',
                  fontFamily: 'Europa, sans-serif'
                }}>
                  Description
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index} sx={{ '&:nth-of-type(odd)': { bgcolor: '#ffffff' } }}>
                  <TableCell sx={{ 
                    fontFamily: 'Europa, sans-serif', 
                    color: '#424242',
                    fontWeight: 'medium'
                  }}>
                    {row.label}
                  </TableCell>
                  <TableCell sx={{ 
                    fontFamily: 'Europa, sans-serif', 
                    color: '#424242'
                  }}>
                    <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 0.5 }}>
                      {row.value}
                    </Typography>
                    {row.description && (
                      <Typography variant="caption" color="text.secondary">
                        {row.description}
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  </Box>
);

// Acquisition content data for lightbox with images and gifs
const acquisitionContent: Record<string, { title: string; content: JSX.Element; images: string[] }> = {
  ivc: {
    title: "IVC Assessment Technique",
    images: [
      '/images/acquisition/ivc-assessment.png',
      '/images/acquisition/ivc-ruq-view.png'
    ],
    content: (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Images Section - Stacked vertically */}
        <Box sx={{ backgroundColor: '#ffffff', p: 2, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
            IVC Assessment Images
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <img 
              src="/images/acquisition/ivc-assessment.png" 
              alt="IVC Assessment" 
              style={{ width: '100%', maxWidth: '800px', height: 'auto', borderRadius: '8px', alignSelf: 'center' }}
            />
            <img 
              src="/images/acquisition/ivc-ruq-view.png" 
              alt="IVC RUQ View" 
              style={{ width: '100%', maxWidth: '800px', height: 'auto', borderRadius: '8px', alignSelf: 'center' }}
            />
          </Box>
        </Box>
        
        {/* Text content */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
            Probe Position:
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontFamily: 'Europa, sans-serif', color: '#616161' }}>
            Place probe in subxiphoid or subcostal position to obtain a longitudinal view of the IVC.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
            Key Structures:
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <List dense sx={{ bgcolor: '#ffffff', borderRadius: 2, p: 2, border: '1px solid #e0e0e0', maxWidth: 600 }}>
              {["Inferior Vena Cava (IVC)", "Right atrial junction", "Hepatic vein confluence", "Liver"].map((item, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`• ${item}`} sx={{ '& .MuiListItemText-primary': { fontFamily: 'Europa, sans-serif', color: '#616161', textAlign: 'center' } }} />
                </ListItem>
              ))}
            </List>
          </Box>
          
          <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
            Key Points:
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <List dense sx={{ bgcolor: '#ffffff', borderRadius: 2, p: 2, border: '1px solid #e0e0e0', maxWidth: 600 }}>
              {[
                "Place patient in supine position",
                "Use a low frequency (curvilinear) probe", 
                "Measure IVC diameter 2-3 cm from right atrial junction",
                "Assess for inspiratory collapse (if applicable)",
                "Record maximum diameter for VEXUS classification"
              ].map((item, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`• ${item}`} sx={{ '& .MuiListItemText-primary': { fontFamily: 'Europa, sans-serif', color: '#616161', textAlign: 'center' } }} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Box>
    )
  },
  hepatic: {
    title: "Hepatic Vein Assessment Technique",
    images: [
      '/images/acquisition/hepatic-long-axis.png',
      '/images/acquisition/hepatic-short-axis.png',
      '/images/acquisition/hepatic-subxiphoid.png',
      '/images/acquisition/gifs/hepatic-long-axis.gif'
    ],
    content: (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Images Section - Stacked vertically */}
        <Box sx={{ backgroundColor: '#ffffff', p: 2, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
            Hepatic Vein Images & Animations
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <img 
              src="/images/acquisition/hepatic-long-axis.png" 
              alt="Hepatic Long Axis" 
              style={{ width: '100%', maxWidth: '800px', height: 'auto', borderRadius: '8px', alignSelf: 'center' }}
            />
            <img 
              src="/images/acquisition/hepatic-short-axis.png" 
              alt="Hepatic Short Axis" 
              style={{ width: '100%', maxWidth: '800px', height: 'auto', borderRadius: '8px', alignSelf: 'center' }}
            />
            <img 
              src="/images/acquisition/gifs/hepatic-long-axis.gif" 
              alt="Hepatic Animation" 
              style={{ width: '100%', maxWidth: '800px', height: 'auto', borderRadius: '8px', alignSelf: 'center' }}
            />
          </Box>
        </Box>
        
        {/* Text content */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
            Probe Position:
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontFamily: 'Europa, sans-serif', color: '#616161' }}>
            Place the probe in the right intercostal space, angled towards the right shoulder.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
            Key Structures:
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <List dense sx={{ bgcolor: '#ffffff', borderRadius: 2, p: 2, border: '1px solid #e0e0e0', maxWidth: 600 }}>
              {["Hepatic vein", "IVC junction", "Liver parenchyma"].map((item, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`• ${item}`} sx={{ '& .MuiListItemText-primary': { fontFamily: 'Europa, sans-serif', color: '#616161', textAlign: 'center' } }} />
                </ListItem>
              ))}
            </List>
          </Box>
          
          <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
            Doppler Waveforms:
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <List dense sx={{ bgcolor: '#ffffff', borderRadius: 2, p: 2, border: '1px solid #e0e0e0', maxWidth: 600 }}>
              {[
                "Triphasic: Normal venous return",
                "Biphasic: Mild congestion",
                "Monophasic: Severe congestion"
              ].map((item, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`• ${item}`} sx={{ '& .MuiListItemText-primary': { fontFamily: 'Europa, sans-serif', color: '#616161', textAlign: 'center' } }} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Box>
    )
  },
  portal: {
    title: "Portal Vein Assessment Technique",
    images: [
      '/images/acquisition/portal-long-axis.png',
      '/images/acquisition/portal-short-axis.png',
      '/images/acquisition/portal-subxiphoid.png',
      '/images/acquisition/gifs/portal-long-axis.gif',
      '/images/acquisition/gifs/portal-subxiphoid.gif'
    ],
    content: (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Images Section - Stacked vertically */}
        <Box sx={{ backgroundColor: '#ffffff', p: 2, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
            Portal Vein Images & Animations
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <img 
              src="/images/acquisition/portal-long-axis.png" 
              alt="Portal Long Axis" 
              style={{ width: '100%', maxWidth: '800px', height: 'auto', borderRadius: '8px', alignSelf: 'center' }}
            />
            <img 
              src="/images/acquisition/portal-short-axis.png" 
              alt="Portal Short Axis" 
              style={{ width: '100%', maxWidth: '800px', height: 'auto', borderRadius: '8px', alignSelf: 'center' }}
            />
            <img 
              src="/images/acquisition/gifs/portal-long-axis.gif" 
              alt="Portal Animation" 
              style={{ width: '100%', maxWidth: '800px', height: 'auto', borderRadius: '8px', alignSelf: 'center' }}
            />
          </Box>
        </Box>
        
        {/* Text content */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
            Probe Position:
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontFamily: 'Europa, sans-serif', color: '#616161' }}>
            Place probe in the right intercostal space, angled slightly cephalad.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
            Key Structures:
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <List dense sx={{ bgcolor: '#ffffff', borderRadius: 2, p: 2, border: '1px solid #e0e0e0', maxWidth: 600 }}>
              {["Portal vein main trunk", "Hepatic artery", "Liver parenchyma"].map((item, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`• ${item}`} sx={{ '& .MuiListItemText-primary': { fontFamily: 'Europa, sans-serif', color: '#616161', textAlign: 'center' } }} />
                </ListItem>
              ))}
            </List>
          </Box>
          
          <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
            Doppler Waveforms:
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <List dense sx={{ bgcolor: '#ffffff', borderRadius: 2, p: 2, border: '1px solid #e0e0e0', maxWidth: 600 }}>
              {[
                "Normal: Continuous flow with minimal pulsatility",
                "Pulsatile: Mild congestion",
                "Highly pulsatile: Severe congestion"
              ].map((item, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`• ${item}`} sx={{ '& .MuiListItemText-primary': { fontFamily: 'Europa, sans-serif', color: '#616161', textAlign: 'center' } }} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Box>
    )
  },
  renal: {
    title: "Renal Vein Assessment Technique",
    images: [
      '/images/acquisition/renal-long-axis.png',
      '/images/acquisition/renal-short-axis.png',
      '/images/acquisition/renal-long-still.png',
      '/images/acquisition/gifs/renal-short-axis.gif'
    ],
    content: (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Images Section - Stacked vertically */}
        <Box sx={{ backgroundColor: '#ffffff', p: 2, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
            Renal Vein Images & Animations
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <img 
              src="/images/acquisition/renal-long-axis.png" 
              alt="Renal Long Axis" 
              style={{ width: '100%', maxWidth: '800px', height: 'auto', borderRadius: '8px', alignSelf: 'center' }}
            />
            <img 
              src="/images/acquisition/renal-short-axis.png" 
              alt="Renal Short Axis" 
              style={{ width: '100%', maxWidth: '800px', height: 'auto', borderRadius: '8px', alignSelf: 'center' }}
            />
            <img 
              src="/images/acquisition/gifs/renal-short-axis.gif" 
              alt="Renal Animation" 
              style={{ width: '100%', maxWidth: '800px', height: 'auto', borderRadius: '8px', alignSelf: 'center' }}
            />
          </Box>
        </Box>
        
        {/* Text content */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
            Probe Position:
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontFamily: 'Europa, sans-serif', color: '#616161' }}>
            Position the probe in the right flank, posterior to the mid-axillary line.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
            Key Structures:
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <List dense sx={{ bgcolor: '#ffffff', borderRadius: 2, p: 2, border: '1px solid #e0e0e0', maxWidth: 600 }}>
              {["Renal vein", "IVC junction", "Kidney", "Right renal artery"].map((item, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`• ${item}`} sx={{ '& .MuiListItemText-primary': { fontFamily: 'Europa, sans-serif', color: '#616161', textAlign: 'center' } }} />
                </ListItem>
              ))}
            </List>
          </Box>
          
          <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
            Doppler Waveforms:
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <List dense sx={{ bgcolor: '#ffffff', borderRadius: 2, p: 2, border: '1px solid #e0e0e0', maxWidth: 600 }}>
              {[
                "Continuous: Normal venous return",
                "Pulsatile: Mild congestion", 
                "Discontinuous/phasic reversal: Severe congestion"
              ].map((item, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`• ${item}`} sx={{ '& .MuiListItemText-primary': { fontFamily: 'Europa, sans-serif', color: '#616161', textAlign: 'center' } }} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Box>
    )
  }
};

const VeinButton: React.FC<{ children: React.ReactNode; veinType: string; onOpenAcquisition: (veinType: string) => void }> = ({ children, veinType, onOpenAcquisition }) => (
  <Button
    variant="contained"
    sx={{
      fontFamily: 'Europa, sans-serif',
      fontWeight: 'bold',
      textTransform: 'none',
      fontSize: '1rem',
      py: 2,
      px: 3,
      borderRadius: 2,
      backgroundColor: '#757575',
      color: 'white',
      border: '1px solid #e0e0e0',
      '&:hover': {
        backgroundColor: '#616161',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      },
      transition: 'all 0.3s ease'
    }}
    onClick={() => onOpenAcquisition(veinType)}
  >
    {children}
  </Button>
);

const EducationPageContent: React.FC = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [acquisitionOpen, setAcquisitionOpen] = useState(false);
  const [selectedAcquisition, setSelectedAcquisition] = useState<string | null>(null);

  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    setLightboxOpen(true);
  };

  const handleOpenAcquisition = (veinType: string) => {
    setSelectedAcquisition(veinType);
    setAcquisitionOpen(true);
  };

  const EducationSection: React.FC<{ children: React.ReactNode; id?: string }> = ({ children, id }) => (
    <Card 
      id={id}
      sx={{
        mb: 4, 
        p: 2,
        borderRadius: 2,
        bgcolor: '#ffffff',
        border: '1px solid #e0e0e0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );

  // Enhanced numbered list component
  const NumberedListItem: React.FC<{ number: number; children: React.ReactNode }> = ({ number, children }) => (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'flex-start', 
      gap: 2, 
      mb: 2,
      justifyContent: 'center',
      textAlign: 'left',
      maxWidth: 800,
      mx: 'auto'
    }}>
      <Chip 
        label={number} 
        sx={{ 
          bgcolor: '#757575',
          color: 'white', 
          fontWeight: 'bold',
          fontFamily: 'Europa, sans-serif',
          minWidth: 32,
          height: 32,
          fontSize: '0.875rem',
          flexShrink: 0,
          mt: 0.5
        }} 
      />
      <Typography sx={{ 
        fontFamily: 'Europa, sans-serif', 
        color: '#424242',
        flex: 1,
        pt: 0.5
      }}>
        {children}
      </Typography>
    </Box>
  );

  // Enhanced list component with centering
  const CenteredList: React.FC<{ children: React.ReactNode; maxWidth?: number }> = ({ children, maxWidth = 800 }) => (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center',
      width: '100%'
    }}>
      <List sx={{ 
        bgcolor: '#ffffff', 
        borderRadius: 2, 
        p: 2, 
        border: '1px solid #e0e0e0',
        maxWidth,
        width: '100%'
      }}>
        {children}
      </List>
    </Box>
  );

  return (
    <Box sx={{ py: 4 }}>
      {/* Header */}
      <Typography 
        variant="h1" 
        component="h1" 
        align="center"
        gutterBottom
        sx={{ 
          fontFamily: 'Europa, sans-serif',
          color: '#212121',
          mb: 6,
          fontWeight: 'bold',
          fontSize: '3rem'
        }}
      >
        Your Practical Guide to Understanding VEXUS
      </Typography>

      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Introduction Section */}
        <EducationSection id="introduction">
          <Typography 
            variant="h2" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontFamily: 'Europa, sans-serif',
              color: '#424242', 
              borderBottom: '2px solid #9e9e9e', 
              pb: 1,
              fontSize: '2.5rem',
              fontWeight: 'bold'
            }}
          >
              Introduction
            </Typography>
          <Typography variant="body1" paragraph sx={{ fontFamily: 'Europa, sans-serif', lineHeight: 1.7, color: '#424242' }}>
            Call it what you want—"Fluid Overload", "Venous Hypertension", "Fluid Up", "Venous Congestion" - they all mean the same thing: the venous circulation is too full, and it's causing problems.<CitationLink refNumber={1} /> For a long time, the medical field has focused on arterial hypotension as the main cause of tissue hypoperfusion- and that's understandable! Sepsis, hypovolemia, and hemorrhage are all serious problems. However, we are increasingly realizing that the other side of the vasculature, venous return, can be equally important to our patients with cardiac or renal failure or the critically ill.<CitationLink refNumber={2} /><CitationLink refNumber={3} /><CitationLink refNumber={4} /> Venous congestion leads to cardiorenal acute kidney injury (AKI), pulmonary edema, worsening cardiac function, poor wound healing, and a host of other conditions.<CitationLink refNumber={5} /><CitationLink refNumber={6} /> The problem is that finding venous pressures is much harder than finding arterial pressures! You can't just use a cuff. That's why we spend hours poking at legs, squinting at necks, and generally shrugging our shoulders. When we really want to know, we often perform a right heart catheterization, putting a pressure transducer into the heart itself. But that's expensive, time-consuming, and above all, risky to the patient! So wouldn't it be great if we had a cheap, noninvasive, low-risk alternative, that could tell us what we need to know without getting all up in the patient's pulmonary arteries?
            </Typography>
          <Typography variant="body1" paragraph sx={{ fontFamily: 'Europa, sans-serif', lineHeight: 1.7, fontWeight: 'medium', color: '#424242' }}>
              That's where Venous Excess Ultrasound (VEXUS) comes in.
            </Typography>
        </EducationSection>

        {/* What is VEXUS Section */}
        <EducationSection id="what-is-vexus">
          <Typography 
            variant="h2" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontFamily: 'Europa, sans-serif',
              color: '#424242', 
              borderBottom: '2px solid #9e9e9e', 
              pb: 1,
              fontSize: '2.5rem',
              fontWeight: 'bold'
            }}
          >
              What Is VEXUS?
            </Typography>
          <Typography variant="body1" paragraph sx={{ fontFamily: 'Europa, sans-serif', lineHeight: 1.7, color: '#424242' }}>
            VEXUS is a 4-point Doppler ultrasound protocol that measures the direction and speed of venous blood flow, data that can be used to assess venous pressure. It was developed by a group of physicians based in Toronto, Canada, who showed that their VEXUS technique could predict when cardiac surgery patients would develop acute kidney injury (AKI).<CitationLink refNumber={7} /> Since that time VEXUS has been shown to correlate strongly with right heart catheterization values,<CitationLink refNumber={8} /> cardiorenal AKI,<CitationLink refNumber={9} /> and mortality in patients with heart failure.<CitationLink refNumber={10} />
            </Typography>
          <Typography variant="body1" paragraph sx={{ fontFamily: 'Europa, sans-serif', lineHeight: 1.7, color: '#424242' }}>
              The VEXUS components are:
            </Typography>
          <CenteredList>
              {['Inferior Vena Cava (IVC) Diameter', 'Hepatic Vein Doppler', 'Portal Vein Doppler', 'Renal Vein Doppler'].map((item, index) => (
                <ListItem key={index} sx={{ py: 1 }}>
                <ListItemText 
                  primary={
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontFamily: 'Europa, sans-serif',
                        fontWeight: 'medium',
                        color: '#424242',
                        textAlign: 'center'
                      }}
                    >
                      <strong>{item}</strong>
                    </Typography>
                  } 
                />
                </ListItem>
              ))}
            </CenteredList>
        </EducationSection>

        {/* Why Use VEXUS Section */}
        <EducationSection id="why-use-vexus">
          <Typography 
            variant="h2" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontFamily: 'Europa, sans-serif',
              color: '#424242', 
              borderBottom: '2px solid #9e9e9e', 
              pb: 1,
              fontSize: '2.5rem',
              fontWeight: 'bold'
            }}
          >
            Why Use VEXUS?
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontFamily: 'Europa, sans-serif', lineHeight: 1.7, color: '#424242' }}>
            VEXUS can help you understand your patient's level of venous congestion and their organ perfusion pressure, which can inform decisions about whether to give fluids, administer diuretic medications, transfuse blood products, or start vasopressor medications. The technique is noninvasive, easily repeatable, and does not require advanced ultrasound or echocardiography techniques.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontFamily: 'Europa, sans-serif', lineHeight: 1.7, color: '#424242' }}>
            <strong>Important Note:</strong> VEXUS is a tool to enhance clinical judgment, not replace it. Always integrate your findings with the patient's history, physical exam, and other investigations.
          </Typography>
        </EducationSection>

        {/* Step-by-Step Guide Section */}
        <EducationSection id="vexus-step-by-step">
          <Typography 
            variant="h2" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontFamily: 'Europa, sans-serif',
              color: '#424242', 
              borderBottom: '2px solid #9e9e9e', 
              pb: 2,
              mb: 4,
              fontSize: '2.5rem',
              fontWeight: 'bold'
            }}
          >
            VEXUS Step-by-Step Guide
          </Typography>
          
          {/* Step 1: Equipment and Preparation */}
          <Card 
            elevation={3} 
            sx={{ 
              mb: 4, 
              border: '1px solid #e0e0e0',
              borderRadius: 3,
              overflow: 'hidden'
            }}
          >
            <Box sx={{ 
              bgcolor: '#f5f5f5', 
              p: 3, 
              borderBottom: '1px solid #e0e0e0',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <Box sx={{ 
                width: 50, 
                height: 50, 
                borderRadius: '50%', 
                backgroundColor: '#757575', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center'
              }}>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', fontFamily: 'Europa, sans-serif' }}>
                  1
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ 
                fontFamily: 'Europa, sans-serif', 
                color: '#424242', 
                fontWeight: 'bold',
                fontSize: '1.8rem'
              }}>
                Equipment and Preparation
              </Typography>
            </Box>
            
            <Box sx={{ p: 3 }}>
              <TableContainer sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#fafafa' }}>
                      <TableCell 
                        sx={{ 
                          color: '#424242', 
                          fontWeight: 'bold',
                          fontFamily: 'Europa, sans-serif',
                          borderBottom: '2px solid #e0e0e0',
                          width: '25%'
                        }}
                      >
                        Item
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          color: '#424242', 
                          fontWeight: 'bold',
                          fontFamily: 'Europa, sans-serif',
                          borderBottom: '2px solid #e0e0e0'
                        }}
                      >
                        Description
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ fontFamily: 'Europa, sans-serif', color: '#424242', fontWeight: 'bold' }}>
                        Ultrasound Machine
                      </TableCell>
                      <TableCell sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                        Must have 2D imaging, color Doppler, and pulsed-wave Doppler capabilities. Electrocardiogram gating adds to the interpretability of the exam, but is not essential.
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ bgcolor: '#fafafa' }}>
                      <TableCell sx={{ fontFamily: 'Europa, sans-serif', color: '#424242', fontWeight: 'bold' }}>
                        Supplies
                      </TableCell>
                      <TableCell sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                        Ultrasound gel, gloves.
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontFamily: 'Europa, sans-serif', color: '#424242', fontWeight: 'bold' }}>
                        Patient Positioning
                      </TableCell>
                      <TableCell sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                        Supine or slightly recumbent, table adjusted to the operator's waist level.
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ bgcolor: '#fafafa' }}>
                      <TableCell sx={{ fontFamily: 'Europa, sans-serif', color: '#424242', fontWeight: 'bold' }}>
                        Important Note
                      </TableCell>
                      <TableCell sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                        Attempt to capture waveforms during end-expiration.
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Card>

          <Divider sx={{ my: 4, borderColor: '#e0e0e0' }} />

          {/* Step 2: IVC Assessment */}
          <Card 
            elevation={3} 
            sx={{ 
              mb: 4, 
              border: '1px solid #e0e0e0',
              borderRadius: 3,
              overflow: 'hidden'
            }}
          >
            <Box sx={{ 
              bgcolor: '#f5f5f5', 
              p: 3, 
              borderBottom: '1px solid #e0e0e0',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <Box sx={{ 
                width: 50, 
                height: 50, 
                borderRadius: '50%', 
                backgroundColor: '#757575', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center'
              }}>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', fontFamily: 'Europa, sans-serif' }}>
                  2
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ 
                fontFamily: 'Europa, sans-serif', 
                color: '#424242', 
                fontWeight: 'bold',
                fontSize: '1.8rem'
              }}>
                Inferior Vena Cava (IVC) Assessment
              </Typography>
            </Box>
            
            <Box sx={{ p: 3 }}>
              <Typography variant="body1" sx={{ 
                fontFamily: 'Europa, sans-serif', 
                lineHeight: 1.7, 
                color: '#424242',
                mb: 3,
                fontSize: '1.1rem'
              }}>
                Measure the IVC using the curvilinear or phased-array probe in the subxiphoid view. Measure the diameter of the IVC just distal to the insertion of the hepatic vein into the IVC.
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <VeinButton veinType="ivc" onOpenAcquisition={handleOpenAcquisition}>
                  IVC Image Acquisition
                </VeinButton>
              </Box>
            </Box>
          </Card>

          <Divider sx={{ my: 4, borderColor: '#e0e0e0' }} />

          {/* Step 3: Hepatic Vein */}
          <Card 
            elevation={3} 
            sx={{ 
              mb: 4, 
              border: '1px solid #e0e0e0',
              borderRadius: 3,
              overflow: 'hidden'
            }}
          >
            <Box sx={{ 
              bgcolor: '#f5f5f5', 
              p: 3, 
              borderBottom: '1px solid #e0e0e0',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <Box sx={{ 
                width: 50, 
                height: 50, 
                borderRadius: '50%', 
                backgroundColor: '#757575', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center'
              }}>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', fontFamily: 'Europa, sans-serif' }}>
                  3
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ 
                fontFamily: 'Europa, sans-serif', 
                color: '#424242', 
                fontWeight: 'bold',
                fontSize: '1.8rem'
              }}>
                Hepatic Vein Assessment
              </Typography>
            </Box>
            
            <Box sx={{ p: 3 }}>
              <Typography variant="body1" sx={{ 
                fontFamily: 'Europa, sans-serif', 
                lineHeight: 1.7, 
                color: '#424242',
                mb: 3,
                fontSize: '1.1rem'
              }}>
                Align the Doppler gate with the main hepatic vein as it enters the IVC, ensuring the angle of insonation is less than 60 degrees.
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <VeinButton veinType="hepatic" onOpenAcquisition={handleOpenAcquisition}>
                  Hepatic Vein Image Acquisition
                </VeinButton>
              </Box>
            </Box>
          </Card>

          <Divider sx={{ my: 4, borderColor: '#e0e0e0' }} />

          {/* Step 4: Portal Vein */}
          <Card 
            elevation={3} 
            sx={{ 
              mb: 4, 
              border: '1px solid #e0e0e0',
              borderRadius: 3,
              overflow: 'hidden'
            }}
          >
            <Box sx={{ 
              bgcolor: '#f5f5f5', 
              p: 3, 
              borderBottom: '1px solid #e0e0e0',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <Box sx={{ 
                width: 50, 
                height: 50, 
                borderRadius: '50%', 
                backgroundColor: '#757575', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center'
              }}>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', fontFamily: 'Europa, sans-serif' }}>
                  4
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ 
                fontFamily: 'Europa, sans-serif', 
                color: '#424242', 
                fontWeight: 'bold',
                fontSize: '1.8rem'
              }}>
                Portal Vein Assessment
              </Typography>
            </Box>
            
            <Box sx={{ p: 3 }}>
              <Typography variant="body1" sx={{ 
                fontFamily: 'Europa, sans-serif', 
                lineHeight: 1.7, 
                color: '#424242',
                mb: 3,
                fontSize: '1.1rem'
              }}>
                Use Doppler to assess flow direction in the portal vein, ideally in the mid-to-distal portion. Aim for an angle less than 60 degrees.
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <VeinButton veinType="portal" onOpenAcquisition={handleOpenAcquisition}>
                  Portal Vein Image Acquisition
                </VeinButton>
              </Box>
            </Box>
          </Card>

          <Divider sx={{ my: 4, borderColor: '#e0e0e0' }} />

          {/* Step 5: Renal Vein */}
          <Card 
            elevation={3} 
            sx={{ 
              mb: 4, 
              border: '1px solid #e0e0e0',
              borderRadius: 3,
              overflow: 'hidden'
            }}
          >
            <Box sx={{ 
              bgcolor: '#f5f5f5', 
              p: 3, 
              borderBottom: '1px solid #e0e0e0',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <Box sx={{ 
                width: 50, 
                height: 50, 
                borderRadius: '50%', 
                backgroundColor: '#757575', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center'
              }}>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', fontFamily: 'Europa, sans-serif' }}>
                  5
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ 
                fontFamily: 'Europa, sans-serif', 
                color: '#424242', 
                fontWeight: 'bold',
                fontSize: '1.8rem'
              }}>
                Renal Vein Assessment
              </Typography>
            </Box>
            
            <Box sx={{ p: 3 }}>
              <Typography variant="body1" sx={{ 
                fontFamily: 'Europa, sans-serif', 
                lineHeight: 1.7, 
                color: '#424242',
                mb: 3,
                fontSize: '1.1rem'
              }}>
                Place the doppler gate over distal portion of the renal interlobar vessels
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <VeinButton veinType="renal" onOpenAcquisition={handleOpenAcquisition}>
                  Renal Vein Image Acquisition
                </VeinButton>
              </Box>
            </Box>
          </Card>
        </EducationSection>

        {/* VEXUS Grading System */}
        <EducationSection id="vexus-grading-system">
          <Typography 
            variant="h2" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontFamily: 'Europa, sans-serif',
              color: '#424242', 
              borderBottom: '2px solid #9e9e9e', 
              pb: 1,
              fontSize: '2.5rem',
              fontWeight: 'bold'
            }}
          >
              VEXUS Grading System
            </Typography>
          <TableContainer component={Paper} elevation={2} sx={{ mt: 2, border: '1px solid #e0e0e0' }}>
              <Table>
                <TableHead>
                <TableRow sx={{ bgcolor: '#ffffff' }}>
                    {['Grade', 'IVC Diameter', 'Hepatic Vein Flow', 'Portal Vein Flow', 'Intrarenal Vein Flow'].map((header) => (
                    <TableCell 
                      key={header} 
                      sx={{ 
                        color: '#424242', 
                        fontWeight: 'bold',
                        fontFamily: 'Europa, sans-serif',
                        borderBottom: '2px solid #e0e0e0'
                      }}
                    >
                      {header}
                    </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {gradingData.map((row) => (
                  <TableRow key={row.grade} sx={{ '&:nth-of-type(odd)': { bgcolor: '#ffffff' } }}>
                      <TableCell>
                      <Chip 
                        label={row.grade} 
                        sx={{ 
                          bgcolor: '#757575',
                          color: 'white', 
                          fontWeight: 'bold', 
                          minWidth: 40,
                          fontFamily: 'Europa, sans-serif'
                        }} 
                      />
                      </TableCell>
                    <TableCell sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>{row.ivc}</TableCell>
                    <TableCell sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>{row.hepatic}</TableCell>
                    <TableCell sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>{row.portal}</TableCell>
                    <TableCell sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>{row.intrarenal}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
        </EducationSection>

        {/* Organ Perfusion Pressure Section */}
        <EducationSection id="organ-perfusion-pressure">
          <ImageInfoTable 
            title="Understanding Organ Perfusion Pressure"
            imageSrc="/images/education/organ-perfusion-diagram.png"
            onImageClick={handleImageClick}
            data={[
              {
                label: "Perfusion Formula",
                value: "Perfusion Pressure = Arterial Pressure - Venous Pressure",
                description: "The fundamental equation for tissue perfusion"
              },
              {
                label: "Arterial Component",
                value: "Mean Arterial Pressure (MAP)",
                description: "Driving pressure for organ blood flow"
              },
              {
                label: "Venous Component", 
                value: "Central Venous Pressure (CVP)",
                description: "Back-pressure opposing organ perfusion"
              },
              {
                label: "Clinical Impact",
                value: "Elevated CVP ↓ Perfusion",
                description: "Venous congestion reduces organ function"
              },
              {
                label: "VEXUS Role",
                value: "Non-invasive CVP assessment",
                description: "Doppler ultrasound estimates venous pressure"
              },
              {
                label: "Sensitive Organs",
                value: "Kidneys, Liver, Intestines, Brain",
                description: "Organs particularly affected by venous congestion"
              }
            ]}
          />
          
          <Typography variant="body1" paragraph sx={{ fontFamily: 'Europa, sans-serif', lineHeight: 1.7, color: '#424242', mt: 3 }}>
            Organ perfusion pressure is a critical concept in understanding venous congestion and its impact on tissue health. 
            While we often focus on arterial pressure as the main determinant of organ perfusion, increased venous pressure 
            can have equally detrimental effects on tissue perfusion.
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ fontFamily: 'Europa, sans-serif', lineHeight: 1.7, color: '#424242' }}>
            When venous pressure rises (venous congestion), it reduces the pressure gradient across the organ, resulting in 
            decreased blood flow despite normal arterial pressure. This mechanism explains why venous congestion can lead to 
            organ dysfunction even with normal arterial pressure and cardiac output.
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ fontFamily: 'Europa, sans-serif', lineHeight: 1.7, color: '#424242' }}>
            Organs particularly sensitive to venous congestion include:
          </Typography>
          
          <CenteredList maxWidth={900}>
            <ListItem sx={{ py: 1 }}>
              <ListItemText 
                primary={
                  <Typography sx={{ fontFamily: 'Europa, sans-serif', color: '#424242', textAlign: 'center' }}>
                    <strong>Kidneys:</strong> Venous congestion increases renal vein pressure, decreases glomerular filtration gradient, and can lead to acute kidney injury.
                  </Typography>
                } 
              />
            </ListItem>
            <ListItem sx={{ py: 1 }}>
              <ListItemText 
                primary={
                  <Typography sx={{ fontFamily: 'Europa, sans-serif', color: '#424242', textAlign: 'center' }}>
                    <strong>Liver:</strong> Elevated hepatic venous pressure increases portal pressure and can impair hepatic function.
                  </Typography>
                } 
              />
            </ListItem>
            <ListItem sx={{ py: 1 }}>
              <ListItemText 
                primary={
                  <Typography sx={{ fontFamily: 'Europa, sans-serif', color: '#424242', textAlign: 'center' }}>
                    <strong>Intestines:</strong> Venous congestion can lead to intestinal edema, malabsorption, and bacterial translocation.
                  </Typography>
                } 
              />
            </ListItem>
            <ListItem sx={{ py: 1 }}>
              <ListItemText 
                primary={
                  <Typography sx={{ fontFamily: 'Europa, sans-serif', color: '#424242', textAlign: 'center' }}>
                    <strong>Brain:</strong> Increased venous pressure can elevate intracranial pressure and impair cerebral perfusion.
                  </Typography>
                } 
              />
            </ListItem>
          </CenteredList>
          
          <Typography variant="body1" paragraph sx={{ fontFamily: 'Europa, sans-serif', lineHeight: 1.7, color: '#424242' }}>
            VEXUS assessment helps identify and quantify venous congestion, allowing clinicians to intervene before significant organ dysfunction occurs.
          </Typography>
        </EducationSection>
        
        {/* Venous Congestion POCUS Section */}
        <EducationSection id="venous-congestion-flow-patterns">
          <ImageInfoTable 
            title="Venous Congestion on POCUS: Flow Patterns"
            imageSrc="/images/education/venous-congestion-patterns.png"
            onImageClick={handleImageClick}
            data={[
              {
                label: "Normal Flow",
                value: "Continuous, minimal phasic",
                description: "Subtle respiratory variation, stable flow"
              },
              {
                label: "Mild Congestion",
                value: "Increased pulsatility",
                description: "Partial flow reversal during cardiac cycles"
              },
              {
                label: "Moderate Congestion",
                value: "Marked pulsatility",
                description: "Periods of flow cessation"
              },
              {
                label: "Severe Congestion",
                value: "To-and-fro flow",
                description: "Frank flow reversal, critical congestion"
              },
              {
                label: "Clinical Impact",
                value: "Compromised venous drainage",
                description: "Increased capillary pressure, tissue edema"
              },
              {
                label: "Assessment Value",
                value: "CVP estimation",
                description: "Non-invasive venous pressure monitoring"
              }
            ]}
          />
          
          <Typography variant="body1" paragraph sx={{ fontFamily: 'Europa, sans-serif', lineHeight: 1.7, color: '#424242', mt: 3 }}>
            Venous Doppler waveforms provide valuable information about central venous pressure and venous congestion. As venous congestion worsens, characteristic changes in flow patterns become evident on Doppler ultrasound.
          </Typography>
          
          <Typography variant="h3" gutterBottom sx={{ fontFamily: 'Europa, sans-serif', mt: 3, color: '#424242', fontSize: '2rem' }}>
            Flow Pattern Progression in Venous Congestion:
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <NumberedListItem number={1}>
              <strong>Normal Flow:</strong> Continuous, minimally phasic flow with subtle respiratory variation.
            </NumberedListItem>
            <NumberedListItem number={2}>
              <strong>Mild Congestion:</strong> Increased pulsatility with partial flow reversal during cardiac cycles.
            </NumberedListItem>
            <NumberedListItem number={3}>
              <strong>Moderate Congestion:</strong> Marked pulsatility with periods of flow cessation.
            </NumberedListItem>
            <NumberedListItem number={4}>
              <strong>Severe Congestion:</strong> To-and-fro flow or frank flow reversal, indicating critical venous congestion.
            </NumberedListItem>
          </Box>
          
          <Typography variant="body1" paragraph sx={{ fontFamily: 'Europa, sans-serif', lineHeight: 1.7, color: '#424242' }}>
            The progression of pulsatility in veins that normally show continuous flow (such as portal and intrarenal veins) is particularly significant. Pulsatility develops when pressure waves from the right atrium are transmitted through the venous system due to increased central venous pressure and reduced venous compliance.
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ fontFamily: 'Europa, sans-serif', lineHeight: 1.7, color: '#424242' }}>
            Flow reversal represents the most severe manifestation, indicating that pressure waves are strong enough to overcome forward flow, resulting in retrograde movement of blood. This has significant implications for organ function, as it compromises venous drainage and increases capillary pressure, leading to tissue edema and dysfunction.
          </Typography>
        </EducationSection>
        
        {/* VEXUS Overview Section */}
        <EducationSection id="vexus-complete-picture">
          <ImageInfoTable 
            title="VEXUS: The Complete Picture"
            imageSrc="/images/education/vexus-overview-diagram.png"
            onImageClick={handleImageClick}
            data={[
              {
                label: "Right Atrial Pressure",
                value: "Central measurement",
                description: "Elevated RAP transmitted through venous system"
              },
              {
                label: "Cardiac Output",
                value: "Heart pumping function",
                description: "Venous congestion impairs ventricular filling"
              },
              {
                label: "Left Atrial Pressure",
                value: "Pulmonary congestion",
                description: "B-lines on lung ultrasound, distinct from systemic"
              },
              {
                label: "IVC Assessment",
                value: "Central venous pressure",
                description: "Diameter and collapsibility evaluation"
              },
              {
                label: "Hepatic Vein Doppler",
                value: "Right atrial pressure info",
                description: "Waveform changes reflect heart function"
              },
              {
                label: "Portal & Renal Veins",
                value: "Organ-specific impact",
                description: "Shows congestion effects on specific organs"
              }
            ]}
          />
          
          <Typography variant="body1" paragraph sx={{ fontFamily: 'Europa, sans-serif', lineHeight: 1.7, color: '#424242', mt: 3 }}>
            The VEXUS protocol provides a comprehensive assessment of the cardiopulmonary-renal axis by examining how right atrial pressure and venous congestion affect multiple organ systems. This overview illustrates the interrelated nature of the hemodynamic parameters examined in VEXUS.
          </Typography>
          
          <Typography variant="h3" gutterBottom sx={{ fontFamily: 'Europa, sans-serif', mt: 3, color: '#424242', fontSize: '2rem', textAlign: 'center' }}>
            Key Components and Relationships
          </Typography>
          
          {/* Core Hemodynamic Parameters */}
          <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Europa, sans-serif', mt: 4, mb: 3, color: '#424242', fontSize: '1.5rem', textAlign: 'center' }}>
            Core Hemodynamic Parameters
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                height: '100%', 
                p: 3, 
                textAlign: 'center',
                border: '2px solid #e0e0e0',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  borderColor: '#757575'
                }
              }}>
                <Box sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%', 
                  backgroundColor: '#757575', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  mx: 'auto', 
                  mb: 2 
                }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', fontFamily: 'Europa, sans-serif' }}>
                    RAP
                  </Typography>
                </Box>
                <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 'bold', color: '#424242' }}>
                  Right Atrial Pressure
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'Europa, sans-serif', color: '#616161', lineHeight: 1.6 }}>
                  The central measurement in venous congestion. Elevated RAP is transmitted backward through the venous system, affecting IVC, hepatic, portal, and renal veins.
                </Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                height: '100%', 
                p: 3, 
                textAlign: 'center',
                border: '2px solid #e0e0e0',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  borderColor: '#757575'
                }
              }}>
                <Box sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%', 
                  backgroundColor: '#757575', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  mx: 'auto', 
                  mb: 2 
                }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', fontFamily: 'Europa, sans-serif' }}>
                    CO
                  </Typography>
                </Box>
                <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 'bold', color: '#424242' }}>
                  Cardiac Output
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'Europa, sans-serif', color: '#616161', lineHeight: 1.6 }}>
                  Represents the heart's pumping function. Venous congestion can reduce CO by impairing ventricular filling and function.
                </Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                height: '100%', 
                p: 3, 
                textAlign: 'center',
                border: '2px solid #e0e0e0',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  borderColor: '#757575'
                }
              }}>
                <Box sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%', 
                  backgroundColor: '#757575', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  mx: 'auto', 
                  mb: 2 
                }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', fontFamily: 'Europa, sans-serif' }}>
                    LAP
                  </Typography>
                </Box>
                <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 'bold', color: '#424242' }}>
                  Left Atrial Pressure
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'Europa, sans-serif', color: '#616161', lineHeight: 1.6 }}>
                  Elevated LAP leads to pulmonary congestion, manifesting as B-lines on lung ultrasound. This is often associated with, but distinct from, systemic venous congestion.
                </Typography>
              </Card>
            </Grid>
          </Grid>
          
          {/* VEXUS Assessment Components */}
          <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Europa, sans-serif', mt: 4, mb: 3, color: '#424242', fontSize: '1.5rem', textAlign: 'center' }}>
            VEXUS Assessment Components
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ fontFamily: 'Europa, sans-serif', lineHeight: 1.7, color: '#424242', textAlign: 'center', mb: 4 }}>
            The VEXUS protocol integrates multiple ultrasound findings to create a comprehensive picture of a patient's congestion status:
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ 
                height: '100%', 
                p: 3, 
                textAlign: 'center',
                border: '2px solid #e0e0e0',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  borderColor: '#757575'
                }
              }}>
                <Box sx={{ 
                  width: 35, 
                  height: 35, 
                  borderRadius: 2, 
                  backgroundColor: '#757575', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  mx: 'auto', 
                  mb: 2 
                }}>
                  <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold', fontFamily: 'Europa, sans-serif' }}>
                    1
                  </Typography>
                </Box>
                <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 'bold', color: '#424242' }}>
                  IVC Assessment
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'Europa, sans-serif', color: '#616161', lineHeight: 1.6 }}>
                  Evaluates central venous pressure with diameter.
                </Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ 
                height: '100%', 
                p: 3, 
                textAlign: 'center',
                border: '2px solid #e0e0e0',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  borderColor: '#757575'
                }
              }}>
                <Box sx={{ 
                  width: 35, 
                  height: 35, 
                  borderRadius: 2, 
                  backgroundColor: '#757575', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  mx: 'auto', 
                  mb: 2 
                }}>
                  <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold', fontFamily: 'Europa, sans-serif' }}>
                    2
                  </Typography>
                </Box>
                <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 'bold', color: '#424242' }}>
                  Hepatic Vein Doppler
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'Europa, sans-serif', color: '#616161', lineHeight: 1.6 }}>
                  Provides information about right atrial pressure and cardiac function through waveform analysis.
                </Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ 
                height: '100%', 
                p: 3, 
                textAlign: 'center',
                border: '2px solid #e0e0e0',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  borderColor: '#757575'
                }
              }}>
                <Box sx={{ 
                  width: 35, 
                  height: 35, 
                  borderRadius: 2, 
                  backgroundColor: '#757575', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  mx: 'auto', 
                  mb: 2 
                }}>
                  <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold', fontFamily: 'Europa, sans-serif' }}>
                    3
                  </Typography>
                </Box>
                <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 'bold', color: '#424242' }}>
                  Portal Vein Doppler
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'Europa, sans-serif', color: '#616161', lineHeight: 1.6 }}>
                  Reflects venous congestion's impact on splanchnic circulation and portal flow patterns.
                </Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ 
                height: '100%', 
                p: 3, 
                textAlign: 'center',
                border: '2px solid #e0e0e0',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  borderColor: '#757575'
                }
              }}>
                <Box sx={{ 
                  width: 35, 
                  height: 35, 
                  borderRadius: 2, 
                  backgroundColor: '#757575', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  mx: 'auto', 
                  mb: 2 
                }}>
                  <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold', fontFamily: 'Europa, sans-serif' }}>
                    4
                  </Typography>
                </Box>
                <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 'bold', color: '#424242' }}>
                  Renal Vein Doppler
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'Europa, sans-serif', color: '#616161', lineHeight: 1.6 }}>
                  Shows how venous congestion affects kidney perfusion and renal venous drainage.
                </Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ 
                height: '100%', 
                p: 3, 
                textAlign: 'center',
                border: '2px solid #e0e0e0',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  borderColor: '#757575'
                }
              }}>
                <Box sx={{ 
                  width: 35, 
                  height: 35, 
                  borderRadius: 2, 
                  backgroundColor: '#757575', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  mx: 'auto', 
                  mb: 2 
                }}>
                  <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold', fontFamily: 'Europa, sans-serif' }}>
                    +
                  </Typography>
                </Box>
                <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 'bold', color: '#424242' }}>
                  Lung Ultrasound
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'Europa, sans-serif', color: '#616161', lineHeight: 1.6 }}>
                  B-lines indicate pulmonary congestion from elevated left heart pressures - complementary to VEXUS.
                </Typography>
              </Card>
            </Grid>
          </Grid>
          
          <Typography variant="body1" paragraph sx={{ fontFamily: 'Europa, sans-serif', lineHeight: 1.7, color: '#424242' }}>
            By examining this interconnected system, VEXUS allows clinicians to differentiate between right-sided (systemic venous) congestion, left-sided (pulmonary) congestion, or both, leading to more targeted therapeutic interventions.
          </Typography>
        </EducationSection>

        {/* Conclusion Section */}
        <EducationSection id="conclusion">
          <Typography 
            variant="h2" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontFamily: 'Europa, sans-serif',
              color: '#424242', 
              borderBottom: '2px solid #9e9e9e', 
              pb: 1,
              fontSize: '2.5rem',
              fontWeight: 'bold'
            }}
          >
            Conclusion
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontFamily: 'Europa, sans-serif', lineHeight: 1.7 }}>
            VEXUS is a powerful POCUS technique for assessing venous congestion. By mastering the steps outlined above and understanding the potential pitfalls, you can incorporate VEXUS into your own practice.
          </Typography>
        </EducationSection>

        {/* References Section */}
        <EducationSection id="references">
          <Typography 
            variant="h2" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontFamily: 'Europa, sans-serif',
              color: '#424242', 
              borderBottom: '2px solid #9e9e9e', 
              pb: 1,
              fontSize: '2.5rem',
              fontWeight: 'bold'
            }}
          >
              References
            </Typography>
            <Grid container spacing={2}>
              {references.map((ref) => (
                <Grid item xs={12} md={6} key={ref.id}>
                <Card sx={{ p: 2, height: '100%', bgcolor: '#ffffff', border: '1px solid #e0e0e0' }} id={ref.id}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Chip 
                      label={ref.number} 
                      sx={{ 
                        bgcolor: '#757575', 
                        color: 'white', 
                        fontWeight: 'bold',
                        fontFamily: 'Europa, sans-serif'
                      }} 
                    />
                      <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: 'bold', 
                          mb: 1,
                          fontFamily: 'Europa, sans-serif',
                          color: '#424242'
                        }}
                      >
                        {ref.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mb: 1,
                          fontFamily: 'Europa, sans-serif'
                        }}
                      >
                        {ref.authors}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mb: 2,
                          fontFamily: 'Europa, sans-serif'
                        }}
                      >
                        {ref.journal}
                      </Typography>
                      <Link 
                        href={ref.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 0.5,
                          fontFamily: 'Europa, sans-serif',
                          color: '#616161',
                          '&:hover': {
                            color: '#424242'
                          }
                        }}
                      >
                          <Launch fontSize="small" />
                          View Article
                        </Link>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
        </EducationSection>
      </Box>

      {/* Image Lightbox */}
      <Dialog open={lightboxOpen} onClose={() => setLightboxOpen(false)} maxWidth="lg" fullWidth>
        <DialogContent sx={{ p: 0, backgroundColor: 'rgba(0,0,0,0.9)', position: 'relative' }}>
          <IconButton 
            onClick={() => setLightboxOpen(false)} 
            sx={{ 
              position: 'absolute', 
              top: 16, 
              right: 16, 
              color: 'white', 
              zIndex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.7)'
              }
            }}
          >
            <Close />
          </IconButton>
          {selectedImage && (
            <Box 
              component="img" 
              src={selectedImage} 
              alt="Medical Image" 
              sx={{ 
                width: '100%', 
                height: 'auto', 
                display: 'block' 
              }} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Acquisition Lightbox */}
      <Dialog 
        open={acquisitionOpen} 
        onClose={() => setAcquisitionOpen(false)} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: {
            width: '90vw',
            maxWidth: '1200px',
            height: '80vh',
            maxHeight: '800px'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            fontFamily: 'Europa, sans-serif',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#424242',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {selectedAcquisition && acquisitionContent[selectedAcquisition].title}
          <IconButton 
            onClick={() => setAcquisitionOpen(false)}
            sx={{ 
              color: '#616161',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.1)'
              }
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, overflow: 'auto' }}>
          {selectedAcquisition && acquisitionContent[selectedAcquisition].content}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default EducationPageContent; 