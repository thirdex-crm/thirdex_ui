/* eslint-disable prettier/prettier */
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  Typography,
  Box,
  MenuItem,
  Chip,
  TextField,
  Button,
  Autocomplete,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  Popover,
  IconButton
} from '@mui/material';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ClearIcon from '@mui/icons-material/Clear';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DateRangePicker } from 'react-date-range';
import { enGB } from 'date-fns/locale';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const FilterPanel = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  showFilter,
  formTypes,
  formType,
  setFormType,
  dateFilters,
  dateFilter,
  setDateFilter,
  districts,
  districtFilter,
  setDistrictFilter,
  genders,
  genderFilter,
  setGenderFilter,
  statuses,
  statusFilter,
  setStatusFilter,
  serviceTypes,
  serviceTypeFilter,
  setServiceTypeFilter,
  createdBy,
  createdByFilter,
  setCreatedByFilter,
  service,
  serviceFilter,
  setServiceFilter,
  dateOpenedFilters,
  dateOpenedFilter,
  setDateOpenedFilter,
  owners,
  ownerFilter,
  setOwnerFilter,
  locations,
  locationFilter,
  setLocationFilter,
  dateAddedFilters,
  dateAddedFilter,
  setDateAddedFilter,
  listNames,
  listNameFilter,
  setListNameFilter,
  formNames,
  formNameFilter,
  setFormNameFilter,
  tags,
  tagFilter,
  setTagFilter,
  names,
  nameFilter,
  setNameFilter,
  receipts,
  receiptIdFilter,
  setReceiptIdFilter,
  campaigns,
  campaignFilter,
  setCampaignFilter,
  caseIds,
  caseIdFilter,
  setCaseIdFilter,
  countriesWithFlags,
  countryOfOriginFilter,
  setCountryOfOriginFilter,
  donorTypes,
  donorTypeFilter,
  setDonorTypeFilter,
  durationOptions,
  durationFilter,
  setDurationFilter,
  amountRanges,
  amountRangeFilter,
  setAmountRangeFilter,
  recruitmentCampaigns,
  recruitmentCampaignFilter,
  setRecruitmentCampaignFilter,
  activityTypes,
  activityTypeFilter,
  setActivityTypeFilter,
  sessionNames,
  sessionNameFilter,
  setSessionNameFilter,
  configurationNames,
  configurationNameFilter,
  setConfigurationNameFilter,
  timeOptions,
  timeFilter,
  setTimeFilter,
  sessionLeads,
  sessionLeadFilter,
  setSessionLeadFilter,
  includeArchives,
  setIncludeArchives,
  selectedFilters = [],
  customDateLabel,
  listType,
  setListType,
  includeServiceuser,
  setIncludeServiceuser,
  formTitles,
  formTitle,
  setFormTitle,
  dateCreated,
  setDateCreated,
  dateSubmitted,
  setDateSubmitted
}) => {
  const [dateRanges, setDateRanges] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeFilterKey, setActiveFilterKey] = useState(null);
  const [, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  });

  const [tempSelectionRange, setTempSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  });

  useEffect(() => {
    if (!dateAddedFilter || !setDateAddedFilter) return;
    setDateAddedFilter(null);
  }, [dateAddedFilter, setDateAddedFilter]);

  const handleReset = () => {
    if (setStartDate) setStartDate('');
    if (setEndDate) setEndDate('');
    if (setFormType) setFormType('');
    if (setDateFilter) setDateFilter('');
    if (setDistrictFilter) setDistrictFilter('');
    if (setGenderFilter) setGenderFilter('');
    if (setStatusFilter) setStatusFilter('');
    if (setServiceTypeFilter) setServiceTypeFilter('');
    if (setServiceFilter) setServiceFilter('');
    if (setDateOpenedFilter) setDateOpenedFilter('');
    if (setOwnerFilter) setOwnerFilter('');
    if (setLocationFilter) setLocationFilter('');
    if (setDateAddedFilter) setDateAddedFilter('');
    if (setListNameFilter) setListNameFilter('');
    if (setFormNameFilter) setFormNameFilter('');
    if (setCreatedByFilter) setCreatedByFilter('');
    if (setTagFilter) setTagFilter('');
    if (setNameFilter) setNameFilter('');
    if (setReceiptIdFilter) setReceiptIdFilter('');
    if (setCampaignFilter) setCampaignFilter('');
    if (setCaseIdFilter) setCaseIdFilter('');
    if (setCountryOfOriginFilter) setCountryOfOriginFilter('');
    if (setDonorTypeFilter) setDonorTypeFilter('');
    if (setDurationFilter) setDurationFilter('');
    if (setAmountRangeFilter) setAmountRangeFilter('');
    if (setRecruitmentCampaignFilter) setRecruitmentCampaignFilter('');
    if (setActivityTypeFilter) setActivityTypeFilter('');
    if (setSessionNameFilter) setSessionNameFilter('');
    if (setConfigurationNameFilter) setConfigurationNameFilter('');
    if (setTimeFilter) setTimeFilter('');
    if (setSessionLeadFilter) setSessionLeadFilter('');
    if (setIncludeArchives) setIncludeArchives(false);
    if (setListType) setListType('');
    if (setIncludeServiceuser) setIncludeServiceuser(false);
    if (formTitle) setFormTitle('');
    if (dateCreated) setDateCreated('');
    if (dateSubmitted) setDateSubmitted('');
    // Reset date range states
    setDateRanges({});
    setSelectionRange({
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    });
  };

  if (!showFilter) return null;

  const parseDate = (value) => {
    if (!value) return null;
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed.toDate() : null;
  };

  const formatDate = (value) => {
    if (!value) return '';
    return dayjs(value).format('YYYY-MM-DD');
  };

  const getOptionValue = (option) => {
    if (option == null) return '';
    if (typeof option === 'string' || typeof option === 'number') return String(option);
    if (typeof option === 'object') {
      return String(option.value ?? option.id ?? option._id ?? option.name ?? option.label ?? '');
    }
    return '';
  };

  const getOptionLabelSafe = (option) => {
    if (option == null) return '';
    if (typeof option === 'string' || typeof option === 'number') return String(option);
    if (typeof option === 'object') {
      return String(option.label ?? option.name ?? option.title ?? option.value ?? option.id ?? option._id ?? '');
    }
    return '';
  };

  const filterMapping = {
    dateRange: {
      label: 'Date Range',
      type: 'dateRange'
    },
    startDate: {
      label: 'Start Date',
      onChange: setStartDate,
      value: startDate,
      type: 'date'
    },
    endDate: {
      label: 'End Date',
      onChange: setEndDate,
      value: endDate,
      type: 'date'
    },
    formType: {
      data: formTypes,
      label: 'Form Type',
      onChange: setFormType,
      value: formType,
      type: 'select'
    },
    dateFilter: {
      data: dateFilters,
      label: 'By Date',
      onChange: setDateFilter,
      value: dateFilter,
      type: 'select'
    },
    districtFilter: {
      data: districts,
      label: 'By Borough/District',
      onChange: setDistrictFilter,
      value: districtFilter,
      type: 'select'
    },
    genderFilter: {
      data: genders,
      label: 'By Gender',
      onChange: setGenderFilter,
      value: genderFilter,
      type: 'select'
    },
    statusFilter: {
      data: statuses,
      label: 'Select Status',
      onChange: setStatusFilter,
      value: statusFilter,
      type: 'select'
    },
    serviceTypeFilter: {
      data: serviceTypes,
      label: 'Select Service Type',
      onChange: setServiceTypeFilter,
      value: serviceTypeFilter,
      type: 'select'
    },
    createdByFilter: {
      data: createdBy,
      label: 'Created By',
      onChange: setCreatedByFilter,
      value: createdByFilter,
      type: 'select'
    },
    serviceFilter: {
      data: service,
      label: 'Select Service',
      onChange: setServiceFilter,
      value: serviceFilter,
      type: 'select'
    },
    dateOpenedFilter: {
      data: dateOpenedFilters,
      label: customDateLabel || 'Start Date',
      onChange: setDateOpenedFilter,
      value: dateOpenedFilter,
      type: 'date'
    },
    ownerFilter: {
      data: owners,
      label: 'By Owner',
      onChange: setOwnerFilter,
      value: ownerFilter,
      type: 'select'
    },
    locationFilter: {
      data: locations,
      label: 'By Location',
      onChange: setLocationFilter,
      value: locationFilter,
      type: 'select'
    },
    dateAddedFilter: {
      data: dateAddedFilters,
      label: 'By Date Added',
      onChange: setDateAddedFilter,
      value: dateAddedFilter,
      type: 'date'
    },
    listNameFilter: {
      data: listNames,
      label: 'List Name',
      onChange: setListNameFilter,
      value: listNameFilter,
      type: 'select'
    },
    formNameFilter: {
      data: formNames,
      label: 'By Form Name',
      onChange: setFormNameFilter,
      value: formNameFilter,
      type: 'select'
    },
    tagFilter: {
      data: tags,
      label: 'By Tags',
      onChange: setTagFilter,
      value: tagFilter,
      type: 'select'
    },
    nameFilter: {
      data: names,
      label: 'Name',
      onChange: setNameFilter,
      value: nameFilter,
      type: 'select'
    },
    receiptIdFilter: {
      data: receipts,
      label: 'By Receipt ID',
      onChange: setReceiptIdFilter,
      value: receiptIdFilter,
      type: 'select'
    },
    campaignFilter: {
      data: campaigns,
      label: 'By Campaign',
      onChange: setCampaignFilter,
      value: campaignFilter,
      type: 'select'
    },
    caseIdFilter: {
      data: caseIds,
      label: 'Case ID',
      onChange: setCaseIdFilter,
      value: caseIdFilter,
      type: 'select'
    },
    countryOfOriginFilter: {
      data: countriesWithFlags,
      label: 'Select country of origin',
      onChange: setCountryOfOriginFilter,
      value: countryOfOriginFilter,
      type: 'select'
    },
    donorTypeFilter: {
      data: donorTypes,
      label: 'By Donor Type',
      onChange: setDonorTypeFilter,
      value: donorTypeFilter,
      type: 'select'
    },
    durationFilter: {
      data: durationOptions,
      label: 'By Duration',
      onChange: setDurationFilter,
      value: durationFilter,
      type: 'select'
    },
    amountRangeFilter: {
      data: amountRanges,
      label: 'By Amount Range',
      onChange: setAmountRangeFilter,
      value: amountRangeFilter,
      type: 'select'
    },
    recruitmentCampaignFilter: {
      data: recruitmentCampaigns,
      label: 'By Recruitment Campaign',
      onChange: setRecruitmentCampaignFilter,
      value: recruitmentCampaignFilter,
      type: 'select'
    },
    activityTypeFilter: {
      data: activityTypes,
      label: 'By Activity Type',
      onChange: setActivityTypeFilter,
      value: activityTypeFilter,
      type: 'select'
    },
    sessionNameFilter: {
      data: sessionNames,
      label: 'By Session Name',
      onChange: setSessionNameFilter,
      value: sessionNameFilter,
      type: 'select'
    },
    configurationNameFilter: {
      data: configurationNames,
      label: 'Configuration Name',
      onChange: setConfigurationNameFilter,
      value: configurationNameFilter,
      type: 'select'
    },
    timeFilter: {
      data: timeOptions,
      label: 'By Time',
      onChange: setTimeFilter,
      value: timeFilter,
      type: 'time'
    },
    sessionLeadFilter: {
      data: sessionLeads,
      label: 'By Session Lead',
      onChange: setSessionLeadFilter,
      value: sessionLeadFilter,
      type: 'select'
    },
    includeArchives: {
      label: 'Include Archives',
      onChange: setIncludeArchives,
      value: includeArchives,
      type: 'checkbox'
    },
    listTypeFilter: {
      data: listType,
      label: 'By List Type',
      onChange: setListType,
      value: listType,
      type: 'select'
    },
    includeServiceuser: {
      label: 'Include Service User',
      onChange: setIncludeServiceuser,
      value: includeServiceuser,
      type: 'checkbox'
    },
    formDisplayTitle: {
      data: formTitles,
      label: 'Form Display Title',
      onChange: setFormTitle,
      value: formTitle,
      type: 'select'
    },
    dateCreated: {
      data: dateCreated,
      label: 'By Date Created',
      onChange: setDateCreated,
      value: dateCreated,
      type: 'date'
    },
    dateSubmitted: {
      data: dateCreated,
      label: 'By Date Submitted',
      onChange: setDateCreated,
      value: dateCreated,
      type: 'date'
    }
  };

  return (
    <>
      <Grid item xs={3}>
        <Card
          sx={{
            p: 2,
            backgroundColor: '#ffffff',
            borderRadius: 2,
            border: '1px solid #e0e0e0'
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center">
              <FilterAltOutlinedIcon sx={{ color: '#808191' }} />
              <Typography variant="subtitle1" color="#808191">
                Filters
              </Typography>
            </Box>
            <Button
              startIcon={<RestartAltIcon />}
              onClick={handleReset}
              size="small"
              sx={{
                color: '#4ba1f8',
                '&:hover': {
                  backgroundColor: 'rgba(75, 161, 248, 0.1)'
                }
              }}
            >
              Reset
            </Button>
          </Box>

          <Box display="flex" flexDirection="column" gap={2}>
            {selectedFilters?.map((filterKey) => {
              const filter = filterMapping[filterKey];
              if (!filter) return null;

              // Skip startDate and endDate separately if dateRange is in the list
              if ((filterKey === 'startDate' || filterKey === 'endDate') && selectedFilters.includes('dateRange')) {
                return null;
              }

              // Handle combined date range picker
              if (filter.type === 'dateRange') {
                const startValue = parseDate(startDate);
                const endValue = parseDate(endDate);

                const getDisplayValue = () => {
                  if (startValue && endValue) {
                    return `${dayjs(startValue).format('DD/MM/YYYY')} - ${dayjs(endValue).format('DD/MM/YYYY')}`;
                  } else if (startValue) {
                    return `${dayjs(startValue).format('DD/MM/YYYY')} - Select end date`;
                  }
                  return '';
                };

                const handleOpenPicker = (event) => {
                  setActiveFilterKey(filterKey);
                  const range = {
                    startDate: startValue || new Date(),
                    endDate: endValue || new Date(),
                    key: 'selection'
                  };
                  setSelectionRange(range);
                  setTempSelectionRange(range);
                  setAnchorEl(event.currentTarget);
                };

                const handleClosePicker = () => {
                  setAnchorEl(null);
                  setActiveFilterKey(null);
                };

                const handleDateChange = (ranges) => {
                  const { selection } = ranges;
                  setTempSelectionRange(selection);
                };

                const handleApply = () => {
                  setSelectionRange(tempSelectionRange);
                  const formattedStart = formatDate(tempSelectionRange.startDate);
                  const formattedEnd = formatDate(tempSelectionRange.endDate);

                  if (setStartDate) setStartDate(formattedStart || '');
                  if (setEndDate) setEndDate(formattedEnd || '');
                  handleClosePicker();
                };

                const handleClearDates = (e) => {
                  e.stopPropagation();
                  if (setStartDate) setStartDate('');
                  if (setEndDate) setEndDate('');
                  setSelectionRange({
                    startDate: new Date(),
                    endDate: new Date(),
                    key: 'selection'
                  });
                  setTempSelectionRange({
                    startDate: new Date(),
                    endDate: new Date(),
                    key: 'selection'
                  });
                };

                return (
                  <Box key={filterKey}>
                    <TextField
                      fullWidth
                      size="small"
                      label={filter.label}
                      value={getDisplayValue()}
                      placeholder="Select date range"
                      onClick={handleOpenPicker}
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            {(startValue || endValue) && (
                              <IconButton size="small" onClick={handleClearDates} sx={{ mr: 0.5, p: 0.5 }}>
                                <ClearIcon sx={{ fontSize: 18, color: '#808191' }} />
                              </IconButton>
                            )}
                            <CalendarMonthIcon sx={{ color: '#808191', cursor: 'pointer' }} />
                          </InputAdornment>
                        ),
                        sx: { cursor: 'pointer' }
                      }}
                    />
                    <Popover
                      open={Boolean(anchorEl) && activeFilterKey === filterKey}
                      anchorEl={anchorEl}
                      onClose={handleClosePicker}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left'
                      }}
                      PaperProps={{
                        sx: {
                          mt: 1,
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                          borderRadius: 2
                        }
                      }}
                    >
                      <Box>
                        <DateRangePicker
                          ranges={[tempSelectionRange]}
                          onChange={handleDateChange}
                          months={2}
                          direction="horizontal"
                          showSelectionPreview={true}
                          moveRangeOnFirstSelection={false}
                          rangeColors={['#4ba1f8']}
                          color="#4ba1f8"
                          locale={enGB}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, p: 2, borderTop: '1px solid #e0e0e0' }}>
                          <Button variant="outlined" onClick={handleClosePicker} sx={{ color: '#808191', borderColor: '#e0e0e0' }}>
                            Close
                          </Button>
                          <Button
                            variant="contained"
                            onClick={handleApply}
                            sx={{ backgroundColor: '#4ba1f8', '&:hover': { backgroundColor: '#2196f3' } }}
                          >
                            Apply
                          </Button>
                        </Box>
                      </Box>
                    </Popover>
                  </Box>
                );
              }

              if (filter.type === 'date') {
                const supportsGlobalRange = typeof setStartDate === 'function' && typeof setEndDate === 'function';
                const localRange = dateRanges[filterKey] || { from: null, to: null };

                const startValue = supportsGlobalRange ? parseDate(startDate) : parseDate(localRange.from);
                const endValue = supportsGlobalRange ? parseDate(endDate) : parseDate(localRange.to || filter.value);

                // Format display value for single input
                const getDisplayValue = () => {
                  if (startValue && endValue) {
                    return `${dayjs(startValue).format('DD/MM/YYYY')} - ${dayjs(endValue).format('DD/MM/YYYY')}`;
                  } else if (startValue) {
                    return `${dayjs(startValue).format('DD/MM/YYYY')} - Select end date`;
                  }
                  return '';
                };

                const handleOpenPicker = (event) => {
                  setActiveFilterKey(filterKey);
                  const range = {
                    startDate: startValue || new Date(),
                    endDate: endValue || new Date(),
                    key: 'selection'
                  };
                  setSelectionRange(range);
                  setTempSelectionRange(range);
                  setAnchorEl(event.currentTarget);
                };

                const handleClosePicker = () => {
                  setAnchorEl(null);
                  setActiveFilterKey(null);
                };

                const handleDateChange = (ranges) => {
                  const { selection } = ranges;
                  setTempSelectionRange(selection);
                };

                const handleApply = () => {
                  setSelectionRange(tempSelectionRange);
                  const formattedStart = formatDate(tempSelectionRange.startDate);
                  const formattedEnd = formatDate(tempSelectionRange.endDate);

                  if (supportsGlobalRange) {
                    setStartDate(formattedStart || '');
                    setEndDate(formattedEnd || '');
                  }

                  setDateRanges((prev) => ({
                    ...prev,
                    [filterKey]: {
                      from: formattedStart || '',
                      to: formattedEnd || ''
                    }
                  }));

                  if (typeof filter.onChange === 'function') {
                    filter.onChange(formattedEnd || null);
                  }
                  handleClosePicker();
                };

                const handleClearDates = (e) => {
                  e.stopPropagation();
                  if (supportsGlobalRange) {
                    setStartDate('');
                    setEndDate('');
                  }
                  setDateRanges((prev) => ({
                    ...prev,
                    [filterKey]: { from: '', to: '' }
                  }));
                  if (typeof filter.onChange === 'function') {
                    filter.onChange(null);
                  }
                  const emptyRange = {
                    startDate: new Date(),
                    endDate: new Date(),
                    key: 'selection'
                  };
                  setSelectionRange(emptyRange);
                  setTempSelectionRange(emptyRange);
                };

                return (
                  <Box key={filterKey}>
                    <TextField
                      fullWidth
                      size="small"
                      label={filter.label}
                      value={getDisplayValue()}
                      placeholder="Select date range"
                      onClick={handleOpenPicker}
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            {(startValue || endValue) && (
                              <IconButton size="small" onClick={handleClearDates} sx={{ mr: 0.5, p: 0.5 }}>
                                <ClearIcon sx={{ fontSize: 18, color: '#808191' }} />
                              </IconButton>
                            )}
                            <CalendarMonthIcon sx={{ color: '#808191', cursor: 'pointer' }} />
                          </InputAdornment>
                        ),
                        sx: { cursor: 'pointer' }
                      }}
                    />
                    <Popover
                      open={Boolean(anchorEl) && activeFilterKey === filterKey}
                      anchorEl={anchorEl}
                      onClose={handleClosePicker}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left'
                      }}
                      PaperProps={{
                        sx: {
                          mt: 1,
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                          borderRadius: 2
                        }
                      }}
                    >
                      <Box>
                        <DateRangePicker
                          ranges={[tempSelectionRange]}
                          onChange={handleDateChange}
                          months={2}
                          direction="horizontal"
                          showSelectionPreview={true}
                          moveRangeOnFirstSelection={false}
                          rangeColors={['#4ba1f8']}
                          color="#4ba1f8"
                          locale={enGB}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, p: 2, borderTop: '1px solid #e0e0e0' }}>
                          <Button variant="outlined" onClick={handleClosePicker} sx={{ color: '#808191', borderColor: '#e0e0e0' }}>
                            Close
                          </Button>
                          <Button
                            variant="contained"
                            onClick={handleApply}
                            sx={{ backgroundColor: '#4ba1f8', '&:hover': { backgroundColor: '#2196f3' } }}
                          >
                            Apply
                          </Button>
                        </Box>
                      </Box>
                    </Popover>
                  </Box>
                );
              }

              if (filter.type === 'select') {
                if (filterKey === 'statusFilter') {
                  return (
                    <TextField
                      key={filterKey}
                      select
                      label={filter.label}
                      fullWidth
                      size="small"
                      value={filter.value || ''}
                      onChange={(e) => filter.onChange(e.target.value)}
                      SelectProps={{
                        renderValue: (selected) =>
                          selected ? (
                            <Chip
                              label={filter.data?.find((status) => status.value === selected)?.label || selected}
                              sx={{
                                color:
                                  selected?.toLowerCase() === 'active'
                                    ? '#79dbfb'
                                    : selected?.toLowerCase() === 'inactive'
                                    ? '#ff6a67'
                                    : selected?.toLowerCase() === 'open'
                                    ? '#2e7d32'
                                    : selected?.toLowerCase() === 'close'
                                    ? '#c62828'
                                    : selected?.toLowerCase() === 'pending'
                                    ? '#f9a825'
                                    : selected?.toLowerCase() === 'approved'
                                    ? '#41c048'
                                    : selected?.toLowerCase() === 'rejected'
                                    ? '#d32f2f'
                                    : '#333',
                                backgroundColor:
                                  selected?.toLowerCase() === 'active'
                                    ? '#e5f8fe'
                                    : selected?.toLowerCase() === 'inactive'
                                    ? '#ffeae9'
                                    : selected?.toLowerCase() === 'open'
                                    ? '#91FD91'
                                    : selected?.toLowerCase() === 'close'
                                    ? '#FDA191'
                                    : selected?.toLowerCase() === 'pending'
                                    ? '#FFF68D'
                                    : selected?.toLowerCase() === 'approved'
                                    ? '#eefbe5'
                                    : selected?.toLowerCase() === 'rejected'
                                    ? '#ffeae9'
                                    : '#e0e0e0',

                                fontWeight: 500,
                                px: 1
                              }}
                            />
                          ) : (
                            ''
                          )
                      }}
                    >
                      {filter.data?.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          <Chip
                            label={option.label}
                            sx={{
                              color:
                                option.value?.toLowerCase() === 'active'
                                  ? '#79dbfb'
                                  : option.value?.toLowerCase() === 'inactive'
                                  ? '#ff6a67'
                                  : option.value?.toLowerCase() === 'open'
                                  ? '#2e7d32'
                                  : option.value?.toLowerCase() === 'close'
                                  ? '#c62828'
                                  : option.value?.toLowerCase() === 'pending'
                                  ? '#f9a825'
                                  : option.value?.toLowerCase() === 'approved'
                                  ? '#41c048'
                                  : option.value?.toLowerCase() === 'rejected'
                                  ? '#d32f2f'
                                  : '#333',
                              backgroundColor:
                                option.value?.toLowerCase() === 'active'
                                  ? '#e5f8fe'
                                  : option.value?.toLowerCase() === 'inactive'
                                  ? '#ffeae9'
                                  : option.value?.toLowerCase() === 'open'
                                  ? '#91FD91'
                                  : option.value?.toLowerCase() === 'close'
                                  ? '#FDA191'
                                  : option.value?.toLowerCase() === 'pending'
                                  ? '#FFF68D'
                                  : option.value?.toLowerCase() === 'approved'
                                  ? '#eefbe5'
                                  : option.value?.toLowerCase() === 'rejected'
                                  ? '#ffeae9'
                                  : '#e0e0e0',

                              fontWeight: 500
                            }}
                          />
                        </MenuItem>
                      ))}
                    </TextField>
                  );
                }
                return (
                  <Box key={filterKey}>
                    <Autocomplete
                      options={filter.data || []}
                      getOptionLabel={(option) => getOptionLabelSafe(option)}
                      isOptionEqualToValue={(option, value) => getOptionValue(option) === getOptionValue(value)}
                      value={
                        filter.data?.find((option) => getOptionValue(option) === String(filter.value ?? '')) ||
                        (filter.value && typeof filter.value === 'object' ? filter.value : null)
                      }
                      onChange={(_, newValue) => filter.onChange(getOptionValue(newValue))}
                      renderInput={(params) => <TextField {...params} label={filter.label} size="small" fullWidth />}
                      renderOption={(props, option, state) => (
                        <li {...props} key={`${filterKey}-${getOptionValue(option) || getOptionLabelSafe(option) || state.index}`}>
                          {option?.flag && (
                            <img src={option.flag} alt={getOptionLabelSafe(option)} style={{ width: 20, height: 15, marginRight: 8 }} />
                          )}
                          {getOptionLabelSafe(option)}
                        </li>
                      )}
                      ListboxProps={{
                        style: {
                          maxHeight: '200px'
                        }
                      }}
                      slotProps={{
                        popper: { placement: 'bottom-start' }
                      }}
                    />
                  </Box>
                );
              }

              if (filter.type === 'time') {
                return (
                  <>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TextField
                        label={filter.label}
                        type="time"
                        variant="outlined"
                        size="small"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ step: 300 }}
                        value={filter.value || ''}
                        onChange={(e) => filter.onChange(e.target.value)}
                        format="hh:mm A"
                        renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                        sx={{
                          '& .MuiInputBase-root.Mui-focused': {
                            backgroundColor: '#e0e0e0'
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </>
                );
              }

              if (filter.type === 'checkbox') {
                return (
                  <FormControlLabel
                    key={filterKey}
                    control={<Checkbox checked={filter.value || false} onChange={(e) => filter.onChange(e.target.checked)} />}
                    label={filter.label}
                  />
                );
              }

              return null;
            })}
          </Box>
        </Card>
      </Grid>
    </>
  );
};

