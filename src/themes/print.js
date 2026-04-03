/* eslint-disable react/prop-types */
import React from 'react';

const PrintStyles = ({ targetId = 'print-chart' }) => (
  <style>
    {`
      @media print {
        @page {
          size: landscape;
          margin: 10mm;
        }
        body * {
          visibility: hidden !important;
        }
        #${targetId}, #${targetId} * {
          visibility: visible !important;
        }
        #${targetId} {
          position: absolute !important;
          top: 0;
          left: 0;
          width: 100% !important;
          overflow: visible !important;
        }
      }
    `}
  </style>
);

export default PrintStyles;
