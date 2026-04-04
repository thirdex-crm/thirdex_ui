import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { getApi } from 'common/apiClient';
import { urls } from 'common/urls';
import moment from 'moment';
import SectionSkeleton from 'ui-component/Loader/SectionSkeleton';
import CasePopover from 'components/CasePopover';

const AboutCaseNote = ({ open, onClose, caseData, setSelectedCaseNote }) => {
  const formatHoursLabel = (value) => {
    const numericValue = Number(value || 0);
    const wholeHours = Math.floor(numericValue);
    const minutes = Math.round((numericValue - wholeHours) * 60);

    return `${wholeHours} hr${wholeHours === 1 ? '' : 's'} ${minutes} mins`;
  };

  const [caseNoteData, setCaseNoteData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCloseTow = () => {
    setAnchorEl(null);
    setCaseNoteData(null);
    setSelectedCaseNote(null);
    onClose();
  };
  const openDialog = Boolean(anchorEl);
  useEffect(() => {
    if (!caseData?.id) return;

    const fetchCaseNotes = async () => {
      try {
        const res = await getApi(urls.casenote.getById.replace(':id', caseData?.id));
        setCaseNoteData(res?.data?.caseNoteData || {});
      } catch (error) {
        console.error('Failed to fetch case note details', error);
      }
    };
    fetchCaseNotes();
  }, [caseData?.id]);

  return (
    <>
      <Dialog
        open={open}
        onClose={handleCloseTow}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: { borderRadius: 2, p: 1 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: '18px' }}>Case Note</DialogTitle>
        <DialogContent>
          {!caseNoteData ? (
            <SectionSkeleton lines={1} variant="rectangular" height={150} spacing={1} />
          ) : (
            <>
              <Box sx={{ backgroundColor: '#fff', width: '100%', borderRadius: '4px', mb: 2 }}>
                <TableContainer component={Paper} elevation={0}>
                  <Table size="small" sx={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableRow sx={{ height: 50 }}>
                        {['Date', 'Subject', 'Contact Type', 'Created By', 'Hours'].map((header) => (
                          <TableCell
                            key={header}
                            sx={{
                              fontSize: '12px',
                              whiteSpace: 'nowrap',
                              padding: '10px',
                              borderBottom: '1px solid lightgray',
                              fontWeight: 600
                            }}
                          >
                            {header}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow sx={{ borderBottom: '1px solid lightgray', height: 50 }}>
                        <TableCell sx={{ fontSize: '12px', padding: '10px' }}>
                          {caseNoteData?.date ? moment(caseNoteData?.date).format('MM/DD/YYYY') : '-'}
                        </TableCell>
                        <TableCell sx={{ fontSize: '12px', padding: '10px' }}>{caseNoteData?.subject || '-'}</TableCell>
                        <TableCell sx={{ fontSize: '12px', padding: '10px' }}>{caseNoteData?.configurationId?.name || '-'}</TableCell>
                        <TableCell sx={{ fontSize: '12px', padding: '10px' }}>
                          {caseNoteData?.createdBy?.accountType || caseNoteData?.createdBy?.firstName || '-'}
                        </TableCell>
                        <TableCell sx={{ fontSize: '12px', padding: '10px' }}>
                          <Box
                            sx={{
                              display: 'inline-block',
                              backgroundColor: '#E0F4FF',
                              color: '#26C6F9',
                              borderRadius: 3,
                              px: 1,
                              py: 0.3,
                              fontSize: '12px',
                              fontWeight: 500
                            }}
                          >
                            {formatHoursLabel(caseNoteData?.time)}
                          </Box>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              <Typography fontSize="13px" mb={2} sx={{ whiteSpace: 'pre-line', padding: '10px' }}>
                {caseNoteData?.note || '-'}
              </Typography>
            </>
          )}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              mt: 1,
              mb: 1,
              mr: 1
            }}
          >
            <Box sx={{ textAlign: 'right' }}>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  fontSize: '12px'
                }}
              >
                Created by {caseNoteData?.createdBy?.firstName || '-'} {caseNoteData?.createdBy?.lastName || ''}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  color: 'text.secondary',
                  fontSize: '12px'
                }}
              >
                On {caseNoteData?.date ? moment(caseNoteData.date).format('DD/MM/YYYY') : '-'}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  color: 'text.secondary',
                  fontSize: '12px'
                }}
              >
                Signature: {caseNoteData?.createdBy?.firstName || '-'} {caseNoteData?.createdBy?.lastName || ''}
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" justifyContent="flex-end" spacing={2} mt={3}>
            <Button
              variant="contained"
              onClick={handleClick}
              sx={{
                borderRadius: '6px',
                width: '100px',
                height: '36px',
                fontSize: '12px',
                backgroundColor: '#009fc7',
                '&:hover': {
                  backgroundColor: '#009fc7'
                }
              }}
            >
              Manage
            </Button>
            <Button
              variant="contained"
              color="inherit"
              onClick={handleCloseTow}
              sx={{
                borderRadius: '6px',
                width: '100px',
                fontSize: '12px',
                backgroundColor: '#0A2C40',
                color: '#fff',
                '&:hover': { backgroundColor: '#0A2C40' }
              }}
            >
              CLOSE
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
      <CasePopover open={openDialog} anchorEl={anchorEl} onClose={handleClose} data={caseNoteData || caseData} closeNote={handleCloseTow} />
    </>
  );
};

AboutCaseNote.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  caseData: PropTypes.shape({
    id: PropTypes.string
  }),
  setSelectedCaseNote: PropTypes.func.isRequired
};

export default AboutCaseNote;
