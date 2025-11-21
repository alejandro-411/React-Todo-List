/**
 * Componente botón de filtro para mostrar tareas según su estado
 * @param {string} name - Nombre del filtro ("All", "Pending", "Completed")
 * @param {boolean} isPressed - Indica si este filtro está actualmente activo
 * @param {Function} setFilter - Función para cambiar el filtro activo
 */
function FilterButton ({ name, isPressed, setFilter }) {
  return (
    <button 
      className={`px-3 py-1 rounded transition-all ${
        isPressed 
          ? 'bg-secondary text-white font-semibold shadow-lg' 
          : 'bg-transparent hover:bg-gray-500 hover:bg-opacity-30'
      }`}
      onClick={() => setFilter(name)} 
      aria-pressed={isPressed}
    >
      {/* Texto oculto para lectores de pantalla (accesibilidad) */}
      <span className="sr-only">Show</span>
      <span>{name}</span>
      <span className="sr-only">Tasks</span>
    </button>
  )
}

export default FilterButton;