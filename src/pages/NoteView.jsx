import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./NoteView.css";

function NoteView() {
  const { noteId } = useParams();

  const [note, setNote] = useState(null);

  useEffect(() => {
    loadNote();
  }, [noteId]);

  const loadNote = async () => {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("id", noteId)
      .single();

    if (error) {
      console.log(error);
      return;
    }

    setNote(data);
  };

  const copyNote = async () => {
    await navigator.clipboard.writeText(
      `${note.title}\n\n${note.content}`
    );

    alert("✓ Note copied!");
  };

  if (!note) {
    return (
      <div className="note-view-page">
        <div className="note-loading">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="note-view-page">

      <div className="note-view-card">

        {/* Header */}
        <div className="note-header">

          <div className="note-title-section">
            <div className="note-icon">📝</div>

            <div>
              <h1>{note.title}</h1>
              <p>Shared note</p>
            </div>
          </div>

          <button
            className="copy-btn"
            onClick={copyNote}
          >
            📋 Copy
          </button>

        </div>

        {/* Divider */}
        <div className="note-divider"></div>

        {/* Content */}
        <div className="note-content">
          <pre>
            {note.content}
          </pre>
        </div>

      </div>

    </div>
  );
}

export default NoteView;