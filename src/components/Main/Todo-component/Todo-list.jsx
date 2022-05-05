import { useEffect, useState } from "react";
import { useLocalStorage } from "../../../hooks/common";
import {
  getTodosData,
  deletTodo,
  updateDoneTodos,
  addNewTodo,
} from "../../../services/serveces";
import { loadStatusFunc } from "../../../custom.js/style";
import { TodoAddItem } from "./Todo-options/Todo-add-item";
import { TodoFilter } from "./Todo-options/Todo-filter";
import { TodoItem } from "./Todo-options/Todo-item";

export const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [status, setStatus] = useState("Idle");
  const [newInputText, setNewInputText] = useState("");
  const [filter, setFilter] = useLocalStorage("filter", "all");
  const [color, displayStatus] = loadStatusFunc(status);
  // const [count, setCount] = useState(0);

  //const filterTodos = useMemo(() => {}
  let filterTodos = todos;
  if (filter !== "all") {
    filterTodos = todos.filter((todo) => {
      return (
        (filter === "done" && todo.completed) ||
        (filter === "notDone" && !todo.completed)
      );
    });
  }
  //, [filter, todos]);

  useEffect(() => {
    setStatus("Progress");
    getTodosData()
      .then(({ data }) => {
        setTodos(data);
      })
      .then(() => {
        setStatus("Loaded");
      })
      .catch(() => {
        setStatus("Error");
      });
  }, []);

  const OnDoneBtnClick = (id) => {
    const item = todos.find((todo) => todo.id === id);
    const newItem = { ...item, completed: !item.completed };
    updateDoneTodos(newItem, id);
    let newTodos = todos.map((item) => (item.id === id ? newItem : item));
    setTodos(newTodos);
  };

  const OnDelBtnClick = (id) => {
    deletTodo(id);
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
  };

  const inputValue = (e) => {
    return setNewInputText(e.target.value);
  };

  // const addNewTodoList = useCallback(
  //   (e) => {
  const addNewTodoList = (e) => {
    e.preventDefault();
    if (newInputText) {
      const newTodoList = {
        title: newInputText,
        completed: false,
      };
      addNewTodo(newTodoList).then(({ data }) => {
        console.log(data);
        setTodos([...todos, data]);
        setNewInputText("");
      });
    } else {
      return false;
    }
  }; //   [todos]
  // );

  // const Counter = (initialCount) => {
  //   return (
  //     <>
  //       Count: {count}
  //       <button onClick={() => setCount(initialCount)}>Скинути</button>
  //       <button onClick={() => setCount((prevCount) => prevCount - 1)}>
  //         -
  //       </button>
  //       <button onClick={() => setCount((prevCount) => prevCount + 1)}>
  //         +
  //       </button>
  //     </>
  //   );
  // };
  return (
    <div>
      {/* <div>{Counter(0)}</div> */}

      <h5>
        Load status: <span style={{ color: color }}>{status}</span>{" "}
      </h5>
      <TodoFilter filter={filter} setFilter={setFilter} />
      <TodoAddItem
        inputValue={inputValue}
        addNewTodoList={addNewTodoList}
        titleValue={newInputText}
      />
      <div
        style={{ display: !displayStatus ? "block" : "none" }}
        className="lds-hourglass"
      ></div>
      <ul>
        {filterTodos.map((todo, index) => {
          return (
            <TodoItem
              todo={todo}
              key={todo.id}
              index={index}
              OnDoneBtnClick={OnDoneBtnClick}
              OnDelBtnClick={OnDelBtnClick}
            />
          );
        })}
      </ul>
    </div>
  );
};
