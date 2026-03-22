export const SUBROLES = {
  INDIVIDUAL: 'donar_individual',
  COMPANY: 'donar_company',
  GROUP: 'donar_group'
};

export const ROLES = {
  SERVICE_USER: 'service_user',
  USER: 'user',
  DONOR: 'donor',
  VOLUNTEER: 'volunteer'
};

export const entityTypeMap = {
  'Service user': 'service_user',
  Volunteer: 'volunteer',
  Service: 'services',
  Case: 'cases',
  Donor: 'donor',
  'Mailing List': 'mailing_list',
  Donation: 'donation',
  Form: 'form'
};
export const sessionNames = [
  { value: 'sessionA', label: 'Session A' },
  { value: 'sessionB', label: 'Session B' }
];
export const listTypeFilter = [
  { value: 'Service user', label: 'Service user' },
  { value: 'Volunteer', label: 'Volunteer ' },
  { value: 'Service', label: 'Service ' },
  { value: 'Case', label: 'Case' },
  { value: 'Donor', label: 'Donor' },
  { value: 'Mailing List', label: 'Mailing List' },
  { value: 'Donation', label: 'Donation' },
  { value: 'Form', label: 'Form' }
];
export const ethnicityOptions = [
  'Arabic or North African',
  'Asian or Asian British – Indian',
  'Asian – Pakistani',
  'Asian – Bangladeshi',
  'Asian – Any other Asian background',
  'Black – Caribbean',
  'Black – African',
  'Black – Any other Black background',
  'Mixed – White and Black Caribbean',
  'Mixed – White and Black African',
  'Mixed – White and Asian',
  'Mixed – Other',
  'Chinese',
  'White – British',
  'White – Irish',
  'White – Other',
  'Unknown'
];

export const stateStyles = [
  { color: '#E9B867', icon: '?' },
  { color: '#7CBD71', icon: '✓' },
  { color: '#CE655D', icon: '✕' }
];

export const districts = [
  { label: 'Adur and Worthing Borough', value: 'adur_worthing_borough' },
  { label: 'Adur District', value: 'adur_district' },
  { label: 'Amber Valley Borough', value: 'amber_valley_borough' },
  { label: 'Arun District', value: 'arun_district' },
  { label: 'Ashford Borough', value: 'ashford_borough' },
  { label: 'Babergh District', value: 'babergh_district' },
  { label: 'Ashfield District', value: 'ashfield_district' },
  { label: 'Basildon Borough', value: 'basildon_borough' }
];

export const contactMethodInitial = {
  Telephone: 0,
  Email: 0,
  Letter: 0,
  SMS: 0,
  Whatsapp: 0
};

export const dateAddedFilters = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'Last 7 Days' },
  { value: 'month', label: 'Last 30 Days' },
  { value: 'year', label: 'Last 1 Year' }
];

export const colors = ['#FF5733', '#33FF57', '#3357FF', '#F39C12', '#9B59B6', '#1ABC9C', '#E74C3C', '#2ECC71'];

export const statusFilter = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
];

export const TagCategoryAppliedToOptions = ['Service Users', 'Volunteers', 'Services', 'Cases', 'Donors', 'Session'];

export const accountTypes = [
  { label: 'Admin', value: 'admin' },
  { label: 'User', value: 'user' }
];

export const permissionsList = [
  { label: 'People', key: 'people' },
  { label: 'Cases', key: 'cases' },
  { label: 'Services', key: 'services' },
  { label: 'Forms', key: 'forms' },
  { label: 'Donor management', key: 'donorManagement' },
  { label: 'Mailing List', key: 'mailingList' }
];

export const channelOptions = ['telephone', 'email', 'letter', 'sms', 'whatsapp', 'donor_tag'];

