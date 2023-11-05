import { useEffect, useState, useId } from "react";
import axiosInstance from "../Axios/axiosInstance.config";
const Todolist = () => {
  const [todos, setTodos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const id = useId;

  const getTodos = async () => {
    try {
      const res = await axiosInstance.get("/todos");
      setTodos(res.data);
    } catch (error) {
      console.error("Error", error);
    }
  };
  const searchTodos = async (query) => {
    try {
      const res = await axiosInstance.get("/todos", {
        params: { q: query },
      });
      setTodos(res.data);
    } catch (error) {
      console.error("Error", error);
    }
  };

  useEffect(() => {
    const delay = 2000;
    const debounce = setTimeout(() => {
      if (searchQuery == "") {
        getTodos();
      } else {
        searchTodos(searchQuery);
      }
    }, delay);
    return () => {
      clearTimeout(debounce);
    };
  }, [searchQuery]);
  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDelete = (id) => {
    axiosInstance.delete(`/todos/${id}`);
    getTodos();
  };
  const handleEdit = (content) => {
    axiosInstance.patch(`/todos/${content.id}`, {
      isCompleted: false,
    });
    getTodos();
  };
  const handleDone = (status) => {
    axiosInstance.patch(`/todos/${status.id}`, {
      isCompleted: true,
    });
    getTodos();
  };

  const addTask = async (e) => {
    e.preventDefault();
    const inputValue = e.target[0].value;
    axiosInstance.post("/todos", {
      id: id,
      taskName: inputValue,
      isCompleted: false,
    });
    e.target[0].value = "";
    getTodos();
  };

  return (
    <div className="todolist">
      <div className="search" onSubmit={addTask}>
        <input
          type="text"
          placeholder="Search ex: todo 1"
          onChange={handleChange}
        />
      </div>
      <form className="addTask" onSubmit={addTask}>
        <input
          type="text"
          // onChange={handleChange}
          placeholder="Add a task........"
        />
        <button className="addtask-btn">Add Task</button>
      </form>
      <div className="lists">
        {todos?.map((todo, id) => (
          <div
            key={id}
            className={`list ${todo.isCompleted ? "completed" : ""}`}
          >
            <p> {todo.taskName}</p>
            <div className="span-btns">
              {!todo.isCompleted && (
                <span onClick={() => handleDone(todo)} title="completed">
                  ✓
                </span>
              )}
              <span
                className="delete-btn"
                onClick={() => handleDelete(todo.id)}
                title="delete"
              >
                x
              </span>
              <span
                className="edit-btn"
                onClick={() => handleEdit(todo)}
                title="edit"
              >
                ↻
              </span>
            </div>
          </div>
        ))}
        {!todos?.length && <h1>No Records</h1>}
      </div>
    </div>
  );
};

export default Todolist;
