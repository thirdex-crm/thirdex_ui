import React from 'react';
import PropTypes from 'prop-types';
import { Card, Typography, Box, Grid, Link, Tooltip } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import StatusChip from './StatusChip';
import moment from 'moment';
import SectionSkeleton from 'ui-component/Loader/SectionSkeleton';
import { useEffect, useState } from 'react';
import { imageUrl } from 'common/urls';

const AboutCaseCard = ({ sessionData }) => {
  const formatHoursLabel = (value) => {
    const numericValue = Number(value || 0);
    const wholeHours = Math.floor(numericValue);
    const minutes = Math.round((numericValue - wholeHours) * 60);

    return `${wholeHours} hr${wholeHours === 1 ? '' : 's'} ${minutes} mins`;
  };

  const resolveAttachmentUrl = (filePath) => {
    if (!filePath) return '';

    const normalizedPath = filePath.replace(/\\/g, '/');

    if (normalizedPath.startsWith('https://') || normalizedPath.startsWith('http://')) {
      return normalizedPath;
    }

    const uploadsSegment = '/uploads/';
    const uploadsIndex = normalizedPath.lastIndexOf(uploadsSegment);
    const relativePath = uploadsIndex >= 0 ? normalizedPath.slice(uploadsIndex + 1) : normalizedPath.replace(/^\/+/, '');

    return `${imageUrl.replace(/\/$/, '')}/${relativePath}`;
  };

  const [loading, setLoading] = useState(true);
  const attachmentPath = sessionData?.file || '';
  const attachmentUrl = resolveAttachmentUrl(attachmentPath);
  const attachmentName = attachmentPath ? attachmentPath.replace(/\\/g, '/').split('/').pop() : '';

  useEffect(() => {
    if (sessionData) {
      setLoading(false);
    }
  }, [sessionData]);
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        boxShadow: 0,
        backgroundColor: '#fff',
        p: 3,
        // height: 228,
        overflowY: 'auto',
        maxWidth: 574
      }}
    >
      <Typography
        sx={{
          fontSize: '16px',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
        gutterBottom
      >
        <DescriptionOutlinedIcon />
        ABOUT CASE
      </Typography>

      <Box borderBottom={1} borderColor="grey.300" mb={2} />
      {loading ? (
        <SectionSkeleton lines={1} variant="rectangular" height={150} spacing={1} />
      ) : (
        <Grid container spacing={2}>
          {/* Left Column */}
          <Grid
            item
            xs={6}
            sx={{
              '& > *:not(:last-child)': {
                marginBottom: '18px'
              }
            }}
          >
            <Typography>
              <Box component="span" sx={{ fontWeight: '600', fontSize: '12px', lineHeight: '24px', marginRight: '8px' }}>
                Case ID :
              </Box>
              <Box component="span" sx={{ fontWeight: '400', fontSize: '12px', lineHeight: '24px', color: '#009FC7' }}>
                {sessionData?.uniqueId || '-'}
              </Box>
            </Typography>

            <Typography>
              <Box component="span" sx={{ fontWeight: '600', fontSize: '12px', lineHeight: '24px', marginRight: '8px' }}>
                Service User :
              </Box>{' '}
              <Box component="span" sx={{ fontWeight: '400', fontSize: '12px', lineHeight: '24px' }}>
                {sessionData?.userServiceDetails?.personalInfo?.firstName + ' ' + sessionData?.userServiceDetails?.personalInfo?.lastName ||
                  '-'}
              </Box>
            </Typography>

            <Typography>
              <Box component="span" sx={{ fontWeight: '600', fontSize: '12px', lineHeight: '24px', marginRight: '8px' }}>
                Case Owner :
              </Box>{' '}
              <Box component="span" sx={{ fontWeight: '400', fontSize: '12px', lineHeight: '24px' }}>
                {sessionData?.caseOwnerDetails?.[0]?.name}
              </Box>
            </Typography>

            <Typography>
              <Box component="span" sx={{ fontWeight: '600', fontSize: '12px', lineHeight: '24px', marginRight: '8px' }}>
                Date Opened :
              </Box>{' '}
              <Box component="span" sx={{ fontWeight: '400', fontSize: '12px', lineHeight: '24px' }}>
                {sessionData?.caseOpened ? moment(sessionData.caseOpened).format('DD/MM/YYYY') : '-'}
              </Box>
            </Typography>
          </Grid>
          {/* Right Column */}
          <Grid
            item
            xs={6}
            sx={{
              '& > *:not(:last-child)': {
                marginBottom: '18px'
              }
            }}
          >
            <Typography>
              <Box component="span" sx={{ fontWeight: '600', fontSize: '12px', lineHeight: '24px', marginRight: '8px' }}>
                Total hours :
              </Box>{' '}
              <Box
                component="span"
                sx={{
                  fontWeight: '400',
                  fontSize: '12px',
                  lineHeight: '24px',
                  backgroundColor: '#E0F4FF',
                  color: '#26C6F9',
                  borderRadius: 3,
                  p: 0.5,
                  px: 1
                }}
              >
                {formatHoursLabel(sessionData?.totalCaseNoteHours)}
              </Box>
            </Typography>
            <Typography>
              <Box component="span" sx={{ fontWeight: '600', fontSize: '12px', lineHeight: '24px', marginRight: '8px' }}>
                Case Status :
              </Box>
              <StatusChip status={sessionData?.status.charAt(0).toUpperCase() + sessionData?.status.slice(1).toLowerCase()} />
            </Typography>

            <Typography>
              <Box component="span" sx={{ fontWeight: '600', fontSize: '12px', lineHeight: '24px', marginRight: '8px' }}>
                Attachments :
              </Box>{' '}
              {attachmentUrl ? (
                <Tooltip title={attachmentName || 'View attachment'}>
                  <Link
                    href={attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="none"
                    sx={{ display: 'inline-flex', verticalAlign: 'middle', color: '#5f5a57' }}
                  >
                    <DescriptionOutlinedIcon sx={{ fontSize: 28 }} />
                  </Link>
                </Tooltip>
              ) : (
                <Box component="span" sx={{ fontWeight: '400', fontSize: '12px', lineHeight: '24px' }}>
                  0 Files
                </Box>
              )}
            </Typography>

            <Typography>
              <Box component="span" sx={{ fontWeight: '600', fontSize: '12px', lineHeight: '24px', marginRight: '8px' }}>
                Date Closed :
              </Box>{' '}
              <Box component="span" sx={{ fontWeight: '400', fontSize: '12px', lineHeight: '24px' }}>
                {sessionData?.caseClosed ? moment(sessionData.caseClosed).format('DD/MM/YYYY') : '-'}
              </Box>
            </Typography>
          </Grid>
        </Grid>
      )}
    </Card>
  );
};

AboutCaseCard.propTypes = {
  sessionData: PropTypes.shape({
    file: PropTypes.string,
    uniqueId: PropTypes.string,
    totalCaseNoteHours: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    status: PropTypes.string,
    caseOpened: PropTypes.string,
    caseClosed: PropTypes.string,
    userServiceDetails: PropTypes.shape({
      personalInfo: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string
      })
    }),
    caseOwnerDetails: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string
      })
    )
  })
};

export default AboutCaseCard;
