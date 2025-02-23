import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import "./styles/main.css";
import "./styles/corner.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

library.add(faCheck, faTrash);

const daysOfWeek = [
  { name: "Lundi", color: "#FF5733" },
  { name: "Mardi", color: "#33FF57" },
  { name: "Mercredi", color: "#3357FF" },
  { name: "Jeudi", color: "#FF33A1" },
  { name: "Vendredi", color: "#FF8C33" },
  { name: "Samedi", color: "#8C33FF" },
  { name: "Dimanche", color: "#33FFF5" },
];

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [day, setDay] = useState(daysOfWeek[0].name);
  const [theme, setTheme] = useState(
    localStorage.getItem("savedTheme") || "standard"
  );

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await axios.get("http://localhost:5000/todos");
      setTodos(response.data);
    };
    fetchTodos();
    changeTheme(theme);
  }, []);

  useEffect(() => {
    localStorage.setItem("savedTheme", theme);
    changeTheme(theme);
  }, [theme]);

  const addToDo = async (event) => {
    event.preventDefault();
    if (input.trim() === "") {
      alert("You must write something!");
      return;
    }
    const newTodo = { text: input, completed: false, day };
    const response = await axios.post("http://localhost:5000/todos", newTodo);
    setTodos([...todos, response.data]);
    setInput("");
  };

  const deleteCheck = async (index, type) => {
    const todo = todos[index];
    if (type === "delete") {
      await axios.delete(`http://localhost:5000/todos/${todo.id}`);
      const newTodos = todos.filter((_, i) => i !== index);
      setTodos(newTodos);
    } else if (type === "check") {
      const updatedTodo = { ...todo, completed: !todo.completed };
      await axios.put(`http://localhost:5000/todos/${todo.id}`, updatedTodo);
      const newTodos = todos.map((todo, i) =>
        i === index ? updatedTodo : todo
      );
      setTodos(newTodos);
    }
  };

  const changeTheme = (color) => {
    setTheme(color);
    document.body.className = color;
    if (color === "darker") {
      document.getElementById("title").classList.add("darker-title");
    } else {
      document.getElementById("title").classList.remove("darker-title");
    }
  };

  return (
    <div>
      <header id="header">
        <div className="flexrow-container">
          <div
            className="darker-theme theme-selector"
            onClick={() => changeTheme("darker")}
          ></div>
        </div>
        <h1 id="title">
          Albert WT<div id="border"></div>
        </h1>
      </header>

      <div id="form">
        <form onSubmit={addToDo}>
          <input
            className={`${theme}-input todo-input`}
            type="text"
            placeholder="Ajouter une tâche à faire cette semaine"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <select
            className={`${theme}-input todo-select`}
            value={day}
            onChange={(e) => setDay(e.target.value)}
          >
            {daysOfWeek.map((day) => (
              <option key={day.name} value={day.name}>
                {day.name}
              </option>
            ))}
          </select>
          <button className={`todo-btn ${theme}-button`} type="submit">
            Ajouter!
          </button>
        </form>
      </div>

      <div className="version">
        <div className="demo version-section">
          <a href="https://github.com/albertboo9/" className="github-corner">
            <svg
              width="80"
              height="80"
              viewBox="0 0 250 250"
              style={{
                fill: "#151513",
                color: "#fff",
                position: "absolute",
                top: 0,
                border: 0,
                left: 0,
                transform: "scale(-1, 1)",
              }}
            >
              <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
              <path
                d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
                fill="currentColor"
                style={{ transformOrigin: "130px 106px" }}
                className="octo-arm"
              ></path>
              <path
                d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
                fill="currentColor"
                className="octo-body"
              ></path>
            </svg>
          </a>
        </div>
        <div>
          <p>
            <span id="datetime">{new Date().toLocaleString()}</span>
          </p>
        </div>
      </div>

      <div id="myUnOrdList" className="days-container">
        {daysOfWeek.map((dayObj) => (
          <div key={dayObj.name} className="day-row">
            <h2 style={{ color: dayObj.color }}>{dayObj.name}</h2>
            <ul className="todo-list">
              {todos
                .filter((todo) => todo.day === dayObj.name)
                .map((todo, index) => (
                  <div
                    key={index}
                    className={`todo ${theme}-todo ${
                      todo.completed ? "completed" : ""
                    }`}
                  >
                    <li className="todo-item">
                      <span
                        className="todo-day-circle"
                        style={{ backgroundColor: dayObj.color }}
                      ></span>
                      {todo.text}
                    </li>
                    <button
                      className={`check-btn ${theme}-button`}
                      onClick={() => deleteCheck(index, "check")}
                    >
                      <FontAwesomeIcon icon="check" />
                    </button>
                    <button
                      className={`delete-btn ${theme}-button`}
                      onClick={() => deleteCheck(index, "delete")}
                    >
                      <FontAwesomeIcon icon="trash" />
                    </button>
                  </div>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
