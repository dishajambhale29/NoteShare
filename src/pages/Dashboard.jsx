import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [groups, setGroups] = useState([]);

  const [groupName, setGroupName] = useState("");
  const [joinCode, setJoinCode] = useState("");

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/login");
      return;
    }

    setUser(user);
    loadGroups(user.id);
  };


  const loadGroups = async (userId) => {
    const { data, error } = await supabase
      .from("group_members")
      .select(`
        group_id,
        role,
        groups (
          id,
          name,
          description,
          group_code
        )
      `)
      .eq("user_id", userId);

    if (error) {
      console.log(error);
      return;
    }

    setGroups(data || []);
  };

  const createGroup = async () => {
    if (!groupName.trim()) {
      alert("Please enter group name");
      return;
    }

    const code = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    const { data, error } = await supabase.rpc("create_group", {
      group_name: groupName,
      group_description: "",
      code: code
    });

    if (error) {
      alert(error.message);
      console.log(error);
      return;
    }

    alert(`Group created!\nJoin Code: ${code}`);

    setGroupName("");

    await loadGroups(user.id);

    navigate(`/group/${data}`);
  };


  const joinGroup = async () => {

  if (!joinCode.trim()) {
    alert("Please enter join code");
    return;
  }

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError) {
    alert(userError.message);
    return;
  }

  if (!user) {
    alert("Please login first.");
    navigate("/login");
    return;
  }

  // Call Supabase function
  const { data, error } = await supabase.rpc(
    "join_group",
    {
      code: joinCode.trim().toUpperCase()
    }
  );

  if (error) {
    console.log("JOIN ERROR:", error);
    alert(error.message);
    return;
  }

  console.log("JOINED GROUP ID:", data);

  alert("Successfully joined the group!");

  setJoinCode("");

  // Reload user's groups
  await loadGroups(user.id);
};

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="dashboard">

      <div className="dashboard-header">

        <h1>Shared Notepad</h1>

        <div className="user-info">
          Signed in as{" "}
          <strong>{user?.email?.split("@")[0]}</strong>

          <button
            className="change-btn"
            onClick={logout}
          >
            change
          </button>
        </div>

      </div>

      <div className="action-container">

        
        <div className="action-card">

          <h2>Create a group</h2>

          <p>
            You'll be the admin. Share the join code with others.
          </p>

          <input
            type="text"
            placeholder="e.g. Python Class - Batch 1"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />

          <button
            className="action-btn"
            onClick={createGroup}
          >
            Create group
          </button>

        </div>

      
        <div className="action-card">

          <h2>Join a group</h2>

          <p>
            Enter the join code your admin shared with you.
          </p>

          <input
            type="text"
            placeholder="e.g. AB12CD"
            value={joinCode}
            onChange={(e) =>
              setJoinCode(e.target.value.toUpperCase())
            }
          />

          <button
            className="action-btn"
            onClick={joinGroup}
          >
            Join group
          </button>

        </div>

      </div>

    
      <h3 className="your-groups">
        Your groups
      </h3>

      <div className="groups-list">

        {groups.length === 0 ? (

          <div className="empty-group">
            You haven't joined any groups yet.
          </div>

        ) : (

          groups.map((item) => (

            <div
              className="group-item"
              key={item.group_id}
              onClick={() =>
                navigate(`/group/${item.group_id}`)
              }
            >
              {item.groups.name}
            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default Dashboard;