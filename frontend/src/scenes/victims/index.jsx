import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import axios from 'axios';

const Victims = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8081/api/victims')
            .then(response => {
                const dataWithId = response.data.map(victim => ({ ...victim, id: victim.VictimID }));
                setRows(dataWithId);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const columns = [
        { field: 'VictimID', headerName: 'ID' },
        {
            field: 'Name',
            headerName: 'Name',
            flex: 1,
            cellClassName: 'name-column--cell',
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
            field: 'Cost',
            headerName: 'Cost',
            flex: 1,
            renderCell: (params) => (
                <Typography color={colors.greenAccent[500]}>
                    ${params.row.Cost}
                </Typography>
            ),
        },
        {
            field: 'Date',
            headerName: 'Date',
            flex: 1,
        },
    ];

    return (
        <Box m="20px">
            <Header title="VICTIMS" subtitle="List of Victims" />
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
                }}
            >
                <DataGrid
                    checkboxSelection
                    rows={rows}
                    columns={columns}
                    getRowId={(row) => row.VictimID}
                />
            </Box>
        </Box>
    );
};

export default Victims;
