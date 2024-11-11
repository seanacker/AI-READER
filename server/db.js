const sqlite3 = require('sqlite3').verbose()

// Connect to an SQLite database file
const db = new sqlite3.Database('./pdf_data.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message)
  } else {
    console.log('Connected to the SQLite database.')

    // Create a table if it doesn’t exist
    db.run(`CREATE TABLE IF NOT EXISTS pdf_data (
      id TEXT PRIMARY KEY,
      file_name TEXT NOT NULL
    );`)

    db.run(`CREATE TABLE IF NOT EXISTS chapters (
      id TEXT PRIMARY KEY,
      pdf_id TEXT,
      file_name TEXT NOT NULL,
      title TEXT,
      content BLOB NOT NULL,
      summary TEXT,
      FOREIGN KEY (pdf_id) REFERENCES pdf_data(id)
    );`);
  }
})

module.exports = db
