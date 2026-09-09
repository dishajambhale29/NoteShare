import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Group.css";

function Group() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [role, setRole] = useState(null);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    loadGroup();
    loadNotes();
  }, [groupId]);

  const loadGroup = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: membership } = await supabase
      .from("group_members")
      .select("role")
      .eq("group_id", groupId)
      .eq("user_id", user.id)
      .single();

    setRole(membership?.role);

    const { data } = await supabase
      .from("groups")
      .select("*")
      .eq("id", groupId)
      .single();

    setGroup(data);
  };

  const loadNotes = async () => {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("group_id", groupId)
      .eq("status", "PUBLISHED")
      .order("created_at", {
        ascending: false,
      });

    if (!error) {
      setNotes(data || []);
    }
  };

  if (!group) {
    return (
      <div className="group-page">
        <div className="group-loading">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="group-page">

      <div className="group-container">

        {/* Group Header */}
        <div className="group-header">

          <div className="group-info">

            <div className="group-icon">
              👥
            </div>

            <div>
              <h1>{group.name}</h1>

              <p>
                {group.description || "Shared notes and resources"}
              </p>

              {group.group_code && (
                <span className="group-code">
                  Code: {group.group_code}
                </span>
              )}
            </div>

          </div>

          {role === "ADMIN" && (
            <button
              className="create-note-btn"
              onClick={() =>
                navigate(`/group/${groupId}/create-note`)
              }
            >
              + Create Note
            </button>
          )}

        </div>

        {/* Divider */}
        <div className="group-divider"></div>

        {/* Notes Heading */}
        <div className="notes-heading">
          <div>
            <h2>Shared Notes</h2>
            <p>
              Notes shared with members of this group
            </p>
          </div>

          <span className="notes-count">
            {notes.length} {notes.length === 1 ? "Note" : "Notes"}
          </span>
        </div>

        {/* Notes */}
        {notes.length === 0 ? (

          <div className="no-notes">
            <div className="no-notes-icon">
              📝
            </div>

            <h3>No notes yet</h3>

            <p>
              {role === "ADMIN"
                ? "Create the first note for this group."
                : "There are no published notes in this group yet."}
            </p>
          </div>

        ) : (

          <div className="notes-grid">

            {notes.map((note) => (

              <div
                className="note-card"
                key={note.id}
              >

                <div className="note-card-header">
                  <div className="note-small-icon">
                    📝
                  </div>

                  <h3>{note.title}</h3>
                </div>

                <p className="note-preview">
                  {note.content.substring(0, 150)}
                  {note.content.length > 150 ? "..." : ""}
                </p>

                <button
                  className="view-note-btn"
                  onClick={() =>
                    navigate(`/note/${note.id}`)
                  }
                >
                  View Note →
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default Group;