FilterPanel.propTypes = {
  startDate: PropTypes.any,
  setStartDate: PropTypes.func,
  endDate: PropTypes.any,
  setEndDate: PropTypes.func,
  showFilter: PropTypes.bool,
  formTypes: PropTypes.array,
  formType: PropTypes.string,
  setFormType: PropTypes.func,
  dateFilters: PropTypes.array,
  dateFilter: PropTypes.string,
  setDateFilter: PropTypes.func,
  districts: PropTypes.array,
  districtFilter: PropTypes.string,
  setDistrictFilter: PropTypes.func,
  genders: PropTypes.array,
  genderFilter: PropTypes.string,
  setGenderFilter: PropTypes.func,
  statuses: PropTypes.array,
  statusFilter: PropTypes.string,
  setStatusFilter: PropTypes.func,
  serviceTypes: PropTypes.array,
  serviceTypeFilter: PropTypes.string,
  setServiceTypeFilter: PropTypes.func,
  createdBy: PropTypes.array,
  createdByFilter: PropTypes.string,
  setCreatedByFilter: PropTypes.func,
  service: PropTypes.array,
  serviceFilter: PropTypes.string,
  setServiceFilter: PropTypes.func,
  dateOpenedFilters: PropTypes.array,
  dateOpenedFilter: PropTypes.string,
  setDateOpenedFilter: PropTypes.func,
  owners: PropTypes.array,
  ownerFilter: PropTypes.string,
  setOwnerFilter: PropTypes.func,
  locations: PropTypes.array,
  locationFilter: PropTypes.string,
  setLocationFilter: PropTypes.func,
  dateAddedFilters: PropTypes.array,
  dateAddedFilter: PropTypes.string,
  setDateAddedFilter: PropTypes.func,
  listNames: PropTypes.array,
  listNameFilter: PropTypes.string,
  setListNameFilter: PropTypes.func,
  formNames: PropTypes.array,
  formNameFilter: PropTypes.string,
  setFormNameFilter: PropTypes.func,
  tags: PropTypes.array,
  tagFilter: PropTypes.string,
  setTagFilter: PropTypes.func,
  names: PropTypes.array,
  nameFilter: PropTypes.string,
  setNameFilter: PropTypes.func,
  receipts: PropTypes.array,
  receiptIdFilter: PropTypes.string,
  setReceiptIdFilter: PropTypes.func,
  campaigns: PropTypes.array,
  campaignFilter: PropTypes.string,
  setCampaignFilter: PropTypes.func,
  caseIds: PropTypes.array,
  caseIdFilter: PropTypes.string,
  setCaseIdFilter: PropTypes.func,
  countriesWithFlags: PropTypes.array,
  countryOfOriginFilter: PropTypes.string,
  setCountryOfOriginFilter: PropTypes.func,
  donorTypes: PropTypes.array,
  donorTypeFilter: PropTypes.string,
  setDonorTypeFilter: PropTypes.func,
  durationOptions: PropTypes.array,
  durationFilter: PropTypes.string,
  setDurationFilter: PropTypes.func,
  amountRanges: PropTypes.array,
  amountRangeFilter: PropTypes.string,
  setAmountRangeFilter: PropTypes.func,
  recruitmentCampaigns: PropTypes.array,
  recruitmentCampaignFilter: PropTypes.string,
  setRecruitmentCampaignFilter: PropTypes.func,
  activityTypes: PropTypes.array,
  activityTypeFilter: PropTypes.string,
  setActivityTypeFilter: PropTypes.func,
  sessionNames: PropTypes.array,
  sessionNameFilter: PropTypes.string,
  setSessionNameFilter: PropTypes.func,
  configurationNames: PropTypes.array,
  configurationNameFilter: PropTypes.string,
  setConfigurationNameFilter: PropTypes.func,
  timeOptions: PropTypes.array,
  timeFilter: PropTypes.string,
  setTimeFilter: PropTypes.func,
  sessionLeads: PropTypes.array,
  sessionLeadFilter: PropTypes.string,
  setSessionLeadFilter: PropTypes.func,
  includeArchives: PropTypes.bool,
  setIncludeArchives: PropTypes.func,
  selectedFilters: PropTypes.array,
  customDateLabel: PropTypes.string,
  listType: PropTypes.string,
  setListType: PropTypes.func,
  includeServiceuser: PropTypes.bool,
  setIncludeServiceuser: PropTypes.func,
  formTitles: PropTypes.array,
  formTitle: PropTypes.string,
  setFormTitle: PropTypes.func,
  dateCreated: PropTypes.string,
  setDateCreated: PropTypes.func,
  dateSubmitted: PropTypes.string,
  setDateSubmitted: PropTypes.func
};

export default FilterPanel;
