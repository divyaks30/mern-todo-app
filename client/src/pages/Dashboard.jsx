import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import "./Dashboard.css";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const navigate = useNavigate();

  const { logout } = useContext(AuthContext);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addTask = async () => {
    if (!title.trim()) return;

    await API.post(
      "/tasks",
      { title },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setTitle("");
    fetchTasks();
  };

  const completeTask = async (id) => {
    await API.put(
      `/tasks/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchTasks();
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchTasks();
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="container">
      <div className="todo-card">

        <div className="top-bar">

  <div className="profile-icon">
    {user?.name?.charAt(0).toUpperCase()}
  </div>

  <button
    className="logout-btn"
    onClick={handleLogout}
  >
    Logout
  </button>

</div>

<h3 className="welcome-text">
  Welcome, {user?.name}
</h3>

        <h1>✨ To-Do List</h1>

        <div className="input-row">
          <input
            type="text"
            value={title}
            placeholder="Enter a task..."
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          <button
            className="add-btn"
            onClick={addTask}
          >
            Add
          </button>
        </div>

        <div className="task-list">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="task-item"
            >
              <div className="task-left">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() =>
                    completeTask(task._id)
                  }
                />

                <span
                  className={
                    task.completed
                      ? "completed"
                      : ""
                  }
                >
                  {task.title}
                </span>
              </div>

              <button
                className="delete-btn"
                onClick={() =>
                  deleteTask(task._id)
                }
              >
                ✕
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}