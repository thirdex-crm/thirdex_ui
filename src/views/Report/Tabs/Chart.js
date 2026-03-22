import { Box } from '@mui/system';
import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { getApi } from 'common/apiClient';
import { urls } from 'common/urls';

const Chart = ({ countryOfOriginFilter, selectedName, status, caseId, dateOpenedFilter }) => {
  const [ethnicityData, setEthnicityData] = useState([]);
  const [ageBarData, setAgeBarData] = useState([0, 0, 0, 0, 0]);
  const [loading, setLoading] = useState(true);

  const staticEthnicityConfig = [
    { id: 1, label: 'Black / Black British', color: '#133144' },
    { id: 2, label: 'Asian / Asian British', color: '#86E5FC' },
    { id: 3, label: 'White British', color: '#3E8EB6' },
    { id: 4, label: 'Mixed Other', color: '#B3F0FD' },
    { id: 5, label: 'Mixed White & Black', color: '#61CFF4' },
    { id: 6, label: 'Arab', color: '#2A5B77' },
    { id: 7, label: 'Other', color: '#327193' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({ page: 1, limit: 1000, role: 'service_user' });
        if (countryOfOriginFilter) queryParams.append('country', countryOfOriginFilter);
        if (selectedName) queryParams.append('name', selectedName);
        if (status) queryParams.append('status', status === 'active');
        if (caseId) queryParams.append('uniqueId', caseId);
        if (dateOpenedFilter) queryParams.append('dateOfBirth', new Date(dateOpenedFilter).toISOString().split('T')[0]);

        const response = await getApi(`${urls.serviceuser.fetchWithPagination}?${queryParams.toString()}`);
        const users = response?.data?.data || [];

        const ethnicityCount = {
          'Black / Black British': 0,
          'Asian / Asian British': 0,
          'White British': 0,
          'Mixed Other': 0,
          'Mixed White & Black': 0,
          Arab: 0,
          Other: 0
        };
        users.forEach((user) => {
          const ethnicity = user?.personalInfo?.ethnicity || 'Other';
          if (ethnicity.includes('Black')) ethnicityCount['Black / Black British']++;
          else if (ethnicity.includes('Asian')) ethnicityCount['Asian / Asian British']++;
          else if (ethnicity.includes('White')) ethnicityCount['White British']++;
          else if (ethnicity.includes('Mixed White') || ethnicity.includes('Mixed – White')) ethnicityCount['Mixed White & Black']++;
          else if (ethnicity.includes('Mixed')) ethnicityCount['Mixed Other']++;
          else if (ethnicity.includes('Arab')) ethnicityCount['Arab']++;
          else ethnicityCount['Other']++;
        });
        setEthnicityData(
          staticEthnicityConfig.map((item) => ({
            id: item.id,
            value: ethnicityCount[item.label],
            label: `${item.label} (${ethnicityCount[item.label]})`,
            color: item.color
          }))
        );

        const ageGroupCount = { Adults: 0, Infants: 0, Seniors: 0, Kids: 0, 'Young Adults': 0 };
        const today = new Date();
        users.forEach((user) => {
          const dobStr = user?.personalInfo?.dateOfBirth;
          if (dobStr) {
            const dob = new Date(dobStr);
            const age = Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000));
            if (age <= 5) ageGroupCount['Infants']++;
            else if (age >= 6 && age <= 14) ageGroupCount['Kids']++;
            else if (age >= 15 && age <= 24) ageGroupCount['Young Adults']++;
            else if (age >= 25 && age <= 59) ageGroupCount['Adults']++;
            else if (age >= 60) ageGroupCount['Seniors']++;
          }
        });
        setAgeBarData([ageGroupCount['Adults'], ageGroupCount['Infants'], ageGroupCount['Seniors'], ageGroupCount['Kids'], ageGroupCount['Young Adults']]);
      } catch (error) {
        console.error('Error fetching service user chart data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [countryOfOriginFilter, selectedName, status, caseId, dateOpenedFilter]);

  return (
    <Grid container spacing={4}>
      <Grid item xs={6}>
        <Box sx={{ backgroundColor: '#fff', boxShadow: '1px 1px 5px #d4d4d4', borderRadius: '10px', mt: 1 }}>
          <Typography sx={{ fontWeight: 'bold', fontSize: '16px', px: 2, pt: 2 }}>Service Users by Ethnicity</Typography>
          <Box sx={{ paddingLeft: '20px' }}>
            {loading ? (
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</Box>
            ) : (
              <PieChart
                series={[{ data: ethnicityData, arcLabel: (item) => `${item.value}`, arcLabelMinAngle: 10, paddingAngle: 1 }]}
                width={320}
                height={300}
                slotProps={{ legend: { hidden: true } }}
                sx={{ [`& .MuiPieArcLabel-root`]: { fill: '#fff', fontSize: '12px' } }}
              />
            )}
          </Box>
        </Box>
      </Grid>

      <Grid item xs={6}>
        <Box sx={{ backgroundColor: '#fff', boxShadow: '1px 1px 5px #d4d4d4', borderRadius: '10px', mt: 1 }}>
          <Typography sx={{ fontWeight: 'bold', fontSize: '16px', px: 2, pt: 2 }}>Service Users by Age Group</Typography>
          {loading ? (
            <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</Box>
          ) : (
            <BarChart
              layout="horizontal"
              series={[{ id: 'bar-series-1', data: ageBarData, color: '#009FC7' }]}
              xAxis={[{ id: 'x-axis', scaleType: 'linear', label: 'Number of users' }]}
              yAxis={[{ id: 'y-axis', scaleType: 'band', data: ['Adults', 'Infants', 'Seniors', 'Kids', 'Young Adults'] }]}
              height={300}
              margin={{ top: 10, bottom: 30, left: 100, right: 20 }}
            />
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default Chart;
