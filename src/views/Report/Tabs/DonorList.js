import PropTypes from 'prop-types';
import { Grid, Typography, IconButton, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid';
import React from 'react';
import { getApi } from 'common/apiClient';
import { urls } from 'common/urls';
import { useState, useEffect } from 'react';
import SingleRowLoader from 'ui-component/Loader/SingleRowLoader';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useGridApiContext } from '@mui/x-data-grid';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
const CaseList = ({ selectedName, status, startDate, endDate }) => {
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  });
  const [rows, setRows] = useState([]);

  const columns = [
    {
      field: 'receiptNumber',
      headerName: 'Receipt No.',
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="500" sx={{ fontSize: '12px' }}>
          #{params.value || '-'}
        </Typography>
      )
    },
    {
      field: 'type',
      headerName: 'Name',
      flex: 1.5,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 'normal',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            fontSize: '12px'
          }}
        >
          {params.value || '-'}
        </Typography>
      )
    },
    {
      field: 'title',
      headerName: 'Credited At',
      flex: 1,
      renderCell: (params) => <Typography sx={{ fontSize: '12px' }}>{params?.value || '-'}</Typography>
    },
    {
      field: 'status',
      headerName: 'Amount',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        const formatAmount = (value) => {
          const numericValue = parseFloat(value.replace(/[^\d.-]/g, ''));
          if (isNaN(numericValue)) return `$0`;
          let formattedValue = numericValue;
          let suffix = '';
          if (numericValue >= 1_000_000_000) {
            formattedValue = (numericValue / 1_000_000_000).toFixed(1);
            suffix = 'B';
          } else if (numericValue >= 1_000_000) {
            formattedValue = (numericValue / 1_000_000).toFixed(1);
            suffix = 'M';
          } else if (numericValue >= 1_000) {
            formattedValue = (numericValue / 1_000).toFixed(1);
            suffix = 'K';
          }

          return `$${formattedValue}${suffix}`;
        };

        return (
          <Typography variant="body2" fontWeight="600" sx={{ color: 'green', fontSize: '12px' }}>
            {formatAmount(params.value) || '-'}
          </Typography>
        );
      }
    },

    {
      field: 'phone',
      headerName: 'Phone',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        const phoneNumber = params.value ? params.value.replace(/^\+91/, '') : '-';
        return (
          <Typography variant="body2" sx={{ fontSize: '12px' }}>
            {phoneNumber || '-'}
          </Typography>
        );
      }
    }
  ];
  useEffect(() => {
    const fetchDonor = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          page: 1,
          limit: 1000
        });

        if (selectedName) {
          queryParams.append('name', selectedName);
        }
        if (status) queryParams.append('status', status === 'active');

        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);
        const response = await getApi(`${urls.transaction.fetchWithPagination}?${queryParams.toString()}`);

        const allTransaction = response?.data?.data || [];

        const formattedTransactions = allTransaction?.map((item, index) => ({
          id: item?._id || index,
          title: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-',
          type:
            item?.donorId?.personalInfo?.firstName || item?.donorId?.personalInfo?.lastName
              ? [`${item?.donorId?.personalInfo?.firstName || '-'}`, `${item?.donorId?.personalInfo?.lastName || '-'}`].join(' ')
              : [item?.donorId?.companyInformation?.companyName || '-'],

          code: item?.campaign?.name || item.campaign || '-',
          status: item?.amountPaid != null ? `₹${item.amountPaid}` : '-',
          more: item?.transactionId || '-',
          receiptNumber: item?.receiptNumber || '-',
          phone: item?.donorId?.contactInfo?.phone || '-'
        }));
        setRows(formattedTransactions);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonor();
  }, [selectedName, status, startDate, endDate]);
  const CustomHeader = () => {
    const apiRef = useGridApiContext();

    const handleExportCSV = () => {
      apiRef.current.exportDataAsCsv();
    };

    const handlePrint = () => {
      apiRef.current.exportDataAsPrint({
        pageStyle:
          '@page { size: landscape; margin: 10mm; } body { -webkit-print-color-adjust: exact; } .MuiDataGrid-footerContainer { display: none !important; } .MuiDataGrid-scrollbar { display: none !important; } .MuiIconButton-root { display: none !important; }'
      });
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
              fontWeight: '450',
              color: '#333',
              fontSize: '13px',
              lineHeight: '36px'
            }}
          >
            {' '}
            Donor Report List
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Tooltip title="Print">
                <IconButton size="small" onClick={handlePrint}>
                  <PrintOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Download CSV">
                <IconButton size="small" onClick={handleExportCSV}>
                  <SaveAltOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Open in New Tab">
                <IconButton size="small" onClick={() => window.open(window.location.href, '_blank')}>
                  <OpenInNewIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </GridToolbarContainer>
      </Box>
    );
  };

  return (
    <>
      <Grid container>
        <Box sx={{ backgroundColor: '#fff', borderRadius: 2, width: '100%' }}>
          <DataGrid
            autoHeight
            rows={loading ? [] : rows}
            columns={columns}
            rowHeight={55}
            loading={loading}
            getRowId={(row) => row.id}
            checkboxSelection
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 25, 50, 100]}
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
            getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row')}
            sx={{
              '& .MuiDataGrid-row': {
                borderBottom: '1px solid #ccc'
              },
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
    </>
  );
};

CaseList.propTypes = {
  selectedName: PropTypes.string,
  status: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string
};

export default CaseList;
