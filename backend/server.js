const mysql = require('mysql');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const dbConfig = {
    host: 'sql6.freesqldatabase.com',
    port: 3306,
    user: 'sql6702195',
    password: 'urlSfaXHpM',
    database: 'sql6702195'
};

const db = mysql.createConnection(dbConfig);

db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');

    // Fetch the highest CrimeID on server start
    db.query('SELECT MAX(CriminalID) AS maxCriminalID FROM Criminals', (err, result) => {
        if (err) {
            console.error('Error fetching max CrimeID:', err);
            return;
        }
       lastCriminalID = result[0].maxCriminalID || 99; // Start from 100 if there are no records
    });

    // Fetch the highest VictimID on server start
    db.query('SELECT MAX(VictimID) AS maxVictimID FROM Victims', (err, result) => {
        if (err) {
            console.error('Error fetching max VictimID:', err);
            return;
        }
       lastVictimID = result[0].maxVictimID || 99; // Start from 100 if there are no records
    });
});

let lastCriminalID = 100;
let lastVictimID = 100;

// Function to get the next CrimeID
const getNextCriminalID = () => {
    lastCriminalID += 1;
    return lastCriminalID;
};

const getNextVictimID = () => {
    lastVictimID += 1;
    return lastVictimID;
}

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT Name, Password, UserType FROM Users WHERE Name = ? AND Password = ?";
    db.query(sql, [username, password], (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Login Failed (error)", error: err });
        }
        if (data.length > 0) {
            const user = data[0];
            return res.status(200).json({ message: "Login Successfully", user });
        } else {
            return res.status(401).json({ message: "Login Failed" });
        }
    });
});

// Crimes endpoint
app.get('/api/crimes', (req, res) => {
    const sql = 'SELECT * FROM Crimes';
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ message: "Error fetching crimes data", error: err });
        return res.json(data);
    });
});

// Criminals endpoint
app.get('/api/criminals', (req, res) => {
    const sql = 'SELECT * FROM Criminals';
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ message: "Error fetching criminals data", error: err });
        return res.json(data);
    });
});

// Add new criminal endpoint
app.post('/api/criminals', (req, res) => {
    const { Name, Age, Address } = req.body;
    const CriminalID = getNextCriminalID();
    const sql = 'INSERT INTO Criminals (CriminalID, Name, Age, Address) VALUES (?, ?, ?, ?)';
    db.query(sql, [CriminalID, Name, Age, Address], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error adding new criminal", error: err });
        }
        return res.status(201).json({ message: "Criminal added successfully", criminalId: result.insertId, CriminalID });
    });
});

// Delete criminal endpoint
app.delete('/api/criminals/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM Criminals WHERE CriminalID = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error deleting criminal", error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Criminal not found" });
        }
        return res.status(200).json({ message: "Criminal deleted successfully" });
    });
});

// Victims endpoint
app.get('/api/victims', (req, res) => {
    const sql = 'SELECT * FROM Victims';
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ message: "Error fetching victims data", error: err });
        return res.json(data);
    });
});

// Add new victim endpoint
app.post('/api/victims', (req, res) => {
    const { Name, Age, Address } = req.body;
    const VictimID = getNextVictimID();
    const sql = 'INSERT INTO Victims (VictimID ,Name, Age, Address) VALUES (? ,?, ?, ?)';
    db.query(sql, [VictimID, Name, Age, Address], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error adding new victim", error: err });
        }
        return res.status(201).json({ message: "Victim added successfully", victimId: result.insertId, VictimID});
    });
});

// Delete victim endpoint
app.delete('/api/victims/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM Victims WHERE VictimID = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error deleting victim", error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Victim not found" });
        }
        return res.status(200).json({ message: "Victim deleted successfully" });
    });
});


// Crimes committed by a specific criminal endpoint
app.get('/api/crimescommitted/:criminalId', (req, res) => {
    const criminalId = req.params.criminalId;
    const sql = `
        SELECT c.CrimeID, c.LocationID, c.CrimeType, c.Description, c.Date, c.StationID 
        FROM Crimes c
        JOIN CrimesCommited cc ON c.CrimeID = cc.CrimeID
        WHERE cc.CriminalID = ?;
    `;
    db.query(sql, [criminalId], (err, data) => {
        if (err) return res.status(500).json({ message: "Error fetching crimes data", error: err });
        return res.json(data);
    });
});

// Crimes involving a specific victim endpoint
app.get('/api/crimesbyvictim/:victimId', (req, res) => {
    const victimId = req.params.victimId;
    const sql = `
        SELECT c.CrimeID, c.LocationID, c.CrimeType, c.Description, c.Date, c.StationID 
        FROM Crimes c
        JOIN CrimeVictims cv ON c.CrimeID = cv.CrimeID
        WHERE cv.VictimID = ?;
    `;
    db.query(sql, [victimId], (err, data) => {
        if (err) return res.status(500).json({ message: "Error fetching crimes data", error: err });
        return res.json(data);
    });
});

// Victims for specific crime endpoint
app.get('/api/victimsforcrime/:crimeId', (req, res) => {
    const crimeId = req.params.crimeId;
    const sql = `
        SELECT DISTINCT v.VictimID, v.Name
        FROM Victims v
        JOIN CrimeVictims cv ON v.VictimID = cv.VictimID
        JOIN CrimesCommited cc ON cv.CrimeID = cc.CrimeID
        WHERE cc.CrimeID = ?;
    `;
    db.query(sql, [crimeId], (err, data) => {
        if (err) return res.status(500).json({ message: "Error fetching victims data", error: err });
        return res.json(data);
    });
});

// Criminals for specific crime endpoint
app.get('/api/criminalsforcrime/:crimeId', (req, res) => {
    const crimeId = req.params.crimeId;
    const sql = `
        SELECT DISTINCT c.CriminalID, c.Name
        FROM Criminals c
        JOIN CrimesCommited cc ON c.CriminalID = cc.CriminalID
        WHERE cc.CrimeID = ?;
    `;
    db.query(sql, [crimeId], (err, data) => {
        if (err) return res.status(500).json({ message: "Error fetching criminals data", error: err });
        return res.json(data);
    });
});

// Start the server
app.listen(8081, () => {
    console.log("Server is running on port 8081");
});
