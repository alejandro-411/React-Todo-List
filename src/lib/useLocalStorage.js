import { useEffect, useState } from "react";

/**
 * Hook personalizado para sincronizar estado de React con localStorage
 * Permite persistir datos entre sesiones del navegador
 * @param {string} key - Clave bajo la cual se guardará el valor en localStorage
 * @param {*} initial - Valor inicial si no existe nada en localStorage
 * @returns {Array} - [value, setValue] similar a useState pero con persistencia
 */
function useLocalStorage (key, initial) {
  /**
   * Estado inicial: intenta cargar desde localStorage, si no existe usa el valor inicial
   * Los datos en localStorage se guardan como JSON string
   */
  const [ value, setValue ] = useState((localStorage.getItem(key) && JSON.parse(localStorage.getItem(key))) || initial);

  const a = localStorage.getItem(key) || 2;
  console.log(a)
  
  /**
   * Effect que sincroniza el estado con localStorage
   * Cada vez que cambia el valor, lo guarda automáticamente en localStorage
   * Se ejecuta después de cada renderizado donde value, key o ambos cambien
   */
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value])

  // Retorna un array similar a useState: [valor, función para actualizar]
  return [ value, setValue ]
}

export default useLocalStorage; 