const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const db = new sqlite3.Database('database.db');

db.run(`CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL
)`);

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/cadastrar', (req, res) => {
  const { nome, email } = req.body;
  db.run(`INSERT INTO usuarios (nome, email) VALUES (?, ?)`, [nome, email], function(err) {
    if (err) {
      return res.send('Erro ao cadastrar.');
    }
    res.send('Usuário cadastrado com sucesso!');
  });
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});