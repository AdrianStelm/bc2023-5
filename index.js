const express = require('express');
const fs = require('fs');
const multer = require('multer');
const app = express();
const port=8000;

app.use(multer().none()); 
app.use(express.json());
app.use(express.static('static'));

const notes = [];

app.get('/UploadForm.html', (req, res) => {
  res.sendFile('UploadForm.html');
});

app.get('/notes', (req, res) => {
  res.json(notes);
});

app.post('/upload', (req, res) => {
  const note_name = req.body.note_name;
  const note = req.body.note;
  const check_note = notes.find(note => note.note_name === note_name);

  if (check_note) {
    res.status(400).send("Bad Request");
  } else {
    notes.push({ note_name: note_name, note: note });
    fs.writeFileSync('notes.json', JSON.stringify(notes));
    res.status(201).send("Created");
  }
});

app.get('/notes/:note_name', (req, res) => {
  const note_name = req.params.note_name;
  const searched_note = notes.find(note => note.note_name === note_name);

  if (searched_note) {
    res.send({ note: searched_note.note });
  } else {
    res.status(404).send('Not Found');
  }
});

app.put('/notes/:note_name', (req, res) => {
  const note_name = req.params.note_name;
  const note = req.body.note;
  const noteIndex = notes.findIndex(note => note.note_name === note_name);

  notes[noteIndex].note = note;
  fs.writeFileSync('notes.json', JSON.stringify(notes));
  res.status(200).send("Changed");
  
});

app.delete('/notes/:note_name', (req, res) => {
  const note_name = req.params.note_name;
  const note_index = notes.findIndex(note => note.note_name === note_name);

  notes.splice(note_index, 1);
  fs.writeFileSync('notes.json', JSON.stringify(notes));
  res.status(200).send("Deleted");
 
});

app.listen(port, () => {
  console.log(`Server is work ${port}`);
});

