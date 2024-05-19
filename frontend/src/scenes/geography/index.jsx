import { Box } from '@mui/material';
import React from 'react';
import Header from "../../components/Header";


const Geography = () => {
  return (
    <Box mt={0} ml={3} pb={5}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Heat Map" subtitle="Crime Statistics of Islamabad City" />
      </Box>

      <Box>
      <tableau-viz id='tableau-viz' src='https://prod-apnortheast-a.online.tableau.com/t/anaeembscs23seecs262cc2e63c/views/FinalTableau/Sheet7' width='900' height='485' hide-tabs toolbar='bottom' ></tableau-viz>
      </Box>
    </Box>
  );
};

export default Geography;
