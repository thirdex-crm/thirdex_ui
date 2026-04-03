/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Stack, Typography, Box, Card, Chip, Tabs, Tab, Grid, IconButton, InputBase } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import FilterPanel from 'components/FilterPanel';
import { urls } from 'common/urls';
import { getApi } from 'common/apiClient';
import { useEffect } from 'react';
import moment from 'moment';
import SingleRowLoader from 'ui-component/Loader/SingleRowLoader';

const dateAddedFilters = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'Last 7 Days' },
  { value: 'month', label: 'Last 30 Days' },
  { value: 'year', label: 'Last 1 Year' }
];

const columns = [
  {
    field: 'title',
    headerName: 'Name',
    flex: 1.5,
    renderCell: (params) => <Typography variant="body1">{params.value || '-'}</Typography>
  },
  {
    field: 'date',
    headerName: 'Date',
    flex: 1,
    renderCell: (params) => (
      <Typography variant="body2" color="textSecondary">
        {params.value || '-'}
      </Typography>
    )
  },
  {
    field: 'age',
    headerName: 'Age',
    flex: 1,
    renderCell: (params) => <Typography variant="body2">{params.value || '-'}</Typography>
  },
  {
    field: 'status',
    headerName: 'Status',
    flex: 1,
    renderCell: (params) => (
      <Chip
        label={params.value || '-'}
        sx={{
          color: params.value === 'APPROVED' ? '#41c048' : 'red',
          backgroundColor: params.value === 'APPROVED' ? '#eefbe5' : '#ffeae9'
        }}
      />
    )
  }
];

export default function TabbedDataGrid() {
  const [tabValue, setTabValue] = useState(0);
  const [showFilter] = useState(true);
  const [dateOpenedFilter, setDateOpenedFilter] = useState('');
  const [namesFilter, setNamesFilter] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [allRows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  });
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Derive the status from the active tab — always server-side filtered
  const tabStatus = tabValue === 0 ? 'APPROVED' : 'REJECTED';

  const getAllResponse = async () => {
    setLoading(true);
    const queryParams = new URLSearchParams({
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
      status: tabStatus
    });
    if (searchQuery) {
      queryParams.append('search', searchQuery);
    }
    if (nameFilter) {
      queryParams.append('title', nameFilter);
    }
    if (dateOpenedFilter) {
      const formattedDate = new Date(dateOpenedFilter).toISOString().split('T')[0];
      queryParams.append('createdAt', formattedDate);
    }
    if (startDate) {
      queryParams.append('startDate', moment(startDate).format('YYYY-MM-DD'));
    }
    if (endDate) {
      queryParams.append('endDate', moment(endDate).format('YYYY-MM-DD'));
    }
    const fromUrl = `${urls?.responses?.submit}?${queryParams.toString()}`;
    const response = await getApi(fromUrl);
    const pagination = response?.data?.meta || { total: 0 };

    const formattedData = (response?.data?.data || []).map((item) => ({
      id: item?._id,
      title: item?.formId?.title || item?.title || '-',
      status: item?.status,
      date: moment(item?.submittedAt).format('L'),
      age: item?.data?.Age || '-'
    }));

    setTotalRows(pagination?.total);
    setRows(formattedData);
    setLoading(false);
  };

  useEffect(() => {
    // Reset to page 0 when tab changes so counts are correct
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [tabValue]);

  useEffect(() => {
    getAllResponse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameFilter, searchQuery, dateOpenedFilter, startDate, endDate, paginationModel, tabStatus]);

  const getResponse = async () => {
    const url = `${urls?.responses?.submit}?limit=10000`;
    const response = await getApi(url);
    const seen = new Set();
    const options = (response?.data?.data || [])
      .filter((item) => item?.status === 'APPROVED' || item?.status === 'REJECTED')
      .reduce((acc, item) => {
        const label = item?.formId?.title || item?.title;
        if (label && !seen.has(label)) {
          seen.add(label);
          acc.push({ value: label, label });
        }
        return acc;
      }, []);
    setNamesFilter(options);
  };
  useEffect(() => {
    getResponse();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const CustomHeader = ({ tabValue, setTabValue }) => {
    return (
      <Box sx={{ height: 'auto', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ borderBottom: '1px solid #4792d3' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ gap: 2 }}>
            <Tab
              label="Accepted"
              value={0}
              sx={{
                marginRight: 2,
                borderRadius: 1,
                textTransform: 'none'
              }}
            />
            <Tab
              label="Rejected"
              value={1}
              sx={{
                marginRight: 2,
                borderRadius: 1,
                textTransform: 'none'
              }}
            />
          </Tabs>
        </Box>
      </Box>
    );
  };

  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between" m={1}>
        <Typography fontWeight="600" fontSize="16px" display="flex" alignItems="center">
          History
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f8f9fa',
            borderRadius: '30px',
            paddingLeft: '16px',
            border: '1px solid #e0e0e0',
            width: '489px',
            height: '40px'
          }}
        >
          <InputBase
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{
              '& .MuiInputBase-input::placeholder': {
                fontSize: '12 px',
                opacity: 1
              },
              '& .MuiInputBase-input': {
                fontSize: '14px'
              },
              '& .MuiInputLabel-root': {
                fontSize: '13px'
              },
              '& .MuiInputBase-root.Mui-focused': {
                backgroundColor: '#e0e0e0'
              },
              flex: 1,
              color: 'text.primary'
            }}
          />
          <IconButton
            // onClick={handleFilter}
            sx={{
              marginRight: '8px',
              width: 18,
              height: 18,
              cursor: 'pointer'
            }}
          >
            <SearchIcon />
          </IconButton>
        </Box>
      </Stack>
      <Grid container spacing={2}>
        <FilterPanel
          showFilter={showFilter}
          dateAddedFilters={dateAddedFilters}
          dateOpenedFilter={dateOpenedFilter}
          setDateOpenedFilter={(value) => setDateOpenedFilter(value)}
          names={namesFilter}
          nameFilter={nameFilter}
          setNameFilter={setNameFilter}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          selectedFilters={['nameFilter', 'dateRange']}
          onReset={() => {
            setNameFilter('');
            setDateOpenedFilter('');
            setStartDate(null);
            setEndDate(null);
            setSearchQuery('');
          }}
        />
        <Grid item xs={9}>
          <Box sx={{ width: '100%' }}>
            <Card sx={{ height: '100vh' }}>
              <DataGrid
                rows={
                  loading
                    ? []
                    : allRows.map((row, index) => ({
                        ...row,
                        sNo: paginationModel.page * paginationModel.pageSize + index + 1
                      }))
                }
                loading={loading}
                columns={columns}
                rowHeight={65}
                getRowId={(row) => row.id}
                // checkboxSelection
                slots={{
                  toolbar: () => <CustomHeader tabValue={tabValue} setTabValue={setTabValue} />,
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
                getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row')}
                sx={{
                  '& .MuiDataGrid-row': {
                    borderBottom: '1px solid #ccc'
                  },
                  '& .MuiDataGrid-columnHeader': {
                    backgroundColor: '#f5f5f5'
                  }
                }}
                rowCount={totalRows}
                pagination
                paginationMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[5, 10, 25, 50]}
              />
            </Card>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
