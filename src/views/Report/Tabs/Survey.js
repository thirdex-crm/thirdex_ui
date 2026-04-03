import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Box, Tabs, Tab, Grid, Tooltip, IconButton, Typography } from '@mui/material';
import Chart from './SurveyChart';
import CaseList from './SurveyList';
import FilterPanel from 'components/FilterPanel';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import PrintStyles from 'themes/print.js';
const Survey = ({ countryOfOriginFilter, selectedName, status, caseId, dateOpenedFilter, FilterPanelProp }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Grid>
      <Tabs value={value} onChange={handleChange} sx={{ mb: 2 }} TabIndicatorProps={{ style: { backgroundColor: '#666CFF' } }}>
        <Tab
          label="Chart View"
          sx={{
            marginRight: 2,
            borderRadius: 1,
            textTransform: 'none',
            color: '#2E2E30E5',
            '&.Mui-selected': {
              color: '#666CFF'
            }
          }}
        />
        <Tab
          label="List View"
          sx={{
            marginRight: 2,
            borderRadius: 1,
            textTransform: 'none',
            color: '#2E2E30E5',
            '&.Mui-selected': {
              color: '#666CFF'
            }
          }}
        />
      </Tabs>

      <Box>
        {value === 0 && (
          <>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 2,
                mb: 1,
                flexWrap: 'wrap',
                gap: 1
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  flexWrap: 'wrap'
                }}
              >
                <Typography variant="body2" fontSize={20}>
                  Key Indicators Of Concern
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Tooltip title="Print">
                  <IconButton size="small" onClick={() => window.print()}>
                    <PrintOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <Box
              sx={{
                px: 0,
                display: 'flex',
                gap: 4,
                alignItems: 'flex-start',
                width: '100%',
                flexWrap: 'nowrap'
              }}
            >
              <Box
                sx={{
                  width: 300,
                  flexShrink: 0,
                  '& .MuiGrid-root': {
                    width: '100% !important',
                    minWidth: '300px !important'
                  }
                }}
              >
                <FilterPanel {...FilterPanelProp} />
              </Box>
              <PrintStyles targetId="print-chart" />
              <Box
                id="print-chart"
                sx={{
                  flexGrow: 2,
                  flexShrink: 1,
                  minWidth: 0
                }}
              >
                <Chart
                  countryOfOriginFilter={countryOfOriginFilter}
                  selectedName={selectedName}
                  status={status}
                  caseId={caseId}
                  dateOpenedFilter={dateOpenedFilter}
                />
              </Box>
            </Box>
          </>
        )}
        {value === 1 && (
          <Box
            sx={{
              px: 0,
              display: 'flex',
              gap: 4,
              alignItems: 'flex-start',
              width: '100%',
              flexWrap: 'nowrap'
            }}
          >
            <Box
              sx={{
                width: 300,
                flexShrink: 0,
                '& .MuiGrid-root': {
                  width: '100% !important',
                  minWidth: '300px !important'
                }
              }}
            >
              <FilterPanel {...FilterPanelProp} />
            </Box>
            <Box
              sx={{
                flexGrow: 2,
                flexShrink: 1,
                minWidth: 0
              }}
            >
              <CaseList countryOfOriginFilter={countryOfOriginFilter} selectedName={selectedName} status={status} />
            </Box>
          </Box>
        )}
      </Box>
    </Grid>
  );
};

Survey.propTypes = {
  countryOfOriginFilter: PropTypes.string,
  selectedName: PropTypes.string,
  status: PropTypes.string,
  caseId: PropTypes.string,
  dateOpenedFilter: PropTypes.string,
  FilterPanelProp: PropTypes.any
};

export default Survey;
