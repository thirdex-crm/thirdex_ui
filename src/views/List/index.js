import React from 'react';
import { Card, Grid, IconButton, Tooltip, Typography, InputBase } from '@mui/material';
import { Box, Stack } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';

import AddIcon from '@mui/icons-material/Add';

import InfoIcon from '@mui/icons-material/Info';

import FilterPanel from 'components/FilterPanel';
import { getApi } from 'common/apiClient';
import { urls } from 'common/urls';
import { useNavigate } from 'react-router-dom';

import SingleRowLoader from 'ui-component/Loader/SingleRowLoader';

import CustomHeader from 'components/CustomHeader';
import ListTypeDialog from './listTypeDialog';

const List = () => {
  const navigate = useNavigate();
  const [showFilter] = useState(true);
  const [, setListFilters] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [rows, setRows] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [includeArchives, setIncludeArchives] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,

    pageSize: 10
  });

  const handleFilter = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();

      if (searchQuery && searchQuery.trim() !== '') {
        queryParams.append('search', searchQuery.trim());
      }

      if (startDate) {
        queryParams.append('startDate', new Date(startDate).toISOString());
      }
      if (endDate) {
        queryParams.append('endDate', new Date(endDate).toISOString());
      }

      queryParams.append('page', paginationModel.page + 1);
      queryParams.append('limit', paginationModel.pageSize);
      if (!includeArchives) {
        queryParams.append('archive', 'false');
      }

      const url = `${urls.list.fetchWithPagination}?${queryParams.toString()}`;

      const response = await getApi(url);

      const allList = response?.data?.data || [];
      const pagination = response?.data?.meta || { total: 0 };

      const formattedUsers = allList?.map((user, index) => {
        return {
          id: user._id,
          serialNumber: `#C-${(index + 1).toString().padStart(3, '0')}`,
          name: user.name || '',
          createdAt: user?.createdAt,
          listType: user?.listType
        };
      });

      setRows(formattedUsers);
      setTotalRows(pagination?.total);
      setIsFiltered(true);
    } catch (error) {
      console.error('Failed to fetch filtered lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLists = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize
      });

      if (!includeArchives) {
        queryParams.append('archive', 'false');
      }

      if (startDate) {
        queryParams.append('startDate', new Date(startDate).toISOString());
      }
      if (endDate) {
        queryParams.append('endDate', new Date(endDate).toISOString());
      }

      const response = await getApi(`${urls.list.fetchWithPagination}?${queryParams.toString()}`);
      const allLists = response?.data?.data || [];
      const pagination = response?.data?.meta || {};

      const formattedUsers = allLists.map((user, index) => ({
        id: user?._id,
        serialNumber: `#C-${(index + 1).toString().padStart(3, '0')}`,
        name: user?.name || '',
        createdAt: user?.createdAt,
        listType: user?.listType
      }));

      setRows(formattedUsers);
      setTotalRows(pagination?.total);

      const uniqueList = [...new Set(allLists.map((item) => item.name).filter(Boolean))].map((value) => ({
        value,
        label: value
      }));

      setListFilters(uniqueList);
    } catch (error) {
      console.error('Failed to fetch lists:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [includeArchives]);

  useEffect(() => {
    if (searchQuery || isFiltered || startDate || endDate) {
      handleFilter();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, startDate, endDate]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setIsFiltered(false);
    setIncludeArchives(false);
    fetchLists();
  };

  useEffect(() => {
    fetchLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel]);
  const columns = [
    {
      field: 'name',
      headerName: 'List Name',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Typography fontWeight={500}>{params.row.name}</Typography>
          <Typography variant="body2" color="textSecondary">
            Created on date {params.row.createdAt}
          </Typography>
        </Box>
      )
    },
    {
      field: 'actions',
      headerName: '',
      width: 50,
      sortable: false,
      renderCell: () => (
        <Tooltip title="Info" arrow>
          <IconButton>
            <InfoIcon sx={{ color: '#49494c' }} />
          </IconButton>
        </Tooltip>
      )
    }
  ];

  const handleRowClick = (id, listType) => {
    navigate('/list-view', { state: { id: id, listType: listType } });
  };
  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Tooltip title="Add" arrow>
          <IconButton
            onClick={() => setOpenDialog(true)}
            sx={{
              backgroundColor: '#009fc7',
              textTransform: 'none',
              whiteSpace: 'nowrap',
              paddingInline: '15px',
              paddingBlock: '7px',
              borderRadius: '10px',
              width: '305px',
              height: '35px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              gap: 1,
              fontSize: '14px',
              padding: '22px',
              '&:hover': {
                backgroundColor: '#009fc7'
              }
            }}
          >
            Add List <AddIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Stack direction="row" spacing={2} alignItems="center">
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
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleFilter();
                }
              }}
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
              onClick={handleFilter}
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
      </Stack>

      <Grid container spacing={2}>
        <FilterPanel
          showFilter={showFilter}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          includeArchives={includeArchives}
          setIncludeArchives={setIncludeArchives}
          selectedFilters={['dateRange', 'includeArchives']}
          onReset={handleReset}
        />
        <Grid item xs={9}>
          <Box width="100%">
            <Card style={{ height: '100vh' }}>
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
                loading={loading}
                checkboxSelection
                onRowSelectionModelChange={(newSelection) => {
                  setSelectedIds(newSelection);
                }}
                rowHeight={65}
                onRowClick={(params) => handleRowClick(params.row.id, params?.row?.listType)}
                disableColumnMenu
                getRowId={(row) => row.id}
                slots={{
                  toolbar: () => (
                    <CustomHeader
                      entityType={'list'}
                      title={`All List`}
                      selectedIds={selectedIds}
                      enableBulkActions={true}
                      exportEnabled={true}
                      extraActions={null}
                      isCompletlyDelete={true}
                      refetchData={fetchLists}
                      //isShowArchive={false}
                      isShowTags={true}
                    />
                  ),
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
                paginationMode="server"
                rowCount={totalRows}
                pageSizeOptions={[10, 25, 50]}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                sx={{
                  '& .MuiDataGrid-columnHeaders': {
                    display: 'none'
                  },
                  '& .MuiDataGrid-cell': {
                    textAlign: 'left',
                    fontSize: '14px'
                  }
                }}
                disableSelectionOnClick
              />
            </Card>
          </Box>
        </Grid>
      </Grid>
      <ListTypeDialog open={openDialog} onClose={() => setOpenDialog(false)} />
    </>
  );
};

export default List;
