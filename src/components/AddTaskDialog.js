/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Box, Grid, Stack, Switch, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, Autocomplete } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { postApi, getApi } from 'common/apiClient';
import { urls } from 'common/urls';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const AddTaskDialog = ({ open, handleClose, fetchTimeLineData }) => {
  const [adminList, setAdminList] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const initialTaskState = {
    details: '',
    assignedTo: '',
    dueDate: '',
    isCompleted: false,
    notification: false
  };

  const [task, setTask] = useState(initialTaskState);
  useEffect(() => {
    const fetchAdminslist = async () => {
      try {
        const response = await getApi(urls.login.getAllAdmin);
        const admins = response?.data?.allAdmins;
        if (Array.isArray(admins)) {
          setAdminList(admins);
        } else if (admins) {
          setAdminList([admins]);
        }
      } catch (error) {
        console.error('Error fetching admins', error);
      }
    };
    fetchAdminslist();
  }, []);

  const handleChange = (field) => (e) => {
    setTask({ ...task, [field]: e.target.value });
  };

  const handleSwitch = (field) => (e) => {
    setTask({ ...task, [field]: e.target.checked });
  };

  const handleSubmit = async () => {
    setIsloading(true);
    try {
      await postApi(urls.dashboard.createTask, {
        ...task,
        assignedTo: task.assignedTo
      });
      setTask(initialTaskState);
      handleClose();
      fetchTimeLineData();
      setIsloading(false);
    } catch (error) {
      console.error('Error saving task:', error);
      setIsloading(false);
    }
  };
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ px: 3, py: 2, borderBottom: '1px solid #eee' }}>
          <Typography variant="h6">{'Create a Task'}</Typography>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={3}>
            <div>
              <Typography fontWeight={600} mb={1}>
                Details
              </Typography>
              <TextField
                fullWidth
                placeholder="Send Email Confirmation"
                value={task?.details}
                onChange={handleChange('details')}
                size="small"
              />
            </div>

            <div>
              <Typography fontWeight={600} mb={1}>
                Assigned To
              </Typography>

              <Autocomplete
                size="small"
                options={adminList}
                getOptionLabel={(option) => option?.name || ''}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                value={adminList.find((admin) => admin._id === task.assignedTo) || null}
                onChange={(event, value) => {
                  setTask((prev) => ({ ...prev, assignedTo: value ? value._id : '' }));
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </div>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Due Date"
                value={task?.dueDate ? dayjs(task.dueDate) : null}
                onChange={(newValue) => {
                  setTask((prev) => ({
                    ...prev,
                    dueDate: newValue ? dayjs(newValue).format('YYYY-MM-DD') : ''
                  }));
                }}
                renderInput={(params) => <TextField {...params} size="small" sx={{ width: '50%' }} />}
              />
            </LocalizationProvider>

            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography fontWeight={600}>Completed</Typography>
                  <Switch checked={task.isCompleted} onChange={handleSwitch('isCompleted')} />
                </Stack>
              </Grid>

              <Grid item>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography fontWeight={600}>Send Notification For This Task</Typography>
                  <Switch checked={task.notification} onChange={handleSwitch('notification')} />
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>

        <Box
          sx={{
            backgroundColor: '#fafafa',
            p: 2,
            borderTop: '1px solid #eee'
          }}
        >
          <Button
            fullWidth
            onClick={handleSubmit}
            startIcon={<AddIcon />}
            disabled={isLoading}
            sx={{
              backgroundColor: '#1976d2',
              color: '#fff',
              borderRadius: 1,
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: '#1565c0'
              },
              '&.Mui-disabled': {
                backgroundColor: '#90caf9',
                color: '#fff'
              }
            }}
          >
            {isLoading ? 'Creating...' : 'Create'}
          </Button>
        </Box>
      </Dialog>
    </>
  );
};

export default AddTaskDialog;
