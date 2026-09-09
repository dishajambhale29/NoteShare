
import { useNavigate } from "react-router-dom";

const NoteCard = ({ note }) => {
  const navigate = useNavigate();

  const copyNote = async () => {
    await navigator.clipboard.writeText(
      `${note.title}\n\n${note.content}`
    );

    alert("Note copied!");
  };

  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div
        className="card h-100 border-0 shadow-sm"
        style={{
          borderRadius: "16px",
          backgroundColor: "#ffffff",
        }}
      >
        <div className="card-body p-4">

          {/* Note Icon */}
          <div
            className="d-flex align-items-center justify-content-center mb-3"
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "12px",
              backgroundColor: "#f1e8d9",
              color: "#B08D57",
              fontSize: "20px",
            }}
          >
            📝
          </div>

          {/* Title */}
          <h5
            className="fw-bold mb-2"
            style={{
              color: "#2E2925",
              fontFamily: "Georgia, serif",
            }}
          >
            {note.title}
          </h5>

          {/* Content */}
          <p
            className="text-muted mb-4"
            style={{
              minHeight: "72px",
              lineHeight: "1.6",
            }}
          >
            {note.content.substring(0, 150)}
            {note.content.length > 150 ? "..." : ""}
          </p>

          {/* Buttons */}
          <div className="d-flex gap-2">

            <button
              className="btn flex-grow-1"
              style={{
                backgroundColor: "#B08D57",
                color: "white",
                borderRadius: "10px",
                border: "none",
              }}
              onClick={() => navigate(`/note/${note.id}`)}
            >
              View Note
            </button>

            <button
              className="btn"
              style={{
                border: "1px solid #B08D57",
                color: "#B08D57",
                borderRadius: "10px",
                backgroundColor: "white",
              }}
              onClick={copyNote}
            >
              Copy
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default NoteCard;
