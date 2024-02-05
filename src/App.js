import React from "react";
import { useState, useEffect } from "react";
import createTodo, { initialTodos } from "./todos";
export default function TodoList() {
    const [todos, setTodos] = useState(initialTodos);
    const [showActive, setShowActive] = useState(false);
    const [activeTodos, setActiveTodos] = useState([]);
    const [visibleTodos, setVisibleTodos] = useState([]);
    const [editingTodoId, setEditingTodoId] = useState(null);
    const [editedText, setEditedText] = useState("");
    const [footer, setFooter] = useState(null);
    useEffect(() => {
        setActiveTodos(todos.filter((todo) => todo.completed));
    }, [todos]);
    useEffect(() => {
        setVisibleTodos(showActive ? activeTodos : todos);
    }, [showActive, todos, activeTodos]);
    useEffect(() => {
        setFooter(<footer>{todos.filter((todo) => !todo.completed).length} todos left</footer>);
    }, [todos]);
    function handleEditClick(todo) {
        setEditingTodoId(todo.id);
        setEditedText(todo.text);
    }
    function handleSaveEditClick() {
        setTodos((prevTodos) =>
            prevTodos.map((todo) =>
                todo.id === editingTodoId ? { ...todo, text: editedText } : todo
            )
        );
        setEditingTodoId(null);
    }
    function handleCancelEditClick() {
        setEditingTodoId(null);
        setEditedText("");
    }

    function handleToggleComplete(todo) {
        setTodos((prevTodos) =>
            prevTodos.map((t) =>
                t.id === todo.id ? { ...t, completed: !t.completed } : t
            )
        );
    }
    function handleAddTodo(newTodo) {
        if (newTodo.text.trim() !== "") {
            setTodos([...todos, newTodo]);
            setFooter(<footer>{todos.filter((todo) => !todo.completed).length + 1} задач(а/и) осталось</footer>);
        }
    }
    function handleDeleteClick(todo) {
        setTodos((prevTodos) => prevTodos.filter((t) => t.id !== todo.id));
    }

    return (
        <div className="todo-list-container">
            <label>
                <input
                    type="checkbox"
                    checked={showActive}
                    onChange={(e) => setShowActive(e.target.checked)}
                />
                Show only active todos
            </label>
            <NewTodo onAdd={handleAddTodo} />
            <ul className="todo-list">
                {visibleTodos.map((todo) => (
                    <li key={todo.id}>
                        <span
                            className={`todo-text ${todo.completed ? "completed" : ""}`}
                        >
                            {todo.text}
                        </span>
                        <div className="todo-actions">
                            {editingTodoId === todo.id ? (
                                <>
                                    <input
                                        value={editedText}
                                        onChange={(e) => setEditedText(e.target.value)}
                                    />
                                    <button onClick={handleSaveEditClick}>Сохранить</button>
                                    <button onClick={handleCancelEditClick}>Отмена</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => handleEditClick(todo)}>Редактировать</button>
                                    <button onClick={() => handleDeleteClick(todo)}>Удалить</button>
                                    <input
                                        type="checkbox"
                                        checked={todo.completed}
                                        onChange={() => handleToggleComplete(todo)}
                                    />
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
            {footer}
        </div>
    );
}

function NewTodo({ onAdd }) {
    const [text, setText] = useState("");

    function handleAddClick() {
        const trimmedText = text.trim();
        if (trimmedText !== "") {
            onAdd(createTodo(trimmedText));
            setText("");
        }
    }

    return (
        <div className="new-todo">
            <input value={text} onChange={(e) => setText(e.target.value)} />
            <button onClick={handleAddClick}>Добавить</button>
        </div>
    );
}
