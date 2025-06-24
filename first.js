const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task");
const todosList = document.getElementById("todos-list");
const itemsLeft = document.getElementById("items-left");
const clearCompletedBtn = document.getElementById("clear-completed");
const emptyState = document.querySelector(".empty-state");
const dateElement = document.getElementById("date");
const filters = document.querySelectorAll(".filter");

let todos = [];
let currentFilter = "all";

// Add new todo
addTaskBtn.addEventListener("click", () => {
    addTodo(taskInput.value);
});

taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTodo(taskInput.value);
});

clearCompletedBtn.addEventListener("click", clearCompleted);

// Add a new todo item
function addTodo(text) {
    if (text.trim() === "") return;

    const todo = {
        id: Date.now(),
        text,
        completed: false
    };
    todos.push(todo);
    taskInput.value = "";
    saveTodos();
    renderTodos();
}

// Save todos to local storage
function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
    updateItemsCount();
    checkEmptyState();
}

// Update count of items left
function updateItemsCount() {
    const uncompletedTodos = todos.filter(todo => !todo.completed);
    itemsLeft.textContent = `${uncompletedTodos.length} item${uncompletedTodos.length !== 1 ? "s" : ""} left`;
}

// Check whether to show empty state
function checkEmptyState() {
    const filteredTodos = filterTodos(currentFilter);
    if (filteredTodos.length === 0) {
        emptyState.classList.remove("hidden");
    } else {
        emptyState.classList.add("hidden");
    }
}

// Filter todos based on filter state
function filterTodos(filter) {
    switch (filter) {
        case "active":
            return todos.filter(todo => !todo.completed);
        case "completed":
            return todos.filter(todo => todo.completed);
        default:
            return todos;
    }
}

// Render todo items on the screen
function renderTodos() {
    todosList.innerHTML = "";
    const filteredTodos = filterTodos(currentFilter);

    filteredTodos.forEach((todo) => {
        const todoItem = document.createElement("li");
        todoItem.classList.add("todo-item");
        if (todo.completed) todoItem.classList.add("completed");

        const checkboxContainer = document.createElement("label");
        checkboxContainer.classList.add("checkbox-container");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("todo-checkbox");
        checkbox.checked = todo.completed;
        checkbox.addEventListener("change", () => toggleTodo(todo.id));

        const checkmark = document.createElement("span");
        checkmark.classList.add("checkmark");

        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(checkmark);

        const todoText = document.createElement("span");
        todoText.classList.add("todo-item-text");
        todoText.textContent = todo.text;

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
        deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

        todoItem.appendChild(checkboxContainer);
        todoItem.appendChild(todoText);
        todoItem.appendChild(deleteBtn);

        todosList.appendChild(todoItem);
    });

    checkEmptyState();
}

// Clear completed tasks
function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos();
}

// Toggle completed state
function toggleTodo(id) {
    todos = todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos();
    renderTodos();
}

// Delete a todo
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

filters.forEach(filter=>{
    filter.addEventListener("click",()=>{
        setActiveFilter(filter.getAttribute("data-filter"))
    })
})
function  setActiveFilter(filter){
    currentFilter=filter
    
    filters.forEach(item=>{
        if(item.getAttribute("data-filter")=== filter){
            item.classList.add("active")
        }
        else{
            item.classList.remove("active")

        }

    })
    renderTodos();
}

function setDate(){
    const options={ weekday:"long",month:"short",day:"numeric"};
    const today=new Date()

    dateElement.textContent=today.toLocaleDateString("en-US",options);
}

// Load todos from localStorage on page load
window.addEventListener("DOMContentLoaded", () => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
        todos = JSON.parse(storedTodos);
    }
    renderTodos();
    setDate()
});
