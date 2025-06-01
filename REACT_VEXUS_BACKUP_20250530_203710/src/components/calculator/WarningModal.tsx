import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
} from '@mui/material';
import { Security, BugReport } from '@mui/icons-material';

interface WarningModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: 'hipaa' | 'beta';
}

const WarningModal: React.FC<WarningModalProps> = ({ 
  open, 
  onClose, 
  onConfirm, 
  type 
}) => {
  const isHIPAA = type === 'hipaa';

  const getIcon = () => {
    return isHIPAA ? <Security color="warning" /> : <BugReport color="info" />;
  };

  const getTitle = () => {
    return isHIPAA ? 'HIPAA Compliance Warning' : 'Beta Feature Warning';
  };

  const getContent = () => {
    if (isHIPAA) {
      return (
        <>
          <DialogContentText sx={{ mb: 2 }}>
            Please ensure that all images uploaded to this calculator are free of Protected Health Information (PHI) 
            as defined by HIPAA regulations.
          </DialogContentText>
          
          <Typography variant="subtitle2" gutterBottom>
            This includes, but is not limited to:
          </Typography>
          
          <List dense>
            <ListItem>
              <ListItemText primary="• Patient names or identifiers" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Medical record numbers" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Dates (except year) associated with a patient" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Device serial numbers" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Any other identifying information" />
            </ListItem>
          </List>
          
          <DialogContentText sx={{ mt: 2 }}>
            The VEXUS ATLAS image recognition system does not store or retain uploaded images. 
            All processing is done securely and images are discarded after analysis.
          </DialogContentText>
        </>
      );
    } else {
      return (
        <>
          <DialogContentText sx={{ mb: 2 }}>
            Please acknowledge that:
          </DialogContentText>
          
          <List dense>
            <ListItem>
              <ListItemText 
                primary="• This system is currently in BETA testing"
                primaryTypographyProps={{ fontWeight: 'medium' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Results may not be completely accurate or reliable" />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="• Do NOT make clinical decisions based solely on this AI"
                primaryTypographyProps={{ fontWeight: 'bold', color: 'error.main' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Always use your clinical judgment and consult other validated methods" />
            </ListItem>
          </List>
          
          <DialogContentText sx={{ mt: 2 }}>
            This tool is intended for educational and research purposes only. The VEXUS score calculation 
            should be verified by a trained clinician.
          </DialogContentText>
        </>
      );
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        elevation: 8,
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle 
        sx={{ 
          display: 'flex', 
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 2
        }}
      >
        <Box sx={{ mr: 1 }}>
          {getIcon()}
        </Box>
        <Typography variant="h6" component="span">
          {getTitle()}
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ py: 3 }}>
        {getContent()}
      </DialogContent>
      
      <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button 
          onClick={onClose} 
          color="inherit"
          variant="outlined"
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          color="primary" 
          variant="contained"
          autoFocus
        >
          I Understand & Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WarningModal; 