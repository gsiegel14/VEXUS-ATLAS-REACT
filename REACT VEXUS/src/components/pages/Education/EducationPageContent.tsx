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
  Grid,
  Button,
  Link,
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
  { grade: 0, hepatic: 'Normal S > D', portal: 'Normal Phasic', intrarenal: 'Continuous' },
  { grade: 1, hepatic: 'Slight Reduction in S', portal: 'Mild Pulsatility', intrarenal: 'Slight Interruption' },
  { grade: 2, hepatic: 'S < D / Reversal', portal: 'Marked Pulsatility', intrarenal: 'Intermittent or Biphasic' },
  { grade: 3, hepatic: 'Severe Abnormal Flow', portal: 'To-and-Fro or Reversal', intrarenal: 'Reversal' }
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
                "Record maximum diameter for VEXUS classification",
                "NOTE: IVC collapsibility is NOT part of VEXUS protocol"
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
            Place the probe in the right 8th-10th intercostal space (typically the 9th), angled towards the right shoulder. Position the Doppler sample volume a few centimeters away from the hepatic vein-IVC junction to avoid turbulent flow artifacts.
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
                        Must have 2D imaging and pulsed-wave Doppler capabilities. Color Doppler and electrocardiogram gating enhance interpretability but are not essential.
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
                mb: 2,
                fontSize: '1.1rem'
              }}>
                Measure the IVC using the curvilinear or phased-array probe in the subxiphoid view. Measure the diameter of the IVC just distal to the insertion of the hepatic vein into the IVC.
              </Typography>
              
              <Box sx={{ 
                p: 2, 
                backgroundColor: '#fff3e0', 
                border: '1px solid #ff9800', 
                borderRadius: 2, 
                mb: 3 
              }}>
                <Typography variant="body2" sx={{ 
                  fontFamily: 'Europa, sans-serif', 
                  fontWeight: 600,
                  color: '#e65100',
                  fontSize: '1rem'
                }}>
                  Important: IVC collapsibility is NOT part of the VEXUS protocol. Only IVC diameter (&lt; 2cm vs &gt; 2cm) is used for VEXUS scoring.
                </Typography>
              </Box>
              
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
                mb: 2,
                fontSize: '1.1rem'
              }}>
                Align the Doppler gate with the main hepatic vein as it enters the IVC, ensuring the angle of insonation is less than 60 degrees.
              </Typography>
              
              <Typography variant="body1" sx={{ 
                fontFamily: 'Europa, sans-serif', 
                lineHeight: 1.7, 
                color: '#424242',
                mb: 3,
                fontSize: '1.1rem',
                fontStyle: 'italic',
                backgroundColor: '#f8f9fa',
                padding: 2,
                borderRadius: 1,
                borderLeft: '4px solid #43c3ac'
              }}>
                <strong>Clinical Tip:</strong> Position the Doppler sample volume a few centimeters away from the hepatic vein-IVC insertion point to avoid turbulent flow artifacts that can interfere with accurate waveform interpretation.
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
                    {['Grade', 'Hepatic Vein Flow', 'Portal Vein Flow', 'Intrarenal Vein Flow'].map((header) => (
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
            Understanding Organ Perfusion Pressure
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <img 
              src="/images/education/organ-perfusion-diagram.png" 
              alt="Organ perfusion pressure diagram showing pMSF, MAP, and OPP relationship" 
              style={{ 
                width: '100%', 
                maxWidth: '600px', 
                height: 'auto', 
                borderRadius: '8px',
                cursor: 'pointer',
                border: '1px solid #e0e0e0'
              }}
              onClick={() => handleImageClick('/images/education/organ-perfusion-diagram.png')}
            />
          </Box>
          
          <Typography variant="body1" paragraph sx={{ fontFamily: 'Europa, sans-serif', lineHeight: 1.7, color: '#424242', mb: 3 }}>
            Organ perfusion pressure represents the net driving force for blood flow through tissues. Understanding this concept is fundamental to appreciating why venous congestion can cause organ dysfunction even when arterial pressures appear normal.
          </Typography>
          
          <Typography variant="h3" gutterBottom sx={{ fontFamily: 'Europa, sans-serif', mt: 3, color: '#424242', fontSize: '2rem' }}>
            The Perfusion Pressure Formula
          </Typography>
          
          <Box sx={{ 
            backgroundColor: '#f8f9fa', 
            padding: 3, 
            borderRadius: 2, 
            border: '1px solid #e0e0e0',
            mb: 3,
            textAlign: 'center'
          }}>
            <Typography variant="h4" sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 'bold', color: '#424242', mb: 2 }}>
              Organ Perfusion Pressure = MAP - CVP
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: 'Europa, sans-serif', color: '#616161' }}>
              Mean Arterial Pressure minus Central Venous Pressure
            </Typography>
          </Box>
          
          <Typography variant="h3" gutterBottom sx={{ fontFamily: 'Europa, sans-serif', mt: 4, color: '#424242', fontSize: '1.8rem' }}>
            Key Components Explained
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                height: '100%', 
                p: 3, 
                border: '2px solid #757575',
                borderRadius: 3,
                backgroundColor: '#fafafa'
              }}>
                <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 'bold', color: '#424242' }}>
                  Mean Arterial Pressure (MAP)
                </Typography>
                <Typography variant="body1" paragraph sx={{ fontFamily: 'Europa, sans-serif', lineHeight: 1.6, color: '#424242' }}>
                  <strong>Definition:</strong> The average arterial pressure during a cardiac cycle, representing the driving force that pushes blood through organs.
                </Typography>
                <Typography variant="body1" paragraph sx={{ fontFamily: 'Europa, sans-serif', lineHeight: 1.6, color: '#424242' }}>
                  <strong>Formula:</strong> DBP + ⅓(SBP - DBP)
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: 'Europa, sans-serif', lineHeight: 1.6, color: '#424242' }}>
                  <strong>Normal Range:</strong> 65-100 mmHg
                </Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                height: '100%', 
                p: 3, 
                border: '2px solid #757575',
                borderRadius: 3,
                backgroundColor: '#f5f5f5'
              }}>
                <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 'bold', color: '#424242' }}>
                  Central Venous Pressure (CVP)
                </Typography>
                <Typography variant="body1" paragraph sx={{ fontFamily: 'Europa, sans-serif', lineHeight: 1.6, color: '#424242' }}>
                  <strong>Definition:</strong> The pressure in the central venous system near the right atrium, representing back-pressure or "venous afterload" that opposes arterial inflow.
                </Typography>
                <Typography variant="body1" paragraph sx={{ fontFamily: 'Europa, sans-serif', lineHeight: 1.6, color: '#424242' }}>
                  <strong>Normal Range:</strong> 2-8 mmHg
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: 'Europa, sans-serif', lineHeight: 1.6, color: '#424242' }}>
                  <strong>Elevated (&gt;10-12 mmHg):</strong> Impairs tissue perfusion
                </Typography>
              </Card>
            </Grid>
          </Grid>
          
          <Typography variant="h3" gutterBottom sx={{ fontFamily: 'Europa, sans-serif', mt: 4, color: '#424242', fontSize: '1.8rem' }}>
            Understanding pMSF (Mean Systemic Filling Pressure)
          </Typography>
          
          <Box sx={{ 
            backgroundColor: '#f5f5f5', 
            padding: 3, 
            borderRadius: 2, 
            border: '1px solid #9e9e9e',
            mb: 3
          }}>
            <Typography variant="body1" paragraph sx={{ fontFamily: 'Europa, sans-serif', lineHeight: 1.7, color: '#424242' }}>
              <strong>pMSF (Mean Systemic Filling Pressure)</strong> represents the upstream pressure driving venous return to the heart. It reflects the effective circulating blood volume and venous tone, serving as an indicator of preload and venous return capacity. Normal pMSF values range from 12-23 mmHg depending on clinical conditions.
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: 'Europa, sans-serif', lineHeight: 1.7, color: '#424242' }}>
              While pMSF is not directly measured by ultrasound, understanding its role helps interpret how changes in systemic filling pressures influence organ-level perfusion patterns visible on VEXUS assessment.
            </Typography>
          </Box>
          
          <Typography variant="h3" gutterBottom sx={{ fontFamily: 'Europa, sans-serif', mt: 4, color: '#424242', fontSize: '1.8rem' }}>
            Clinical Significance
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ fontFamily: 'Europa, sans-serif', lineHeight: 1.7, color: '#424242' }}>
            When venous pressure rises due to congestion, it reduces the pressure gradient across organs, resulting in decreased blood flow despite normal arterial pressure. This mechanism explains why venous congestion can lead to organ dysfunction even with normal arterial pressure and cardiac output.
          </Typography>
          
          <Box sx={{ 
            backgroundColor: '#fafafa', 
            padding: 3, 
            borderRadius: 2, 
            border: '2px solid #757575',
            mb: 3
          }}>
            <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 'bold', color: '#424242' }}>
              Key Clinical Pearl
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: 'Europa, sans-serif', lineHeight: 1.7, color: '#424242' }}>
              Even if MAP is adequate (&gt;65 mmHg), elevated CVP (&gt;10-12 mmHg) can cause organ hypoperfusion by increasing "venous afterload." This uncouples macro-hemodynamics from actual tissue perfusion, highlighting why VEXUS assessment of venous congestion is crucial for comprehensive patient evaluation.
            </Typography>
          </Box>
          
          <Typography variant="h6" gutterBottom sx={{ 
            fontFamily: 'Europa, sans-serif', 
            fontWeight: 'bold', 
            color: '#424242',
            textAlign: 'center',
            mb: 3
          }}>
            Organs Particularly Sensitive to Venous Congestion
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                height: '100%',
                backgroundColor: '#f8f9fa',
                border: '1px solid #dee2e6',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      backgroundColor: '#e9ecef',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2
                    }}>
                      <Typography sx={{ 
                        fontFamily: 'Europa, sans-serif', 
                        fontWeight: 'bold',
                        color: '#424242',
                        fontSize: '1.1rem'
                      }}>
                        K
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ 
                      fontFamily: 'Europa, sans-serif', 
                      fontWeight: 'bold',
                      color: '#424242'
                    }}>
                      Kidneys
                    </Typography>
                  </Box>
                  <Typography sx={{ 
                    fontFamily: 'Europa, sans-serif', 
                    lineHeight: 1.6,
                    color: '#424242'
                  }}>
                    Venous congestion increases renal vein pressure, decreases glomerular filtration gradient, and can lead to acute kidney injury.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                height: '100%',
                backgroundColor: '#f8f9fa',
                border: '1px solid #dee2e6',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      backgroundColor: '#e9ecef',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2
                    }}>
                      <Typography sx={{ 
                        fontFamily: 'Europa, sans-serif', 
                        fontWeight: 'bold',
                        color: '#424242',
                        fontSize: '1.1rem'
                      }}>
                        L
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ 
                      fontFamily: 'Europa, sans-serif', 
                      fontWeight: 'bold',
                      color: '#424242'
                    }}>
                      Liver
                    </Typography>
                  </Box>
                  <Typography sx={{ 
                    fontFamily: 'Europa, sans-serif', 
                    lineHeight: 1.6,
                    color: '#424242'
                  }}>
                    Elevated hepatic venous pressure increases portal pressure and can impair hepatic function.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                height: '100%',
                backgroundColor: '#f8f9fa',
                border: '1px solid #dee2e6',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      backgroundColor: '#e9ecef',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2
                    }}>
                      <Typography sx={{ 
                        fontFamily: 'Europa, sans-serif', 
                        fontWeight: 'bold',
                        color: '#424242',
                        fontSize: '1.1rem'
                      }}>
                        I
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ 
                      fontFamily: 'Europa, sans-serif', 
                      fontWeight: 'bold',
                      color: '#424242'
                    }}>
                      Intestines
                    </Typography>
                  </Box>
                  <Typography sx={{ 
                    fontFamily: 'Europa, sans-serif', 
                    lineHeight: 1.6,
                    color: '#424242'
                  }}>
                    Venous congestion can lead to intestinal edema, malabsorption, and bacterial translocation.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                height: '100%',
                backgroundColor: '#f8f9fa',
                border: '1px solid #dee2e6',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      backgroundColor: '#e9ecef',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2
                    }}>
                      <Typography sx={{ 
                        fontFamily: 'Europa, sans-serif', 
                        fontWeight: 'bold',
                        color: '#424242',
                        fontSize: '1.1rem'
                      }}>
                        B
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ 
                      fontFamily: 'Europa, sans-serif', 
                      fontWeight: 'bold',
                      color: '#424242'
                    }}>
                      Brain
                    </Typography>
                  </Box>
                  <Typography sx={{ 
                    fontFamily: 'Europa, sans-serif', 
                    lineHeight: 1.6,
                    color: '#424242'
                  }}>
                    Increased venous pressure can elevate intracranial pressure and impair cerebral perfusion.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Box sx={{ 
            backgroundColor: '#e8f5e8',
            border: '2px solid #4caf50',
            borderRadius: 2,
            p: 3,
            mt: 3,
            textAlign: 'center'
          }}>
            <Typography variant="h6" gutterBottom sx={{ 
              fontFamily: 'Europa, sans-serif', 
              fontWeight: 'bold',
              color: '#2e7d32'
            }}>
              Clinical Significance
            </Typography>
            <Typography sx={{ 
              fontFamily: 'Europa, sans-serif', 
              lineHeight: 1.7,
              color: '#424242',
              fontSize: '1.1rem'
            }}>
              VEXUS assessment helps identify and quantify venous congestion, allowing clinicians to intervene before significant organ dysfunction occurs.
            </Typography>
          </Box>
          
          {/* Lung Ultrasound - Complementary Assessment */}
          <Box sx={{ 
            mt: 4,
            p: 3,
            backgroundColor: '#fff8e1',
            border: '2px dashed #ff9800',
            borderRadius: 2
          }}>
            <Typography variant="h6" gutterBottom sx={{ 
              fontFamily: 'Europa, sans-serif', 
              fontWeight: 'bold',
              color: '#f57c00',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Box sx={{ 
                width: 32, 
                height: 32, 
                borderRadius: '50%', 
                backgroundColor: '#ffe0b2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Typography sx={{ 
                  fontFamily: 'Europa, sans-serif', 
                  fontWeight: 'bold',
                  color: '#f57c00',
                  fontSize: '0.9rem'
                }}>
                  +
                </Typography>
              </Box>
              Lung Ultrasound: Complementary Assessment
            </Typography>
            
            <Typography variant="body1" sx={{ 
              fontFamily: 'Europa, sans-serif', 
              lineHeight: 1.7,
              color: '#424242',
              mb: 2
            }}>
              <strong>Important Note:</strong> Lung ultrasound is <em>not part of VEXUS</em> but can provide valuable complementary information during assessment.
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: 2,
              backgroundColor: '#ffffff',
              p: 2,
              borderRadius: 1,
              border: '1px solid #ffcc02'
            }}>
              <Box sx={{ 
                width: 40, 
                height: 40, 
                borderRadius: '50%', 
                backgroundColor: '#e1f5fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Typography sx={{ 
                  fontFamily: 'Europa, sans-serif', 
                  fontWeight: 'bold',
                  color: '#0277bd',
                  fontSize: '1.1rem'
                }}>
                  L
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" sx={{ 
                  fontFamily: 'Europa, sans-serif', 
                  fontWeight: 'bold',
                  color: '#0277bd',
                  mb: 1
                }}>
                  Lung B-lines
                </Typography>
                <Typography sx={{ 
                  fontFamily: 'Europa, sans-serif', 
                  lineHeight: 1.6,
                  color: '#424242'
                }}>
                  B-lines indicate pulmonary congestion from elevated left heart pressures - complementary to VEXUS assessment of systemic venous congestion.
                </Typography>
              </Box>
            </Box>
          </Box>
        </EducationSection>
        
        {/* Venous Congestion POCUS Section */}
        <EducationSection id="venous-congestion-flow-patterns">
          <Typography 
            variant="h3" 
            component="h3" 
            gutterBottom 
            sx={{ 
              fontFamily: 'Europa, sans-serif',
              color: '#424242', 
              borderBottom: '2px solid #43c3ac', 
              pb: 1,
              fontSize: '2rem',
              fontWeight: 'bold',
              mb: 3
            }}
          >
            VEXUS Venous Flow Assessment Guide
          </Typography>

          {/* Main Assessment Table */}
          <Card sx={{ mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: 3 }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ 
                background: 'linear-gradient(135deg, #43c3ac 0%, #2c8a7a 100%)', 
                color: 'white', 
                p: 3, 
                textAlign: 'center' 
              }}>
                <Typography variant="h5" sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 'bold', mb: 1 }}>
                  🩸 Venous Congestion Flow Patterns
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'Europa, sans-serif', opacity: 0.9 }}>
                  Progressive stages from normal drainage to critical congestion
                </Typography>
              </Box>

              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                    <TableCell sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 'bold', fontSize: '1rem' }}>
                      Congestion Level
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 'bold', fontSize: '1rem' }}>
                      Ultrasound Appearance
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 'bold', fontSize: '1rem' }}>
                      Pathophysiology
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 'bold', fontSize: '1rem' }}>
                      Clinical Significance
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Normal Flow */}
                  <TableRow sx={{ '&:hover': { backgroundColor: '#f0fdf4' } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          backgroundColor: '#22c55e',
                          boxShadow: '0 0 8px rgba(34, 197, 94, 0.4)'
                        }} />
                        <Typography sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 'bold', color: '#16a34a' }}>
                          Normal Flow
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontFamily: 'Europa, sans-serif', color: '#424242', mb: 0.5 }}>
                        • Smooth, continuous flow
                      </Typography>
                      <Typography sx={{ fontFamily: 'Europa, sans-serif', color: '#424242', mb: 0.5 }}>
                        • Gentle respiratory variations
                      </Typography>
                      <Typography sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                        • No flow interruptions
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                        Blood flows freely back to heart. Normal venous pressure allows efficient drainage.
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label="No Congestion" 
                        size="small" 
                        sx={{ 
                          backgroundColor: '#dcfce7', 
                          color: '#16a34a', 
                          fontFamily: 'Europa, sans-serif',
                          mb: 1
                        }} 
                      />
                      <Typography variant="body2" sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                        Heart pumping effectively, good organ perfusion
                      </Typography>
                    </TableCell>
                  </TableRow>

                  {/* Mild Congestion */}
                  <TableRow sx={{ '&:hover': { backgroundColor: '#fffbeb' } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          backgroundColor: '#eab308',
                          boxShadow: '0 0 8px rgba(234, 179, 8, 0.4)'
                        }} />
                        <Typography sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 'bold', color: '#ca8a04' }}>
                          Mild Congestion
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontFamily: 'Europa, sans-serif', color: '#424242', mb: 0.5 }}>
                        • More pulsing with heartbeat
                      </Typography>
                      <Typography sx={{ fontFamily: 'Europa, sans-serif', color: '#424242', mb: 0.5 }}>
                        • Flow slows but doesn't stop
                      </Typography>
                      <Typography sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                        • Some backward flow during systole
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                        Heart working harder. Venous pressure rising slightly, early congestion signs.
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label="Early Warning" 
                        size="small" 
                        sx={{ 
                          backgroundColor: '#fef3c7', 
                          color: '#ca8a04', 
                          fontFamily: 'Europa, sans-serif',
                          mb: 1
                        }} 
                      />
                      <Typography variant="body2" sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                        Monitor progression, consider fluid management
                      </Typography>
                    </TableCell>
                  </TableRow>

                  {/* Moderate Congestion */}
                  <TableRow sx={{ '&:hover': { backgroundColor: '#fff7ed' } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          backgroundColor: '#f97316',
                          boxShadow: '0 0 8px rgba(249, 115, 22, 0.4)'
                        }} />
                        <Typography sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 'bold', color: '#ea580c' }}>
                          Moderate Congestion
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontFamily: 'Europa, sans-serif', color: '#424242', mb: 0.5 }}>
                        • Strong pulsing pattern
                      </Typography>
                      <Typography sx={{ fontFamily: 'Europa, sans-serif', color: '#424242', mb: 0.5 }}>
                        • Flow stops briefly each heartbeat
                      </Typography>
                      <Typography sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                        • Clear flow interruptions
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                        Venous pressure significantly elevated. Blood struggling to return to heart.
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label="Significant Congestion" 
                        size="small" 
                        sx={{ 
                          backgroundColor: '#fed7aa', 
                          color: '#ea580c', 
                          fontFamily: 'Europa, sans-serif',
                          mb: 1
                        }} 
                      />
                      <Typography variant="body2" sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                        Organ function may be affected, intervention likely needed
                      </Typography>
                    </TableCell>
                  </TableRow>

                  {/* Severe Congestion */}
                  <TableRow sx={{ '&:hover': { backgroundColor: '#fef2f2' } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          backgroundColor: '#ef4444',
                          boxShadow: '0 0 8px rgba(239, 68, 68, 0.4)'
                        }} />
                        <Typography sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 'bold', color: '#dc2626' }}>
                          Severe Congestion
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontFamily: 'Europa, sans-serif', color: '#424242', mb: 0.5 }}>
                        • Flow goes backward and forward
                      </Typography>
                      <Typography sx={{ fontFamily: 'Europa, sans-serif', color: '#424242', mb: 0.5 }}>
                        • Complete flow reversal
                      </Typography>
                      <Typography sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                        • "To-and-fro" pattern
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                        Venous system severely overloaded. Blood cannot drain properly from organs.
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label="Critical Congestion" 
                        size="small" 
                        sx={{ 
                          backgroundColor: '#fecaca', 
                          color: '#dc2626', 
                          fontFamily: 'Europa, sans-serif',
                          mb: 1
                        }} 
                      />
                      <Typography variant="body2" sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                        High risk of organ damage, urgent treatment required
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Teaching Analogy Box */}
          <Card sx={{ mb: 4, backgroundColor: '#f8fafc', border: '2px solid #e2e8f0' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{ 
                  backgroundColor: '#43c3ac', 
                  borderRadius: '50%', 
                  p: 1, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <Typography sx={{ fontSize: '1.5rem' }}>💡</Typography>
                </Box>
                <Typography variant="h6" sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 'bold', color: '#1e293b' }}>
                  Think of it Like a Drain
                </Typography>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#22c55e' }} />
                    <Typography sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 'bold' }}>Normal:</Typography>
                    <Typography sx={{ fontFamily: 'Europa, sans-serif' }}>Water flows down smoothly</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#eab308' }} />
                    <Typography sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 'bold' }}>Mild:</Typography>
                    <Typography sx={{ fontFamily: 'Europa, sans-serif' }}>Drain is slightly slow, some gurgling</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#f97316' }} />
                    <Typography sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 'bold' }}>Moderate:</Typography>
                    <Typography sx={{ fontFamily: 'Europa, sans-serif' }}>Drain backing up, water stops flowing</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ef4444' }} />
                    <Typography sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 'bold' }}>Severe:</Typography>
                    <Typography sx={{ fontFamily: 'Europa, sans-serif' }}>Water flowing backward out of drain</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Clinical Application Table */}
          <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: 3 }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ 
                background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)', 
                color: 'white', 
                p: 3, 
                textAlign: 'center' 
              }}>
                <Typography variant="h6" sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 'bold', mb: 1 }}>
                  🎯 Clinical Assessment Value
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'Europa, sans-serif', opacity: 0.9 }}>
                  Why VEXUS matters in patient care
                </Typography>
              </Box>

              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ borderBottom: 'none', py: 2 }}>
                      <Typography sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 'bold', color: '#424242' }}>
                        📊 CVP Estimation
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottom: 'none', py: 2 }}>
                      <Typography sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                        Non-invasive way to estimate central venous pressure without catheters
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                    <TableCell sx={{ borderBottom: 'none', py: 2 }}>
                      <Typography sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 'bold', color: '#424242' }}>
                        🫀 Organ Assessment
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottom: 'none', py: 2 }}>
                      <Typography sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                        Identifies which organs are affected by poor venous drainage
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ borderBottom: 'none', py: 2 }}>
                      <Typography sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 'bold', color: '#424242' }}>
                        💊 Treatment Guidance
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottom: 'none', py: 2 }}>
                      <Typography sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                        Helps decide if patient needs more fluids or fluid removal (diuretics)
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                    <TableCell sx={{ borderBottom: 'none', py: 2 }}>
                      <Typography sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 'bold', color: '#424242' }}>
                        ⚠️ Risk Stratification
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottom: 'none', py: 2 }}>
                      <Typography sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                        Identifies patients at high risk for acute kidney injury and poor outcomes
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
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
            VEXUS: The Complete Picture
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <img 
              src="/images/education/vexus-overview-diagram.png" 
              alt="VEXUS complete picture diagram showing RAP, LAP, CO, MAP, OPP, pMSF and B-lines" 
              style={{ 
                width: '100%', 
                maxWidth: '700px', 
                height: 'auto', 
                borderRadius: '8px',
                cursor: 'pointer',
                border: '1px solid #e0e0e0'
              }}
              onClick={() => handleImageClick('/images/education/vexus-overview-diagram.png')}
            />
          </Box>
          
          <Typography variant="body1" paragraph sx={{ fontFamily: 'Europa, sans-serif', lineHeight: 1.7, color: '#424242', mb: 4 }}>
            This diagram illustrates the comprehensive hemodynamic assessment that VEXUS provides, showing the relationships between cardiac pressures, organ perfusion, and venous congestion. Understanding each component helps clinicians interpret VEXUS findings in the broader context of cardiovascular physiology.
          </Typography>
          
          <Typography variant="h3" gutterBottom sx={{ fontFamily: 'Europa, sans-serif', mt: 4, color: '#424242', fontSize: '2rem' }}>
            Complete Terminology Reference
          </Typography>
          
          <TableContainer component={Paper} elevation={2} sx={{ border: '1px solid #e0e0e0', mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell sx={{ 
                    color: '#424242', 
                    fontWeight: 'bold',
                    fontFamily: 'Europa, sans-serif',
                    width: '20%'
                  }}>
                    Term
                  </TableCell>
                  <TableCell sx={{ 
                    color: '#424242', 
                    fontWeight: 'bold',
                    fontFamily: 'Europa, sans-serif',
                    width: '30%'
                  }}>
                    Definition
                  </TableCell>
                  <TableCell sx={{ 
                    color: '#424242', 
                    fontWeight: 'bold',
                    fontFamily: 'Europa, sans-serif',
                    width: '25%'
                  }}>
                    Normal Values
                  </TableCell>
                  <TableCell sx={{ 
                    color: '#424242', 
                    fontWeight: 'bold',
                    fontFamily: 'Europa, sans-serif'
                  }}>
                    VEXUS Relationship
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow sx={{ '&:nth-of-type(odd)': { bgcolor: '#fafafa' } }}>
                  <TableCell sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 'bold', color: '#1976d2' }}>
                    RAP
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                    <strong>Right Atrial Pressure</strong> - Pressure in the right atrium reflecting venous return and right heart function
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                    0-5 mmHg
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                    Elevated RAP is transmitted through venous system, causing abnormal VEXUS flow patterns in hepatic, portal, and renal veins
                  </TableCell>
                </TableRow>
                
                <TableRow sx={{ '&:nth-of-type(odd)': { bgcolor: '#fafafa' } }}>
                  <TableCell sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 'bold', color: '#1976d2' }}>
                    LAP
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                    <strong>Left Atrial Pressure</strong> - Pressure in the left atrium reflecting left ventricular filling pressure and volume status
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                    8-15 mmHg
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                    Elevated LAP causes pulmonary congestion (B-lines) but is separate from systemic venous congestion assessed by VEXUS
                  </TableCell>
                </TableRow>
                
                <TableRow sx={{ '&:nth-of-type(odd)': { bgcolor: '#fafafa' } }}>
                  <TableCell sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 'bold', color: '#1976d2' }}>
                    CO
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                    <strong>Cardiac Output</strong> - Volume of blood pumped by the heart per minute
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                    4-8 L/min
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                    Venous congestion (high VEXUS scores) impairs ventricular filling and can reduce cardiac output
                  </TableCell>
                </TableRow>
                
                <TableRow sx={{ '&:nth-of-type(odd)': { bgcolor: '#fafafa' } }}>
                  <TableCell sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 'bold', color: '#1976d2' }}>
                    MAP
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                    <strong>Mean Arterial Pressure</strong> - Average arterial pressure during cardiac cycle; driving force for organ perfusion
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                    65-100 mmHg
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                    Part of organ perfusion pressure calculation (MAP - CVP). Normal MAP with elevated venous pressure still impairs perfusion
                  </TableCell>
                </TableRow>
                
                <TableRow sx={{ '&:nth-of-type(odd)': { bgcolor: '#fafafa' } }}>
                  <TableCell sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 'bold', color: '#1976d2' }}>
                    OPP
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                    <strong>Organ Perfusion Pressure</strong> - Net driving pressure for blood flow through organs (MAP - CVP)
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                    &gt;60 mmHg for adequate perfusion
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                    VEXUS identifies elevated venous pressure (CVP) that reduces OPP despite normal MAP, explaining organ dysfunction
                  </TableCell>
                </TableRow>
                
                <TableRow sx={{ '&:nth-of-type(odd)': { bgcolor: '#fafafa' } }}>
                  <TableCell sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 'bold', color: '#1976d2' }}>
                    pMSF
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                    <strong>Mean Systemic Filling Pressure</strong> - Upstream pressure driving venous return; reflects blood volume and venous tone
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                    12-23 mmHg
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                    Gradient between pMSF and RAP drives venous return. VEXUS patterns help assess this relationship non-invasively
                  </TableCell>
                </TableRow>
                
                <TableRow sx={{ '&:nth-of-type(odd)': { bgcolor: '#fafafa' } }}>
                  <TableCell sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 'bold', color: '#1976d2' }}>
                    B-lines
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                    <strong>Lung Ultrasound B-lines</strong> - Vertical artifacts indicating pulmonary edema from elevated left heart pressures
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                    &lt;3 B-lines per lung zone
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                    Complementary to VEXUS: B-lines show pulmonary congestion while VEXUS shows systemic venous congestion
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          
          <Typography variant="h3" gutterBottom sx={{ fontFamily: 'Europa, sans-serif', mt: 4, color: '#424242', fontSize: '1.8rem' }}>
            Clinical Integration
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ fontFamily: 'Europa, sans-serif', lineHeight: 1.7, color: '#424242' }}>
            This comprehensive assessment allows clinicians to understand the complete hemodynamic picture. VEXUS specifically addresses the often-overlooked venous side of circulation, providing insights into how elevated venous pressures affect organ perfusion even when arterial pressures appear adequate.
          </Typography>
          
          <Box sx={{ 
            backgroundColor: '#e3f2fd', 
            padding: 3, 
            borderRadius: 2, 
            border: '1px solid #2196f3',
            mb: 3
          }}>
            <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 'bold', color: '#1976d2' }}>
              Key Clinical Insight
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: 'Europa, sans-serif', lineHeight: 1.7, color: '#424242' }}>
              The formula <strong>OPP = MAP - pMSF</strong> shown in the diagram emphasizes that organ perfusion depends not just on arterial pressure, but on the pressure gradient across the entire cardiovascular system. VEXUS provides the missing piece by non-invasively assessing the venous component that traditional monitoring often overlooks.
            </Typography>
          </Box>
          
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