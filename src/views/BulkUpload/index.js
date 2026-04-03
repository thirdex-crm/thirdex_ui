import { Grid, Typography } from '@mui/material';
import React from 'react';
import BulkUploadInfoBox from './InfoBox';
import BulkUploadActions from './BulkUploadActions';
import FileUploadBox from './FileUploadBox';

import Papa from 'papaparse';
import ExcelJS from 'exceljs';
import { useState } from 'react';
import { urls } from 'common/urls';
import { postApi } from 'common/apiClient';
import toast from 'react-hot-toast';

const BulkUploadFile = () => {
  const [uploadType, setUploadType] = useState('');

  const handleFileUpload = async (file) => {
    if (!uploadType) {
      toast.error('Please select an upload type before uploading a file');
      return;
    }

    const fileType = file.name.split('.').pop();

    if (fileType === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: ({ data }) => {
          switch (uploadType) {
            case 'users':
              return validateAndUploadServiceUser(data);
            case 'services':
              return validateAndUploadServices(data);
            case 'donors':
              return validateAndUploadDonor(data);
            case 'cases':
              return validateAndUploadCases(data);
            default:
              throw new Error('Unsupported upload target');
          }
        },
        error: (err) => {
          alert('CSV parsing failed');
          console.error(err);
        }
      });
    } else if (fileType === 'xlsx') {
      const buffer = await file.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);

      // Helper: parse a worksheet into array of row objects
      const parseSheet = (worksheet) => {
        if (!worksheet) return [];
        const headers = worksheet.getRow(1).values.slice(1);
        const data = [];
        worksheet.eachRow((row, index) => {
          if (index === 1) return;
          const rowData = {};
          headers.forEach((header, i) => {
            rowData[header] = row.values[i + 1];
          });
          // Skip completely empty rows
          if (Object.values(rowData).some((v) => v !== undefined && v !== null && v !== '')) {
            data.push(rowData);
          }
        });
        return data;
      };

      if (uploadType === 'donors') {
        // Sheet 1: Donor data, Sheet 2: Financial data
        const donorSheet = workbook.worksheets[0];
        const financialSheet = workbook.worksheets[1];
        const donorRows = parseSheet(donorSheet);
        const financialRows = parseSheet(financialSheet);
        if (donorRows.length > 0) await validateAndUploadDonor(donorRows);
        if (financialRows.length > 0) await validateAndUploadFinancial(financialRows);
        return;
      }

      const worksheet = workbook.worksheets[0];
      const data = parseSheet(worksheet);

      switch (uploadType) {
        case 'users':
          return validateAndUploadServiceUser(data);
        case 'services':
          return validateAndUploadServices(data);
        case 'cases':
          return validateAndUploadCases(data);
        default:
          throw new Error('Unsupported upload target');
      }
    } else {
      alert('Unsupported file format. Please upload .csv or .xlsx');
    }
  };

  const validateAndUploadCases = async (rows) => {
    const requiredFields = ['service_user', 'service', 'case_owner', 'case_open_date', 'case_closed_date'];
    const errors = [];

    rows.forEach((row, i) => {
      requiredFields.forEach((field) => {
        if (!row[field]) {
          errors.push(`Row ${i + 2}: Missing ${field}`);
        }
      });
    });

    if (errors.length) {
      console.error(errors);
      alert('Validation failed. See console.');
      return;
    }

    try {
      const res = await postApi(urls.case.bulkUpload, rows);
      if (res?.success) {
        toast.success('Successfully uploaded Case data');
      } else {
        toast.error('Upload failed. Please check your data and try again');
      }
    } catch (error) {
      console.log('error in cases bulkUpload===========>', error);
      toast.error('Error uploading case data, make sure data is correct');
    }
  };
  const validateAndUploadServices = async (rows) => {
    const requiredFields = ['service_name', 'service_code', 'service_type'];
    const errors = [];

    rows.forEach((row, i) => {
      requiredFields.forEach((field) => {
        if (!row[field]) {
          errors.push(`Row ${i + 2}: Missing ${field}`);
        }
      });
    });

    if (errors.length) {
      console.error(errors);
      alert('Validation failed. See console.');
      return;
    }

    try {
      const res = await postApi(urls.service.bulkUpload, rows);
      if (res?.success) {
        toast.success('Successfully uploaded service data');
      } else {
        toast.error('Upload failed. Please check your data and try again');
      }
    } catch (error) {
      console.log('error in service bulkUpload===========>', error);
      toast.error('Error uploading service data, make sure data is correct');
    }
  };
  const validateAndUploadServiceUser = async (rows) => {
    const requiredFields = [
      'personalInfo_gender',
      'personalInfo_firstname',
      'personalInfo_lastname',
      'personalInfo_ethnicity',
      'contactInfo_homephone',
      'contactInfo_phone',
      'contactInfo_email'
    ];
    const errors = [];

    rows.forEach((row, i) => {
      requiredFields.forEach((field) => {
        if (!row[field]) {
          errors.push(`Row ${i + 2}: Missing ${field}`);
        }
      });
    });

    if (errors.length) {
      console.error(errors);
      alert('Validation failed. See console.');
      return;
    }

    try {
      const res = await postApi(urls.serviceuser.bulkUploadUsers, rows);
      if (res?.success) {
        toast.success('Successfully uploaded service user data');
      } else {
        toast.error('Upload failed. Please check your data and try again');
      }
    } catch (error) {
      console.log('error in service user bulkUpload===========>', error);
      toast.error('Error uploading service user data, make sure data is correct');
    }
  };
  const validateAndUploadDonor = async (rows) => {
    const requiredFields = [
      'personalInfo_gender',
      'personalInfo_firstname',
      'personalInfo_lastname',
      'contactInfo_homephone',
      'contactInfo_phone',
      'contactInfo_email'
    ];
    const errors = [];

    rows.forEach((row, i) => {
      requiredFields.forEach((field) => {
        if (!row[field]) {
          errors.push(`Row ${i + 2}: Missing ${field}`);
        }
      });
    });

    if (errors.length) {
      console.error(errors);
      alert('Validation failed. See console.');
      return;
    }

    try {
      const res = await postApi(urls.serviceuser.bulkUploadDonors, rows);
      if (res?.success) {
        toast.success('Successfully uploaded donor data');
      } else {
        toast.error('Upload failed. Please check your data and try again');
      }
    } catch (error) {
      console.log('error in service user bulkUpload===========>', error);
      toast.error('Error uploading service user data, make sure data is correct');
    }
  };

  const validateAndUploadFinancial = async (rows) => {
    const requiredFields = ['amountPaid', 'paymentMethod', 'campaign'];
    const errors = [];

    rows.forEach((row, i) => {
      requiredFields.forEach((field) => {
        if (!row[field]) {
          errors.push(`Row ${i + 2}: Missing ${field}`);
        }
      });
    });

    if (errors.length) {
      console.error(errors);
      alert('Financial sheet validation failed. See console.');
      return;
    }

    try {
      const res = await postApi(urls.transaction.bulkUpload, rows);
      const saved = res?.data?.results?.length ?? 0;
      const failed = res?.data?.errors?.length ?? 0;

      if (saved > 0 && failed === 0) {
        toast.success(`Successfully uploaded ${saved} financial record${saved !== 1 ? 's' : ''}`);
      } else if (saved > 0 && failed > 0) {
        toast.success(
          `Uploaded ${saved} record${saved !== 1 ? 's' : ''}. ${failed} row${
            failed !== 1 ? 's' : ''
          } failed — check that Campaign and Payment Method names match your Configuration settings.`
        );
      } else {
        const firstError =
          res?.data?.errors?.[0]?.error || 'Make sure Campaign and Payment Method names match your Configuration settings exactly.';
        toast.error(`Financial upload failed: ${firstError}`);
      }
    } catch (error) {
      console.log('error in financial bulkUpload===========>', error);
      toast.error('Error uploading financial data, make sure data is correct');
    }
  };
  return (
    <>
      <Grid container spacing={1} p={2}>
        <Grid item xs={12}>
          <Typography fontWeight="600" fontSize="16px" display="flex" alignItems="center">
            Bulk Upload
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <BulkUploadInfoBox />
        </Grid>
        <Grid item xs={12}>
          <BulkUploadActions uploadType={uploadType} setUploadType={setUploadType} />
        </Grid>
        <Grid item xs={12}>
          <FileUploadBox onFileUpload={handleFileUpload} />
        </Grid>
        {/* <Grid item xs={12}>
                    <UploadedHistory />
                </Grid> */}
      </Grid>
    </>
  );
};

export default BulkUploadFile;
