import { Grid, Typography, IconButton, InputBase } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useGridApiContext } from '@mui/x-data-grid';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import { Box, Stack } from '@mui/system';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import flag from '../../../assets/images/Flag_of_India.svg';
import { useState } from 'react';
import { getApi } from 'common/apiClient';
import { urls } from 'common/urls';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import CheckIcon from '@mui/icons-material/Check';
import SingleRowLoader from 'ui-component/Loader/SingleRowLoader';
import config from '../../../config';

const CaseList = ({ countryOfOriginFilter, selectedName, status, dateOpenedFilter1 }) => {
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  });
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [countriesWithFlags, setCountriesWithFlags] = useState([]);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryParams = new URLSearchParams({
          page: paginationModel.page + 1,
          limit: paginationModel.pageSize
        });

        if (selectedName) {
          queryParams.append('name', selectedName);
        }

        // countryOfOriginFilter is already a Configuration ObjectId (set from configCountries in Report/index.js)
        if (countryOfOriginFilter) queryParams.append('country', countryOfOriginFilter);

        if (status) queryParams.append('status', status === 'active');

        if (dateOpenedFilter1 && dateOpenedFilter1 !== '') {
          const formattedDate = new Date(dateOpenedFilter1).toISOString().split('T')[0];
          queryParams.append('date', formattedDate);
        }

        const response = await getApi(`${urls.session.fetchWithPagination}?${queryParams.toString()}`);

        const data = response?.data?.data || [];
        const pagination = response?.data?.meta || { total: 0 };

        const transformedRows = data.map((item, index) => {
          // serviceuser refs admin model — fields are flat (name/firstName/lastName, no personalInfo)
          const su = item?.serviceuser;
          const fullName = `${su?.firstName || ''} ${su?.lastName || ''}`.trim() || su?.name || '-';
          // country is a populated Configuration object — extract its name
          const countryObj = item?.country;
          const countryName = countryObj && typeof countryObj === 'object' ? countryObj?.name : (countryObj || '-');
          const matchedCountry = countriesWithFlags.find((c) => c.label.toLowerCase() === (countryName || '').toLowerCase());

          return {
            id: item._id || index,
            sNo: index + 1,
            serviceUser: fullName,
            dob: item.date ? dayjs(item.date).format('DD/MM/YYYY') : '-',
            status: item.isActive ? 'Active' : 'Inactive',
            country: countryName || '-',
            countryFlag: matchedCountry?.flag || '',
            owner: item.serviceId?.name || '-'
          };
        });

        setTotalRows(pagination?.total);
        setRows(transformedRows);
      } catch (error) {
        console.error('API Error:', error);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [countriesWithFlags, paginationModel, countryOfOriginFilter, selectedName, status, dateOpenedFilter1]);

  const columns = [
    {
      field: 'sNo',
      headerName: '#',
      width: 60,
      renderCell: (params) => <Typography sx={{ fontSize: '12px' }}>{params?.value}</Typography>
    },
    {
      field: 'serviceUser',
      headerName: 'Service User',
      flex: 1,
      renderCell: (params) => <Typography sx={{ fontSize: '12px' }}>{params?.value || '-'}</Typography>
    },
    {
      field: 'dob',
      headerName: 'Session Date',
      flex: 1,
      renderCell: (params) => <Typography sx={{ fontSize: '12px' }}>{params?.value || '-'}</Typography>
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => {
        const val = params.value;
        const colorMap = {
          Active:   { bg: '#E6F9F0', color: '#1A7A4A', border: '#A3D9BC' },
          Inactive: { bg: '#FEE8E8', color: '#C0392B', border: '#F5AEAE' }
        };
        const style = colorMap[val] || { bg: '#F0F0F0', color: '#737586', border: '#ccc' };
        return (
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            px: 1, py: 0.3, borderRadius: '12px',
            backgroundColor: style.bg, border: `1px solid ${style.border}`
          }}>
            <CheckIcon sx={{ fontSize: '11px', color: style.color }} />
            <Typography sx={{ fontSize: '11px', fontWeight: 600, color: style.color, lineHeight: 1 }}>
              {val || '-'}
            </Typography>
          </Box>
        );
      }
    },
    {
      field: 'country',
      headerName: 'Country',
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center">
          <img src={params.row.countryFlag} alt={params.row.country} style={{ width: 20, height: 20, objectFit: 'contain' }} />
          <Typography sx={{ ml: '5px', fontSize: '12px' }}>{params?.value || '-'}</Typography>
        </Stack>
      )
    },
    {
      field: 'owner',
      headerName: 'Service',
      flex: 1,
      renderCell: (params) => <Typography sx={{ fontSize: '12px' }}>{params?.value || '-'}</Typography>
    }
  ];

  const CustomHeader = () => {
     const apiRef = useGridApiContext();

    const handleExportCSV = () => {
      apiRef.current.exportDataAsCsv();
    };

    const handlePrint = () => {
      apiRef.current.exportDataAsPrint();
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
              fontWeight: 400,
              color: '#5f5955',
              fontSize: '13px'
            }}
          >
            Session Report List
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
           

             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <PrintOutlinedIcon sx={{ cursor: 'pointer' }} onClick={handlePrint} />
            <SaveAltOutlinedIcon sx={{ cursor: 'pointer' }} onClick={handleExportCSV} />
            <OpenInNewIcon sx={{ cursor: 'pointer' }} onClick={() => window.open(window.location.href, '_blank')} />
          </Box>
          </Box>
        </GridToolbarContainer>
      </Box>
    );
  };

  return (
    <Grid container>
      <Box sx={{ backgroundColor: '#fff', borderRadius: 2 }} height="100vh" width="100%">
        <DataGrid
          rows={
            loading
              ? []
              : rows.map((row, index) => ({
                  ...row,
                  sNo: paginationModel.page * paginationModel.pageSize + index + 1
                }))
          }
          columns={columns}
          rowCount={totalRows}
          loading={loading}
          pagination
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 25, 50]}
          rowHeight={65}
          getRowId={(row) => row.id}
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
  );
};

export default CaseList;
