import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import Header from '../../components/Header';
import axios from 'axios';

const Crimes = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        // Fetch data from the server
        axios.get('http://localhost:8081/api/crimes')
            .then(response => {
                setRows(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const columns = [
        { field: 'CrimeID', headerName: 'ID' },
        {
            field: 'CrimeType',
            headerName: 'Crime Type',
            flex: 1,
        },
        {
            field: 'Description',
            headerName: 'Description',
            flex: 1,
        },
        {
            field: 'Date',
            headerName: 'Date',
            flex: 1,
        },
        {
            field: 'LocationID',
            headerName: 'Location ID',
            flex: 1,
        },
        {
            field: 'StationID',
            headerName: 'Station ID',
            flex: 1,
        },
    ];

    return (
        <Box m="20px">
            <Header title="CRIMES" subtitle="Managing the Crimes Data" />
            <Box
                m="40px 0 0 0"
                height="75vh"
                sx={{
                    '& .MuiDataGrid-root': {
                        border: 'none',
                    },
                    '& .MuiDataGrid-cell': {
                        borderBottom: 'none',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: colors.blueAccent[700],
                        borderBottom: 'none',
                    },
                    '& .MuiDataGrid-virtualScroller': {
                        backgroundColor: colors.primary[400],
                    },
                    '& .MuiDataGrid-footerContainer': {
                        borderTop: 'none',
                        backgroundColor: colors.blueAccent[700],
                    },
                    '& .MuiCheckbox-root': {
                        color: `${colors.greenAccent[200]} !important`,
                    },
                }}
            >
                <DataGrid 
                    checkboxSelection 
                    rows={rows} 
                    columns={columns} 
                    getRowId={(row) => row.CrimeID} 
                />
            </Box>
        </Box>
    );
};

export default Crimes;
