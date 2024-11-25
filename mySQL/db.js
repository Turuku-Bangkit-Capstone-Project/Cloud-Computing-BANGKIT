const mysql = require('mysql');

// Konfigurasi database MySQL
const db = mysql.createConnection({
    host: 'localhost',       // ip host database
    user: 'myuser',            // Username MySQL
    password: 'saljusemihujan',// Password MySQL
    database: 'userdata' // Nama database
});

// Hubungkan ke MySQL
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        return;
    }
    console.log('Connected to MySQL database!');
});
module.exports = db;