import React, { useState, useEffect } from 'react';
import { Box, Modal, Typography, IconButton, useTheme } from '@mui/material';
import { DataGrid , GridToolbar } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';

const Victims = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [rows, setRows] = useState([]);
    const [selectedVictimId, setSelectedVictimId] = useState(null);
    const [crimes, setCrimes] = useState([]);
    const [open, setOpen] = useState(false);

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

    const handleNameClick = (id) => {
        setSelectedVictimId(id);
        axios.get(`http://localhost:8081/api/crimesbyvictim/${id}`)
            .then(response => {
                setCrimes(response.data.map(crime => ({ ...crime, id: crime.CrimeID })));
                setOpen(true);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    const handleClose = () => {
        setOpen(false);
        setCrimes([]);
    };

    const columns = [
        { field: 'VictimID', headerName: 'ID' },
        {
            field: 'Name',
            headerName: 'Name',
            flex: 1,
            cellClassName: 'name-column--cell',
            renderCell: (params) => (
                <span
                    style={{ cursor: 'pointer', color: colors.greenAccent[300] }}
                    onClick={() => handleNameClick(params.id)}
                >
                    {params.value}
                </span>
            ),
        },
        {
            field: 'Age',
            headerName: 'Age',
            flex: 1,
        },
        {
            field: 'Address',
            headerName: 'Address',
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
                    rows={rows}
                    columns={columns}
                    getRowId={(row) => row.VictimID}
                    components={{ Toolbar: GridToolbar }}
                />
            </Box>

            <Modal open={open} onClose={handleClose}>
                <Box sx={{
                    position: 'absolute',
                    top: '10%',
                    left: '10%',
                    right: '10%',
                    bgcolor: 'background.paper',
                    p: 4,
                    boxShadow: 24,
                }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">Crimes Involving Victim</Typography>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <DataGrid
                        rows={crimes}
                        columns={[
                            { field: 'CrimeID', headerName: 'Crime ID', flex: 0.5 },
                            { field: 'LocationID', headerName: 'Location ID', flex: 0.5 },
                            { field: 'CrimeType', headerName: 'Crime Type', flex: 1 },
                            { field: 'Description', headerName: 'Description', flex: 2 },
                            { field: 'Date', headerName: 'Date', flex: 1 },
                            { field: 'StationID', headerName: 'Station ID', flex: 0.5 },
                        ]}
                        autoHeight
                    />
                </Box>
            </Modal>
        </Box>
    );
};

export default Victims;
