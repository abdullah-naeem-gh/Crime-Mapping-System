import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import { useTheme } from '@mui/material';
import axios from 'axios';

const Criminals = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8081/api/criminals')
            .then(response => {
                const dataWithId = response.data.map(criminal => ({ ...criminal, id: criminal.CriminalID }));
                setRows(dataWithId);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.5 },
        { field: 'RegistrarID', headerName: 'Registrar ID' },
        {
            field: 'Name',
            headerName: 'Name',
            flex: 1,
            cellClassName: 'name-column--cell',
        },
        {
            field: 'Age',
            headerName: 'Age',
            type: 'number',
            headerAlign: 'left',
            align: 'left',
        },
        {
            field: 'Phone',
            headerName: 'Phone Number',
            flex: 1,
        },
        {
            field: 'Email',
            headerName: 'Email',
            flex: 1,
        },
        {
            field: 'Address',
            headerName: 'Address',
            flex: 1,
        },
        {
            field: 'City',
            headerName: 'City',
            flex: 1,
        },
        {
            field: 'ZipCode',
            headerName: 'Zip Code',
            flex: 1,
        },
    ];

    return (
        <Box m="20px">
            <Header
                title="CRIMINALS"
                subtitle="List of Criminals for Reference"
            />
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
                    '& .name-column--cell': {
                        color: colors.greenAccent[300],
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
                    '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
                        color: `${colors.grey[100]} !important`,
                    },
                }}
            >
                <DataGrid
                    rows={rows}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                />
            </Box>
        </Box>
    );
};

export default Criminals;
