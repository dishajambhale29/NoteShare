import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./CreateNote.css";

function CreateNote() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const createNote = async (e) => {
  e.preventDefault();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    navigate("/login");
    return;
  }

  // Note expires after 24 hours
  const expiresAt = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  ).toISOString();

  const { error } = await supabase
    .from("notes")
    .insert({
      group_id: groupId,
      created_by: user.id,
      title: title,
      content: content,
      status: "PUBLISHED",
      expires_at: expiresAt,
    });

  if (error) {
    alert(error.message);
    return;
  }

  alert("Note published! It will be available for 24 hours.");

  navigate(`/group/${groupId}`);
};

  return (
    <div className="create-note-page">

      <div className="create-note-card">

        {/* Header */}
        <div className="create-note-header">

          <div className="create-note-icon">
            📝
          </div>

          <div>
            <h1>Create Note</h1>
            <p>
              Create and share a new note with your group.
            </p>
          </div>

        </div>

        <div className="create-note-divider"></div>

        {/* Form */}
        <form onSubmit={createNote}>

          {/* Title */}
          <div className="create-input-group">

            <label htmlFor="note-title">
              Note Title
            </label>

            <input
              id="note-title"
              type="text"
              placeholder="Enter your note title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              required
            />

          </div>

          {/* Content */}
          <div className="create-input-group">

            <label htmlFor="note-content">
              Note Content
            </label>

            <textarea
              id="note-content"
              rows="15"
              placeholder="Write your note here..."
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              required
            />

          </div>

          {/* Buttons */}
          <div className="create-note-actions">

            <button
              type="button"
              className="cancel-note-btn"
              onClick={() =>
                navigate(`/group/${groupId}`)
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="publish-note-btn"
            >
              🚀 Publish Note
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default CreateNote;