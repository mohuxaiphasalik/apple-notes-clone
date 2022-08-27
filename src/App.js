import React from "react";
import Editor from "./components/Editor";
import Sidebar from "./components/Sidebar";
import Split from "react-split";
import { nanoid } from "nanoid";
import "./styles/style.css";
export default function App() {
  const [notes, setNotes] = React.useState(
    () => JSON.parse(localStorage.getItem("notes")) || []
  );

  const [currentNoteId, setCurrentNoteId] = React.useState(
    (notes[0] && notes[0].id) || ""
  );

  localStorage.clear();
  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "# Type your markdown note's title here",
    };
    setNotes((prevNotes) => [newNote, ...prevNotes]);
    setCurrentNoteId(newNote.id);
  }

  function updateNote(text) {
    setNotes((oldNotes) => {
      const newArrangement = [];
      oldNotes.forEach((note) => {
        console.log(note);
        if (note.id === currentNoteId) {
          newArrangement.unshift({ ...note, body: text });
        } else {
          newArrangement.push(note);
        }
      });
      return newArrangement;
    });
  }

  // working without making recent one at top

  //  setNotes((oldNotes) =>
  //    oldNotes.map((oldNote) => {
  //      return oldNote.id === currentNoteId
  //        ? { ...oldNote, body: text }
  //        : oldNote;
  //    })
  //  );

  React.useEffect(
    function () {
      window.localStorage.setItem("notes", JSON.stringify(notes));
    },
    [notes]
  );

  function findCurrentNote() {
    return (
      notes.find((note) => {
        return note.id === currentNoteId;
      }) || notes[0]
    );
  }

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction="horizontal" className="split">
          <Sidebar
            notes={notes}
            currentNote={findCurrentNote()}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
          />
          {currentNoteId && notes.length > 0 && (
            <Editor currentNote={findCurrentNote()} updateNote={updateNote} />
          )}
        </Split>
      ) : (
        <div className="no-notes">
          <h1>You have no notes</h1>
          <button className="first-note" onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}
