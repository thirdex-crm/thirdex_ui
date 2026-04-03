import React, { useState } from 'react';
import {
  Card,
  Grid,
  TextField,
  Typography,
  Button,
  Select,
  MenuItem,
  IconButton,
  Box,
  Paper,
  FormControl,
  InputLabel,
  FormHelperText
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Delete, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { postApi, getApi } from 'common/apiClient';
import toast from 'react-hot-toast';
import { urls } from 'common/urls';
import { useEffect } from 'react';
import { Autocomplete } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { caseFieldOptions, ethnicityOptions, fieldOptions, serviceFieldOptions, transactionFieldOptions } from 'common/constants';

const AddListForm = () => {
  const location = useLocation();
  const state = location.state;
  const navigate = useNavigate();
  const [isLoading, setIsloading] = useState(false);
  const [tagOptions, setTagOptions] = useState([]);
  const [filterFieldOptions, setFilterFieldOptions] = useState([]);
  const setFieldOption = () => {
    if (state?.type == 'service_user' || state?.type == 'donor' || state?.type == 'volunteer') {
      setFilterFieldOptions(fieldOptions);
    } else if (state?.type == 'donations') {
      setFilterFieldOptions(transactionFieldOptions);
    } else if (state?.type == 'case') {
      setFilterFieldOptions(caseFieldOptions);
    } else if (state?.type == 'services') {
      setFilterFieldOptions(serviceFieldOptions);
    } else {
      setFilterFieldOptions([]);
    }
  };

  // Map list type to TagCategory appliedTo label
  const getAppliedTo = () => {
    const map = {
      service_user: 'Service Users',
      volunteer: 'Volunteers',
      services: 'Services',
      case: 'Cases',
      donor: 'Donors'
    };
    return map[state?.type] || null;
  };
  const { handleSubmit, control } = useForm({
    mode: 'all',
    defaultValues: {
      listName: '',
      tags: [],
      includeArchived: false
    }
  });

  const [filters, setFilters] = useState([]);

  const handleFilterChange = (id, field, value) => {
    setFilters((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              [field]: value,
              errors: {
                ...f.errors,
                [field]: false
              }
            }
          : f
      )
    );
  };

  const addFilter = () => {
    setFilters([...filters, { id: Date.now(), logic: 'AND', field: '', comparison: '', value: '' }]);
  };

  const removeFilter = (id) => {
    setFilters(filters.filter((f) => f.id !== id));
  };

  const fetchtTagData = async () => {
    try {
      const appliedTo = getAppliedTo();
      const url = appliedTo ? `${urls.tag.getAllTags}?appliedTo=${encodeURIComponent(appliedTo)}` : urls.tag.getAllTags;
      const response = await getApi(url);
      setTagOptions(response?.data?.allTags || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };
  useEffect(() => {
    fetchtTagData();
    setFieldOption();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data) => {
    setIsloading(true);
    let hasError = false;

    const validatedFilters = filters.map((filter) => {
      const valueEmpty = Array.isArray(filter.value) ? filter.value.length === 0 : !filter.value?.trim();
      const newErrors = {
        field: !filter.field?.trim(),
        comparison: !filter.comparison?.trim(),
        value: valueEmpty
      };

      if (newErrors?.field || newErrors?.comparison || newErrors?.value) {
        hasError = true;
      }

      return {
        ...filter,
        errors: newErrors
      };
    });

    if (hasError) {
      setFilters(validatedFilters);
      setIsloading(false);
      return;
    }

    try {
      const formData = {
        ...data,
        name: data.listName || '',
        tags: (data.tags || []).map((tag) => tag._id),
        listType: state?.type || '',

        filters: validatedFilters.map((filter) => {
          const rest = { ...filter };
          delete rest.errors;
          return {
            ...rest,
            value: Array.isArray(rest.value) ? rest.value.join(', ') : rest.value
          };
        })
      };
      const response = await postApi(urls.list.create, formData);
      toast.success('List added successfully');
      const newListId = response?.data?.newList?._id;
      if (newListId) {
        navigate('/list-view', { state: { id: newListId, listType: state?.type || '' } });
      } else {
        navigate('/list');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error Adding List');
    } finally {
      setIsloading(false);
    }
  };
  const onError = () => {
    const validatedFilters = filters.map((filter) => {
      const valueEmpty = Array.isArray(filter.value) ? filter.value.length === 0 : !filter.value?.trim();
      const newErrors = {
        field: !filter.field?.trim(),
        comparison: !filter.comparison?.trim(),
        value: valueEmpty
      };

      return {
        ...filter,
        errors: newErrors
      };
    });

    setFilters(validatedFilters);
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography fontWeight="600" fontSize="16px" display="flex" alignItems="center" gap={1}>
          <IconButton onClick={() => navigate(-1)} size="small">
            <ArrowBackIcon />
          </IconButton>
          {`Create list of ${state?.type}`}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'grey',
            borderRadius: '50%',
            width: 32,
            height: 32,
            cursor: 'pointer'
          }}
          onClick={() => navigate(-1)}
        >
          <CloseIcon sx={{ color: 'white', fontSize: 20 }} />
        </Box>
      </Box>

      <Card sx={{ p: 3, mt: 3 }} component="form" onSubmit={handleSubmit(onSubmit, onError)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="listName"
              control={control}
              rules={{ required: 'This field is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="List Name"
                  size="small"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="tags"
              control={control}
              render={({ field, fieldState }) => (
                <Autocomplete
                  multiple
                  options={tagOptions || []}
                  getOptionLabel={(option) => option?.name || ''}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  onChange={(_, value) => field.onChange(value)}
                  value={field.value || []}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Include People with these Tags"
                      size="small"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            Include People where :
            <Button variant="contained" onClick={addFilter} sx={{ fontSize: '10px', borderRadius: '20px', background: '#009fc7', ml: 2 }}>
              Add Include Filter
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              {filters.map((filter) => (
                <Grid container spacing={1} alignItems="center" key={filter.id} sx={{ mb: 1 }}>
                  <Grid item xs={2}>
                    <Select
                      fullWidth
                      size="small"
                      value={filter.logic}
                      onChange={(e) => handleFilterChange(filter.id, 'logic', e.target.value)}
                    >
                      <MenuItem value="AND">AND</MenuItem>
                      <MenuItem value="OR">OR</MenuItem>
                    </Select>
                  </Grid>
                  <Grid item xs={3}>
                    <FormControl fullWidth size="small" error={filter.errors?.field}>
                      <InputLabel>Field</InputLabel>
                      <Select value={filter.field} onChange={(e) => handleFilterChange(filter.id, 'field', e.target.value)} label="Field">
                        {filterFieldOptions?.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {filter.errors?.field && <FormHelperText>Field is required</FormHelperText>}
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <FormControl fullWidth size="small" error={filter.errors?.comparison}>
                      <InputLabel>Comparison</InputLabel>
                      <Select
                        value={filter.comparison}
                        onChange={(e) => handleFilterChange(filter.id, 'comparison', e.target.value)}
                        label="Comparison"
                      >
                        <MenuItem value="equals">Equals</MenuItem>
                        <MenuItem value="not_equals">Not Equals</MenuItem>
                        <MenuItem value="contains">Contains</MenuItem>
                        <MenuItem value="not_contains">Not Contains</MenuItem>
                        <MenuItem value="greater_than">Greater Than</MenuItem>
                        <MenuItem value="less_than">Less Than</MenuItem>
                      </Select>
                      {filter.errors?.comparison && <FormHelperText>Comparison is required</FormHelperText>}
                    </FormControl>
                  </Grid>

                  <Grid item xs={2}>
                    {filter.field === 'personalInfo.ethnicity' ? (
                      <Autocomplete
                        multiple
                        options={ethnicityOptions}
                        getOptionLabel={(option) => option}
                        value={Array.isArray(filter.value) ? filter.value : filter.value ? filter.value.split(', ').filter(Boolean) : []}
                        onChange={(_, selected) => handleFilterChange(filter.id, 'value', selected)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Value"
                            size="small"
                            error={filter.errors?.value}
                            helperText={filter.errors?.value ? 'Value is required' : ''}
                          />
                        )}
                      />
                    ) : (
                      <TextField
                        fullWidth
                        label="Value"
                        size="small"
                        value={filter.value}
                        onChange={(e) => handleFilterChange(filter.id, 'value', e.target.value)}
                        error={filter.errors?.value}
                        helperText={filter.errors?.value ? 'Value is required' : ''}
                      />
                    )}
                  </Grid>
                  <Grid item xs={2}>
                    <Box display="flex" alignItems="center">
                      <IconButton size="small" onClick={() => removeFilter(filter.id)}>
                        <Delete />
                      </IconButton>
                      <IconButton size="small">
                        <ArrowUpward fontSize="small" />
                      </IconButton>
                      <IconButton size="small">
                        <ArrowDownward fontSize="small" />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              ))}
            </Paper>
          </Grid>

          <Grid container spacing={2} sx={{ justifyContent: 'flex-end', mt: 1, pr: 2 }}>
            <Grid item>
              <Button type="submit" variant="contained" sx={{ background: '#053146' }} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'SAVE CHANGES'}
              </Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" color="error" onClick={() => navigate(-1)}>
                CANCEL
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

export default AddListForm;
