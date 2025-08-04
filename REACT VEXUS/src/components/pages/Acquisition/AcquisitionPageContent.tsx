import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogContent,
  IconButton,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Close, ZoomIn, PlayArrow } from '@mui/icons-material';

interface ImageData {
  src: string;
  alt: string;
  caption?: string;
}

interface ViewContent {
  id: string;
  title: string;
  images: ImageData[];
  technique: {
    probePosition: string;
    keyStructures: string[];
    keyPoints?: string[];
    specialNotes?: string[];
    dopplerWaveforms?: string[];
  };
  atlasContent?: {
    src: string;
    alt: string;
    title: string;
  };
}

interface AssessmentData {
  title: string;
  views: ViewContent[];
}

const assessmentData: Record<string, AssessmentData> = {
  ivc: {
    title: "IVC Assessment",
    views: [
      {
        id: "ivc-long-view",
        title: "IVC - Long Axis View (Subcostal)",
        images: [
          { 
            src: "/images/acquisition/ivc-assessment-corrected.png", 
            alt: "IVC Assessment Technique - Subcostal Long Axis View",
            caption: "IVC Assessment Technique - Subcostal Long Axis View"
          }
        ],
        technique: {
          probePosition: "Place probe in subxiphoid or subcostal position to obtain a longitudinal view of the IVC.",
          keyStructures: ["Inferior Vena Cava (IVC)", "Right atrial junction", "Hepatic vein confluence", "Liver"],
          keyPoints: [
            "Place patient in supine position",
            "Use a low frequency (curvilinear) probe",
            "Measure IVC diameter 2-3 cm from right atrial junction",
            "Record maximum diameter for VEXUS classification",
            "NOTE: IVC collapsibility is NOT part of VEXUS protocol"
          ],
          specialNotes: [
            "Ensure measurement is taken during normal respiration",
            "Document both maximum and minimum diameters if significant respiratory variation",
            "Consider patient's volume status and positioning when interpreting measurements"
          ]
        },
        atlasContent: { 
          src: "/images/acquisition/ivc-assessment-corrected.png", 
          alt: "IVC Assessment", 
          title: "IVC" 
        }
      },
      {
        id: "ivc-ruq-view",
        title: "IVC - RUQ Intercostal View",
        images: [
          { 
            src: "/images/acquisition/ivc-measurement-corrected.png", 
            alt: "IVC RUQ Intercostal View", 
            caption: "IVC Assessment Technique - RUQ Intercostal View"
          }
        ],
        technique: {
          probePosition: "Place the curvilinear probe in the right subcostal or intercostal space, typically between the mid-clavicular and anterior axillary lines, angled superiorly and slightly medially to visualize the IVC longitudinally through the liver.",
          keyStructures: [
            "Inferior Vena Cava (IVC)", 
            "Liver parenchyma", 
            "Right atrial junction", 
            "Hepatic veins (when visible)",
            "Diaphragm"
          ],
          keyPoints: [
            "Use this view when subcostal window is inadequate",
            "Patient positioning may need adjustment (left lateral decubitus can help)",
            "Optimize probe angle to align with IVC long axis",
            "Measure IVC diameter 2-3 cm from right atrial junction",
            "Use the liver as an acoustic window"
          ],
          specialNotes: [
            "This view is an alternative when the standard subcostal view is suboptimal",
            "The IVC orientation may differ from the standard longitudinal subcostal view",
            "May require patient to hold breath briefly to improve visualization",
            "Particularly useful in patients with significant bowel gas or obesity",
            "Can be challenging in patients with liver disease or altered anatomy",
            "Consider using harmonic imaging to improve visualization through liver tissue"
          ]
        },
        atlasContent: { 
          src: "/images/acquisition/ivc-measurement-corrected.png", 
          alt: "IVC RUQ View", 
          title: "IVC RUQ" 
        }
      }
    ]
  },
  hepatic: {
    title: "Hepatic Vein Assessment",
    views: [
      {
        id: "hepatic-long-view",
        title: "Hepatic Vein - Long Axis View",
        images: [
          { 
            src: "/images/acquisition/hepatic-vein-long-axis-corrected.png", 
            alt: "Hepatic Vein - Long Axis View",
            caption: "Hepatic Vein - Long Axis View"
          }
        ],
        technique: {
          probePosition: "Place the probe in the right 8th-10th intercostal space (typically the 9th), angled towards the right shoulder. Position the Doppler sample volume a few centimeters away from the hepatic vein-IVC junction to avoid turbulent flow artifacts.",
          keyStructures: ["Hepatic vein", "IVC junction", "Liver parenchyma"],
          dopplerWaveforms: [
            "Triphasic: Normal venous return",
            "Biphasic: Mild congestion", 
            "Monophasic: Severe congestion"
          ]
        },
        atlasContent: { 
          src: "/images/acquisition/hepatic-vein-long-axis-corrected.png", 
          alt: "Hepatic Long Axis Assessment", 
          title: "Hepatic Long Axis" 
        }
      },
      {
        id: "hepatic-short-view",
        title: "Hepatic Vein - Short Axis View",
        images: [
          { 
            src: "/images/acquisition/hepatic-vein-short-axis-corrected.png", 
            alt: "Hepatic Vein - Short Axis View",
            caption: "Hepatic Vein - Short Axis View"
          }
        ],
        technique: {
          probePosition: "Curvilinear probe in the right mid-axillary line at the level of the xiphoid or slightly below, angled towards the patient's head. Probe rotated 90 degrees counterclockwise from long-axis position.",
          keyStructures: ["Hepatic veins", "Portal vein", "IVC"]
        }
      },
      {
        id: "hepatic-subxiphoid-view",
        title: "Hepatic Vein - Subxiphoid View",
        images: [
          { 
            src: "/images/acquisition/hepatic-vein-subxiphoid-corrected.png", 
            alt: "Hepatic Vein - Subxiphoid View",
            caption: "Hepatic Vein - Subxiphoid View"
          }
        ],
        technique: {
          probePosition: "Probe in subxiphoid position, angling superiorly and slightly to the patient's right.",
          keyStructures: ["Left hepatic vein", "Middle hepatic vein", "Liver", "Right atrium", "IVC"]
        }
      }
    ]
  },
  portal: {
    title: "Portal Vein Assessment",
    views: [
      {
        id: "portal-long-view",
        title: "Portal Vein - Long Axis View",
        images: [
          { 
            src: "/images/acquisition/portal-vein-long-axis-corrected.png", 
            alt: "Portal Vein - Long Axis View",
            caption: "Portal Vein - Long Axis View"
          }
        ],
        technique: {
          probePosition: "Place probe in the right intercostal space, angled slightly cephalad.",
          keyStructures: ["Portal vein main trunk", "Hepatic artery", "Liver parenchyma"],
          dopplerWaveforms: [
            "Normal: Continuous flow with minimal pulsatility",
            "Pulsatile: Mild congestion",
            "Highly pulsatile: Severe congestion"
          ]
        },
        atlasContent: { 
          src: "/images/acquisition/portal-vein-long-axis-corrected.png", 
          alt: "Portal Long Axis Assessment", 
          title: "Portal Long Axis" 
        }
      },
      {
        id: "portal-short-view",
        title: "Portal Vein - Short Axis View",
        images: [
          { 
            src: "/images/acquisition/portal-vein-short-axis-corrected.png", 
            alt: "Portal Vein - Short Axis View",
            caption: "Portal Vein - Short Axis View"
          }
        ],
        technique: {
          probePosition: "Probe in mid-axillary line, below the xiphoid process, angled slightly toward patient's right shoulder, rotated 90 degrees counterclockwise from long axis view.",
          keyStructures: ["Portal vein", "Hepatic artery"],
          specialNotes: [
            "This view can be helpful for distinguishing portal vein pulsations from those originating from the nearby hepatic artery."
          ]
        }
      },
      {
        id: "portal-subxiphoid-view",
        title: "Portal Vein - Subxiphoid View",
        images: [
          { 
            src: "/images/acquisition/portal-vein-subxiphoid-corrected.png", 
            alt: "Portal Vein - Subxiphoid View",
            caption: "Portal Vein - Subxiphoid View"
          }
        ],
        technique: {
          probePosition: "Probe in subxiphoid position, angling superiorly and slightly to the patient's right.",
          keyStructures: ["Portal vein", "Liver", "IVC"]
        },
        atlasContent: { 
          src: "/images/acquisition/portal-vein-subxiphoid-corrected.png", 
          alt: "Portal Vein Subxiphoid View", 
          title: "Portal Subxiphoid" 
        }
      }
    ]
  },
  renal: {
    title: "Renal Vein Assessment",
    views: [
      {
        id: "renal-long-view",
        title: "Renal Vein - Long Axis View",
        images: [
          { 
            src: "/images/acquisition/renal-vein-long-axis-corrected.png", 
            alt: "Renal Vein - Long Axis View",
            caption: "Renal Vein - Long Axis View"
          }
        ],
        technique: {
          probePosition: "Position the probe in the flank (right or left), posterior to the mid-axillary line. Start with the right kidney for consistency, but use the left kidney as an alternative when the right kidney is difficult to visualize due to body habitus, bowel gas, or patient positioning constraints.",
          keyStructures: ["Renal interlobar vein", "Kidney hilum", "Renal artery", "Renal pyramids"],
          keyPoints: [
            "Either kidney can be used for VEXUS assessment",
            "Left kidney may be easier to visualize in some patients",
            "Focus on interlobar or arcuate veins within the kidney parenchyma",
            "Sample volume should be placed in intrarenal veins, not the main renal vein"
          ],
          dopplerWaveforms: [
            "Continuous: Normal venous return",
            "Pulsatile: Mild congestion",
            "Discontinuous/phasic reversal: Severe congestion"
          ]
        },
        atlasContent: { 
          src: "/images/acquisition/renal-vein-long-axis-corrected.png", 
          alt: "Renal Long Axis Assessment", 
          title: "Renal Long Axis" 
        }
      },
      {
        id: "renal-short-view",
        title: "Renal Vein - Short Axis View",
        images: [
          { 
            src: "/images/acquisition/renal-vein-short-axis-corrected.png", 
            alt: "Renal Vein - Short Axis View",
            caption: "Renal Vein - Short Axis View"
          }
        ],
        technique: {
          probePosition: "Position probe in transverse orientation at flank (right or left), looking for the kidney in cross-section. Use whichever kidney provides better visualization.",
          keyStructures: ["Renal interlobar vein", "Renal artery", "Kidney hilum", "Renal pyramids"],
          specialNotes: [
            "This view is useful for assessing flow within the intrarenal veins while avoiding angle-dependent errors in Doppler measurements.",
            "Either kidney can be assessed - choose the one with better acoustic window",
            "Focus on interlobar veins between the renal pyramids rather than the main renal vein"
          ]
        },
        atlasContent: { 
          src: "/images/acquisition/renal-vein-short-axis-corrected.png", 
          alt: "Renal Short Axis Assessment", 
          title: "Renal Short Axis" 
        }
      }
    ]
  }
};

