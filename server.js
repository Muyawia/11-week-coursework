const express = require("express");
const path = require("path");
const fs = require("fs");
const notes = require("./db/db.json");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.listen(PORT, () => console.log(`Listening on PORT... ${PORT}`));

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/assets/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/assets/notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/assets/index.html"));
});
//Creates a binary ID number!
function uniqueID() {
  return Math.random().toString(2).substring(36);
}

function newNote(body, allNotes) {
  const note = body;

  body.id = uniqueID();

  allNotes.push(note);
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify(allNotes, null, 2)
  );
  return note;
};

app.post("/api/notes", (req, res) => {
  const note = newNote(req.body, notes);
  res.json(note);
});

function removeNote(id, allNotes) {
  for (let i = 0; i < allNotes.length; i++) {
    let note = allNotes[i];

    if (note.id == id) {
      allNotes.splice(i, 1);
      fs.writeFileSync(
        path.join(__dirname, "./db/db.json"),
        JSON.stringify(allNotes, null, 2)
      );

      break;
    }
  }
};

app.delete("/api/notes/:id", (req, res) => {
  removeNote(req.params.id, notes);
  res.json(true);
});