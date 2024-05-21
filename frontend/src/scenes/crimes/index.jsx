import React, { useState, useEffect } from 'react';
import { Box, Modal, Typography, IconButton } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import { useTheme } from '@mui/material';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';

const Crimes = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [rows, setRows] = useState([]);
    const [selectedCrimeId, setSelectedCrimeId] = useState(null);
    const [victims, setVictims] = useState([]);
    const [criminals, setCriminals] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:8081/api/crimes')
            .then(response => {
                const dataWithId = response.data.map(crime => ({ ...crime, id: crime.CrimeID }));
                setRows(dataWithId);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const handleCrimeClick = (id) => {
        setSelectedCrimeId(id);
        axios.get(`http://localhost:8081/api/victimsforcrime/${id}`)
            .then(response => {
                setVictims(response.data.map((victim, index) => ({
                    ...victim,
                    id: `victim-${index}-${victim.VictimID}` // create a unique id
                })));
            })
            .catch(error => {
                console.error('Error fetching victims data:', error);
            });

        axios.get(`http://localhost:8081/api/criminalsforcrime/${id}`)
            .then(response => {
                setCriminals(response.data.map((criminal, index) => ({
                    ...criminal,
                    id: `criminal-${index}-${criminal.CriminalID}` // create a unique id
                })));
                setOpen(true);
            })
            .catch(error => {
                console.error('Error fetching criminals data:', error);
            });
    };

    const handleClose = () => {
        setOpen(false);
        setVictims([]);
        setCriminals([]);
    };

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.5 },
        {
            field: 'CrimeType',
            headerName: 'Crime Type',
            flex: 1,
            renderCell: (params) => (
                <span
                    style={{ cursor: 'pointer', color: colors.greenAccent[300] }}
                    onClick={() => handleCrimeClick(params.id)}
                >
                    {params.value}
                </span>
            ),
        },
        { field: 'Description', headerName: 'Description', flex: 2 },
        { field: 'Date', headerName: 'Date', flex: 1 },
    ];

    const victimColumns = [
        { field: 'VictimID', headerName: 'Victim ID', flex: 0.5 },
        { field: 'Name', headerName: 'Victim Name', flex: 1 },
    ];

    const criminalColumns = [
        { field: 'CriminalID', headerName: 'Criminal ID', flex: 0.5 },
        { field: 'Name', headerName: 'Criminal Name', flex: 1 },
    ];

    return (
        <Box m="20px" mt={0}>
            <Header
                title="CRIMES"
                subtitle="List of Crimes for Reference"
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
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6">Details for Crime ID: {selectedCrimeId}</Typography>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Box display="flex" gap={2}>
                        <Box flex={1}>
                            <Typography variant="h6">Victims</Typography>
                            <DataGrid
                                rows={victims}
                                columns={victimColumns}
                                autoHeight
                            />
                        </Box>
                        <Box flex={1}>
                            <Typography variant="h6">Criminals</Typography>
                            <DataGrid
                                rows={criminals}
                                columns={criminalColumns}
                                autoHeight
                            />
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default Crimes;
