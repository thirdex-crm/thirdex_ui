import PropTypes from 'prop-types';
import { Grid, IconButton, Tooltip, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid';
import React from 'react';
import { useState } from 'react';
import { getApi } from 'common/apiClient';
import { urls } from 'common/urls';
import { useEffect } from 'react';
import config from '../../../config';
import SingleRowLoader from 'ui-component/Loader/SingleRowLoader';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useGridApiContext } from '@mui/x-data-grid';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
const CaseList = ({ countryOfOriginFilter, selectedName, status, caseId, dateOpenedFilter }) => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5
  });
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [countriesWithFlags, setCountriesWithFlags] = useState([]);

  const columns = [
    {
      field: 'name',
      headerName: 'Attendee Name ',
      width: 120,
      renderCell: (params) => <Typography sx={{ fontSize: '12px' }}>{params?.value || '-'}</Typography>
    },
    {
      field: 'serviceUser',
      headerName: 'Attendee Type',
      width: 140,
      renderCell: () => <Typography sx={{ fontSize: '12px' }}>{'User'}</Typography>
    },
    {
      field: 'nickName',
      headerName: 'Preferred/ Known As',
      width: 100,
      renderCell: (params) => <Typography sx={{ fontSize: '10px' }}>{params?.value || '-'}</Typography>
    },
    {
      field: 'age',
      headerName: 'Age',
      width: 80,
      renderCell: (params) => <Typography sx={{ fontSize: '10px' }}>{params?.value || '-'}</Typography>
    },
    {
      field: 'gender',
      headerName: 'Gender',
      width: 100,
      renderCell: (params) => <Typography sx={{ fontSize: '10px' }}>{params?.value || '-'}</Typography>
    },
    {
      field: 'ethicity',
      headerName: 'Ethnicity',
      width: 100,
      renderCell: (params) => <Typography sx={{ fontSize: '10px' }}>{params?.value || '-'}</Typography>
    },
    {
      field: 'country',
      headerName: 'Country',
      width: 90,
      renderCell: (params) => (
        <Stack direction="row">
          <img src={params.row.countryFlag} alt={params.row.country} style={{ width: 20, height: 20, objectFit: 'contain' }} />
          <Typography sx={{ fontSize: '12px', ml: '5px' }}>{params.row.country || '-'}</Typography>
        </Stack>
      )
    }
  ];

  const CustomHeader = () => {
    const apiRef = useGridApiContext();

    const handleExportCSV = () => {
      apiRef.current.exportDataAsCsv();
    };

    const handlePrint = () => {
      apiRef.current.exportDataAsPrint({
        pageStyle:
          '@page { size: landscape; margin: 10mm; } body { -webkit-print-color-adjust: exact; } .MuiDataGrid-footerContainer { display: none !important; } .MuiDataGrid-scrollbar { display: none !important; } .MuiIconButton-root { display: none !important; }'
      });
    };
    return (
      <Box sx={{ height: '50px', display: 'flex', alignItems: 'center' }}>
        <GridToolbarContainer
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #ddd',
            width: '100%',
            height: '100%',
            padding: '0 12px'
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: '400',
              color: '#333',
              fontSize: '14px',
              lineHeight: '36px'
            }}
          >
            {' '}
            Attendee Report List
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Tooltip title="Print">
                <IconButton size="small" onClick={handlePrint}>
                  <PrintOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Download CSV">
                <IconButton size="small" onClick={handleExportCSV}>
                  <SaveAltOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Open in New Tab">
                <IconButton size="small" onClick={() => window.open(window.location.href, '_blank')}>
                  <OpenInNewIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </GridToolbarContainer>
      </Box>
    );
  };
  useEffect(() => {
    fetch(config.filter_Country)
      .then((res) => res.json())
      .then((data) => {
        const countries = data.map((country) => ({
          value: country?.name?.common,
          label: country?.name?.common,
          flag: country?.flags?.png
        }));
        setCountriesWithFlags(countries);
      });
  }, []);
  function calculateAge(dobString) {
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    return age;
  }

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: 1,
        limit: 1000
      });

      if (countryOfOriginFilter) {
        const selectedCountry = countriesWithFlags.find((country) => country.value === countryOfOriginFilter);
        if (selectedCountry) {
          queryParams.append('country', selectedCountry.label);
        }
      }

      if (selectedName) {
        queryParams.append('name', selectedName);
      }

      if (status) queryParams.append('status', status === 'active');

      if (caseId) queryParams.append('uniqueId', caseId);

      if (dateOpenedFilter && dateOpenedFilter !== '') {
        const formattedDate = new Date(dateOpenedFilter).toISOString().split('T')[0];
        queryParams.append('caseOpened', formattedDate);
      }

      const response = await getApi(`${urls.attendees.fetchWithPagination}?${queryParams.toString()}`);
      const allAttendee = response?.data?.data || [];

      const formattedUsers = allAttendee?.map((user) => {
        const firstName = user?.attendee?.personalInfo?.firstName || '';
        const lastName = user?.attendee?.personalInfo?.lastName || '';
        const countryName = user?.attendee?.contactInfo?.country || '-';
        const matchedCountry = countriesWithFlags.find((c) => c.label.toLowerCase() === countryName.toLowerCase());
        const dob = user?.attendee?.personalInfo?.dateOfBirth;
        const age = dob ? calculateAge(dob) : '-';
        return {
          id: user?._id,
          name: `${firstName} ${lastName}`.trim() || '',
          ethicity: user?.attendee?.personalInfo?.ethnicity || '-',
          gender: user?.attendee?.personalInfo?.gender || '-',
          age: age,
          nickName: user?.attendee?.personalInfo?.nickName || '-',
          country: countryName,
          countryFlag: matchedCountry?.flag || ''
        };
      });

      const pagination = response?.data?.meta || { total: 0 };

      setRows(formattedUsers);
      setTotalRows(pagination?.total);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchInitialData();
  }, [countriesWithFlags, countryOfOriginFilter, selectedName, status, caseId, dateOpenedFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Grid container>
        <Box sx={{ backgroundColor: '#fff', borderRadius: 2, width: '100%' }}>
          <DataGrid
            autoHeight
            rows={loading ? [] : rows}
            columns={columns}
            loading={loading}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            rowCount={totalRows}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            rowHeight={55}
            getRowId={(rows) => rows?.id}
            slots={{
              toolbar: () => <CustomHeader />,
              loadingOverlay: () => (
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'self-start',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)'
                  }}
                >
                  <SingleRowLoader />
                </Box>
              ),
              noRowsOverlay: () => (loading ? null : <Box sx={{ padding: 2, textAlign: 'center' }}>No data available.</Box>)
            }}
            components={{
              Toolbar: () => <CustomHeader />
            }}
            checkboxSelection
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#eeeeee',
                fontSize: '0.75rem'
              },
              '& .MuiDataGrid-checkboxInput': {
                padding: '2px',
                transform: 'scale(0.8)'
              }
            }}
          />
        </Box>
      </Grid>
    </>
  );
};

CaseList.propTypes = {
  countryOfOriginFilter: PropTypes.string,
  selectedName: PropTypes.string,
  status: PropTypes.string,
  caseId: PropTypes.string,
  dateOpenedFilter: PropTypes.string
};

export default CaseList;