export const fieldOptions = [
  // Personal Info
  { value: 'personalInfo.firstName', label: 'First Name' },
  { value: 'personalInfo.lastName', label: 'Last Name' },
  { value: 'personalInfo.title', label: 'Title' },
  { value: 'personalInfo.gender', label: 'Gender' },
  { value: 'personalInfo.dateOfBirth', label: 'Date of Birth' },
  { value: 'personalInfo.nickName', label: 'Nickname' },
  { value: 'personalInfo.ethnicity', label: 'Ethnicity' },

  // Contact Info
  { value: 'contactInfo.homePhone', label: 'Home Phone' },
  { value: 'contactInfo.phone', label: 'Phone' },
  { value: 'contactInfo.email', label: 'Email' },
  { value: 'contactInfo.addressLine1', label: 'Address Line 1' },
  { value: 'contactInfo.addressLine2', label: 'Address Line 2' },
  { value: 'contactInfo.town', label: 'Town' },
  { value: 'contactInfo.district', label: 'Borough/District' },
  { value: 'contactInfo.postcode', label: 'Postcode' },
  { value: 'contactInfo.country', label: 'Country' },
  { value: 'contactInfo.firstLanguage', label: 'First Language' },

  // Emergency Contact
  { value: 'emergencyContact.firstName', label: 'Emergency Contact First Name' },
  { value: 'emergencyContact.lastName', label: 'Emergency Contact Last Name' },
  { value: 'emergencyContact.title', label: 'Emergency Contact Title' },
  { value: 'emergencyContact.gender', label: 'Emergency Contact Gender' },
  { value: 'emergencyContact.relationshipToUser', label: 'Relationship to Service User' },
  { value: 'emergencyContact.homePhone', label: 'Emergency Contact Home Phone' },
  { value: 'emergencyContact.phone', label: 'Emergency Contact Phone' },
  { value: 'emergencyContact.email', label: 'Emergency Contact Email' },
  { value: 'emergencyContact.addressLine1', label: 'Emergency Contact Address Line 1' },
  { value: 'emergencyContact.addressLine2', label: 'Emergency Contact Address Line 2' },
  { value: 'emergencyContact.country', label: 'Emergency Contact Country' },
  { value: 'emergencyContact.town', label: 'Emergency Contact Town' },
  { value: 'emergencyContact.postcode', label: 'Emergency Contact Postcode' }
];
export const transactionFieldOptions = [
  { value: 'amountPaid', label: 'Amount Paid' },
  { value: 'processingCost', label: 'Processing Cost' },
  { value: 'receiptNumber', label: 'Receipt Number' },
  { value: 'transactionId', label: 'Transaction ID' },
  { value: 'isArchive', label: 'Archived' },
  { value: 'isDelete', label: 'Deleted' },
  { value: 'isCompletlyDelete', label: 'Completely Deleted' },
  { value: 'createdAt', label: 'Created Date' },
  { value: 'updatedAt', label: 'Updated Date' }
];
export const serviceFieldOptions = [
  { value: 'name', label: 'Name' },
  { value: 'code', label: 'Code' },
  { value: 'isArchive', label: 'Archived' },
  { value: 'description', label: 'Description' }
];
export const caseFieldOptions = [
  { value: 'uniqueId', label: 'Case ID' },
  { value: 'caseOpened', label: 'Case Opened Date' },
  { value: 'caseClosed', label: 'Case Closed Date' },
  { value: 'description', label: 'Description' },
  { value: 'status', label: 'Status' }
];
export const formFieldOptions = [
  { value: 'title', label: 'Title' },
  { value: 'type', label: 'Type' },
  { value: 'description', label: 'Description' },
  { value: 'records', label: 'Records' },
  { value: 'publicId', label: 'Public ID' },
  { value: 'createdAt', label: 'Created Date' },
  { value: 'fields.label', label: 'Field Label' },
  { value: 'fields.type', label: 'Field Type' },
  { value: 'fields.required', label: 'Field Required' }
];
export const mailingListFieldOptions = [
  { value: 'name', label: 'Name' },
  { value: 'userType', label: 'User Type' }
];


