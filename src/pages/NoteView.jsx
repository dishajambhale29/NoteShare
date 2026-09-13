
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./NoteView.css";

function NoteView() {
  const { noteId } = useParams();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNote();
  }, [noteId]);

  const loadNote = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("id", noteId)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (error) {
      console.log("Error loading note:", error);
      setNote(null);
      setLoading(false);
      return;
    }

    setNote(data);
    setLoading(false);
  };

  const copyNote = async () => {
    if (!note) return;

    await navigator.clipboard.writeText(
      `${note.title}\n\n${note.content}`
    );

    alert("✓ Note copied!");
  };

  if (loading) {
    return (
      <div className="note-view-page">
        <div className="note-loading">
          Loading...
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="note-view-page">
        <div className="note-loading">
          This note has expired or does not exist.
        </div>
      </div>
    );
  }

  return (
    <div className="note-view-page">

      <div className="note-view-card">

  
        <div className="note-header">

          <div className="note-title-section">

            <div className="note-icon">
              📝
            </div>

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

      
        <div className="note-divider"></div>

    
        <div className="note-content">
          <pre>{note.content}</pre>
        </div>

      </div>

    </div>
  );
}

export default NoteView;

