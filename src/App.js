/**
 * Sistema de Gestión de Tareas - To-Do App
 * Ingeniería de Software III
 * Universidad EAM - Facultad de Ingeniería
 * 
 * Integrantes:
 * - Bryan Alejandro Benavides Gallego
 * - Alejandro Castano Uzquiano
 * 
 * Noviembre 2025
 */

import { useState } from "react";
import FilterButton from "./components/FilterButton";
import Form from "./components/Form";
import Todo from "./components/Todo";
import useLocalStorage from "./lib/useLocalStorage";


const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed
}

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App() {

  // const [todos, setTodos] = useState([]);
  const [todos, setTodos] = useLocalStorage('todos', []);
  const [completedAll, setCompletedAll] = useState(false);
  const [filter, setFilter] = useState("All");
  const [currentlyEditing, setCurrentlyEditing] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);

  /**
   * Agrega una nueva tarea al array de tareas
   * @param {Object} todo - Objeto con la información de la tarea (text, id, completed)
   */
  function addTodo(todo) {
    setTodos([
      ...todos, 
      todo
    ]);
  }

  /**
   * Elimina una tarea específica del array de tareas
   * @param {string} id - ID único de la tarea a eliminar
   */
  function deleteTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  /**
   * Elimina todas las tareas del array
   * Útil para limpiar completamente la lista
   */
  function deleteAll(){
    setTodos([]);
  }

  /**
   * Elimina únicamente las tareas marcadas como completadas
   * Mantiene las tareas pendientes intactas
   */
  function deleteCompleted(){
    setTodos(todos.filter((todo) => !todo.completed));
  }

  /**
   * Alterna el estado de completado de una tarea específica
   * @param {string} id - ID único de la tarea a alternar
   * Si la tarea está completada, la marca como pendiente y viceversa
   */
  function toggleTodo(id){
    setTodos(todos.map((todo) => (
      todo.id === id ? {
        ...todo,
        completed: !todo.completed
      } : todo
    )))
  }

  /**
   * Alterna el estado de todas las tareas
   * Si alguna está completada la marca como pendiente y viceversa
   */
  function toggleAll(){
    setTodos(todos.map((todo) => (
      {
        ...todo,
        completed: !todo.completed
      }      
    )
    ));
  }

  /**
   * Actualiza el texto de una tarea específica
   * @param {string} text - Nuevo texto de la tarea
   * @param {string} id - ID único de la tarea a actualizar
   */
  function updateTodo(text, id){
    console.log(text)
    setTodos(todos.map((todo) => (
      todo.id === id ? {
        ...todo,
        text: text
      } : todo 
    )))
  }

  /**
   * Marca todas las tareas como completadas o pendientes
   * Dependiendo del estado actual (completedAll)
   */
  function completeAll() {
    setTodos(todos.map((todo) => (
      { 
        ...todo,
        completed: !completedAll
      }
    )));
    setCompletedAll(!completedAll);
  }

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton 
      name={name}
      key={name}
      isPressed={name === filter} 
      setFilter={setFilter}
    />
  ));

  // Filtrar tareas por búsqueda y filtro
  const filteredTodos = todos
    .filter(FILTER_MAP[filter])
    .filter((todo) => 
      todo.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Contador de tareas pendientes
  const pendingCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <div className={`app-container ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-r from-green-400 to-blue-500'} flex min-h-screen transition-colors duration-300`}>
      <div className={`m-auto ${darkMode ? 'bg-gray-800' : 'bg-primary-600'} p-6 rounded-lg text-white max-w-md w-full shadow-2xl`}>
        {/* Header con modo oscuro */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-xl font-semibold">TO DO LIST</h2>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            title={darkMode ? "Modo Claro" : "Modo Oscuro"}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Contador de tareas */}
        <div className={`mb-4 p-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-primary-500'}`}>
          <div className="flex justify-between text-sm">
            <span>📋 Pendientes: <strong>{pendingCount}</strong></span>
            <span>✅ Completadas: <strong>{completedCount}</strong></span>
          </div>
        </div>

        <Form addTodo={addTodo} darkMode={darkMode} />
        
        {/* Barra de búsqueda */}
        {todos.length > 0 && (
          <div className="mb-4">
            <input 
              type="text"
              placeholder="🔍 Buscar tareas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-3 py-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} outline-none focus:ring-2 focus:ring-secondary`}
            />
          </div>
        )}

        {/* Lista de tareas */}
        <ul className="todos">
          {filteredTodos.length > 0 ? (
            filteredTodos.map(({ text, id, completed }) => (
              <Todo 
                key={id}
                text={text} 
                id={id} 
                completed={completed}
                deleteTodo={deleteTodo}
                toggleTodo={toggleTodo}
                updateTodo={updateTodo}
                isEditing={id === currentlyEditing}
                setCurrentlyEditing={setCurrentlyEditing}
                darkMode={darkMode}
              />
            ))
          ) : searchTerm ? (
            <div className="text-center py-8 text-gray-400">
              No se encontraron resultados para "{searchTerm}"
            </div>
          ) : todos.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No hay tareas. ¡Agrega una nueva!
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No hay tareas en esta categoría
            </div>
          )}
        </ul>

        <div className="hidden">
          <button onClick={deleteAll}>Delete All</button>
          <button onClick={toggleAll}>Toggle All</button>
          <button onClick={completeAll}>Complete All</button>
        </div>
        
        {/* Filtros y botón limpiar completadas */}
        <div className={!todos.length && 'hidden'}>
          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-2">
              {filterList}
            </div>
            {completedCount > 0 && (
              <button 
                onClick={deleteCompleted}
                className={`text-xs px-3 py-1 rounded ${darkMode ? 'bg-red-700 hover:bg-red-600' : 'bg-red-500 hover:bg-red-600'} transition-colors`}
                title="Eliminar tareas completadas"
              >
                🗑️ Limpiar completadas ({completedCount})
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
