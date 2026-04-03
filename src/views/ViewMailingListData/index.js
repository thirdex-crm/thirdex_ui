import {
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  Switch,
  Tooltip,
  Typography
} from '@mui/material';
import React from 'react';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { useLocation, useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import CustomHeader from 'components/CustomHeader';
import SingleRowLoader from 'ui-component/Loader/SingleRowLoader';
import PersonIcon from '@mui/icons-material/Person';
import InfoIcon from '@mui/icons-material/Info';
import { useState, useEffect } from 'react';
import { getApi } from 'common/apiClient';
import { urls } from 'common/urls';
import toast from 'react-hot-toast';

const ViewMailingListData = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const location = useLocation();
  const id = location?.state?.id;
  const [selectedIds, setSelectedIds] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  });
  const [mailData, setMailData] = useState();
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [separateFiles, setSeparateFiles] = useState(false);
  const [combineAddress, setCombineAddress] = useState(false);
  const [addToTimeline, setAddToTimeline] = useState(false);

  const handlePrepareDownload = async () => {
    try {
      const response = await getApi(`${urls.mail.fetchMailingListData}/${id}?page=1&limit=100000`);
      const allUsers = response?.data?.users || [];

      let records = allUsers;
      if (combineAddress) {
        const seen = {};
        records = allUsers.filter((u) => {
          const addr = u?.personalInfo?.address || '';
          if (seen[addr]) return false;
          seen[addr] = true;
          return true;
        });
      }

      const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Address'];
      const csvRows = records.map((u) => [
        u?.personalInfo?.firstName || '',
        u?.personalInfo?.lastName || '',
        u?.personalInfo?.email || '',
        u?.personalInfo?.phone || '',
        u?.personalInfo?.address || ''
      ]);

      const escape = (val) => `"${String(val).replace(/"/g, '""')}"`;
      const csvContent = [headers.map(escape).join(','), ...csvRows.map((row) => row.map(escape).join(','))].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${mailData?.name || 'mailing-list'}.csv`);
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

  const fetchMails = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize
      });

      //   if (!includeArchives) {
      //     queryParams.append('archive', 'false');
      //   }

      const response = await getApi(`${urls.mail.fetchMailingListData}/${id}?${queryParams.toString()}`);
      const users = response?.data?.users || [];
      const pagination = response?.data?.meta || {};

      const formattedUsers = users.map((user, index) => ({
        id: user._id,
        serialNumber: `#C-${(index + 1).toString().padStart(3, '0')}`,
        name: `${user.personalInfo.firstName} ${user.personalInfo.lastName}` || ''
      }));

      setMailData(response?.data?.mailData);

      setRows(formattedUsers);
      setTotalRows(pagination?.total);
    } catch (error) {
      console.error('Failed to fetch mails:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <IconButton onClick={() => navigate('/view-people', { state: { id: params.row.id } })}>
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography fontWeight="600" fontSize="16px" display="flex" alignItems="center">
            <IconButton onClick={() => navigate(-1)}>
              <KeyboardBackspaceIcon sx={{ fontSize: 20, color: 'black' }} />
            </IconButton>
            {mailData?.name}
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
      </Grid>

      <Grid container spacing={2} mt={1}>
        <Grid item xs={12}>
          <Card sx={{ height: '500px', width: '100%', backgroundColor: '#ffff' }}>
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
              onRowSelectionModelChange={(newSelection) => {
                setSelectedIds(newSelection);
              }}
              pageSizeOptions={[5, 10, 25, 50]}
              rowHeight={65}
              getRowId={(row) => row.id}
              slots={{
                toolbar: () => (
                  <CustomHeader
                    entityType="mailingList"
                    title={mailData?.name}
                    selectedIds={selectedIds}
                    enableBulkActions={false}
                    exportEnabled={true}
                    extraActions={null}
                    refetchData={fetchMails}
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
        </Grid>
      </Grid>
    </>
  );
};

export default ViewMailingListData;
