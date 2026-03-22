import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Switch,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { urls } from 'common/urls';
import { getApi } from 'common/apiClient';
import { useEffect } from 'react';

const DefaultFields = ({ templateData, setTemplateData, setPreset, onClose, setFormValues }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  // const templates = [
  //     {
  //         id: 1,
  //         name: 'Community Refferal Form',
  //         data: [
  //             {
  //                 "type": "header",
  //                 "subtype": "h1",
  //                 "label": "Community Referral"
  //             },
  //             {
  //                 "type": "text",
  //                 "required": true,
  //                 "label": "Name",
  //                 "className": "form-control",
  //                 "name": "text-1747390638003-0",
  //                 "subtype": "text"
  //             },
  //             {
  //                 "type": "text",
  //                 "required": true,
  //                 "label": "Contact Number",
  //                 "className": "form-control",
  //                 "name": "text-1747390643179-0",
  //                 "subtype": "text"
  //             },
  //             {
  //                 "type": "text",
  //                 "required": true,
  //                 "label": "Email",
  //                 "className": "form-control",
  //                 "name": "text-1747390648300-0",
  //                 "subtype": "text"
  //             },
  //             {
  //                 "type": "text",
  //                 "required": true,
  //                 "label": "Job Role",
  //                 "className": "form-control",
  //                 "name": "text-1747390640020-0",
  //                 "subtype": "text"
  //             },
  //             {
  //                 "type": "select",
  //                 "required": true,
  //                 "label": "What is you relationship to the person you are referring?",
  //                 "className": "form-control",
  //                 "name": "select-1747393619538-0",
  //                 "values": [
  //                     {
  //                         "label": "Parent",
  //                         "value": "Parent",
  //                         "selected": true
  //                     },
  //                     {
  //                         "label": "Family",
  //                         "value": "Family",
  //                         "selected": false
  //                     },
  //                     {
  //                         "label": "Professional",
  //                         "value": "Professional",
  //                         "selected": false
  //                     }
  //                 ]
  //             },
  //             {
  //                 "type": "paragraph",
  //                 "subtype": "p",
  //                 "label": "Details of person you are referring to our service Please enter the details of the person you are referring in this section</div>"
  //             },
  //             {
  //                 "type": "text",
  //                 "required": true,
  //                 "label": "First Name",
  //                 "className": "form-control",
  //                 "name": "text-1747393699662-0",
  //                 "subtype": "text"
  //             },
  //             {
  //                 "type": "text",
  //                 "required": true,
  //                 "label": "Last Name",
  //                 "className": "form-control",
  //                 "name": "text-1747393699662-0",
  //                 "subtype": "text"
  //             },
  //             {
  //                 "type": "text",
  //                 "required": false,
  //                 "label": "Preferred Name",
  //                 "className": "form-control",
  //                 "name": "text-1747393729122-0",
  //                 "subtype": "text"
  //             },
  //             {
  //                 "type": "textarea",
  //                 "required": true,
  //                 "label": "Address",
  //                 "className": "form-control",
  //                 "name": "textarea-1747392000535-0",
  //                 "subtype": "textarea"
  //             },
  //             {
  //                 "type": "text",
  //                 "required": true,
  //                 "label": "Email",
  //                 "className": "form-control",
  //                 "name": "text-1747393741211-0",
  //                 "subtype": "text"
  //             },
  //             {
  //                 "type": "text",
  //                 "required": false,
  //                 "label": "Phone Number",
  //                 "className": "form-control",
  //                 "name": "text-1747393776960-0",
  //                 "subtype": "text"
  //             },
  //             {
  //                 "type": "select",
  //                 "required": true,
  //                 "label": "Which service are you referring yourself to?",
  //                 "className": "form-control",
  //                 "name": "select-1747393860748-0",
  //                 "values": [
  //                     {
  //                         "label": "Sevices",
  //                         "value": "services",
  //                         "selected": true
  //                     },
  //                     {
  //                         "label": "Option 2",
  //                         "value": "option-2",
  //                         "selected": false
  //                     }
  //                 ]
  //             },
  //             {
  //                 "type": "radio-group",
  //                 "required": false,
  //                 "label": "Gender",
  //                 "name": "radio-group-1747393911151-0",
  //                 "values": [
  //                     {
  //                         "label": "Male",
  //                         "value": "male",
  //                         "selected": false
  //                     },
  //                     {
  //                         "label": "Female",
  //                         "value": "female",
  //                         "selected": false
  //                     },
  //                     {
  //                         "label": "Other",
  //                         "value": "other",
  //                         "selected": false
  //                     }
  //                 ]
  //             },
  //             {
  //                 "type": "select",
  //                 "required": false,
  //                 "label": "Ethicity",
  //                 "className": "form-control",
  //                 "name": "select-1747393962260-0",
  //                 "values": [
  //                     {
  //                         "label": "Option 1",
  //                         "value": "option1",
  //                         "selected": true
  //                     },
  //                     {
  //                         "label": "Option 2",
  //                         "value": "option-2",
  //                         "selected": false
  //                     }
  //                 ]
  //             },
  //             {
  //                 "type": "select",
  //                 "required": false,
  //                 "label": "First Language",
  //                 "className": "form-control",
  //                 "name": "select-1747394001540-0",
  //                 "values": [
  //                     {
  //                         "label": "English",
  //                         "value": "English",
  //                         "selected": true
  //                     },
  //                     {
  //                         "label": "Hindi",
  //                         "value": "hindi",
  //                         "selected": false
  //                     }
  //                 ]
  //             },
  //             {
  //                 "type": "checkbox-group",
  //                 "required": false,
  //                 "label": "What are their hobbies",
  //                 "name": "checkbox-group-1747394065499-0",
  //                 "values": [
  //                     {
  //                         "label": "These options will be taken from 'tags' under the 'Hobbies & Interests' category and converted to tags on the service user profile if the form is used as a 'new referral  form)",
  //                         "value": "These options will be taken from 'tags' under the 'Hobbies & Interests' category and converted to tags on the service user profile if the form is used as a 'new referral  form)",
  //                         "selected": true
  //                     }
  //                 ]
  //             },
  //             {
  //                 "type": "text",
  //                 "required": false,
  //                 "label": "please tell us your reason for referral",
  //                 "className": "form-control",
  //                 "name": "text-1747394178686-0",
  //                 "subtype": "text"
  //             },
  //             {
  //                 "type": "checkbox-group",
  //                 "required": false,
  //                 "label": "Do you have a disability or condition that you would like us to be aware of, so we can better support you ?",
  //                 "name": "checkbox-group-1747390664112-0",
  //                 "values": [
  //                     {
  //                         "label": "Yes",
  //                         "value": "Yes",
  //                         "selected": true
  //                     },
  //                     {
  //                         "label": "Prefer Not to Answer",
  //                         "value": "Prefer Not to Answer",
  //                         "selected": false
  //                     }
  //                 ]
  //             },
  //             {
  //                 "type": "select",
  //                 "required": false,
  //                 "label": "Safeguarding/Risk Factors",
  //                 "className": "form-control",
  //                 "name": "select-1747394234523-0",
  //                 "values": [
  //                     {
  //                         "label": "Response to go into 'Risk Factors' section of profile",
  //                         "value": "Response to go into 'Risk Factors' section of profile",
  //                         "selected": true
  //                     }
  //                 ]
  //             },
  //             {
  //                 "type": "radio-group",
  //                 "required": false,
  //                 "label": "Please select your reason(s) for concern:",
  //                 "name": "radio-group-1747392615161-0",
  //                 "values": [
  //                     {
  //                         "label": "Options taken from 'Key Indicators of Concern' under config.",
  //                         "value": "Options taken from 'Key Indicators of Concern' under config.",
  //                         "selected": true
  //                     }
  //                 ]
  //             }
  //         ],
  //         title: ['Community Refferal Form']
  //     },
  //     {
  //         id: 2,
  //         name: 'Volunteer Form',
  //         data: [
  //             {
  //                 "type": "header",
  //                 "subtype": "h1",
  //                 "label": "Volunteer Sign Up Form"
  //             },
  //             {
  //                 "type": "text",
  //                 "required": true,
  //                 "label": "First Name",
  //                 "className": "form-control",
  //                 "name": "text-1747390638003-0",
  //                 "subtype": "text"
  //             },
  //             {
  //                 "type": "text",
  //                 "required": true,
  //                 "label": "Last Name",
  //                 "className": "form-control",
  //                 "name": "text-1747390640020-0",
  //                 "subtype": "text"
  //             },
  //             {
  //                 "type": "text",
  //                 "required": true,
  //                 "label": "Contact Number",
  //                 "className": "form-control",
  //                 "name": "text-1747390643179-0",
  //                 "subtype": "text"
  //             },
  //             {
  //                 "type": "text",
  //                 "required": true,
  //                 "label": "Email",
  //                 "className": "form-control",
  //                 "name": "text-1747390648300-0",
  //                 "subtype": "text"
  //             },
  //             {
  //                 "type": "text",
  //                 "required": true,
  //                 "label": "Age",
  //                 "className": "form-control",
  //                 "name": "text-1747390648300-0",
  //                 "subtype": "text"
  //             },
  //             {
  //                 "type": "date",
  //                 "required": true,
  //                 "label": "Date Of Birth",
  //                 "className": "form-control",
  //                 "name": "date-1747390651030-0",
  //                 "subtype": "date"
  //             },
  //             {
  //                 "type": "radio-group",
  //                 "required": true,
  //                 "label": "Gender",
  //                 "name": "radio-group-1747392026637-0",
  //                 "values": [
  //                     {
  //                         "label": "Male",
  //                         "value": "male",
  //                         "selected": false
  //                     },
  //                     {
  //                         "label": "Female",
  //                         "value": "female",
  //                         "selected": false
  //                     },
  //                     {
  //                         "label": "Other",
  //                         "value": "other",
  //                         "selected": false
  //                     },
  //                 ]
  //             },
  //             {
  //                 "type": "textarea",
  //                 "required": true,
  //                 "label": "Address",
  //                 "className": "form-control",
  //                 "name": "textarea-1747392000535-0",
  //                 "subtype": "textarea"
  //             },
  //             {
  //                 "type": "radio-group",
  //                 "required": false,
  //                 "label": "When are you available?",
  //                 "name": "radio-group-1747392026637-0",
  //                 "values": [
  //                     {
  //                         "label": "Monday",
  //                         "value": "monday",
  //                         "selected": false
  //                     },
  //                     {
  //                         "label": "Tuesday",
  //                         "value": "tuesday",
  //                         "selected": false
  //                     },
  //                     {
  //                         "label": "Wednesday",
  //                         "value": "wednesday",
  //                         "selected": false
  //                     },
  //                     {
  //                         "label": "Saturday",
  //                         "value": "saturday",
  //                         "selected": false
  //                     }
  //                 ]
  //             },
  //             {
  //                 "type": "checkbox-group",
  //                 "required": false,
  //                 "label": "Do you any past experience in volunteer work ?",
  //                 "name": "checkbox-group-1747392385352-0",
  //                 "values": [
  //                     {
  //                         "label": "Yes",
  //                         "value": "yes",
  //                         "selected": true
  //                     },
  //                     {
  //                         "label": "no",
  //                         "value": "no",
  //                         "selected": false
  //                     }
  //                 ]
  //             },
  //             {
  //                 "type": "checkbox-group",
  //                 "required": false,
  //                 "label": "Please add any comments or questions you might have",
  //                 "name": "checkbox-group-1747392559988-0",
  //                 "values": [
  //                     {
  //                         "label": "Answer will go the 'notes' section if form is used to create a new volunteer under 'new referrals'",
  //                         "value": "Answer will go the 'notes' section if form is used to create a new volunteer under 'new referrals'",
  //                         "selected": true
  //                     }
  //                 ]
  //             },
  //             {
  //                 "type": "radio-group",
  //                 "required": false,
  //                 "label": "Interest and skills",
  //                 "name": "radio-group-1747392615161-0",
  //                 "values": [
  //                     {
  //                         "label": "These options will be taken from 'tags' under the 'Hobbies & Interests' category and converted to tags on the service user profile if the form is used as a 'new referral  form)",
  //                         "value": "These options will be taken from 'tags' under the 'Hobbies & Interests' category and converted to tags on the service user profile if the form is used as a 'new referral  form)",
  //                         "selected": true
  //                     },
  //                     {
  //                         "label": "Option 2",
  //                         "value": "option-2",
  //                         "selected": false
  //                     }
  //                 ]
  //             },
  //             {
  //                 "type": "checkbox-group",
  //                 "required": false,
  //                 "label": "Do you have a disability or condition that you would like us to be aware of, so we can better support you ?",
  //                 "name": "checkbox-group-1747390664112-0",
  //                 "values": [
  //                     {
  //                         "label": "Yes",
  //                         "value": "Yes",
  //                         "selected": true
  //                     },
  //                     {
  //                         "label": "Prefer Not to Answer",
  //                         "value": "Prefer Not to Answer",
  //                         "selected": false
  //                     }
  //                 ]
  //             }
  //         ],
  //         title: ['Volunteer Sign Up Form']
  //     },
  //     {
  //         id: 3,
  //         name: 'Workshop Form',
  //         data: [
  //             {
  //                 "type": "header",
  //                 "subtype": "h1",
  //                 "label": "WorkShop Form"
  //             },
  //             {
  //                 "type": "text",
  //                 "required": true,
  //                 "label": "First Name",
  //                 "className": "form-control",
  //                 "name": "text-1747390638003-0",
  //                 "subtype": "text"
  //             },
  //             {
  //                 "type": "text",
  //                 "required": true,
  //                 "label": "Last Name",
  //                 "className": "form-control",
  //                 "name": "text-1747390640020-0",
  //                 "subtype": "text"
  //             },
  //             {
  //                 "type": "text",
  //                 "required": true,
  //                 "label": "Contact Number",
  //                 "className": "form-control",
  //                 "name": "text-1747390643179-0",
  //                 "subtype": "text"
  //             },
  //             {
  //                 "type": "text",
  //                 "required": true,
  //                 "label": "Email",
  //                 "className": "form-control",
  //                 "name": "text-1747390648300-0",
  //                 "subtype": "text"
  //             },
  //             {
  //                 "type": "date",
  //                 "required": true,
  //                 "label": "Date Of Birth",
  //                 "className": "form-control",
  //                 "name": "date-1747390651030-0",
  //                 "subtype": "date"
  //             },
  //             {
  //                 "type": "select",
  //                 "required": false,
  //                 "label": "First Language",
  //                 "className": "form-control",
  //                 "name": "select-1747390659031-0",
  //                 "values": [
  //                     {
  //                         "label": "English",
  //                         "value": "english",
  //                         "selected": true
  //                     },
  //                     {
  //                         "label": "Hindi",
  //                         "value": "hindi",
  //                         "selected": false
  //                     }
  //                 ]
  //             },
  //             {
  //                 "type": "checkbox-group",
  //                 "required": false,
  //                 "label": "Do you have a disability or condition that you would like us to be aware of, so we can better support you ?",
  //                 "name": "checkbox-group-1747390664112-0",
  //                 "values": [
  //                     {
  //                         "label": "Yes -Physical disability",
  //                         "value": "Yes -Physical disability",
  //                         "selected": false
  //                     },
  //                     {
  //                         "label": "Yes - Mental Health need",
  //                         "value": "Yes - Mental Health need",
  //                         "selected": false
  //                     },
  //                     {
  //                         "label": "Yes - Learning difficulties",
  //                         "value": "Yes - Learning difficulties",
  //                         "selected": false
  //                     },
  //                     {
  //                         "label": "Yes - Other",
  //                         "value": "Yes - Other",
  //                         "selected": false
  //                     },
  //                     {
  //                         "label": "Prefer Not to Answer",
  //                         "value": "Prefer Not to Answer",
  //                         "selected": false
  //                     }
  //                 ]
  //             },
  //             {
  //                 "type": "text",
  //                 "required": false,
  //                 "label": "If yes, please provide any details that would help us understand your needs and ensure appropriate accommodations.",
  //                 "className": "form-control",
  //                 "name": "text-1747390671327-0",
  //                 "subtype": "text"
  //             },
  //             {
  //                 "type": "select",
  //                 "required": true,
  //                 "label": "Please choose which session you will be attending.",
  //                 "className": "form-control",
  //                 "name": "select-1747390674293-0",
  //                 "values": [
  //                     {
  //                         "label": "Day1",
  //                         "value": "Day1",
  //                         "selected": true
  //                     },
  //                     {
  //                         "label": "Day2",
  //                         "value": "Day2",
  //                         "selected": false
  //                     },
  //                     {
  //                         "label": "Day3",
  //                         "value": "Day3",
  //                         "selected": false
  //                     }
  //                 ]
  //             },
  //             {
  //                 "type": "radio-group",
  //                 "required": true,
  //                 "label": "Dietary restrictions",
  //                 "name": "radio-group-1747390677832-0",
  //                 "values": [
  //                     {
  //                         "label": "none",
  //                         "value": "none",
  //                         "selected": false
  //                     },
  //                     {
  //                         "label": "veg",
  //                         "value": "veg",
  //                         "selected": false
  //                     },
  //                     {
  //                         "label": "vegan",
  //                         "value": "vegan",
  //                         "selected": false
  //                     },
  //                     {
  //                         "label": "other",
  //                         "value": "other",
  //                         "selected": false
  //                     }
  //                 ]
  //             },
  //             {
  //                 "type": "paragraph",
  //                 "subtype": "p",
  //                 "label": "Please let us know if we may contact you through the following channels for the purposes outlined below. You can choose your preferences by selecting the appropriate options"
  //             },
  //             {
  //                 "type": "radio-group",
  //                 "required": false,
  //                 "label": "Phone",
  //                 "name": "radio-group-1747732324317-0",
  //                 "values": [
  //                     {
  //                         "label": "News Letter",
  //                         "value": "newsLetter",
  //                         "selected": false
  //                     },
  //                     {
  //                         "label": "Upcoming Event",
  //                         "value": "upcomingEvent",
  //                         "selected": false
  //                     }
  //                 ]
  //             },
  //             {
  //                 "type": "radio-group",
  //                 "required": false,
  //                 "label": "Email",
  //                 "name": "radio-group-1747732676617-0",
  //                 "values": [
  //                     {
  //                         "label": "News Letter",
  //                         "value": "newsLetter",
  //                         "selected": false
  //                     },
  //                     {
  //                         "label": "Upcoming Event",
  //                         "value": "upcomingEvent",
  //                         "selected": false
  //                     }
  //                 ]
  //             },
  //             {
  //                 "type": "radio-group",
  //                 "required": false,
  //                 "label": "SMS",
  //                 "name": "radio-group-1747732678352-0",
  //                 "values": [
  //                     {
  //                         "label": "News Letter",
  //                         "value": "newsLetter",
  //                         "selected": false
  //                     },
  //                     {
  //                         "label": "Upcoming Event",
  //                         "value": "upcomingEvent",
  //                         "selected": false
  //                     }
  //                 ]
  //             },
  //             {
  //                 "type": "radio-group",
  //                 "required": false,
  //                 "label": "Letter",
  //                 "name": "radio-group-1747732679740-0",
  //                 "values": [
  //                     {
  //                         "label": "News Letter",
  //                         "value": "newsLetter",
  //                         "selected": false
  //                     },
  //                     {
  //                         "label": "Upcoming Event",
  //                         "value": "upcomingEvent",
  //                         "selected": false
  //                     }
  //                 ]
  //             }
  //         ],
  //         title: ['Workshop Form']
  //     },
  //     {
  //         id: 4,
  //         name: 'Satisfaction Survey',
  //         data: [
  //             {
  //                 "type": "header",
  //                 "subtype": "h1",
  //                 "label": "Satisfaction Survey"
  //             },
  //             {
  //                 "type": "text",
  //                 "required": false,
  //                 "label": "Name",
  //                 "className": "form-control",
  //                 "name": "text-1747390638003-0",
  //                 "subtype": "text"
  //             },
  //             {
  //                 "type": "text",
  //                 "required": false,
  //                 "label": "Email",
  //                 "className": "form-control",
  //                 "name": "text-1747390648300-0",
  //                 "subtype": "text"
  //             },
  //             {
  //                 "type": "text",
  //                 "required": false,
  //                 "label": "Contact Number",
  //                 "className": "form-control",
  //                 "name": "text-1747390643179-0",
  //                 "subtype": "text"
  //             },
  //             {
  //                 "type": "radio-group",
  //                 "required": false,
  //                 "label": "I think your organisation have helped me to achieve my goals: (1 -Strongly Disagree, 5 -Strongly Disagree)",
  //                 "name": "radio-group-1747730913543-0",
  //                 "values": [
  //                     {
  //                         "label": "1",
  //                         "value": "1",
  //                         "selected": false
  //                     },
  //                     {
  //                         "label": "2",
  //                         "value": "2",
  //                         "selected": false
  //                     },
  //                     {
  //                         "label": "3",
  //                         "value": "3",
  //                         "selected": false
  //                     },
  //                     {
  //                         "label": "4",
  //                         "value": "4",
  //                         "selected": false
  //                     },
  //                     {
  //                         "label": "5",
  //                         "value": "5",
  //                         "selected": false
  //                     }
  //                 ]
  //             },
  //             {
  //                 "type": "radio-group",
  //                 "required": false,
  //                 "label": "The staff/Mentor at your organisation have treated me fairly and with respect: (1 -Strongly Disagree, 5 -Strongly Disagree)",
  //                 "name": "radio-group-1747731020035-0",
  //                 "values": [
  //                     {
  //                         "label": "1",
  //                         "value": "1",
  //                         "selected": false
  //                     },
  //                     {
  //                         "label": "2",
  //                         "value": "2",
  //                         "selected": false
  //                     },
  //                     {
  //                         "label": "3",
  //                         "value": "3",
  //                         "selected": false
  //                     },
  //                     {
  //                         "label": "4",
  //                         "value": "4",
  //                         "selected": false
  //                     },
  //                     {
  //                         "label": "5",
  //                         "value": "5",
  //                         "selected": false
  //                     }
  //                 ]
  //             },
  //             {
  //                 "type": "radio-group",
  //                 "required": false,
  //                 "label": "I am now more able to deal with issues and problems in my life than I was before: (1 -Strongly Disagree, 5 -Strongly Disagree)",
  //                 "name": "radio-group-1747731049575-0",
  //                 "values": [
  //                     {
  //                         "label": "1",
  //                         "value": "1",
  //                         "selected": false
  //                     },
  //                     {
  //                         "label": "2",
  //                         "value": "2",
  //                         "selected": false
  //                     },
  //                     {
  //                         "label": "3",
  //                         "value": "3",
  //                         "selected": false
  //                     },
  //                     {
  //                         "label": "4",
  //                         "value": "4",
  //                         "selected": false
  //                     },
  //                     {
  //                         "label": "5",
  //                         "value": "5",
  //                         "selected": false
  //                     }
  //                 ]
  //             },
  //             {
  //                 "type": "radio-group",
  //                 "required": false,
  //                 "label": "I now feel more positive about my future: (1 -Strongly Disagree, 5 -Strongly Disagree)",
  //                 "name": "radio-group-1747731068376-0",
  //                 "values": [
  //                     {
  //                         "label": "1",
  //                         "value": "1",
  //                         "selected": false
  //                     },
  //                     {
  //                         "label": "2",
  //                         "value": "2",
  //                         "selected": false
  //                     },
  //                     {
  //                         "label": "3",
  //                         "value": "3",
  //                         "selected": false
  //                     },
  //                     {
  //                         "label": "4",
  //                         "value": "4",
  //                         "selected": false
  //                     },
  //                     {
  //                         "label": "5",
  //                         "value": "5",
  //                         "selected": false
  //                     }
  //                 ]
  //             },
  //             {
  //                 "type": "radio-group",
  //                 "required": false,
  //                 "label": "I am satisfied with the service I received from your organisation: (1 -Strongly Disagree, 5 -Strongly Disagree)",
  //                 "name": "radio-group-1747731098042-0",
  //                 "values": [
  //                     {
  //                         "label": "1",
  //                         "value": "1",
  //                         "selected": false
  //                     },
  //                     {
  //                         "label": "2",
  //                         "value": "2",
  //                         "selected": false
  //                     },
  //                     {
  //                         "label": "3",
  //                         "value": "3",
  //                         "selected": false
  //                     },
  //                     {
  //                         "label": "4",
  //                         "value": "4",
  //                         "selected": false
  //                     },
  //                     {
  //                         "label": "5",
  //                         "value": "5",
  //                         "selected": false
  //                     }
  //                 ]
  //             },
  //             {
  //                 "type": "text",
  //                 "required": true,
  //                 "label": "In what way/s could the service/s provided to me by your organisation be improved?",
  //                 "className": "form-control",
  //                 "name": "text-1747394178686-0",
  //                 "subtype": "text"
  //             },
  //             {
  //                 "type": "textarea",
  //                 "required": true,
  //                 "label": "I'd also like to add... ",
  //                 "className": "form-control",
  //                 "name": "textarea-1747731154988-0",
  //                 "subtype": "textarea"
  //             }
  //         ],
  //         title: ['Satisfaction Survey']
  //     },
  //     {
  //         id: 5,
  //         name: 'New Form',
  //         data: [
  //             {
  //                 "type": "header",
  //                 "subtype": "h1",
  //                 "label": "Form Heading"
  //             }
  //         ],
  //         title: ['New Form']
  //     }
  // ];

  const starterTemplates = [
    {
      id: 'community-referral',
      name: 'Community Refferal Form',
      data: [
        { type: 'header', subtype: 'h1', label: 'Community Refferal Form' },
        { type: 'text', required: true, label: 'First Name', className: 'form-control', name: 'text-first-name', subtype: 'text' },
        { type: 'text', required: true, label: 'Last Name', className: 'form-control', name: 'text-last-name', subtype: 'text' },
        { type: 'text', required: true, label: 'Contact Number', className: 'form-control', name: 'text-contact-number', subtype: 'text' },
        { type: 'text', required: true, label: 'Email', className: 'form-control', name: 'text-email', subtype: 'text' }
      ]
    },
    {
      id: 'satisfaction-survey',
      name: 'Satisfaction survey',
      data: [
        { type: 'header', subtype: 'h1', label: 'Satisfaction survey' },
        {
          type: 'radio-group',
          required: true,
          label: 'Overall, how satisfied are you with our service?',
          name: 'radio-satisfaction',
          values: [
            { label: '1', value: '1', selected: false },
            { label: '2', value: '2', selected: false },
            { label: '3', value: '3', selected: false },
            { label: '4', value: '4', selected: false },
            { label: '5', value: '5', selected: false }
          ]
        },
        { type: 'textarea', required: false, label: "I'd also like to add...", className: 'form-control', name: 'textarea-comments', subtype: 'textarea' }
      ]
    },
    {
      id: 'self-referral',
      name: 'Self Refferal Form',
      data: [
        { type: 'header', subtype: 'h1', label: 'Self Refferal Form' },
        { type: 'text', required: true, label: 'First Name', className: 'form-control', name: 'text-self-first-name', subtype: 'text' },
        { type: 'text', required: true, label: 'Last Name', className: 'form-control', name: 'text-self-last-name', subtype: 'text' },
        { type: 'textarea', required: false, label: 'Please tell us your reason for referral', className: 'form-control', name: 'textarea-referral-reason', subtype: 'textarea' }
      ]
    },
    {
      id: 'volunteer-signup',
      name: 'Volunteer Sign-up Form',
      data: [
        { type: 'header', subtype: 'h1', label: 'Volunteer Sign-up Form' },
        { type: 'text', required: true, label: 'First Name', className: 'form-control', name: 'text-volunteer-first-name', subtype: 'text' },
        { type: 'text', required: true, label: 'Last Name', className: 'form-control', name: 'text-volunteer-last-name', subtype: 'text' },
        { type: 'text', required: true, label: 'Email', className: 'form-control', name: 'text-volunteer-email', subtype: 'text' }
      ]
    },
    {
      id: 'workshop-registration',
      name: 'Workshop Registration Form',
      data: [
        { type: 'header', subtype: 'h1', label: 'Workshop Registration Form' },
        { type: 'text', required: true, label: 'First Name', className: 'form-control', name: 'text-workshop-first-name', subtype: 'text' },
        { type: 'text', required: true, label: 'Last Name', className: 'form-control', name: 'text-workshop-last-name', subtype: 'text' },
        { type: 'select', required: true, label: 'Please choose which session you will be attending', className: 'form-control', name: 'select-workshop-session', values: [] }
      ]
    }
  ];

  const records = [
    { id: 'service_user', value: 'Service User' },
    { id: 'volunteer', value: 'Volunteer' },
    { id: 'donar_individual', value: 'Donor Individual' },
    { id: 'donar_company', value: 'Donor Company' },
    { id: 'donor_group', value: 'Donor Group' },
  ]

  const validationSchema = yup.object({
    starterForm: yup.string().required('Please choose a starter form or create a new form.'),
    formDisplayTitle: yup.string().when('starterForm', {
      is: 'create-new',
      then: (schema) => schema.trim().required('Form Display Title is Required.'),
      otherwise: (schema) => schema
    }),
    description: yup.string().max(500, 'Description Cannot Exceed 500 Characters.'),
    formType: yup.string().when('starterForm', {
      is: 'create-new',
      then: (schema) => schema.required('Form Type is Required.'),
      otherwise: (schema) => schema
    }),
    formRecord: yup.string().test('required-if-switch-true', 'Form Record is Required.', function (value) {
      const { createRecord, starterForm } = this.parent;
      if (starterForm === 'create-new' && createRecord) {
        return !!value;
      }
      return true;
    })
  });

  const initialValues = {
    starterForm: '',
    formDisplayTitle: '',
    formType: '',
    description: '',
    formRecord: '',
    createRecord: false
  };

  const [step, setStep] = useState(1);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      const selectedStarterTemplate = starterTemplates.find((template) => template.id === values.starterForm);

      const baseTemplateData = selectedStarterTemplate
        ? selectedStarterTemplate.data
        : [{ type: 'header', subtype: 'h1', label: values.formDisplayTitle }];

      const updatedTemplateData = baseTemplateData.map((field) => {
        if (field.type === 'header') {
          return { ...field, label: values.formDisplayTitle || field.label };
        }
        return field;
      });

      setFormValues(values);
      setTemplateData(updatedTemplateData);
      setPreset(false);
      setStep(1);
      formik?.resetForm();
    }
  });

  const handleStarterFormChange = (event) => {
    const value = event.target.value;
    formik.setFieldValue('starterForm', value);

    if (value === 'create-new') {
      setStep(2);
      formik.setFieldValue('formDisplayTitle', '');
      formik.setFieldValue('description', '');
      formik.setFieldValue('formType', '');
      formik.setFieldValue('createRecord', false);
      formik.setFieldValue('formRecord', '');
    } else {
      setStep(1);
    }
  };

  const handleStepOneContinue = async () => {
    await formik.setTouched({ starterForm: true });
    if (!formik.values.starterForm) {
      return;
    }

    if (formik.values.starterForm === 'create-new') {
      setStep(2);
      return;
    }

    const selectedStarterTemplate = starterTemplates.find((template) => template.id === formik.values.starterForm);
    if (!selectedStarterTemplate) {
      return;
    }

    formik.setValues(
      {
        ...formik.values,
        formDisplayTitle: selectedStarterTemplate.name,
        description: '',
        formType: selectedStarterTemplate.name,
        createRecord: false,
        formRecord: ''
      },
      false
    );

    setStep(2);
  };
  const [formTypes, setFormTypes] = useState([])

  const fetchData = async () => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('configurationType', 'Form Types');
      const response = await getApi(`${urls.configuration.fetchWithPagination}?${queryParams.toString()}`);
      setFormTypes(response?.data?.data)

    } catch (error) {
      console.error('Error fetching config:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [])

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Box
        sx={{
          mb: 3,
          p: 2,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #f5fbff 0%, #eef5ff 100%)',
          border: '1px solid #d9e6f2'
        }}
      >
        <Typography sx={{ textAlign: 'left', fontSize: 18, fontWeight: 700, color: '#0b2b40' }}>
          {step === 1 ? 'Add Form' : 'ADD FORM'}
        </Typography>
        {step === 1 && (
          <Typography sx={{ textAlign: 'left', fontSize: 13, color: '#496477', mt: 0.5 }}>
            Choose a starter form or create a brand new one.
          </Typography>
        )}
      </Box>

      {step === 1 && (
        <Grid container spacing={2.2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Select
                id="starterForm"
                name="starterForm"
                displayEmpty
                value={formik.values.starterForm}
                onChange={handleStarterFormChange}
                error={formik.touched.starterForm && Boolean(formik.errors.starterForm)}
                renderValue={(selected) => {
                  if (!selected) {
                    return <Typography sx={{ color: '#6a778a', fontSize: 15 }}>Starter Form</Typography>;
                  }

                  if (selected === 'create-new') {
                    return 'Create a new form';
                  }

                  const selectedTemplate = starterTemplates.find((template) => template.id === selected);
                  return selectedTemplate?.name || 'Starter Form';
                }}
                sx={{
                  borderRadius: 2,
                  minHeight: 56,
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: 15,
                    color: '#2d495c',
                    py: 1.3
                  }
                }}
              >
                <MenuItem value="">
                  <em>Starter Form</em>
                </MenuItem>
                {starterTemplates.map((template) => (
                  <MenuItem value={template?.id} key={template?.id}>
                    {template?.name}
                  </MenuItem>
                ))}
                <MenuItem value="create-new">Create a new form</MenuItem>
              </Select>
              <FormHelperText sx={{ color: '#d32f2f' }}>{formik?.touched?.starterForm && formik?.errors?.starterForm}</FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      )}

      {step === 2 && (
        <Grid container spacing={2.2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                id="formDisplayTitle"
                name="formDisplayTitle"
                label="Form Display Title"
                size="small"
                placeholder="Enter form display title"
                value={formik.values.formDisplayTitle}
                onChange={formik.handleChange}
                error={formik.touched.formDisplayTitle && Boolean(formik.errors.formDisplayTitle)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <FormHelperText sx={{ color: '#d32f2f' }}>{formik?.touched?.formDisplayTitle && formik?.errors?.formDisplayTitle}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                id="description"
                name="description"
                label="Form Description"
                size="small"
                multiline
                minRows={3}
                placeholder="Enter a short description"
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <FormHelperText sx={{ color: '#d32f2f' }}>{formik?.touched?.description && formik?.errors?.description}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="formType">Form Type</InputLabel>
              <Select
                labelId="formType"
                label="Form Type"
                id="formType"
                name="formType"
                size="small"
                value={formik.values.formType}
                onChange={formik.handleChange}
                error={formik.touched.formType && Boolean(formik.errors.formType)}
                sx={{ borderRadius: 2 }}
              >
                {formTypes.map((template) => (
                  <MenuItem value={template?.name} key={template?._id}>
                    {template?.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText sx={{ color: '#d32f2f' }}>{formik?.touched?.formType && formik?.errors?.formType}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2,
                py: 1,
                minHeight: 56,
                borderRadius: 2,
                border: '1px solid #dfe8ef',
                backgroundColor: '#f8fbfd'
              }}
            >
              <Typography sx={{ textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#2d495c', pr: 1 }}>
                Will this form be used to create a persons record?
              </Typography>
              <Switch
                checked={formik.values.createRecord}
                onChange={(e) => {
                  const checked = e.target.checked;
                  formik.setFieldValue('createRecord', checked);
                  if (!checked) {
                    formik.setFieldValue('formRecord', '');
                  }
                }}
                color="primary"
              />
            </Box>
          </Grid>

          {formik.values.createRecord && (
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="record">Choose Type Of Record</InputLabel>
                <Select
                  labelId="record"
                  label="Choose Type Of Record"
                  id="formRecord"
                  name="formRecord"
                  value={formik.values.formRecord}
                  onChange={formik.handleChange}
                  error={formik.touched.formRecord && Boolean(formik.errors.formRecord)}
                  sx={{ borderRadius: 2 }}
                >
                  {records.map((template) => (
                    <MenuItem value={template?.id} key={template?.id}>
                      {template?.value}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText sx={{ color: '#d32f2f' }}>{formik?.touched?.formRecord && formik?.errors?.formRecord}</FormHelperText>
              </FormControl>
            </Grid>
          )}
        </Grid>
      )}

      <Box
        sx={{
          mt: 3,
          pt: 2,
          borderTop: '1px solid #e7edf3',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 1.5
        }}
      >
        <Button
          variant="outlined"
          sx={{
            color: '#365f7b',
            borderColor: '#b8cddd',
            textTransform: 'none',
            borderRadius: 2,
            px: 3
          }}
          onClick={() => {
            formik.resetForm();
            onClose();
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{
            bgcolor: '#0b3d59',
            color: '#fff',
            textTransform: 'none',
            borderRadius: 2,
            px: 3,
            '&:hover': { bgcolor: '#0f4e70' }
          }}
          onClick={step === 1 ? handleStepOneContinue : formik.handleSubmit}
        >
          {step === 1 ? 'Continue' : 'Save Changes'}
        </Button>
      </Box>
    </Box>
  );
};

export default DefaultFields;
