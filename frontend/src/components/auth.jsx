import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const STATUSES = [
  { key: "à faire", label: "À FAIRE", color: "bg-blue-200", border: "border-blue-400" },
  { key: "en cours", label: "EN COURS", color: "bg-pink-200", border: "border-pink-400" },
  { key: "terminée", label: "TERMINÉE", color: "bg-green-200", border: "border-green-500" },
];

const getStatusIcon = (key) => {
  if (key === "à faire") return <span className="text-blue-500 text-3xl">📋</span>;
  if (key === "en cours") return <span className="text-pink-500 text-3xl">⏳</span>;
  if (key === "terminée") return <span className="text-green-600 text-3xl">✅</span>;
  return null;
};

const getStatusTextColor = (key) => {
  if (key === "à faire") return "text-blue-600";
  if (key === "en cours") return "text-pink-600";
  if (key === "terminée") return "text-green-700";
  return "";
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const Auth = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [message, setMessage] = useState("");

  const fetchTasks = () => {
    axiosInstance.get("/tasks")
      .then((res) => setTasks(res.data))
      .catch((err) => console.error("Erreur chargement tâches :", err));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2000);
  };

  const addTask = async () => {
    if (newTask.trim()) {
      try {
        await axiosInstance.post("/tasks", {
          title: newTask,
          statut: "à faire"
        });
        setNewTask("");
        fetchTasks();
        showMessage("Tâche ajoutée !");
      } catch (err) {
        console.error("Erreur ajout tâche :", err);
      }
    }
  };

  const startEdit = (task) => {
    setEditId(task.id);
    setEditTitle(task.title);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditTitle("");
  };

  const saveEdit = async () => {
    if (editTitle.trim()) {
      try {
        await axiosInstance.put(`/tasks/${editId}`, {
          title: editTitle,
        });
        setEditId(null);
        setEditTitle("");
        fetchTasks();
        showMessage("Tâche modifiée !");
      } catch (err) {
        console.error("Erreur modification tâche :", err);
      }
    }
  };

  const deleteTask = async (id) => {
    try {
      await axiosInstance.delete(`/tasks/${id}`);
      fetchTasks();
      showMessage("Tâche supprimée !");
    } catch (err) {
      console.error("Erreur suppression tâche :", err);
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;

    const task = tasks.find((t) => t.id === draggableId);
    if (!task) return;

    try {
      await axiosInstance.put(`/tasks/${task.id}`, {
        title: task.title,
        statut: destination.droppableId,
      });
      fetchTasks();
      showMessage("Statut modifié !");
    } catch (err) {
      console.error("Erreur changement de statut :", err);
    }
  };
axiosInstance.get("/tasks")
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-between">
      <div className="w-full">
        <div
  className="w-full h-72 bg-cover bg-center flex flex-col items-center justify-center"
  style={{
    backgroundImage:
      "linear-gradient(to right, rgba(101, 67, 255, 0.5), rgba(100, 200, 255, 0.5)), url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80')",
  }}
>
  <h1 className="text-5xl font-extrabold text-white flex items-center gap-3">
    <span className="text-pink-300 drop-shadow text-5xl">🌸</span>
    <span>My To-Do List</span>
    <span className="text-pink-300 drop-shadow text-5xl">🌸</span>
  </h1>
  <p className="text-xl text-white mt-4  drop-shadow text-center font-bold">
    Organisez vos journées, accomplissez vos objectifs et gardez le sourire chaque jour !
  </p>
</div>

        <div className="w-full flex flex-col items-center">
          {message && (
            <div className="mb-4 text-green-600 text-center font-semibold">{message}</div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              editId ? saveEdit() : addTask();
            }}
            className="flex mb-8 gap-2 w-full max-w-xl mt-12"
          >
            <input
              type="text"
               className="border-2 border-black focus:border-black rounded-l px-3 py-2 flex-1 outline-none transition"
              placeholder={editId ? "Modifier la tâche" : "Nouvelle tâche"}
              value={editId ? editTitle : newTask}
              onChange={(e) => (editId ? setEditTitle(e.target.value) : setNewTask(e.target.value))}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
            >
              {editId ? "💾" : "➕"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="ml-2 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                Annuler
              </button>
            )}
          </form>

          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-6 w-full justify-center">
              {STATUSES.map((status) => (
                <Droppable droppableId={status.key} key={status.key}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`rounded-xl shadow-lg p-4 w-80 min-h-[300px] flex flex-col ${status.color}`}
                    >
                      <h2 className="flex mb-4 w-full">
                        <div
                          className={`flex items-center justify-between w-full px-6 py-4 rounded-lg font-semibold shadow border-4 bg-white ${status.border}`}
                          style={{ minHeight: 64 }}
                        >
                          <span>{getStatusIcon(status.key)}</span>
                          <span className={`text-2xl ${getStatusTextColor(status.key)} font-bold tracking-wide`}>
                            {status.label}
                          </span>
                        </div>
                      </h2>

                      {tasks
                        .filter((task) => (task.statut || "à faire") === status.key)
                        .map((task, idx) => (
                          <Draggable draggableId={task.id} index={idx} key={task.id}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`mb-3 p-3 rounded bg-white shadow flex justify-between items-center ${
                                  snapshot.isDragging ? "bg-blue-100" : ""
                                }`}
                              >
                                <span>
                                  {task.title}
                                  <div className="text-xs text-gray-500">{formatDate(task.created_at)}</div>
                                </span>
                                <span className="flex gap-2">
                                  <button
                                    onClick={() => startEdit(task)}
                                    className="hover:scale-110 transition"
                                    style={{ color: "#2563eb", fontSize: "1.2em" }}
                                    title="Modifier"
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    onClick={() => deleteTask(task.id)}
                                    className="hover:scale-110 transition"
                                    style={{ color: "#dc2626", fontSize: "1.2em" }}
                                    title="Supprimer"
                                  >
                                    🗑️
                                  </button>
                                </span>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>

      <footer className="w-full py-4 mt-8 bg-gray-200 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} My To-Do List. Tous droits réservés.
      </footer>
    </div>
  );
};

export default Auth;
