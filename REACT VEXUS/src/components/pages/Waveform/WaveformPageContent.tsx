import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Link,
  Dialog,
  DialogContent,
  IconButton,
  Button,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Close, ZoomIn, PlayArrow } from '@mui/icons-material';

interface ImageData {
  src: string;
  alt: string;
  caption?: string;
}

// Citation component for numbered references
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
      const element = document.getElementById(`reference-${refNumber}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }}
  >
    {refNumber}
  </Box>
);

// Updated Section wrapper to match Acquisition page style
const WaveformSection: React.FC<{ children: React.ReactNode; id?: string }> = ({ children, id }) => (
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

const WaveformPageContent: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);

  const handleImageClick = (image: ImageData) => {
    setSelectedImage(image);
    setLightboxOpen(true);
  };

  // Updated Image component to match Acquisition page style
  const ImageSection: React.FC<{
    title: string;
    imageSrc: string;
    imageAlt: string;
    caption: string;
  }> = ({ title, imageSrc, imageAlt, caption }) => (
    <Box sx={{ mb: 3, textAlign: 'center' }}>
      <Typography 
        variant="h4" 
        component="h4" 
        gutterBottom 
        sx={{ 
          fontFamily: 'Europa, sans-serif',
          color: '#424242',
          fontWeight: 'bold',
          mb: 2
        }}
      >
        {title}
      </Typography>
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
        onClick={() => handleImageClick({ src: imageSrc, alt: imageAlt, caption })}
      >
        <Box sx={{ position: 'relative' }}>
          <Box
            component="img"
            src={imageSrc}
            alt={imageAlt}
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
      {caption && (
        <Box sx={{ mt: 2, maxWidth: 800, mx: 'auto' }}>
          <Card sx={{ p: 2, bgcolor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
            <Typography 
              variant="body1" 
              sx={{ 
                fontFamily: 'Europa, sans-serif',
                lineHeight: 1.6,
                color: '#616161',
                fontStyle: 'italic'
              }}
            >
              {caption}
            </Typography>
          </Card>
        </Box>
      )}
    </Box>
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
          Interpreting VExUS Doppler Waveforms
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
          Comprehensive guide to interpreting VEXUS ultrasound waveform patterns for improved venous congestion assessment and patient care.
        </Typography>
      </Box>

      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Introduction Section */}
        <WaveformSection id="introduction">
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
                Introduction to VExUS Doppler Waveforms
              </Typography>
              
              <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                <Card sx={{ p: 3, bgcolor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
                  <Typography variant="body1" paragraph sx={{ fontFamily: 'Europa, sans-serif', lineHeight: 1.7, color: '#424242' }}>
                    Venous Excess Ultrasound (VExUS) is a point-of-care ultrasound assessment method that evaluates systemic venous congestion by examining the Doppler waveforms of key veins (hepatic, portal, and intrarenal) alongside the size and variation of the inferior vena cava (IVC)<CitationLink refNumber={1} /><CitationLink refNumber={2} />. By analyzing these venous patterns, clinicians can estimate how elevated right-sided heart pressures or excessive fluid loading affect organ blood flow<CitationLink refNumber={1} /><CitationLink refNumber={3} />.
                  </Typography>
                  
                  <Typography variant="body1" paragraph sx={{ fontFamily: 'Europa, sans-serif', lineHeight: 1.7, color: '#424242' }}>
                    Recognizing normal waveforms versus mild or severe abnormalities provides an immediate snapshot of venous congestion:
                  </Typography>
                  
                  <List sx={{ pl: 2 }}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                            • <strong>Normal waveforms</strong> suggest no significant congestion.
                          </Typography>
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                            • <strong>Mild abnormalities</strong> indicate early or moderate venous hypertension.
                          </Typography>
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography sx={{ fontFamily: 'Europa, sans-serif', color: '#424242' }}>
                            • <strong>Severe abnormalities</strong> reflect high venous pressure and substantial backward flow.
                          </Typography>
                        }
                      />
                    </ListItem>
                  </List>
                  
                  <Typography variant="body1" sx={{ fontFamily: 'Europa, sans-serif', lineHeight: 1.7, color: '#424242' }}>
                    This resource will describe how to recognize these pattern changes in each vein type.
                  </Typography>
                </Card>
              </Box>
            </CardContent>
          </Card>
        </WaveformSection>

        {/* EKG Tracing Section */}
        <WaveformSection id="ekg-tracing">
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
                EKG Tracing in VExUS Assessment
              </Typography>
              
              <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                <Card sx={{ p: 3, bgcolor: '#f8f9fa', border: '1px solid #e0e0e0', mb: 3 }}>
                  <Typography variant="body1" paragraph sx={{ fontFamily: 'Europa, sans-serif', lineHeight: 1.7, color: '#424242' }}>
                    Hepatic vein waveforms are best interpreted with respect to the cardiac cycle, making simultaneous EKG tracing invaluable for accurate pattern recognition and phase identification. The cardiac electrical events help identify the timing of various waveform components:
                  </Typography>

                  <List sx={{ pl: 2 }}>
                    <ListItem sx={{ py: 0.25, px: 0 }}>
                      <ListItemText 
                        primary="• The S wave occurring during ventricular systole (between QRS complex and T wave)"
                        sx={{ 
                          '& .MuiListItemText-primary': { 
                            fontSize: '1rem',
                            fontFamily: 'Europa, sans-serif',
                            color: '#616161'
                          } 
                        }} 
                      />
                    </ListItem>
                    <ListItem sx={{ py: 0.25, px: 0 }}>
                      <ListItemText 
                        primary="• The D wave during early ventricular diastole (after T wave)"
                        sx={{ 
                          '& .MuiListItemText-primary': { 
                            fontSize: '1rem',
                            fontFamily: 'Europa, sans-serif',
                            color: '#616161'
                          } 
                        }} 
                      />
                    </ListItem>
                    <ListItem sx={{ py: 0.25, px: 0 }}>
                      <ListItemText 
                        primary="• The A wave during atrial contraction (shortly after P wave)"
                        sx={{ 
                          '& .MuiListItemText-primary': { 
                            fontSize: '1rem',
                            fontFamily: 'Europa, sans-serif',
                            color: '#616161'
                          } 
                        }} 
                      />
                    </ListItem>
                    <ListItem sx={{ py: 0.25, px: 0 }}>
                      <ListItemText 
                        primary="• The V wave at end-systole (during the T wave)"
                        sx={{ 
                          '& .MuiListItemText-primary': { 
                            fontSize: '1rem',
                            fontFamily: 'Europa, sans-serif',
                            color: '#616161'
                          } 
                        }} 
                      />
                    </ListItem>
                  </List>
                  
                  <Typography variant="body1" sx={{ fontFamily: 'Europa, sans-serif', lineHeight: 1.7, color: '#424242' }}>
                    This temporal correlation helps identify waveform abnormalities with confidence, particularly when distinguishing between S and D waves in cases of mild congestion or determining true flow reversals in severe congestion.
                  </Typography>
                </Card>
              </Box>

              <ImageSection
                title="EKG Tracing with Hepatic Vein Waveform"
                imageSrc="/images/EKGtracing.hepatic.png"
                imageAlt="EKG Tracing with Hepatic Vein Waveform"
                caption="EKG tracing displayed alongside hepatic vein waveform allows for precise identification of cardiac cycle phases. This temporal correlation is essential for accurate interpretation of venous flow patterns and distinguishing between normal and abnormal waveform components."
              />
            </CardContent>
          </Card>
        </WaveformSection>

        {/* Hepatic Vein Patterns Section */}
        <WaveformSection id="hepatic-vein-patterns">
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
                Hepatic Vein Waveforms
              </Typography>

              {/* Normal Pattern */}
              <Card elevation={2} sx={{ mb: 3, bgcolor: '#fafafa', border: '1px solid #e0e0e0' }}>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
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
                    Normal Pattern
                  </Typography>
                  
                  <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                    <Card sx={{ p: 3, bgcolor: '#f8f9fa', border: '1px solid #e0e0e0', mb: 3 }}>
                      <List sx={{ pl: 2 }}>
                        <ListItem sx={{ py: 0.25, px: 0 }}>
                          <ListItemText 
                            primary='• "S > D": The systolic wave (S) is larger than the diastolic wave (D) when viewed on Doppler.'
                            sx={{ 
                              '& .MuiListItemText-primary': { 
                                fontSize: '1rem',
                                fontFamily: 'Europa, sans-serif',
                                color: '#616161'
                              } 
                            }} 
                          />
                        </ListItem>
                        <ListItem sx={{ py: 0.25, px: 0 }}>
                          <ListItemText 
                            primary="• Includes small retrograde deflections: the A wave (atrial contraction) and a tiny V wave (end-systole)."
                            sx={{ 
                              '& .MuiListItemText-primary': { 
                                fontSize: '1rem',
                                fontFamily: 'Europa, sans-serif',
                                color: '#616161'
                              } 
                            }} 
                          />
                        </ListItem>
                        <ListItem sx={{ py: 0.25, px: 0 }}>
                          <ListItemText 
                            primary="• Overall, flow is predominantly toward the heart during both systole and diastole, with only minor reversals in late diastole (A wave)."
                            sx={{ 
                              '& .MuiListItemText-primary': { 
                                fontSize: '1rem',
                                fontFamily: 'Europa, sans-serif',
                                color: '#616161'
                              } 
                            }} 
                          />
                        </ListItem>
                      </List>
                    </Card>
                  </Box>

                  <ImageSection
                    title="Normal Hepatic Vein: Doppler ASVD Pattern"
                    imageSrc="/images/hepaticvein.normal.asvd.png"
                    imageAlt="Doppler Normal Hepatic ASVD Pattern"
                    caption="Doppler display showing the characteristic ASVD pattern in optimal alignment. Each wave component is clearly defined: atrial contraction (A), systolic forward flow (S), venous (V), and diastolic (D) waves. The prominent S wave amplitude relative to D wave demonstrates normal right atrial pressures and preserved venous return dynamics."
                  />

                  <ImageSection
                    title="Normal Hepatic Vein: ASVD View"
                    imageSrc="/images/Hepatic.asvd.normal.2.png"
                    imageAlt="Normal Hepatic ASVD Pattern"
                    caption="A view of the normal hepatic vein waveform showing the classic ASVD pattern. This perspective highlights the wave components from a different angle, with clear visualization of the atrial contraction (A), systolic forward flow (S), venous (V), and diastolic (D) waves. The prominent S wave confirms normal right heart pressures."
                  />
                </CardContent>
              </Card>

              {/* Mild Congestion */}
              <Card elevation={2} sx={{ mb: 3, bgcolor: '#fafafa', border: '1px solid #e0e0e0' }}>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
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
                    Mild Congestion
                  </Typography>
                  
                  <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                    <Card sx={{ p: 3, bgcolor: '#f8f9fa', border: '1px solid #e0e0e0', mb: 3 }}>
                      <List sx={{ pl: 2 }}>
                        <ListItem sx={{ py: 0.25, px: 0 }}>
                          <ListItemText 
                            primary='• "S < D" Pattern: The systolic (S) wave diminishes, appearing with less amplitude than the diastolic (D) wave.'
                            sx={{ 
                              '& .MuiListItemText-primary': { 
                                fontSize: '1rem',
                                fontFamily: 'Europa, sans-serif',
                                color: '#616161'
                              } 
                            }} 
                          />
                        </ListItem>
                        <ListItem sx={{ py: 0.25, px: 0 }}>
                          <ListItemText 
                            primary="• The A wave usually becomes more prominent."
                            sx={{ 
                              '& .MuiListItemText-primary': { 
                                fontSize: '1rem',
                                fontFamily: 'Europa, sans-serif',
                                color: '#616161'
                              } 
                            }} 
                          />
                        </ListItem>
                        <ListItem sx={{ py: 0.25, px: 0 }}>
                          <ListItemText 
                            primary="• This is often the first indicator of elevated right atrial pressure and mild venous congestion."
                            sx={{ 
                              '& .MuiListItemText-primary': { 
                                fontSize: '1rem',
                                fontFamily: 'Europa, sans-serif',
                                color: '#616161'
                              } 
                            }} 
                          />
                        </ListItem>
                      </List>
                    </Card>
                  </Box>

                  <ImageSection
                    title="Mild Congestion: S < D Pattern with AVSD Visible"
                    imageSrc="/images/hepatic.mild.png"
                    imageAlt="Doppler Mild Hepatic Congestion Pattern"
                    caption="This image demonstrates mild hepatic vein congestion with the classic 'S < D' pattern. Note how the systolic (S) wave amplitude is smaller than the diastolic (D) wave, while both remain below the baseline (forward flow). The atrial (A) wave is more pronounced, and all components of the AVSD pattern are visible. This pattern indicates early venous congestion with rising right atrial pressures."
                  />
                </CardContent>
              </Card>

              {/* Severe Congestion */}
              <Card elevation={2} sx={{ mb: 3, bgcolor: '#fafafa', border: '1px solid #e0e0e0' }}>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
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
                    Severe Congestion
                  </Typography>
                  
                  <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                    <Card sx={{ p: 3, bgcolor: '#f8f9fa', border: '1px solid #e0e0e0', mb: 3 }}>
                      <List sx={{ pl: 2 }}>
                        <ListItem sx={{ py: 0.25, px: 0 }}>
                          <ListItemText 
                            primary='• Reversal of S Wave: The systolic (S) wave actually reverses direction, appearing above the baseline on Doppler (indicating flow away from the heart during systole).'
                            sx={{ 
                              '& .MuiListItemText-primary': { 
                                fontSize: '1rem',
                                fontFamily: 'Europa, sans-serif',
                                color: '#616161'
                              } 
                            }} 
                          />
                        </ListItem>
                        <ListItem sx={{ py: 0.25, px: 0 }}>
                          <ListItemText 
                            primary="• Reflects significantly elevated right atrial pressures, often seen in severe tricuspid regurgitation or right-sided heart failure."
                            sx={{ 
                              '& .MuiListItemText-primary': { 
                                fontSize: '1rem',
                                fontFamily: 'Europa, sans-serif',
                                color: '#616161'
                              } 
                            }} 
                          />
                        </ListItem>
                      </List>
                    </Card>
                  </Box>

                  <ImageSection
                    title="Hepatic Vein S-D Reversal"
                    imageSrc="/images/Hepatic.SR.SD.png"
                    imageAlt="Hepatic Vein S-D Reversal Waveform"
                    caption="This image demonstrates severe systolic flow reversal in a hepatic vein. Note how the S wave appears above the baseline (retrograde flow during systole) while the D wave remains below the baseline (antegrade flow during diastole). This pattern indicates significant right-sided venous congestion and is often associated with elevated right atrial pressures."
                  />
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </WaveformSection>

        {/* Portal Vein Waveforms Section */}
        <WaveformSection id="portal-vein-waveforms">
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
                Portal Vein Waveforms
              </Typography>

              {/* Normal Pattern */}
              <Card elevation={2} sx={{ mb: 3, bgcolor: '#fafafa', border: '1px solid #e0e0e0' }}>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
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
                    Normal Pattern
                  </Typography>
                  
                  <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                    <Card sx={{ p: 3, bgcolor: '#f8f9fa', border: '1px solid #e0e0e0', mb: 3 }}>
                      <List sx={{ pl: 2 }}>
                        <ListItem sx={{ py: 0.25, px: 0 }}>
                          <ListItemText 
                            primary="• Continuous Forward Flow: Portal flow is steady and laminar, with minimal pulsatility throughout the cardiac cycle."
                            sx={{ 
                              '& .MuiListItemText-primary': { 
                                fontSize: '1rem',
                                fontFamily: 'Europa, sans-serif',
                                color: '#616161'
                              } 
                            }} 
                          />
                        </ListItem>
                        <ListItem sx={{ py: 0.25, px: 0 }}>
                          <ListItemText 
                            primary="• Pulsatility Index < 30%: Only very minor variations in flow velocity."
                            sx={{ 
                              '& .MuiListItemText-primary': { 
                                fontSize: '1rem',
                                fontFamily: 'Europa, sans-serif',
                                color: '#616161'
                              } 
                            }} 
                          />
                        </ListItem>
                      </List>
                    </Card>
                  </Box>

                  <ImageSection
                    title="Normal Portal Vein Waveform"
                    imageSrc="/images/portal.normal.png"
                    imageAlt="Normal Portal Vein Waveform"
                    caption="This Doppler image demonstrates a normal portal vein waveform with continuous, laminar forward flow and minimal pulsatility. The steady flow pattern with pulsatility index < 30% indicates normal portal venous pressure without significant backpressure from the right heart or hepatic circulation."
                  />
                </CardContent>
              </Card>

              {/* Mild Congestion */}
              <Card elevation={2} sx={{ mb: 3, bgcolor: '#fafafa', border: '1px solid #e0e0e0' }}>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
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
                    Mild Congestion
                  </Typography>
                  
                  <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                    <Card sx={{ p: 3, bgcolor: '#f8f9fa', border: '1px solid #e0e0e0', mb: 3 }}>
                      <List sx={{ pl: 2 }}>
                        <ListItem sx={{ py: 0.25, px: 0 }}>
                          <ListItemText 
                            primary="• Increased Pulsatility (30-50%): Mild undulating pattern that fluctuates with the cardiac cycle."
                            sx={{ 
                              '& .MuiListItemText-primary': { 
                                fontSize: '1rem',
                                fontFamily: 'Europa, sans-serif',
                                color: '#616161'
                              } 
                            }} 
                          />
                        </ListItem>
                        <ListItem sx={{ py: 0.25, px: 0 }}>
                          <ListItemText 
                            primary="• Flow remains forward (below baseline), but shows periodic variation reflecting elevated back-pressure."
                            sx={{ 
                              '& .MuiListItemText-primary': { 
                                fontSize: '1rem',
                                fontFamily: 'Europa, sans-serif',
                                color: '#616161'
                              } 
                            }} 
                          />
                        </ListItem>
                      </List>
                    </Card>
                  </Box>

                  <ImageSection
                    title="Portal Vein Mild Congestion"
                    imageSrc="/images/portal.mild.png"
                    imageAlt="Portal Vein Mild Congestion"
                    caption="This Doppler image demonstrates mild portal vein congestion. Note the characteristic undulating waveform with a pulsatility index between 30-50%. The flow velocity varies throughout the cardiac cycle but remains consistently forward (below baseline), indicating early venous congestion without reversal of flow. This pattern suggests the beginning of backward transmission of right atrial pressure through the hepatic circulation."
                  />
                </CardContent>
              </Card>

              {/* Severe Congestion */}
              <Card elevation={2} sx={{ mb: 3, bgcolor: '#fafafa', border: '1px solid #e0e0e0' }}>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
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
                    Severe Congestion
                  </Typography>
                  
                  <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                    <Card sx={{ p: 3, bgcolor: '#f8f9fa', border: '1px solid #e0e0e0', mb: 3 }}>
                      <List sx={{ pl: 2 }}>
                        <ListItem sx={{ py: 0.25, px: 0 }}>
                          <ListItemText 
                            primary="• High Pulsatility > 50%: Marked oscillation of the portal flow with deep troughs."
                            sx={{ 
                              '& .MuiListItemText-primary': { 
                                fontSize: '1rem',
                                fontFamily: 'Europa, sans-serif',
                                color: '#616161'
                              } 
                            }} 
                          />
                        </ListItem>
                        <ListItem sx={{ py: 0.25, px: 0 }}>
                          <ListItemText 
                            primary="• Can approach or briefly cross the baseline (or show short-lived flow reversal), reflecting high venous pressures transmitted back from the right atrium and hepatic circulation."
                            sx={{ 
                              '& .MuiListItemText-primary': { 
                                fontSize: '1rem',
                                fontFamily: 'Europa, sans-serif',
                                color: '#616161'
                              } 
                            }} 
                          />
                        </ListItem>
                      </List>
                    </Card>
                  </Box>

                  <ImageSection
                    title="Portal Vein Severe Congestion"
                    imageSrc="/images/portal.severe.png"
                    imageAlt="Portal Vein Severe Congestion"
                    caption="This image shows severe portal vein congestion with a pulsatility index exceeding 50%. The marked oscillations feature deep troughs that approach or briefly cross the baseline, indicating significant backpressure from the right heart and hepatic circulation. This degree of pulsatility is associated with significant venous hypertension and organ congestion."
                  />
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </WaveformSection>

        {/* Intrarenal Vein Waveforms Section */}
        <WaveformSection id="intrarenal-vein-waveforms">
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
                Intrarenal (Renal Parenchymal) Vein Waveforms
              </Typography>

              {/* Normal Pattern */}
              <Card elevation={2} sx={{ mb: 3, bgcolor: '#fafafa', border: '1px solid #e0e0e0' }}>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
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
                    Normal Pattern
                  </Typography>
                  
                  <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                    <Card sx={{ p: 3, bgcolor: '#f8f9fa', border: '1px solid #e0e0e0', mb: 3 }}>
                      <List sx={{ pl: 2 }}>
                        <ListItem sx={{ py: 0.25, px: 0 }}>
                          <ListItemText 
                            primary="• Continuous Monophasic Flow: The tiny interlobar veins in the kidney typically exhibit a steady, non-pulsatile flow throughout the cardiac cycle."
                            sx={{ 
                              '& .MuiListItemText-primary': { 
                                fontSize: '1rem',
                                fontFamily: 'Europa, sans-serif',
                                color: '#616161'
                              } 
                            }} 
                          />
                        </ListItem>
                        <ListItem sx={{ py: 0.25, px: 0 }}>
                          <ListItemText 
                            primary="• No distinct systolic or diastolic components are recognizable; wave appears almost flat on Doppler."
                            sx={{ 
                              '& .MuiListItemText-primary': { 
                                fontSize: '1rem',
                                fontFamily: 'Europa, sans-serif',
                                color: '#616161'
                              } 
                            }} 
                          />
                        </ListItem>
                      </List>
                    </Card>
                  </Box>

                  <ImageSection
                    title="Normal Renal Vein Waveform"
                    imageSrc="/images/renal.normal.png"
                    imageAlt="Normal Renal Vein Waveform"
                    caption="This Doppler image demonstrates a normal renal vein waveform pattern. Note the continuous, monophasic flow with minimal variation throughout the cardiac cycle. This flat, steady pattern indicates normal venous drainage from the kidney without significant right-sided pressure influence. The absence of pulsatility suggests normal central venous pressure."
                  />
                </CardContent>
              </Card>

              {/* Mild Congestion */}
              <Card elevation={2} sx={{ mb: 3, bgcolor: '#fafafa', border: '1px solid #e0e0e0' }}>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
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
                    Mild Congestion
                  </Typography>
                  
                  <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                    <Card sx={{ p: 3, bgcolor: '#f8f9fa', border: '1px solid #e0e0e0', mb: 3 }}>
                      <List sx={{ pl: 2 }}>
                        <ListItem sx={{ py: 0.25, px: 0 }}>
                          <ListItemText 
                            primary="• Biphasic (S & D) Pulsatile Flow: As venous pressure rises, a waveform emerges with two forward-flow peaks—one in systole and another in diastole—separated by a brief trough."
                            sx={{ 
                              '& .MuiListItemText-primary': { 
                                fontSize: '1rem',
                                fontFamily: 'Europa, sans-serif',
                                color: '#616161'
                              } 
                            }} 
                          />
                        </ListItem>
                        <ListItem sx={{ py: 0.25, px: 0 }}>
                          <ListItemText 
                            primary='• Called a "discontinuous" pattern, it reflects moderate venous congestion within the renal parenchyma.'
                            sx={{ 
                              '& .MuiListItemText-primary': { 
                                fontSize: '1rem',
                                fontFamily: 'Europa, sans-serif',
                                color: '#616161'
                              } 
                            }} 
                          />
                        </ListItem>
                      </List>
                    </Card>
                  </Box>

                  <ImageSection
                    title="Renal Vein Mild Congestion"
                    imageSrc="/images/renal.mild.png"
                    imageAlt="Renal Vein Mild Congestion"
                    caption="This image demonstrates mild renal vein congestion with the characteristic biphasic pattern. Note the renal artery waveform visible at the top of the image, and below it, the discontinuous venous S and D waves. The two distinct forward-flow peaks (systolic and diastolic) are separated by a noticeable trough in the venous waveform. This 'discontinuous' flow pattern indicates moderate venous congestion in the renal parenchyma with early transmission of central venous pressure variations to the kidney's venous circulation."
                  />
                </CardContent>
              </Card>

              {/* Severe Congestion */}
              <Card elevation={2} sx={{ mb: 3, bgcolor: '#fafafa', border: '1px solid #e0e0e0' }}>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
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
                    Severe Congestion
                  </Typography>
                  
                  <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                    <Card sx={{ p: 3, bgcolor: '#f8f9fa', border: '1px solid #e0e0e0', mb: 3 }}>
                      <List sx={{ pl: 2 }}>
                        <ListItem sx={{ py: 0.25, px: 0 }}>
                          <ListItemText 
                            primary="• Monophasic D-Only Flow: The systolic component disappears entirely, and only diastolic flow remains visible per heartbeat."
                            sx={{ 
                              '& .MuiListItemText-primary': { 
                                fontSize: '1rem',
                                fontFamily: 'Europa, sans-serif',
                                color: '#616161'
                              } 
                            }} 
                          />
                        </ListItem>
                        <ListItem sx={{ py: 0.25, px: 0 }}>
                          <ListItemText 
                            primary="• Signifies significant back-pressure on the kidney's venous outflow. This pattern correlates with higher risk of acute kidney injury."
                            sx={{ 
                              '& .MuiListItemText-primary': { 
                                fontSize: '1rem',
                                fontFamily: 'Europa, sans-serif',
                                color: '#616161'
                              } 
                            }} 
                          />
                        </ListItem>
                      </List>
                    </Card>
                  </Box>

                  <ImageSection
                    title="Renal Vein Severe Congestion"
                    imageSrc="/images/renal.severe.png"
                    imageAlt="Renal Vein Severe Congestion"
                    caption="This Doppler image demonstrates severe renal vein congestion with the characteristic monophasic D-only flow pattern. Note the complete absence of the systolic flow component, with flow only occurring during diastole. This pattern indicates significant back-pressure on renal venous outflow and is associated with increased risk of acute kidney injury in the setting of venous congestion."
                  />
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </WaveformSection>

        {/* VExUS Grading Section */}
        <WaveformSection id="vexus-grading">
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
                Putting It All Together: VExUS Grading
              </Typography>

              <ImageSection
                title="VExUS Grading System"
                imageSrc="/images/VExUS.grading.png"
                imageAlt="VExUS Grading System"
                caption="Comprehensive VExUS grading system showing the classification criteria for each grade based on venous waveform patterns and IVC characteristics."
              />

              <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                <Card sx={{ p: 3, bgcolor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
                  <List sx={{ pl: 2 }}>
                    <ListItem sx={{ py: 0.25, px: 0 }}>
                      <ListItemText 
                        primary="• Grade 0 (Normal): All hepatic, portal, and renal waveforms are normal, with a collapsible IVC."
                        sx={{ 
                          '& .MuiListItemText-primary': { 
                            fontSize: '1rem',
                            fontFamily: 'Europa, sans-serif',
                            color: '#616161'
                          } 
                        }} 
                      />
                    </ListItem>
                    <ListItem sx={{ py: 0.25, px: 0 }}>
                      <ListItemText 
                        primary="• Grade 1 (Mild): One or more veins show mild abnormalities (e.g., S < D in hepatic vein, mild pulsatility in portal vein, or biphasic renal flow) combined with a dilated or non-collapsing IVC."
                        sx={{ 
                          '& .MuiListItemText-primary': { 
                            fontSize: '1rem',
                            fontFamily: 'Europa, sans-serif',
                            color: '#616161'
                          } 
                        }} 
                      />
                    </ListItem>
                    <ListItem sx={{ py: 0.25, px: 0 }}>
                      <ListItemText 
                        primary="• Grade 2 (Moderate): At least one severe abnormality (e.g., reversed S wave in hepatic vein, marked pulsatility or brief reversal in portal vein, or D-only renal flow)."
                        sx={{ 
                          '& .MuiListItemText-primary': { 
                            fontSize: '1rem',
                            fontFamily: 'Europa, sans-serif',
                            color: '#616161'
                          } 
                        }} 
                      />
                    </ListItem>
                    <ListItem sx={{ py: 0.25, px: 0 }}>
                      <ListItemText 
                        primary="• Grade 3 (Severe): Two or more severe waveform changes across hepatic, portal, or renal veins."
                        sx={{ 
                          '& .MuiListItemText-primary': { 
                            fontSize: '1rem',
                            fontFamily: 'Europa, sans-serif',
                            color: '#616161'
                          } 
                        }} 
                      />
                    </ListItem>
                  </List>

                  <Typography variant="body1" sx={{ fontFamily: 'Europa, sans-serif', lineHeight: 1.7, color: '#424242', mt: 2 }}>
                    Patients with advanced VExUS grades are at higher risk for congestive organ injury (hepatic congestion, kidney injury, etc.), and recognition of these patterns prompts intensified decongestive therapies<CitationLink refNumber={1} /><CitationLink refNumber={2} /><CitationLink refNumber={8} />.
                  </Typography>
                </Card>
              </Box>
            </CardContent>
          </Card>
        </WaveformSection>

        {/* References Section */}
        <WaveformSection id="references">
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
                References
              </Typography>
              <Grid container spacing={2}>
                {[
                  {
                    id: 1,
                    title: "The Venous Excess Ultrasound Grading System (VExUS) in Predicting AKI in Cardiac Surgery Patients",
                    authors: "Beaubien-Souligny W, et al.",
                    journal: "Crit Care Med. 2021;49(3):e263-e272",
                    url: "https://journals.lww.com/ccmjournal/Fulltext/2021/03000/The_Venous_Excess_Ultrasound_Grading_System.6.aspx"
                  },
                  {
                    id: 2,
                    title: "Focused Ultrasound Evaluation in Acute Medicine",
                    authors: "Beaubien-Souligny W, et al.",
                    journal: "J Am Heart Assoc. 2020;9:e014974",
                    url: "https://www.ahajournals.org/doi/10.1161/JAHA.119.014974"
                  },
                  {
                    id: 3,
                    title: "Clinical Significance of Portal Flow Pulsatility",
                    authors: "Denault AY, et al.",
                    journal: "J Cardiothorac Vasc Anesth. 2022;36(3):874-883",
                    url: "https://www.sciencedirect.com/science/article/pii/S1053077021005960"
                  },
                  {
                    id: 4,
                    title: "Guidelines for Performing a Comprehensive Transthoracic Echocardiographic Examination in Adults",
                    authors: "Mitchell C, et al.",
                    journal: "J Am Soc Echocardiogr. 2019;32(1):1-64",
                    url: "https://www.onlinejase.com/article/S0894-7317(18)30760-5/fulltext"
                  },
                  {
                    id: 5,
                    title: "Evaluation of organ congestion in heart failure",
                    authors: "Mullens W, et al.",
                    journal: "J Am Coll Cardiol. 2023;81(8):821-836",
                    url: "https://www.jacc.org/doi/10.1016/j.jacc.2022.11.078"
                  },
                  {
                    id: 6,
                    title: "Early Detection of Fluid Overload and Elevated Venous Pressure",
                    authors: "Ait-Oufella H, et al.",
                    journal: "Crit Care. 2019;23(1):176",
                    url: "https://ccforum.biomedcentral.com/articles/10.1186/s13054-019-2443-7"
                  },
                  {
                    id: 7,
                    title: "Renal Doppler Ultrasonography in the Critical Care Setting",
                    authors: "Sobczyk D, Nycz K",
                    journal: "Crit Care Res Pract. 2020;2020:8858794",
                    url: "https://www.hindawi.com/journals/ccrp/2020/8858794/"
                  },
                  {
                    id: 8,
                    title: "A Stepwise Demonstration of the VExUS Score",
                    authors: "Sorouri K, et al.",
                    journal: "J Cardiothorac Vasc Anesth. 2022;36(4):1163-1171",
                    url: "https://www.sciencedirect.com/science/article/pii/S1053077021008502"
                  }
                ].map((ref) => (
                  <Grid item xs={12} sm={6} md={4} key={ref.id}>
                    <Card sx={{ p: 2, height: '100%', bgcolor: '#f8f9fa' }}>
                      <Typography 
                        id={`reference-${ref.id}`}
                        variant="h6"
                        sx={{
                          fontFamily: 'Europa, sans-serif',
                          fontWeight: 'bold',
                          fontSize: '1.1em',
                          mb: 0.5,
                          color: '#333'
                        }}
                      >
                        {ref.id}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: 'Europa, sans-serif',
                          fontWeight: 'bold',
                          mb: 0.5,
                          color: '#333'
                        }}
                      >
                        {ref.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: 'Europa, sans-serif',
                          fontStyle: 'italic',
                          fontSize: '0.9em',
                          mb: 0.5,
                          color: '#555'
                        }}
                      >
                        {ref.authors}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: 'Europa, sans-serif',
                          fontSize: '0.9em',
                          color: '#666',
                          mb: 1
                        }}
                      >
                        {ref.journal}
                      </Typography>
                      <Link
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          display: 'inline-block',
                          p: '0.3em 0.6em',
                          backgroundColor: '#007bff',
                          color: 'white',
                          textDecoration: 'none',
                          borderRadius: '0.2em',
                          fontSize: '0.9em',
                          fontFamily: 'Europa, sans-serif',
                          '&:hover': {
                            backgroundColor: '#0056b3'
                          }
                        }}
                      >
                        View Article
                      </Link>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </WaveformSection>
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

export default WaveformPageContent; 