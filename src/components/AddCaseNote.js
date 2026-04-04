import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, TextField, FormControlLabel, Button, Grid, Modal, MenuItem } from '@mui/material';
import AntSwitch from 'components/AntSwitch';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useNavigate } from 'react-router-dom';
import { getApi, postApi, updateApi } from 'common/apiClient';
import { urls } from 'common/urls';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { decodedToken } from 'utils/adminData';

const HOURS_OPTIONS = Array.from({ length: 96 }, (_, index) => ((index + 1) * 0.25).toFixed(2));

const formatHoursOption = (value) => {
  const numericValue = Number(value);
  const wholeHours = Math.floor(numericValue);
  const minutes = Math.round((numericValue - wholeHours) * 60);

  return `${wholeHours} hr${wholeHours === 1 ? '' : 's'} ${minutes} min`;
};

const CaseNoteDialog = ({ open, fetchdata, handleClose, onSubmit, title = 'Add Case Note', caseid, caseNoteId, initialData }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: dayjs(),
    hours: '',
    notes: '',
    contactPurpose: '',
    subject: '',
    toggle: false,
    file: null,
    caseId: initialData?.caseId?._id || initialData?.caseId || caseid || ''
  });

  const [contactTypeEntry, setContactTypeEntry] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [caseNoteData, setCaseNoteData] = useState();

  const fileInputRef = useRef();

  useEffect(() => {
    if (initialData) {
      setCaseNoteData(initialData);
    }

    const fetchCaseNoteData = async () => {
      try {
        const res = await getApi(urls.casenote.getById.replace(':id', caseNoteId));
        setCaseNoteData(res?.data?.caseNoteData);
      } catch (err) {
        console.error('Error fetching case note data:', err);
      }
    };

    if (caseNoteId) {
      fetchCaseNoteData();
    } else if (!initialData) {
      setCaseNoteData(undefined);
    }
  }, [caseNoteId, initialData]);

  useEffect(() => {
    if (caseNoteData) {
      setFormData((prev) => ({
        ...prev,
        date: caseNoteData.date ? dayjs(caseNoteData.date) : dayjs(),
        hours: caseNoteData.time || '',
        notes: caseNoteData.notes || caseNoteData.note || '',
        subject: caseNoteData.subject || '',
        contactPurpose: caseNoteData.configurationId?._id || '',
        toggle: caseNoteData.access ?? false,
        caseId: caseNoteData.caseId?._id || caseNoteData.caseId || caseid || '',
        file: null // don't prefill file
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        date: dayjs(),
        hours: '',
        notes: '',
        subject: '',
        contactPurpose: '',
        toggle: false,
        file: null,
        caseId: initialData?.caseId?._id || initialData?.caseId || caseid || ''
      }));
    }
  }, [caseNoteData, caseid, initialData]);

  useEffect(() => {
    const fetchContactTypes = async () => {
      try {
        const res = await getApi(urls.configuration.fetch);
        const options = res?.data?.allConfiguration?.filter((item) => item.configurationType === 'Contact Types');
        setContactTypeEntry(options || []);
      } catch (err) {
        console.error('Error fetching contact types:', err);
      }
    };
    fetchContactTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleToggle = (e) => {
    setFormData((prev) => ({ ...prev, toggle: e.target.checked }));
  };

  const handleSubmit = async () => {
    const newErrors = {};
    if (!formData.hours) newErrors.hours = 'Hours are required';
    if (!formData.notes?.trim()) newErrors.notes = 'Case Notes are required';
    if (!formData.subject?.trim()) newErrors.subject = 'Subject is required';
    if (!formData.contactPurpose) newErrors.contactPurpose = 'Contact Type is required';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    try {
      const userId = decodedToken?.id;
      const form = new FormData();

      form.append('date', formData.date?.toISOString?.() || '');
      form.append('time', formData.hours);
      form.append('note', formData.notes);
      form.append('subject', formData.subject);
      form.append('access', formData.toggle);
      form.append('caseId', formData.caseId);
      form.append('configurationId', formData.contactPurpose);
      form.append('createdBy', userId);

      if (formData.file) form.append('file', formData.file);

      let response;

      if (caseNoteData?._id) {
        response = await updateApi(`${urls.casenote.update}${caseNoteData._id}`, form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Case note updated successfully!');
        navigate(-1);
      } else {
        response = await postApi(urls.casenote.create, form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Case note added successfully!');
      }

      onSubmit(response.data);
      fetchdata?.();

      setFormData({
        date: dayjs(),
        hours: '',
        notes: '',
        contactPurpose: '',
        subject: '',
        toggle: false,
        file: null,
        caseId: initialData?.caseId?._id || initialData?.caseId || caseid || ''
      });

      if (fileInputRef.current) fileInputRef.current.value = null;
    } catch (err) {
      console.error('Error submitting case note:', err);
      toast.error('Failed to save case note.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="case-note-dialog">
      <Box sx={{ bgcolor: 'background.paper', p: 3, mx: 'auto', mt: '10%', borderRadius: 2, boxShadow: 24, width: '60%' }}>
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        <Grid container spacing={2} mt={1} mb={2}>
          <Grid item xs={12} sm={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date"
                value={formData.date}
                onChange={(newValue) => setFormData((prev) => ({ ...prev, date: newValue }))}
                renderInput={(params) => <TextField {...params} fullWidth size="small" />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              label="Hours Spent"
              variant="outlined"
              size="small"
              fullWidth
              value={formData.hours}
              name="hours"
              onChange={handleChange}
              error={Boolean(errors.hours)}
              helperText={errors.hours}
            >
              {HOURS_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {formatHoursOption(option)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              size="small"
              label="Contact Type"
              name="contactPurpose"
              value={formData.contactPurpose}
              onChange={handleChange}
              error={Boolean(errors.contactPurpose)}
              helperText={errors.contactPurpose}
            >
              {contactTypeEntry.map((option) => (
                <MenuItem key={option._id} value={option._id}>
                  {option.name.charAt(0).toUpperCase() + option.name.slice(1)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <TextField
          fullWidth
          multiline
          rows={1}
          size="small"
          label="Subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          sx={{ mb: 2 }}
          inputProps={{ maxLength: 50 }}
          error={Boolean(errors.subject) || formData.subject.length > 50}
          helperText={errors.subject || (formData.subject.length > 50 ? 'Max 50 characters allowed' : '')}
        />
        <TextField
          fullWidth
          multiline
          size="small"
          rows={3}
          label="Case Notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          sx={{ mb: 2 }}
          inputProps={{ maxLength: 1000 }}
          error={Boolean(errors.notes) || formData.notes.length > 1000}
          helperText={errors.notes || (formData.notes.length > 1000 ? 'Max 1000 characters allowed' : '')}
        />

        <Box mt={1} display="flex" justifyContent="space-between" alignItems="center">
          <FormControlLabel
            control={<AntSwitch checked={formData.toggle} onChange={handleToggle} />}
            label="Restrict Access?"
            labelPlacement="start"
            sx={{ '.MuiFormControlLabel-label': { mr: 1 } }}
          />
          <Box display="flex" gap={2}>
            <Button variant="outlined" color="error" onClick={handleClose} disabled={isLoading}>
              CANCEL
            </Button>
            <Button variant="contained" sx={{ background: '#053146' }} onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Saving...' : caseNoteData?._id ? 'UPDATE CASE' : 'SAVE CASE'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

CaseNoteDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  fetchdata: PropTypes.func,
  handleClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  title: PropTypes.string,
  caseid: PropTypes.string,
  caseNoteId: PropTypes.string,
  initialData: PropTypes.object
};

export default CaseNoteDialog;
