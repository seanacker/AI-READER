const express = require('express')
const db = require('./db')
const { v4: uuidv4 } = require('uuid')
const app = express()
const PORT = 5000

const cors = require('cors')
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }))
app.use(express.raw({ type: 'application/octet-stream', limit: '10mb' }))

app.post('/text-file', (req, res) => {
  const fileData = req.body
  const fileName = decodeURIComponent(req.headers['x-file-name'])
  const id = uuidv4()

  db.run('INSERT INTO pdf_data (id, file_name, content) VALUES (?, ?, ?)', [id, fileName, fileData], function (err) {
    if (err) {
      console.error('Database Error:', err.message)
      return res.status(500).json({ error: 'Failed to save data' })
    }
    res.status(200).json({ id })
  })
})

app.get('/text-files', (_, res) => {
  db.all('SELECT id, file_name FROM pdf_data', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve data' })
    }
    const files = rows.map(row => ({
      id: row.id,
      name: row.file_name
    }))

    res.status(200).json({ files })
  })
})

app.get('/text-file/:id', (req, res) => {
  const { id } = req.params

  db.get('SELECT file_name, content FROM pdf_data WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve data' })
    }

    if (!row) {
      return res.status(404).json({ error: 'File not found' })
    }

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `inline; filename="${row.file_name}"`)
    res.send(row.content)
  })
})

app.post('/save-summary', (req, res) => {
  const { id, summary, chatHistory } = req.body;
  const chatHistoryString = JSON.stringify(chatHistory);

  db.run(
    `INSERT INTO summaries (id, summary, chat_history) 
     VALUES (?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET summary = ?, chat_history = ?`,
    [id, summary, chatHistoryString, summary, chatHistoryString],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to save summary' });
      }
      res.status(200).json({ message: 'Summary saved successfully', id });
    }
  );
});

app.get('/get-summary/:id', (req, res) => {
  const { id } = req.params;

  db.get(
    `SELECT summary, chat_history FROM summaries WHERE id = ?`,
    [id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to retrieve summary' });
      }
      if (!row) {
        return res.status(200).json({ summary: null, chatHistory: [] });
      }
      res.status(200).json({
        summary: row.summary,
        chatHistory: JSON.parse(row.chat_history),
      });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
