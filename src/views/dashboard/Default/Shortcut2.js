import React from 'react';
import PropTypes from 'prop-types';
import { Card, Typography } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AirplayIcon from '@mui/icons-material/Airplay';
import { IconSeeding, IconClipboardData } from '@tabler/icons';
import { useNavigate } from 'react-router-dom';

const Shortcut2 = ({ icon, title, path, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (path) {
      navigate(path);
    }
  };

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'row',
        cursor: 'pointer',
        border: '1px solid #00000033',
        justifyContent: 'center',
        alignItems: 'center',
        py: '10px'
      }}
      onClick={handleClick}
    >
      {icon === 1 && <PersonOutlineIcon sx={{ fontSize: '24px' }} />}
      {icon === 2 && <IconClipboardData sx={{ fontSize: '30px' }} />}
      {icon === 3 && <AirplayIcon sx={{ fontSize: '24px' }} />}
      {icon === 4 && <IconSeeding sx={{ fontSize: '30px' }} />}
      <Typography sx={{ ml: '5px' }}>{title}</Typography>
    </Card>
  );
};

Shortcut2.propTypes = {
  icon: PropTypes.number,
  title: PropTypes.string,
  path: PropTypes.string,
  onClick: PropTypes.func
};

export default Shortcut2;
