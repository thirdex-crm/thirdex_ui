import PropTypes from 'prop-types';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useGridApiContext } from '@mui/x-data-grid';
import { Grid, IconButton, Tooltip, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid';
import React from 'react';
import { getApi } from 'common/apiClient';
import { urls } from 'common/urls';
import { useState } from 'react';
import { useEffect } from 'react';
import config from '../../../config';
import SingleRowLoader from 'ui-component/Loader/SingleRowLoader';

const ServiceList = ({ countryOfOriginFilter, selectedName, status, caseId, dateOpenedFilter }) => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5
  });
  const [loading, setLoading] = useState(true);
  const [includeArchives] = useState(false);
  const [rows, setRows] = useState([]);
  const [countriesWithFlags, setCountriesWithFlags] = useState([]);
  const [totalRows, setTotalRows] = useState(0);

  const columns = [
    {
      field: 'uniqueId',
      headerName: 'Case ID',
      width: 100,
      align: 'center',
      renderCell: (params) => <Typography sx={{ fontSize: '12px' }}>{params?.value || '-'}</Typography>
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
      renderCell: (params) => (
        <Typography sx={{ fontSize: '12px' }}>
          {params?.row?.firstName || ''}
          {params?.row?.firstName && params?.row?.lastName ? ' ' : ''}
          {params?.row?.lastName || ''}
          {params?.value || ''}
        </Typography>
      )
    },
    {
      field: 'dob',
      headerName: 'DOB',
      width: 100,
      renderCell: (params) => <Typography sx={{ fontSize: '12px' }}>{params?.value || '-'}</Typography>
    },
    {
      field: 'age',
      headerName: 'Age',
      width: 70,
      renderCell: (params) => (
        <Box
          sx={{
            width: 35,
            height: 30,
            borderRadius: '40%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            border: '1px solid #d4d4d4'
          }}
        >
          {params.value || '-'}
        </Box>
      )
    },

    {
      field: 'country',
      headerName: 'Country',
      width: 150,
      renderCell: (params) => (
        <Stack direction="row">
          <img src={params.row.countryFlag} alt={params.row.country} style={{ width: 20, height: 20, objectFit: 'contain' }} />
          <Typography sx={{ fontSize: '12px', ml: '5px' }}>{params.row.country || '-'}</Typography>
        </Stack>
      )
    },
    {
      field: 'gender',
      headerName: 'Gender',
      width: 100,
      renderCell: (params) => <Typography sx={{ fontSize: '12px' }}>{params?.value || '-'}</Typography>
    },
    {
      field: 'ethicity',
      headerName: 'Ethicity',
      width: 100,
      renderCell: (params) => <Typography sx={{ fontSize: '12px' }}>{params?.value || '-'}</Typography>
    },
    {
      field: 'no',
      headerName: 'ContactNo.',
      width: 150,
      renderCell: (params) => <Typography sx={{ fontSize: '12px' }}>{params?.value || '-'}</Typography>
    }
  ];

  useEffect(() => {
    fetch(config.filter_Country)
      .then((res) => res.json())
      .then((data) => {
        const countries = data.map((country) => ({
          value: country?.name?.common || country?.value,
          label: country?.name?.common || country?.name,
          flag: country?.flags?.png || country?.flags
        }));

        setCountriesWithFlags(countries);
      })
      .catch((error) => console.error('Error fetching countries:', error));
  }, []);
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
              color: '#333',
              fontSize: '14px',
              lineHeight: '36px',
              fontWeight: '400'
            }}
          >
            Service User Report List
          </Typography>

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
        </GridToolbarContainer>
      </Box>
    );
  };

  const getAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const fetchpeople = async () => {
    if (!countriesWithFlags.length) return;

    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: 1,
        limit: 1000,
        role: 'service_user'
      });

      if (!includeArchives) {
        queryParams.append('archive', 'false');
      }
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
        queryParams.append('dateOfBirth', formattedDate);
      }

      const response = await getApi(`${urls.serviceuser.fetchWithPagination}?${queryParams.toString()}`);
      const allUser = response?.data?.data || [];

      const pagination = response?.data?.meta || { total: 0 };

      const formattedUsers = allUser?.map((user, index) => {
        const dob = user.personalInfo?.dateOfBirth ? new Date(user.personalInfo?.dateOfBirth).toLocaleDateString() : '-';
        const age = dob !== '-' ? getAge(dob) : '-';
        const countryName = user?.contactInfo?.country || '-';

        const matchedCountry = countriesWithFlags.find((c) => c.label.toLowerCase() === countryName.toLowerCase());

        const uniqueId = user?.uniqueId;
        return {
          id: user._id,
          serialNumber: `#C-${(index + 1).toString().padStart(3, '0')}`,
          userid: '-',
          firstName: user.personalInfo?.firstName || '-',
          lastName: user.personalInfo?.lastName || '-',
          dob,
          age,
          uniqueId,
          country: countryName,
          countryFlag: matchedCountry?.flag || '',
          ethicity: user.personalInfo?.ethnicity || '-',
          no: user.contactInfo?.phone || '-',
          gender: user.personalInfo?.gender || ''
        };
      });

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
    if (countriesWithFlags.length > 0) {
      fetchpeople();
    }
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
            checkboxSelection
            components={{
              Toolbar: () => <CustomHeader />
            }}
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

ServiceList.propTypes = {
  countryOfOriginFilter: PropTypes.string,
  selectedName: PropTypes.string,
  status: PropTypes.string,
  caseId: PropTypes.string,
  dateOpenedFilter: PropTypes.string
};

export default ServiceList;
