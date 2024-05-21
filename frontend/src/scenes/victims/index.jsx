import React, { useState, useEffect } from 'react';
import { Box, Modal, Typography, IconButton, Button, TextField, useTheme } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
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
    const [addOpen, setAddOpen] = useState(false);
    const [removeOpen, setRemoveOpen] = useState(false);
    const [newVictim, setNewVictim] = useState({ Name: '', Age: '', Address: '' });
    const [victimIdToRemove, setVictimIdToRemove] = useState('');

    useEffect(() => {
        axios.get('process.env.REACT_APP_BACKEND_URL/api/victims')
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
        axios.get(`process.env.REACT_APP_BACKEND_URL/api/crimesbyvictim/${id}`)
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

    const handleAddClose = () => {
        setAddOpen(false);
        setNewVictim({ Name: '', Age: '', Address: '' });
    };

    const handleRemoveClose = () => {
        setRemoveOpen(false);
        setVictimIdToRemove('');
    };

    const handleAddOpen = () => {
        setAddOpen(true);
    };

    const handleRemoveOpen = () => {
        setRemoveOpen(true);
    };

    const handleAddVictim = () => {
        axios.post('process.env.REACT_APP_BACKEND_URL/api/victims', newVictim)
            .then(response => {
                const newVictimWithId = { ...newVictim, id: response.data.VictimID };
                setRows([...rows, newVictimWithId]);
                handleAddClose();
            })
            .catch(error => {
                console.error('Error adding victim:', error);
            });
    };

    const handleRemoveVictim = () => {
        axios.delete(`process.env.REACT_APP_BACKEND_URL/api/victims/${victimIdToRemove}`)
            .then(response => {
                setRows(rows.filter(row => row.id !== parseInt(victimIdToRemove)));
                handleRemoveClose();
            })
            .catch(error => {
                console.error('Error removing victim:', error);
            });
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
        <Box m="20px" mt={0}>
            <Header title="VICTIMS" subtitle="List of Victims" />
            <Box display="flex" gap="10px" mb="10px">
                <Button variant="contained" color="secondary" onClick={handleAddOpen}>
                    Add Victim
                </Button>
                <Button variant="contained" color="error" onClick={handleRemoveOpen}>
                    Remove Victim
                </Button>
            </Box>
            <Box
                m="10px 0 0 0"
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
                    getRowId={(row) => row.id}
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

            <Modal open={addOpen} onClose={handleAddClose}>
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
                        <Typography variant="h6">Add New Victim</Typography>
                        <IconButton onClick={handleAddClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Box component="form" display="flex" flexDirection="column" gap="20px" mt="20px">
                        <TextField
                            label="Name"
                            value={newVictim.Name}
                            onChange={(e) => setNewVictim({ ...newVictim, Name: e.target.value })}
                        />
                        <TextField
                            label="Age"
                            type="number"
                            value={newVictim.Age}
                            onChange={(e) => setNewVictim({ ...newVictim, Age: e.target.value })}
                        />
                        <TextField
                            label="Address"
                            value={newVictim.Address}
                            onChange={(e) => setNewVictim({ ...newVictim, Address: e.target.value })}
                        />
                        <Button variant="contained" color="primary" onClick={handleAddVictim}>
                            Add Victim
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Modal open={removeOpen} onClose={handleRemoveClose}>
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
                        <Typography variant="h6">Remove Victim</Typography>
                        <IconButton onClick={handleRemoveClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Box component="form" display="flex" flexDirection="column" gap="20px" mt="20px">
                        <TextField
                            label="Victim ID"
                            value={victimIdToRemove}
                            onChange={(e) => setVictimIdToRemove(e.target.value)}
                        />
                        <Button variant="contained" color="error" onClick={handleRemoveVictim}>
                            Remove Victim
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default Victims;
