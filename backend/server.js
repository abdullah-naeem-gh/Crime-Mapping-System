const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'sql6.freesqldatabase.com',
    port: 3306,
    user: 'sql6702195',
    password: 'urlSfaXHpM',
    database: 'sql6702195'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

// Login endpoint
app.post('/login', (req, res) => {
    const sql = "SELECT Name, Password, UserType FROM Users WHERE Name = ? AND Password = ?";
    db.query(sql, [req.body.username, req.body.password], (err, data) => {
        if (err) return res.json({ message: "Login Failed (error)" });
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

// Victims endpoint
app.get('/api/victims', (req, res) => {
    const sql = 'SELECT * FROM Victims';
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ message: "Error fetching victims data", error: err });
        return res.json(data);
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


app.listen(8081, () => {
    console.log("Server is running on port 8081");
});
