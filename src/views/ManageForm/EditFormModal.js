/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Dialog } from '@mui/material';
import FormBuilder from 'formBuilder/FormBuilder';
import SelectTemplate from 'formBuilder/SelectTemplate';
import TemplateOne from 'formBuilder/TemplateOne';
import TemplateTwo from 'formBuilder/TemplateTwo';
import TemplateThree from 'formBuilder/TemplateThree';

const EditFormModal = ({ open = false, onClose = () => {}, getAllForms, editFormData }) => {
  const [formData, setFormData] = useState([]);
  const [preset, setPreset] = useState(false);
  const [preview, setPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateData, setTemplateData] = useState([]);
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    if (open && editFormData) {
      setPreset(false);
      setPreview(false);
      setSelectedTemplate(null);
      setFormData([]);
      // Map DB fields to formBuilder-compatible format
      const fields = (editFormData.fields || []).map((f) => ({
        type: f.type,
        label: f.label,
        name: f.name,
        required: f.required,
        values: f.values,
        validation: f.validation,
        subtype: f.subtype
      }));
      setTemplateData(fields);
      setFormValues({
        formType: editFormData.type || '',
        description: editFormData.description || '',
        formRecord: editFormData.records || ''
      });
    }
  }, [open, editFormData]);

  const handleClose = () => {
    setPreset(false);
    setPreview(false);
    setSelectedTemplate(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      {!preview && !preset && (
        <FormBuilder
          setFormData={setFormData}
          formData={formData}
          setPreview={setPreview}
          onClose={handleClose}
          templateData={templateData}
          setTemplateData={setTemplateData}
          setPreset={setPreset}
          isEdit={true}
        />
      )}
      {preview && !selectedTemplate && (
        <SelectTemplate setPreview={setPreview} setSelectedTemplate={setSelectedTemplate} onClose={handleClose} setPreset={setPreset} />
      )}
      {selectedTemplate === 1 && (
        <TemplateOne
          formValues={formValues}
          formData={formData}
          setFormData={setFormData}
          setSelectedTemplate={setSelectedTemplate}
          setPreview={setPreview}
          setPreset={setPreset}
          onClose={handleClose}
          getAllForms={getAllForms}
          isEdit={true}
          formId={editFormData?.publicId}
        />
      )}
      {selectedTemplate === 2 && <TemplateTwo formData={formData} setSelectedTemplate={setSelectedTemplate} setPreview={setPreview} />}
      {selectedTemplate === 3 && <TemplateThree formData={formData} setSelectedTemplate={setSelectedTemplate} setPreview={setPreview} />}
    </Dialog>
  );
};

export default EditFormModal;
