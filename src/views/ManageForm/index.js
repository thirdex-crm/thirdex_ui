import {
  Stack,
  Grid,
  Card,
  Box,
  Typography,
  IconButton,
  Chip,
  Tooltip,
  InputBase,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import AddFormModal from './AddForm.js';

import EditFormModal from './EditFormModal';
import { DataGrid } from '@mui/x-data-grid';
import React, { useState } from 'react';
import FilterPanel from 'components/FilterPanel';
import { urls } from 'common/urls.js';
import { getApi, deleteApi } from 'common/apiClient.js';
import { useEffect } from 'react';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import SingleRowLoader from 'ui-component/Loader/SingleRowLoader.js';
import CustomHeader from 'components/CustomHeader.js';
import toast from 'react-hot-toast';

const Lead = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState(null);
  const [rows, setRows] = useState([]);
  const [formType, setFormType] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formTypes, setFormTypes] = useState([]);
  const [formTitles, setFormTitles] = useState([]);
  const [dateCreated, setDateCreated] = useState('');
  const [showFilter] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [totalRows, setTotalRows] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,

    pageSize: 10
  });
  const [loading, setLoading] = useState(true);

  const handleOpenAdd = () => {
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  const handleEdit = async (row) => {
    try {
      const response = await getApi(`${urls.forms.getById}/${row.link}`);
      if (response?.data) {
        setEditFormData(response.data);
        setOpenEdit(true);
      } else {
        toast.error('Failed to load form data');
      }
    } catch (error) {
      toast.error('Failed to fetch form data');
    }
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setEditFormData(null);
  };

  const handleDeleteClick = (row) => {
    setFormToDelete(row);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteApi(`${urls.forms.delete}/${formToDelete.link}`);
      toast.success('Form deleted successfully');
      getAllForms();
    } catch (error) {
      toast.error('Failed to delete form');
    } finally {
      setDeleteConfirmOpen(false);
      setFormToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setFormToDelete(null);
  };

  const handleNavigate = (id) => {
    window.open(`/surveyform/${id}`, '_blank');
    // navigate(`/surveyform/${id}`)
  };

  const getAllForms = async () => {
    setLoading(true);
    const queryParams = new URLSearchParams({
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize
    });
    if (searchQuery) {
      queryParams.append('search', searchQuery);
    }
    if (formType) {
      queryParams.append('type', formType);
    }
    if (formTitle) {
      queryParams.append('title', formTitle);
    }
    if (dateCreated) {
      queryParams.append('createdAt', dateCreated);
    }
    const fromUrl = `${urls?.forms?.getAll}?${queryParams.toString()}`;
    const response = await getApi(fromUrl);
    const pagination = response?.data?.meta || { total: 0 };
    const formattedData = response?.data?.data?.map((item, index) => {
      let data = {
        id: item?._id,
        index: index + 1,
        title: item?.title,
        description: item?.description,
        formType: item?.type,
        link: item?.publicId
      };
      return data;
    });
    setTotalRows(pagination?.total);
    setRows(formattedData);
    setLoading(false);
  };
  useEffect(() => {
    getAllForms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, formType, paginationModel, formTitle, dateCreated]);

  const getFormTypes = async () => {
    const url = `${urls?.forms?.getAll}?limit=1000`;
    const response = await getApi(url);
    const options = response?.data?.data?.map((item) => ({
      value: item?.title,
      label: item?.title
    }));
    const optionsType = response?.data?.data?.map((item) => ({
      value: item?.type,
      label: item?.type
    }));
    setFormTypes(optionsType);
    setFormTitles(options);
  };
  useEffect(() => {
    getFormTypes();
  }, []);

  const columns = [
    {
      field: 'title',
      headerName: 'Form Display Title',
      flex: 0.8,
      renderCell: (params) => <Chip label={params.value} sx={{ bgcolor: '#e5f8fe', color: '#79dbfb' }} />
    },
    {
      field: 'description',
      headerName: 'Form Description',
      flex: 0.8,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
          {params.value}
        </Typography>
      )
    },

    {
      field: 'formType',
      headerName: 'Form Type',
      flex: 0.8,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ whiteSpace: 'normal' }}>
          {params.value}
        </Typography>
      )
    },

    {
      field: 'edit',
      headerName: 'Action',
      flex: 0.7,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title="Open Form" arrow>
            <IconButton
              size="small"
              onClick={() => handleNavigate(params.row.link)}
              sx={{
                color: '#009fc7',
                '&:hover': { backgroundColor: '#e5f8fe' }
              }}
            >
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Form" arrow>
            <IconButton
              size="small"
              onClick={() => handleEdit(params.row)}
              sx={{
                color: '#5c5cff',
                '&:hover': { backgroundColor: '#f0f0ff' }
              }}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Form" arrow>
            <IconButton
              size="small"
              onClick={() => handleDeleteClick(params.row)}
              sx={{
                color: '#e53935',
                '&:hover': { backgroundColor: '#fdecea' }
              }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <>
      <Grid>
        <AddFormModal open={openAdd} onClose={handleCloseAdd} getAllForms={getAllForms} />
        <EditFormModal open={openEdit} onClose={handleCloseEdit} getAllForms={getAllForms} editFormData={editFormData} />
        <Dialog open={deleteConfirmOpen} onClose={handleDeleteCancel}>
          <DialogTitle>Delete Form</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete <strong>{formToDelete?.title}</strong>? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} sx={{ color: '#555' }}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              variant="contained"
              sx={{ backgroundColor: '#e53935', '&:hover': { backgroundColor: '#c62828' } }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Card sx={{ backgroundColor: '#eef2f6' }}>
          <Grid>
            <Stack direction="row" alignItems="center" justifyContent="space-between" m={1} marginBlock={3}>
              <Tooltip title="Add" arrow>
                <IconButton
                  onClick={() => handleOpenAdd()}
                  sx={{
                    backgroundColor: '#009fc7',
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    paddingInline: '15px',
                    paddingBlock: '7px',
                    borderRadius: '10px',
                    width: '220px',
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
                  Add New Form
                  <AddIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '30px',
                  paddingLeft: '16px',
                  border: '1px solid #e0e0e0',
                  width: '489px',
                  height: '45px'
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
          </Grid>

          <Grid container spacing={2}>
            <FilterPanel
              showFilter={showFilter}
              formTypes={formTypes}
              formType={formType}
              setFormType={setFormType}
              formTitles={formTitles}
              formTitle={formTitle}
              setFormTitle={setFormTitle}
              dateCreated={dateCreated}
              setDateCreated={setDateCreated}
              selectedFilters={['formType', 'formDisplayTitle', 'dateCreated']}
            />

            <Grid item xs={9}>
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
                  slots={{
                    toolbar: () => (
                      <CustomHeader
                        entityType="form"
                        title="Form List"
                        selectedIds={selectedIds}
                        enableBulkActions={false}
                        exportEnabled={true}
                        extraActions={null}
                        refetchData={getAllForms}
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
                  getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row')}
                  rowHeight={65}
                  // getRowHeight={() => 'auto'}
                  // sx={{
                  //   '& .MuiDataGrid-cell': {
                  //     whiteSpace: 'normal',
                  //     lineHeight: '1.4rem',
                  //     py: 1
                  //   },
                  //   '& .MuiDataGrid-row': {
                  //     borderBottom: '1px solid #ccc'
                  //   },
                  //   '& .MuiDataGrid-columnHeader': {
                  //     backgroundColor: '#f5f5f5'
                  //   }
                  // }}
                  rowCount={totalRows}
                  pagination
                  paginationMode="server"
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  onRowSelectionModelChange={(newSelection) => {
                    setSelectedIds(newSelection);
                  }}
                  pageSizeOptions={[5, 10, 25, 50]}
                />
              </Card>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </>
  );
};

export default Lead;
