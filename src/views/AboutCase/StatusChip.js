import PropTypes from 'prop-types';
import { Chip } from '@mui/material';

const StatusChip = ({ status }) => {
  const normalizedStatus = status;
  let color = '';
  let bgColor = '';

  switch (normalizedStatus) {
    case 'Open':
    case 'open':
      // icon = (
      //   <Box
      //     sx={{
      //       display: 'flex',
      //       alignItems: 'center',
      //       justifyContent: 'center',
      //       fontSize: iconSize,
      //       color: '#2e7d32'
      //     }}
      //   >
      //     <CheckIcon fontSize="inherit" />
      //   </Box>
      // );
      //   color = '#2e7d32';
      bgColor = '#91FD91';
      break;
    case 'Closed':
    case 'closed':
    case 'Close':
    case 'close':
      // icon = (
      //   <Box
      //     sx={{
      //       display: 'flex',
      //       alignItems: 'center',
      //       justifyContent: 'center',
      //       fontSize: iconSize,
      //       color: '#c62828'
      //     }}
      //   >
      //     <CloseIcon fontSize="inherit" />
      //   </Box>
      // );
      //   color = '#c62828';
      bgColor = '#FDA191';
      break;
    case 'Pending':
    case 'pending':
      // icon = (
      //   <Box
      //     sx={{
      //       display: 'flex',
      //       alignItems: 'center',
      //       justifyContent: 'center',
      //       fontSize: iconSize,
      //       color: '#f9a825'
      //     }}
      //   >
      //     <LoopIcon fontSize="inherit" />
      //   </Box>
      // );
      //   color = '#f9a825';
      bgColor = '#FFF68D';
      break;
    default:
      color = 'gray';
      bgColor = 'transparent';
  }

  return (
    <Chip
      label={normalizedStatus || '-'}
      variant="filled"
      size="small"
      sx={{
        height: 24,
        fontSize: '12px',
        paddingRight: '4px',
        paddingLeft: '4px',
        borderRadius: '12px',
        borderColor: color,
        backgroundColor: bgColor,
        color: color,
        fontWeight: '400',
        ml: 1
      }}
    />
  );
};

StatusChip.propTypes = {
  status: PropTypes.string
};

export default StatusChip;
