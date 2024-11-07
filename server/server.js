const express = require('express');
const db = require('./db');
const { v4: uuidv4 } = require('uuid'); // Import UUID function
const app = express();
const PORT = 5000;

const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3000' }));

// Configure Express to accept raw binary data in requests
app.use(express.raw({ type: 'application/octet-stream', limit: '10mb' })); // Adjust limit as needed

app.post('/text-file', (req, res) => {
  const fileData = req.body; // Binary data
  const fileName = decodeURIComponent(req.headers['x-file-name']); // Get file name from header
  const id = uuidv4();

  // Insert binary data as a BLOB
  db.run(`INSERT INTO pdf_data (id, file_name, content) VALUES (?, ?, ?)`, [id, fileName, fileData], function (err) {
    if (err) {
      console.error('Database Error:', err.message);
      return res.status(500).json({ error: 'Failed to save data' });
    }
    res.status(200).json({ id });
  });
});

app.get('/text-files', (req, res) => {
  // Query to retrieve the id and file name for all files
  db.all(`SELECT id, file_name FROM pdf_data`, [], (err, rows) => {
      if (err) {
          return res.status(500).json({ error: 'Failed to retrieve data' });
      }

      // Map the rows to the required format
      const files = rows.map(row => ({
          id: row.id,
          name: row.file_name
      }));

      res.status(200).json({ files });
  });
});

app.get('/text-file/:id', (req, res) => {
    const { id } = req.params;
  
    db.get(`SELECT file_name, content FROM pdf_data WHERE id = ?`, [id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to retrieve data' });
      }
  
      if (!row) {
        return res.status(404).json({ error: 'File not found' });
      }
  
      // Set headers to inform the frontend about the content type and filename
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${row.file_name}"`);
      res.send(row.content); // Send binary data directly
    });
  });
  


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
