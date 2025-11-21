import { useEffect, useState, useRef } from "react";
import trashcan from '../icons/trashcan.svg';
import edit from '../icons/edit.svg';

/**
 * Componente para mostrar y editar una tarea individual
 * @param {string} text - Texto de la tarea
 * @param {string} id - Identificador único de la tarea
 * @param {boolean} completed - Estado de completado de la tarea
 * @param {Function} deleteTodo - Función para eliminar la tarea
 * @param {Function} toggleTodo - Función para marcar/desmarcar como completada
 * @param {Function} updateTodo - Función para actualizar el texto de la tarea
 * @param {boolean} isEditing - Indica si esta tarea está en modo edición
 * @param {Function} setCurrentlyEditing - Función para controlar qué tarea está siendo editada
 * @param {boolean} darkMode - Estado del modo oscuro para aplicar estilos
 */
function Todo ({ text, id, completed, deleteTodo, toggleTodo, updateTodo, isEditing, setCurrentlyEditing, darkMode }) {

  // Estado para el texto mientras se edita
  const [newText, setNewText] = useState(text);
  // Límite máximo de caracteres para el modo de edición
  const MAX_CHARS = 30;

  // Referencia al input de edición para enfocar automáticamente
  const editingInput = useRef(null);

  /**
   * Effect que enfoca el input automáticamente cuando entra en modo edición
   */
  useEffect(() => {
    if (!isEditing) return;
    editingInput.current.focus();
  }, [isEditing]);
  
  /**
   * Maneja el envío del formulario de edición mediante Enter
   * Valida que el texto no esté vacío y no exceda el límite de caracteres
   * Si la validación falla, restaura el texto original
   * @param {Event} e - Evento del formulario
   */
  function handleSubmit(e) {
    e.preventDefault();
    const trimmedText = newText.trim();
    
    // Si está vacío, restaurar el texto original y salir de edición
    if (!trimmedText) {
      setNewText(text);
      setCurrentlyEditing();
      return;
    }
    
    // Si excede el límite, restaurar texto original y salir de edición
    if (trimmedText.length > MAX_CHARS) {
      setNewText(text);
      setCurrentlyEditing();
      return;
    }
    
    // Actualizar la tarea y salir del modo edición
    updateTodo(trimmedText, id);
    setCurrentlyEditing();
  }

  /**
   * Maneja los cambios en el input de edición
   * Limita la entrada a MAX_CHARS caracteres durante la escritura
   * @param {Event} e - Evento del input
   */
  function handleEditInputChange (e) {
    // Limitar a MAX_CHARS caracteres
    if (e.target.value.length <= MAX_CHARS) {
      setNewText(e.target.value);
    }
  }

  /**
   * Maneja el clic en el botón de editar/guardar
   * Si está en modo edición: valida y guarda los cambios, o restaura el texto original si está vacío
   * Si no está en modo edición: activa el modo de edición para esta tarea
   * @param {Event} e - Evento del botón
   */
  function handleEditButtonClick (e) {
    if (isEditing) {
      // Al salir del modo edición, validar el texto
      const trimmedText = newText.trim();
      if (!trimmedText) {
        // Si está vacío, restaurar el texto original
        setNewText(text);
      } else {
        // Si tiene contenido, actualizar la tarea
        updateTodo(trimmedText, id);
      }
      setCurrentlyEditing("");
    } else {
      // Activar modo edición para esta tarea específica
      setCurrentlyEditing(id);
    }
  }

  /**
   * Maneja la pérdida de foco del input de edición
   * Guarda automáticamente los cambios si el texto es válido
   * Si el texto está vacío, restaura el texto original
   * Sale del modo de edición
   */
  function handleBlur() {
    // Cuando se pierde el foco, guardar o restaurar
    const trimmedText = newText.trim();
    if (!trimmedText) {
      // Restaurar texto original si está vacío
      setNewText(text);
    } else {
      // Guardar cambios si tiene contenido
      updateTodo(trimmedText, id);
    }
    // Salir del modo edición
    setCurrentlyEditing("");
  }

  return (
    <li className={`relative flex items-center text-white ${darkMode ? 'bg-gray-700' : 'bg-primary-400'} mb-3 p-2 rounded transition-all hover:scale-[1.02]`} id={id} key={id} data-completed={completed}>
      <label htmlFor={`input-${id}`} className="group cursor-pointer flex-1 overflow-hidden" >
        <input checked={completed} onChange={() => toggleTodo(id)} value={completed} className="appearance-none w-3.5 h-3.5 mr-2 border rounded-full ease-linear duration-400 group-hover:shadow-checkbox group-hover:border-secondary checked:border-secondary checked:bg-secondary" id={`input-${id}` } type="checkbox" />
        <span className={`${completed ? 'line-through text-gray-400' : ''} break-words`}>{text}</span>
      </label>
      <form className={!isEditing && 'hidden'} onSubmit={handleSubmit}>
        <input 
          ref={editingInput} 
          className={`absolute left-7.5 top-2 right-20 ${darkMode ? 'bg-gray-700' : 'bg-primary-400'} outline-none border-0 border-b border-white`} 
          id={`edit-box-${id}`} 
          type="text" 
          value={newText}
          maxLength={MAX_CHARS}
          autoComplete="off"
          onChange={handleEditInputChange}
          onBlur={handleBlur}
        />
        <button className="hidden" type="submit">Update</button>
      </form>
      
      <button className="ml-auto text-white hover:text-yellow-300 transition-colors" onClick={handleEditButtonClick}>
        <img src={edit} alt="edit" />
      </button> 
      <button className="ml-2 text-white hover:text-red-400 transition-colors" onClick={() => deleteTodo(id)}>
        <img src={trashcan} alt="delete" />    
      </button>
      <button className="hidden" onClick={() => toggleTodo(id)}>Toggle</button>
      
    </li>
  )
}

export default Todo;