const AcquisitionPageContent: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);

  const handleImageClick = (image: ImageData) => {
    setSelectedImage(image);
    setLightboxOpen(true);
  };

  const AcquisitionSection: React.FC<{ children: React.ReactNode; id?: string }> = ({ children, id }) => (
    <Box 
      id={id}
      sx={{ 
        mb: 4,
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      {children}
    </Box>
  );

  const ViewSection: React.FC<{ view: ViewContent; assessmentType: string }> = ({ view, assessmentType }) => (
    <Card elevation={2} sx={{ mb: 3, bgcolor: '#fafafa', border: '1px solid #e0e0e0' }}>
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        {/* Title */}
        <Typography 
          variant="h4" 
          component="h3" 
          gutterBottom 
          sx={{ 
            fontFamily: 'Europa, sans-serif',
            color: '#424242',
            fontWeight: 'bold',
            textAlign: 'center',
            mb: 3
          }}
        >
          {view.title}
        </Typography>
        
        {/* Image */}
        {view.images.length > 0 && (
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Card 
              sx={{ 
                display: 'inline-block',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '1px solid #e0e0e0',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 3
                }
              }}
              onClick={() => handleImageClick(view.images[0])}
            >
              <Box sx={{ position: 'relative' }}>
                <Box
                  component="img"
                  src={view.images[0].src}
                  alt={view.images[0].alt}
                  sx={{ 
                    width: '100%',
                    maxWidth: 900,
                    height: 'auto',
                    display: 'block'
                  }}
                />
                <IconButton 
                  sx={{ 
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    color: '#616161',
                    '&:hover': {
                      backgroundColor: 'white'
                    }
                  }}
                >
                  <ZoomIn />
                </IconButton>
              </Box>
            </Card>
          </Box>
        )}

        {/* Additional Images if any */}
        {view.images.length > 1 && (
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Grid container spacing={2} justifyContent="center">
              {view.images.slice(1).map((image, imageIndex) => (
                <Grid item key={imageIndex + 1}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      border: '1px solid #e0e0e0',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: 3
                      }
                    }}
                    onClick={() => handleImageClick(image)}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <Box
                        component="img"
                        src={image.src}
                        alt={image.alt}
                        sx={{ 
                          width: 500,
                          height: 350,
                          objectFit: 'cover'
                        }}
                      />
                      <IconButton 
                        sx={{ 
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: 'rgba(255,255,255,0.9)',
                          color: '#616161',
                          '&:hover': {
                            backgroundColor: 'white'
                          }
                        }}
                      >
                        <ZoomIn />
                      </IconButton>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        
        {/* Text Description */}
        <Box sx={{ mb: 3, maxWidth: 800, mx: 'auto' }}>
          <Card sx={{ p: 3, bgcolor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
            <Box sx={{ mb: 2 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontFamily: 'Europa, sans-serif',
                  fontWeight: 'bold', 
                  mb: 1,
                  color: '#424242'
                }}
              >
                Probe Position:
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontFamily: 'Europa, sans-serif',
                  lineHeight: 1.6,
                  color: '#616161'
                }}
              >
                {view.technique.probePosition}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontFamily: 'Europa, sans-serif',
                  fontWeight: 'bold', 
                  mb: 1,
                  color: '#424242'
                }}
              >
                Key Structures:
              </Typography>
              <List dense sx={{ pl: 2 }}>
                {view.technique.keyStructures.map((structure, index) => (
                  <ListItem key={index} sx={{ py: 0.25, px: 0 }}>
                    <ListItemText 
                      primary={`• ${structure}`}
                      sx={{ 
                        '& .MuiListItemText-primary': { 
                          fontSize: '1rem',
                          fontFamily: 'Europa, sans-serif',
                          color: '#616161'
                        } 
                      }} 
                    />
                  </ListItem>
                ))}
              </List>
            </Box>

            {view.technique.keyPoints && (
              <Box sx={{ mb: 2 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: 'Europa, sans-serif',
                    fontWeight: 'bold', 
                    mb: 1,
                    color: '#424242'
                  }}
                >
                  Key Points:
                </Typography>
                <List dense sx={{ pl: 2 }}>
                  {view.technique.keyPoints.map((point, index) => (
                    <ListItem key={index} sx={{ py: 0.25, px: 0 }}>
                      <ListItemText 
                        primary={`• ${point}`}
                        sx={{ 
                          '& .MuiListItemText-primary': { 
                            fontSize: '1rem',
                            fontFamily: 'Europa, sans-serif',
                            color: '#616161'
                          } 
                        }} 
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {view.technique.dopplerWaveforms && (
              <Box sx={{ mb: 2 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: 'Europa, sans-serif',
                    fontWeight: 'bold', 
                    mb: 1,
                    color: '#424242'
                  }}
                >
                  Doppler Waveforms:
                </Typography>
                <List dense sx={{ pl: 2 }}>
                  {view.technique.dopplerWaveforms.map((waveform, index) => (
                    <ListItem key={index} sx={{ py: 0.25, px: 0 }}>
                      <ListItemText 
                        primary={`• ${waveform}`}
                        sx={{ 
                          '& .MuiListItemText-primary': { 
                            fontSize: '1rem',
                            fontFamily: 'Europa, sans-serif',
                            color: '#616161'
                          } 
                        }} 
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {view.technique.specialNotes && (
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: 'Europa, sans-serif',
                    fontWeight: 'bold', 
                    mb: 1,
                    color: '#424242'
                  }}
                >
                  Special Notes:
                </Typography>
                <List dense sx={{ pl: 2 }}>
                  {view.technique.specialNotes.map((note, index) => (
                    <ListItem key={index} sx={{ py: 0.25, px: 0 }}>
                      <ListItemText 
                        primary={`• ${note}`}
                        sx={{ 
                          '& .MuiListItemText-primary': { 
                            fontSize: '1rem',
                            fontFamily: 'Europa, sans-serif',
                            color: '#616161'
                          } 
                        }} 
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Card>
        </Box>

        {/* Atlas Content (GIF) - Moved here to appear directly after text description */}
        {view.atlasContent && (
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Card sx={{ 
              display: 'inline-block',
              bgcolor: '#f5f5f5',
              border: '1px solid #e0e0e0',
              p: 2
            }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontFamily: 'Europa, sans-serif',
                  color: '#424242',
                  fontWeight: 'bold',
                  mb: 2,
                  textAlign: 'center'
                }}
              >
                {view.atlasContent.title}
              </Typography>
              <Box 
                sx={{ 
                  position: 'relative', 
                  cursor: 'pointer',
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: '1px solid #e0e0e0',
                  '&:hover .play-overlay': { opacity: 1 }
                }}
                onClick={() => handleImageClick({ 
                  src: view.atlasContent!.src, 
                  alt: view.atlasContent!.alt, 
                  caption: `${view.atlasContent!.title} Animation` 
                })}
              >
                <Box
                  component="img"
                  src={view.atlasContent.src}
                  alt={view.atlasContent.alt}
                  sx={{ 
                    width: '100%', 
                    maxWidth: 800,
                    height: 'auto', 
                    display: 'block' 
                  }}
                />
                <Box
                  className="play-overlay"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  }}
                >
                  <PlayArrow sx={{ fontSize: 48, color: 'white' }} />
                </Box>
              </Box>
            </Card>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h1" 
          component="h1" 
          sx={{ 
            fontFamily: 'Europa, sans-serif',
            color: '#2c3e50',
            mb: 2,
            fontWeight: 'bold'
          }}
        >
          VEXUS Image Acquisition Guide
        </Typography>
        <Typography 
          variant="h5" 
          component="p" 
          sx={{ 
            fontFamily: 'Europa, sans-serif',
            color: 'text.secondary',
            maxWidth: 800,
            mx: 'auto'
          }}
        >
          Comprehensive guide to VEXUS ultrasound image acquisition techniques, standards, and best practices for medical professionals and researchers.
        </Typography>
      </Box>

      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* IVC Assessment */}
        <AcquisitionSection id="ivc-assessment">
          <Card elevation={3} sx={{ mb: 4 }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography 
                variant="h2" 
                component="h2" 
                sx={{ 
                  fontFamily: 'Europa, sans-serif',
                  color: '#2c3e50',
                  mb: 3
                }}
              >
                {assessmentData.ivc.title}
              </Typography>

              {assessmentData.ivc.views.map((view) => (
                <ViewSection 
                  key={view.id} 
                  view={view} 
                  assessmentType="ivc" 
                />
              ))}
            </CardContent>
          </Card>
        </AcquisitionSection>

        {/* Hepatic Vein Assessment */}
        <AcquisitionSection id="hepatic-vein-assessment">
          <Card elevation={3} sx={{ mb: 4 }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography 
                variant="h2" 
                component="h2" 
                sx={{ 
                  fontFamily: 'Europa, sans-serif',
                  color: '#2c3e50',
                  mb: 3
                }}
              >
                {assessmentData.hepatic.title}
              </Typography>

              {assessmentData.hepatic.views.map((view) => (
                <ViewSection 
                  key={view.id} 
                  view={view} 
                  assessmentType="hepatic" 
                />
              ))}
            </CardContent>
          </Card>
        </AcquisitionSection>

        {/* Portal Vein Assessment */}
        <AcquisitionSection id="portal-vein-assessment">
          <Card elevation={3} sx={{ mb: 4 }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography 
                variant="h2" 
                component="h2" 
                sx={{ 
                  fontFamily: 'Europa, sans-serif',
                  color: '#2c3e50',
                  mb: 3
                }}
              >
                {assessmentData.portal.title}
              </Typography>

              {assessmentData.portal.views.map((view) => (
                <ViewSection 
                  key={view.id} 
                  view={view} 
                  assessmentType="portal" 
                />
              ))}
            </CardContent>
          </Card>
        </AcquisitionSection>

        {/* Renal Vein Assessment */}
        <AcquisitionSection id="renal-vein-assessment">
          <Card elevation={3} sx={{ mb: 4 }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography 
                variant="h2" 
                component="h2" 
                sx={{ 
                  fontFamily: 'Europa, sans-serif',
                  color: '#2c3e50',
                  mb: 3
                }}
              >
                {assessmentData.renal.title}
              </Typography>

              {assessmentData.renal.views.map((view) => (
                <ViewSection 
                  key={view.id} 
                  view={view} 
                  assessmentType="renal" 
                />
              ))}
            </CardContent>
          </Card>
        </AcquisitionSection>

        {/* General Tips Section */}
        <AcquisitionSection id="general-acquisition-tips">
          <Card elevation={3}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography 
                variant="h2" 
                component="h2" 
                gutterBottom 
                sx={{ 
                  fontFamily: 'Europa, sans-serif',
                  color: '#2c3e50' 
                }}
              >
                General Acquisition Tips
              </Typography>
              <Grid container spacing={2}>
                {[
                  "Ensure proper patient positioning for optimal image quality",
                  "Adjust Doppler settings appropriately for each vessel",
                  "Use respiratory variation assessment when appropriate",
                  "Document findings systematically",
                  "Compare with baseline studies when available",
                  "Consider patient's breathing cycle during image acquisition",
                  "Optimize gain and depth settings for each view"
                ].map((tip, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card sx={{ p: 2, height: '100%', bgcolor: '#f8f9fa' }}>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontFamily: 'Europa, sans-serif',
                          lineHeight: 1.5 
                        }}
                      >
                        • {tip}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </AcquisitionSection>
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
              src={selectedImage.src} 
              alt={selectedImage.alt} 
              sx={{ 
                width: '100%', 
                height: 'auto', 
                display: 'block' 
              }} 
            />
          )}
          {selectedImage?.caption && (
            <Box 
              sx={{ 
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                p: 2,
                fontFamily: 'Europa, sans-serif'
              }}
            >
              <Typography variant="body1">
                {selectedImage.caption}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AcquisitionPageContent; 