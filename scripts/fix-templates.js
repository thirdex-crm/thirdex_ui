const ExcelJS = require('exceljs');
const path = require('path');

const BASE = path.join(__dirname, '../public/sampleFiles');

// Donor template (2 sheets, generated from scratch)
const buildDonorTemplate = async () => {
  const wb = new ExcelJS.Workbook();

  // Sheet 1: Donor
  const donorSheet = wb.addWorksheet('Donor');
  donorSheet.addRow([
    'personalInfo_title','personalInfo_gender','personalInfo_firstname','personalInfo_lastname',
    'personalInfo_dob','contactInfo_homephone','contactInfo_phone','contactInfo_email',
    'contactInfo_addressLine1','contactInfo_addressLine2','contactInfo_district',
    'contactInfo_postcode','contactInfo_country','otherInfo_tags',
    'contactPreferences_contactPurposes','contactPurposes_dateOfConfirmation',
    'contactPurposes_reason','contactPurposes_contactMethods_donerTag',
    'contactPurposes_contactMethods_email','contactPurposes_contactMethods_letter',
    'contactPurposes_contactMethods_sms','contactPurposes_contactMethods_whatsapp',
    'companyInformation_companyName','companyInformation_mainContact',
    'companyInformation_socialMediaLinks','companyInformation_recruitmentCampaign','subRole',
  ]);
  donorSheet.addRow([
    'Mr','Male','John','Smith','1985-06-15','07700900000','07700900001',
    'john.smith@example.com','10 High Street','Apartment 2','southwark','SE1 1AA',
    'United Kingdom','Tag1, Tag2','Email','2024-01-01','Personal',
    'true','true','false','false','false','','','','','donar_individual',
  ]);

  // Sheet 2: Financial
  // IMPORTANT: paymentMethod/campaign/currency/productId must exactly match
  // config names in your Configuration settings.
  const financialSheet = wb.addWorksheet('Financial');
  financialSheet.addRow([
    'donor_email','amountPaid','paymentMethod','campaign','currency',
    'productId','processingCost','receiptNumber','transactionId','amountDue','quantity',
  ]);
  // Replace the values below with names that exactly match your Configuration settings
  financialSheet.addRow([
    'john.smith@example.com', 100, 'YOUR_PAYMENT_METHOD_NAME', 'YOUR_CAMPAIGN_NAME', 'YOUR_CURRENCY_NAME',
    'YOUR_PRODUCT_NAME', 2.5, 'REC-001', 'TXN-001', 0, 1,
  ]);

  await wb.xlsx.writeFile(path.join(BASE, 'service_donorSample_file.xlsx'));
  console.log('Generated: service_donorSample_file.xlsx (Donor + Financial sheets)');
};

// Service-user template: remove unwanted columns using a fresh workbook
const buildServiceUserTemplate = async () => {
  const filePath = path.join(BASE, 'service_user_sample_file.xlsx');
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);
  const ws = wb.worksheets[0];

  const colsToRemove = new Set([
    'otherInfo_file','otherInfo_notes','otherInfo_restrict_access','personalInfo_profile_image',
    'riskAssessment_notes',
  ]);

  const headers = ws.getRow(1).values.slice(1);
  const removeIndices = new Set();
  headers.forEach((h, i) => { if (colsToRemove.has(h)) removeIndices.add(i); });

  if (removeIndices.size === 0) {
    console.log('service_user_sample_file.xlsx: no columns to remove');
    return;
  }

  const newHeaders = headers.filter((_, i) => !removeIndices.has(i));
  const dataRows = [];
  ws.eachRow((row, rowIdx) => {
    if (rowIdx === 1) return;
    const vals = row.values.slice(1);
    dataRows.push(vals.filter((_, i) => !removeIndices.has(i)));
  });

  const wb2 = new ExcelJS.Workbook();
  const ws2 = wb2.addWorksheet(ws.name || 'Sheet1');
  ws2.addRow(newHeaders);
  dataRows.forEach(r => ws2.addRow(r));

  await wb2.xlsx.writeFile(filePath);
  console.log('Updated: service_user_sample_file.xlsx (removed ' + removeIndices.size + ' columns)');
};

// Services template: rebuild without file and notes columns
const buildServicesTemplate = async () => {
  const filePath = path.join(BASE, 'services_sample_file.xlsx');
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);
  const ws = wb.worksheets[0];

  const colsToRemove = new Set(['file', 'notes']);

  const headers = ws.getRow(1).values.slice(1);
  const removeIndices = new Set();
  headers.forEach((h, i) => { if (colsToRemove.has(h)) removeIndices.add(i); });

  if (removeIndices.size === 0) {
    console.log('services_sample_file.xlsx: no columns to remove');
    return;
  }

  const newHeaders = headers.filter((_, i) => !removeIndices.has(i));
  const dataRows = [];
  ws.eachRow((row, rowIdx) => {
    if (rowIdx === 1) return;
    const vals = row.values.slice(1);
    dataRows.push(vals.filter((_, i) => !removeIndices.has(i)));
  });

  const wb2 = new ExcelJS.Workbook();
  const ws2 = wb2.addWorksheet(ws.name || 'Sheet1');
  ws2.addRow(newHeaders);
  dataRows.forEach(r => ws2.addRow(r));

  await wb2.xlsx.writeFile(filePath);
  console.log('Updated: services_sample_file.xlsx (removed ' + removeIndices.size + ' columns)');
};

// Cases template: rebuild without notes and file columns
const buildCasesTemplate = async () => {
  const filePath = path.join(BASE, 'case_sample_file.xlsx');
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);
  const ws = wb.worksheets[0];

  const colsToRemove = new Set(['file', 'notes']);

  const headers = ws.getRow(1).values.slice(1);
  const removeIndices = new Set();
  headers.forEach((h, i) => { if (colsToRemove.has(h)) removeIndices.add(i); });

  if (removeIndices.size === 0) {
    console.log('case_sample_file.xlsx: no columns to remove');
    return;
  }

  const newHeaders = headers.filter((_, i) => !removeIndices.has(i));
  const dataRows = [];
  ws.eachRow((row, rowIdx) => {
    if (rowIdx === 1) return;
    const vals = row.values.slice(1);
    dataRows.push(vals.filter((_, i) => !removeIndices.has(i)));
  });

  const wb2 = new ExcelJS.Workbook();
  const ws2 = wb2.addWorksheet(ws.name || 'Sheet1');
  ws2.addRow(newHeaders);
  dataRows.forEach(r => ws2.addRow(r));

  await wb2.xlsx.writeFile(filePath);
  console.log('Updated: case_sample_file.xlsx (removed ' + removeIndices.size + ' columns)');
};

Promise.all([buildDonorTemplate(), buildServiceUserTemplate(), buildServicesTemplate(), buildCasesTemplate()])
  .then(() => console.log('All done'))
  .catch(console.error);
