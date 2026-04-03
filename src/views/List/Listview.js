import React from 'react';
import { Card, Grid, IconButton, Tooltip, Typography, Button, Dialog, DialogContent, DialogTitle, Switch, Divider } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import PersonIcon from '@mui/icons-material/Person';
import InfoIcon from '@mui/icons-material/Info';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { getApi } from 'common/apiClient';
import toast from 'react-hot-toast';
import { urls } from 'common/urls';
import { useLocation, useNavigate } from 'react-router-dom';
import SingleRowLoader from 'ui-component/Loader/SingleRowLoader';
import { entityTypeMap } from 'common/constants';
import CustomHeader from 'components/CustomHeader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
const ListView = () => {
  const location = useLocation();
  const { id, listType } = location.state;
  const navigate = useNavigate();
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [listData, setListData] = useState();
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [separateFiles, setSeparateFiles] = useState(false);
  const [combineAddress, setCombineAddress] = useState(false);
  const [addToTimeline, setAddToTimeline] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  });

  const handlePrepareDownload = async () => {
    try {
      const response = await getApi(`${urls.list.fetchListData}/${id}?page=1&limit=100000`);
      const allData = response?.data?.data || [];
      const lType = listType?.toLowerCase();

      let headers = [];
      let csvRows = [];

      if (['service_user', 'donor', 'volunteer'].includes(lType)) {
        headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Address'];

        let records = allData;
        if (combineAddress) {
          const seen = {};
          records = allData.filter((u) => {
            const addr = u?.personalInfo?.address || '';
            if (seen[addr]) return false;
            seen[addr] = true;
            return true;
          });
        }

        csvRows = records.map((u) => [
          u?.personalInfo?.firstName || '',
          u?.personalInfo?.lastName || '',
          u?.personalInfo?.email || '',
          u?.personalInfo?.phone || '',
          u?.personalInfo?.address || ''
        ]);
      } else if (lType === 'donations') {
        headers = ['Transaction ID', 'Amount Paid', 'Payment Method', 'Date'];
        csvRows = allData.map((d) => [
          d?.transactionId || '',
          d?.amountPaid || '',
          d?.paymentMethod || '',
          d?.createdAt ? new Date(d.createdAt).toLocaleDateString() : ''
        ]);
      } else if (lType === 'case') {
        headers = ['Case ID', 'Title', 'Status', 'Date'];
        csvRows = allData.map((c) => [
          c?.uniqueId || c?._id || '',
          c?.title || '',
          c?.status || '',
          c?.createdAt ? new Date(c.createdAt).toLocaleDateString() : ''
        ]);
      } else if (lType === 'services') {
        headers = ['Name', 'Type', 'Date'];
        csvRows = allData.map((s) => [s?.name || '', s?.serviceType || '', s?.createdAt ? new Date(s.createdAt).toLocaleDateString() : '']);
      } else {
        headers = ['ID', 'Name'];
        csvRows = allData.map((item) => [item?._id || '', item?.name || item?.title || item?.transactionId || '']);
      }

      const escape = (val) => `"${String(val).replace(/"/g, '""')}"`;
      const csvContent = [headers.map(escape).join(','), ...csvRows.map((row) => row.map(escape).join(','))].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${listData?.name || 'list'}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadOpen(false);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to prepare download');
    }
  };

  const fetchLists = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize
      });

      //   if (!includeArchives) {
      //     queryParams.append('archive', 'false');
      //   }

      const response = await getApi(`${urls.list.fetchListData}/${id}?${queryParams.toString()}`);
      const users = response?.data?.data || [];
      const pagination = response?.data?.meta || {};

      const formattedUsers = users.map((user, index) => ({
        id: user?._id,
        serialNumber: `#C-${(index + 1).toString().padStart(3, '0')}`,
        name: user?.personalInfo
          ? `${user.personalInfo.firstName} ${user.personalInfo.lastName}`
          : user?.uniqueId || user?.name || user?.transactionId || user?.title
      }));

      setListData(response?.data?.listData);

      setRows(formattedUsers);
      setTotalRows(pagination?.total);
    } catch (error) {
      console.error('Failed to fetch mails:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInfoClick = (rowId) => {
    const type = listType?.toLowerCase();
    if (type === 'service_user' || type === 'volunteer') {
      navigate('/view-people', { state: { id: rowId } });
    } else if (type === 'services') {
      navigate('/view-service', { state: { serviceId: rowId } });
    } else if (type === 'case') {
      navigate('/view-case', { state: { id: rowId } });
    } else if (type === 'donor') {
      navigate('/view-donor', { state: { id: rowId } });
    }
  };

  const columns = [
    {
      field: 'person',
      headerName: 'Details',
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={2} width="100%" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={2}>
            <PersonIcon />
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 450 }}>
                {params.row.name} {params.row.serialNumber}
              </Typography>
            </Box>
          </Stack>

          <Tooltip title="Info" arrow>
            <IconButton onClick={() => handleInfoClick(params.row.id)}>
              <InfoIcon sx={{ color: '#49494c' }} />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    }
  ];

  return (
    <>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography fontWeight="600" fontSize="16px" display="flex" alignItems="center" gap={1}>
            <IconButton onClick={() => navigate(-1)} size="small">
              <ArrowBackIcon />
            </IconButton>
            {'Lists'}
          </Typography>

          <Tooltip title="Download" arrow>
            <IconButton
              onClick={() => setDownloadOpen(true)}
              sx={{
                backgroundColor: '#009fc7',
                color: 'white',
                borderRadius: '10px',
                width: 40,
                height: 40,
                '&:hover': { backgroundColor: '#007da3' }
              }}
            >
              <FileDownloadOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Download Dialog */}
        <Dialog open={downloadOpen} onClose={() => setDownloadOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 600, fontSize: '16px' }}>Download</DialogTitle>
          <Divider />
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="body2">Create separate files for each communication channel</Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <IconButton size="small" onClick={() => setSeparateFiles(false)} sx={{ p: 0 }}>
                    <Typography fontSize="14px" color="error">
                      ✕
                    </Typography>
                  </IconButton>
                  <Switch
                    checked={separateFiles}
                    onChange={(e) => setSeparateFiles(e.target.checked)}
                    size="small"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: '#009fc7' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#009fc7' }
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {separateFiles ? 'Yes' : 'No'}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="body2">Combine people at the same address into one row in the download file</Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <IconButton size="small" onClick={() => setCombineAddress(false)} sx={{ p: 0 }}>
                    <Typography fontSize="14px" color="error">
                      ✕
                    </Typography>
                  </IconButton>
                  <Switch
                    checked={combineAddress}
                    onChange={(e) => setCombineAddress(e.target.checked)}
                    size="small"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: '#009fc7' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#009fc7' }
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {combineAddress ? 'Yes' : 'No'}
                  </Typography>
                </Box>
              </Box>

              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{ border: '2px solid #f5a623', borderRadius: 2, p: 1.5 }}
              >
                <Typography variant="body2">Add Activities to Timeline</Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <IconButton size="small" onClick={() => setAddToTimeline(false)} sx={{ p: 0 }}>
                    <Typography fontSize="14px" color="error">
                      ✕
                    </Typography>
                  </IconButton>
                  <Switch
                    checked={addToTimeline}
                    onChange={(e) => setAddToTimeline(e.target.checked)}
                    size="small"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: '#009fc7' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#009fc7' }
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {addToTimeline ? 'Yes' : 'No'}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" justifyContent="flex-end" gap={2} mt={1}>
                <Button
                  variant="contained"
                  onClick={() => setDownloadOpen(false)}
                  sx={{
                    backgroundColor: '#f5a623',
                    '&:hover': { backgroundColor: '#d4911a' },
                    color: '#fff',
                    borderRadius: '20px',
                    textTransform: 'none'
                  }}
                >
                  Close
                </Button>
                <Button
                  variant="contained"
                  onClick={handlePrepareDownload}
                  sx={{
                    backgroundColor: '#009fc7',
                    '&:hover': { backgroundColor: '#007da3' },
                    borderRadius: '20px',
                    textTransform: 'none'
                  }}
                >
                  Prepare Download
                </Button>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
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
              rowHeight={65}
              getRowId={(row) => row.id}
              checkboxSelection
              onRowSelectionModelChange={(newSelection) => {
                setSelectedIds(newSelection);
              }}
              slots={{
                toolbar: () => (
                  <CustomHeader
                    entityType={entityTypeMap[listType] || 'service_user'}
                    title={`${listType} List`}
                    selectedIds={selectedIds}
                    enableBulkActions={true}
                    exportEnabled={true}
                    extraActions={null}
                    refetchData={fetchLists}
                    isCompletlyDelete={true}
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
    </>
  );
};

export default ListView;
