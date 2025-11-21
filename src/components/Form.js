import { useState } from "react";
import { nanoid } from 'nanoid';
import plus from '../icons/plus.svg';

/**
 * Componente de formulario para crear nuevas tareas
 * @param {Function} addTodo - Función para agregar una nueva tarea
 * @param {boolean} darkMode - Estado del modo oscuro para aplicar estilos
 */
function Form ({ addTodo, darkMode }) {

  // Estado para el texto de la nueva tarea
  const [text, setText] = useState("");
  // Estado para mostrar mensajes de error
  const [error, setError] = useState("");
  // Límite máximo de caracteres permitidos
  const MAX_CHARS = 30;

  /**
   * Maneja el envío del formulario
   * Valida que el campo no esté vacío y no exceda el límite de caracteres
   * @param {Event} e - Evento del formulario
   */
  function handleSubmit(e) {
    e.preventDefault();
    const todoText = text.trim();
    
    // Validación: campo vacío
    if (!todoText) {
      setError("⚠️ El campo no puede estar vacío");
      setTimeout(() => setError(""), 3000);
      return;
    }
    
    // Validación: excede límite de caracteres
    if (todoText.length > MAX_CHARS) {
      setError(`⚠️ Máximo ${MAX_CHARS} caracteres permitidos`);
      setTimeout(() => setError(""), 3000);
      return;
    }
    
    // Crea la nueva tarea con un ID único generado por nanoid
    addTodo({
      text: todoText,
      id: `todo-${nanoid()}`,
      completed: false
    });
    clearForm();
  }

  /**
   * Limpia el formulario después de crear una tarea
   * Resetea el texto y el mensaje de error
   */
  function clearForm() {
    setText("");
    setError("");
  }

  return (
    <div className="mb-4">
      <form className="text-white flex gap-1 w-full" onSubmit={handleSubmit}>
        <label htmlFor="todo" className="flex-1 mr-1" > 
          <span className="hidden">Todo</span>
          <input 
            className={`w-full text-inherit px-1 py-2 border-0 border-b ${error ? 'border-red-500' : 'border-white'} ${darkMode ? 'bg-gray-700' : 'bg-transparent'} outline-0 transition-colors`}
            type="text" 
            name="todo" 
            placeholder="Add New Todo" 
            value={text}
            maxLength={MAX_CHARS}
            autoComplete="off"
            onChange={(e) => {
              setText(e.target.value);
              if (error) setError("");
            }}
          />
        </label>
        <button className="text-inherit bg-secondary w-9 h-9 flex justify-center items-center rounded-full shadow-button hover:scale-110 transition-transform" type="submit">
          <img src={plus} alt="plus" />
          <span className="sr-only">Add Todo</span>
        </button>
      </form>
      <div className="flex justify-between items-center mt-1">
        {error ? (
          <div className="text-red-400 text-sm animate-pulse">
            {error}
          </div>
        ) : (
          <div className="text-xs text-gray-400">
            {text.length}/{MAX_CHARS} caracteres
          </div>
        )}
      </div>
    </div>
  )
}

export default Form;