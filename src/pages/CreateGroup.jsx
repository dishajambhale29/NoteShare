
import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

function CreateGroup() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const createGroup = async (e) => {

    e.preventDefault();

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    console.log("USER:", user);
    console.log("USER ID:", user?.id);
    console.log("USER ERROR:", userError);

    // Check user
    if (userError) {
      alert(userError.message);
      return;
    }

    if (!user) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    // Generate group code
    const code = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    console.log("Group Code:", code);


    const {
      data,
      error
    } = await supabase.rpc("create_group", {
      group_name: name,
      group_description: description,
      code: code
    });

    console.log("RPC DATA:", data);
    console.log("RPC ERROR:", error);

    if (error) {
      alert("Error: " + error.message);
      return;
    }

    alert(`Group created!\nGroup Code: ${code}`);

  
    navigate(`/group/${data}`);
  };

  return (
    <div className="container mt-5">

      <div className="col-md-6 mx-auto">

        <div className="card shadow">

          <div className="card-body">

            <h2 className="mb-4">
              Create Group
            </h2>

            <form onSubmit={createGroup}>

              <input
                type="text"
                className="form-control mb-3"
                placeholder="Group name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <textarea
                className="form-control mb-3"
                placeholder="Description"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
              />

              <button
                type="submit"
                className="btn btn-primary w-100"
              >
                Create Group
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}

export default CreateGroup;

