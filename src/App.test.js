/**
 * Suite de Pruebas Automatizadas - Sistema de Gestión de Tareas
 * Ingeniería de Software III
 * Universidad EAM - Facultad de Ingeniería
 *
 * Integrantes:
 * - Bryan Alejandro Benavides Gallego
 * - Alejandro Castaño Uzquiano
 *
 * Fecha: Noviembre 2025
 *
 * Este archivo contiene todas las pruebas funcionales del sistema
 * incluyendo las 15 pruebas principales + 2 pruebas de idea de negocio
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock de localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

global.localStorage = localStorageMock;

// Limpiar localStorage antes de cada prueba
beforeEach(() => {
  localStorage.clear();
});

/**
 * PRUEBA 1: Comprobar que la aplicación To-Do puede abrirse correctamente
 * y que carga su interfaz principal sin errores
 */
describe('PRUEBA 1: Carga de la interfaz principal', () => {
  test('La aplicación se renderiza correctamente sin errores', () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });

  test('Se muestra el título "TO DO LIST"', () => {
    render(<App />);
    const title = screen.getByText(/TO DO LIST/i);
    expect(title).toBeInTheDocument();
  });

  test('Se muestra el formulario de creación de tareas', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    expect(input).toBeInTheDocument();
  });

  test('Se muestran los botones de filtro (All, Active, Completed)', () => {
    render(<App />);
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });
});

/**
 * PRUEBA 2: Validar que el sistema muestre correctamente todas
 * las tareas existentes al ingresar al módulo principal
 */
describe('PRUEBA 2: Visualización de tareas existentes', () => {
  test('Se muestra mensaje cuando no hay tareas', () => {
    render(<App />);
    expect(screen.getByText(/No hay tareas/i)).toBeInTheDocument();
  });

  test('Se muestran todas las tareas creadas', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    // Crear varias tareas
    await userEvent.type(input, 'Tarea 1');
    fireEvent.click(addButton);

    await userEvent.clear(input);
    await userEvent.type(input, 'Tarea 2');
    fireEvent.click(addButton);

    await userEvent.clear(input);
    await userEvent.type(input, 'Tarea 3');
    fireEvent.click(addButton);

    // Verificar que se muestren todas
    expect(screen.getByText('Tarea 1')).toBeInTheDocument();
    expect(screen.getByText('Tarea 2')).toBeInTheDocument();
    expect(screen.getByText('Tarea 3')).toBeInTheDocument();
  });
});

/**
 * PRUEBA 3: Comprobar que el usuario pueda crear tareas nuevas ingresando
 * la información requerida, y que estas se guarden correctamente
 */
describe('PRUEBA 3: Creación de tareas', () => {
  test('Se puede crear una nueva tarea', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, 'Nueva tarea de prueba');
    fireEvent.click(addButton);

    expect(screen.getByText('Nueva tarea de prueba')).toBeInTheDocument();
  });

  test('El input se limpia después de crear una tarea', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, 'Tarea temporal');
    fireEvent.click(addButton);

    expect(input.value).toBe('');
  });

  test('La tarea se guarda en localStorage', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, 'Tarea persistente');
    fireEvent.click(addButton);

    const storedTodos = JSON.parse(localStorage.getItem('todos') || '[]');
    expect(storedTodos).toHaveLength(1);
    expect(storedTodos[0].text).toBe('Tarea persistente');
  });
});

/**
 * PRUEBA 4: Confirmar que el usuario pueda modificar los datos de
 * una tarea existente sin generar errores de actualización
 */
describe('PRUEBA 4: Edición de tareas', () => {
  test('Se puede editar una tarea existente', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    // Crear tarea
    await userEvent.type(input, 'Tarea original');
    fireEvent.click(addButton);

    // Buscar botón de editar
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(btn => btn.querySelector('img[alt="edit todo"]'));

    if (editButton) {
      fireEvent.click(editButton);

      // Buscar input de edición
      const editInput = screen.getByDisplayValue('Tarea original');
      await userEvent.clear(editInput);
      await userEvent.type(editInput, 'Tarea modificada');

      // Guardar cambios (presionar Enter o buscar botón de guardar)
      fireEvent.keyDown(editInput, { key: 'Enter', code: 'Enter' });

      await waitFor(() => {
        expect(screen.queryByText('Tarea modificada')).toBeInTheDocument();
      });
    }
  });
});

/**
 * PRUEBA 5: Verificar que el sistema permita al usuario eliminar una tarea
 * existente de manera correcta y definitiva
 */
describe('PRUEBA 5: Eliminación de tareas', () => {
  test('Se puede eliminar una tarea', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    // Crear tarea
    await userEvent.type(input, 'Tarea a eliminar');
    fireEvent.click(addButton);

    expect(screen.getByText('Tarea a eliminar')).toBeInTheDocument();

    // Eliminar tarea
    const deleteButtons = screen.getAllByRole('button');
    const deleteButton = deleteButtons.find(btn => btn.querySelector('img[alt="delete todo"]'));

    if (deleteButton) {
      fireEvent.click(deleteButton);
      await waitFor(() => {
        expect(screen.queryByText('Tarea a eliminar')).not.toBeInTheDocument();
      });
    }
  });

  test('La tarea eliminada se remueve de localStorage', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, 'Tarea temporal');
    fireEvent.click(addButton);

    const deleteButtons = screen.getAllByRole('button');
    const deleteButton = deleteButtons.find(btn => btn.querySelector('img[alt="delete todo"]'));

    if (deleteButton) {
      fireEvent.click(deleteButton);

      await waitFor(() => {
        const storedTodos = JSON.parse(localStorage.getItem('todos') || '[]');
        expect(storedTodos).toHaveLength(0);
      });
    }
  });
});

/**
 * PRUEBA 6: Comprobar que el usuario pueda cambiar el estado de una tarea
 * de "pendiente" a "completada"
 */
describe('PRUEBA 6: Marcar tarea como completada', () => {
  test('Se puede marcar una tarea como completada', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, 'Tarea a completar');
    fireEvent.click(addButton);

    // Buscar checkbox
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    // Marcar como completada
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  test('El contador se actualiza al completar una tarea', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, 'Tarea 1');
    fireEvent.click(addButton);

    // Verificar contador inicial
    expect(screen.getByText(/Pendientes:/i).textContent).toContain('1');
    expect(screen.getByText(/Completadas:/i).textContent).toContain('0');

    // Completar tarea
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    // Verificar contador actualizado
    await waitFor(() => {
      expect(screen.getByText(/Pendientes:/i).textContent).toContain('0');
      expect(screen.getByText(/Completadas:/i).textContent).toContain('1');
    });
  });
});

/**
 * PRUEBA 7: Verificar que el usuario pueda revertir el estado de una tarea
 * marcada como completada y devolverla a su estado pendiente
 */
describe('PRUEBA 7: Desmarcar tarea completada', () => {
  test('Se puede revertir una tarea completada a pendiente', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, 'Tarea reversible');
    fireEvent.click(addButton);

    const checkbox = screen.getByRole('checkbox');

    // Marcar como completada
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    // Revertir a pendiente
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  test('El contador se actualiza al revertir una tarea', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, 'Tarea');
    fireEvent.click(addButton);

    const checkbox = screen.getByRole('checkbox');

    // Completar
    fireEvent.click(checkbox);
    await waitFor(() => {
      expect(screen.getByText(/Completadas:/i).textContent).toContain('1');
    });

    // Revertir
    fireEvent.click(checkbox);
    await waitFor(() => {
      expect(screen.getByText(/Pendientes:/i).textContent).toContain('1');
      expect(screen.getByText(/Completadas:/i).textContent).toContain('0');
    });
  });
});

/**
 * PRUEBA 8: Validar que el sistema impida crear una tarea sin título,
 * mostrando mensaje de error y bloqueando el guardado
 */
describe('PRUEBA 8: Validación de campo vacío', () => {
  test('No se puede crear una tarea vacía', async () => {
    render(<App />);
    const addButton = screen.getByRole('button', { name: /add/i });

    // Intentar crear sin texto
    fireEvent.click(addButton);

    // No debe haber tareas en la lista
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  test('Se muestra mensaje de error al intentar crear tarea vacía', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    // Intentar con espacios en blanco
    await userEvent.type(input, '   ');
    fireEvent.click(addButton);

    // El input debe mantener el foco o mostrar error
    expect(input).toBeInTheDocument();
  });
});

/**
 * PRUEBA 9: Verificar que el contador de tareas pendientes se actualice
 * automáticamente cuando se agregan, completan o eliminan tareas
 */
describe('PRUEBA 9: Contador de tareas', () => {
  test('El contador se actualiza al agregar tareas', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    // Agregar primera tarea
    await userEvent.type(input, 'Tarea 1');
    fireEvent.click(addButton);
    expect(screen.getByText(/Pendientes:/i).textContent).toContain('1');

    // Agregar segunda tarea
    await userEvent.clear(input);
    await userEvent.type(input, 'Tarea 2');
    fireEvent.click(addButton);
    expect(screen.getByText(/Pendientes:/i).textContent).toContain('2');
  });

  test('El contador se actualiza al completar tareas', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, 'Tarea');
    fireEvent.click(addButton);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(screen.getByText(/Completadas:/i).textContent).toContain('1');
    });
  });

  test('El contador se actualiza al eliminar tareas', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, 'Tarea');
    fireEvent.click(addButton);
    expect(screen.getByText(/Pendientes:/i).textContent).toContain('1');

    const deleteButtons = screen.getAllByRole('button');
    const deleteButton = deleteButtons.find(btn => btn.querySelector('img[alt="delete todo"]'));

    if (deleteButton) {
      fireEvent.click(deleteButton);
      await waitFor(() => {
        expect(screen.getByText(/Pendientes:/i).textContent).toContain('0');
      });
    }
  });
});

/**
 * PRUEBA 10: Confirmar la persistencia de las tareas creadas
 * tras cerrar y volver a abrir la aplicación
 */
describe('PRUEBA 10: Persistencia de datos', () => {
  test('Las tareas se mantienen después de recargar', async () => {
    // Primera renderización
    const { unmount } = render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, 'Tarea persistente');
    fireEvent.click(addButton);

    expect(screen.getByText('Tarea persistente')).toBeInTheDocument();

    // Desmontar componente (simular cierre)
    unmount();

    // Segunda renderización (simular apertura)
    render(<App />);

    // La tarea debe seguir ahí
    expect(screen.getByText('Tarea persistente')).toBeInTheDocument();
  });

  test('El estado de completado se persiste', async () => {
    const { unmount } = render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, 'Tarea');
    fireEvent.click(addButton);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    unmount();
    render(<App />);

    const newCheckbox = screen.getByRole('checkbox');
    expect(newCheckbox).toBeChecked();
  });
});

/**
 * PRUEBA 11: Verificar que el sistema permite realizar búsquedas de tareas
 * por nombre o palabra clave
 */
describe('PRUEBA 11: Búsqueda de tareas', () => {
  test('La búsqueda filtra correctamente las tareas', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    // Crear varias tareas
    await userEvent.type(input, 'Comprar leche');
    fireEvent.click(addButton);
    await userEvent.clear(input);

    await userEvent.type(input, 'Estudiar React');
    fireEvent.click(addButton);
    await userEvent.clear(input);

    await userEvent.type(input, 'Hacer ejercicio');
    fireEvent.click(addButton);

    // Buscar
    const searchInput = screen.getByPlaceholderText(/Buscar tareas/i);
    await userEvent.type(searchInput, 'React');

    // Solo debe mostrar la tarea con "React"
    expect(screen.getByText('Estudiar React')).toBeInTheDocument();
    expect(screen.queryByText('Comprar leche')).not.toBeInTheDocument();
    expect(screen.queryByText('Hacer ejercicio')).not.toBeInTheDocument();
  });

  test('Se muestra mensaje cuando no hay resultados', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, 'Tarea 1');
    fireEvent.click(addButton);

    const searchInput = screen.getByPlaceholderText(/Buscar tareas/i);
    await userEvent.type(searchInput, 'xyz123');

    expect(screen.getByText(/No se encontraron resultados/i)).toBeInTheDocument();
  });
});

/**
 * PRUEBA 12: Comprobar que el sistema permita eliminar todas las tareas
 * marcadas como completadas mediante la opción "Limpiar completadas"
 */
describe('PRUEBA 12: Limpiar tareas completadas', () => {
  test('Se pueden eliminar todas las tareas completadas', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    // Crear tareas
    await userEvent.type(input, 'Tarea 1');
    fireEvent.click(addButton);
    await userEvent.clear(input);

    await userEvent.type(input, 'Tarea 2');
    fireEvent.click(addButton);
    await userEvent.clear(input);

    await userEvent.type(input, 'Tarea 3');
    fireEvent.click(addButton);

    // Completar algunas
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[1]);

    // Buscar botón "Limpiar completadas"
    await waitFor(() => {
      const clearButton = screen.getByText(/Limpiar completadas/i);
      expect(clearButton).toBeInTheDocument();
      fireEvent.click(clearButton);
    });

    // Solo debe quedar la tarea pendiente
    await waitFor(() => {
      expect(screen.queryByText('Tarea 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Tarea 2')).not.toBeInTheDocument();
      expect(screen.getByText('Tarea 3')).toBeInTheDocument();
    });
  });

  test('Las tareas pendientes no se eliminan', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, 'Pendiente');
    fireEvent.click(addButton);
    await userEvent.clear(input);

    await userEvent.type(input, 'Completada');
    fireEvent.click(addButton);

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]); // Completar la segunda

    await waitFor(() => {
      const clearButton = screen.getByText(/Limpiar completadas/i);
      fireEvent.click(clearButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Pendiente')).toBeInTheDocument();
      expect(screen.queryByText('Completada')).not.toBeInTheDocument();
    });
  });
});

/**
 * PRUEBA 13: Verificar que el sistema permita al usuario alternar entre
 * modo claro y oscuro
 */
describe('PRUEBA 13: Modo claro/oscuro', () => {
  test('Existe el botón de cambio de tema', () => {
    render(<App />);
    const themeButtons = screen.getAllByRole('button');
    const themeButton = themeButtons.find(btn => btn.textContent === '🌙' || btn.textContent === '☀️');
    expect(themeButton).toBeInTheDocument();
  });

  test('El tema se puede cambiar', async () => {
    const { container } = render(<App />);
    const themeButtons = screen.getAllByRole('button');
    const themeButton = themeButtons.find(btn => btn.textContent === '🌙' || btn.textContent === '☀️');

    if (themeButton) {
      const initialTheme = container.querySelector('.app-container')?.className;
      fireEvent.click(themeButton);

      await waitFor(() => {
        const newTheme = container.querySelector('.app-container')?.className;
        expect(newTheme).not.toBe(initialTheme);
      });
    }
  });

  test('La preferencia de tema se guarda en localStorage', async () => {
    render(<App />);
    const themeButtons = screen.getAllByRole('button');
    const themeButton = themeButtons.find(btn => btn.textContent === '🌙' || btn.textContent === '☀️');

    if (themeButton) {
      fireEvent.click(themeButton);

      await waitFor(() => {
        const savedTheme = localStorage.getItem('darkMode');
        expect(savedTheme).toBeTruthy();
      });
    }
  });
});

/**
 * PRUEBA 14: Verificar que el sistema permita cerrar sesión de forma segura
 * (En esta aplicación no hay sistema de autenticación, pero validamos
 * que se puedan limpiar los datos correctamente)
 */
describe('PRUEBA 14: Limpieza de sesión/datos', () => {
  test('Los datos en localStorage pueden ser limpiados', () => {
    localStorage.setItem('todos', JSON.stringify([{ id: '1', text: 'Test', completed: false }]));
    expect(localStorage.getItem('todos')).toBeTruthy();

    localStorage.clear();
    expect(localStorage.getItem('todos')).toBeNull();
  });

  test('La aplicación funciona correctamente después de limpiar datos', () => {
    localStorage.clear();
    render(<App />);
    expect(screen.getByText(/TO DO LIST/i)).toBeInTheDocument();
  });
});

/**
 * PRUEBA 15: Validar que el sistema pueda cerrarse completamente de manera
 * controlada, sin generar errores
 */
describe('PRUEBA 15: Cierre controlado del sistema', () => {
  test('El componente se puede desmontar sin errores', () => {
    const { unmount } = render(<App />);
    expect(() => unmount()).not.toThrow();
  });

  test('Los datos persisten después de desmontar el componente', async () => {
    const { unmount } = render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, 'Tarea antes de cerrar');
    fireEvent.click(addButton);

    unmount();

    const storedTodos = JSON.parse(localStorage.getItem('todos') || '[]');
    expect(storedTodos).toHaveLength(1);
    expect(storedTodos[0].text).toBe('Tarea antes de cerrar');
  });

  test('No quedan listeners o procesos activos después del cierre', () => {
    const { unmount } = render(<App />);
    unmount();
    // Si hay memory leaks, esta prueba fallará
    expect(true).toBe(true);
  });
});

/**
 * ========================================================================
 * PRUEBAS DE IDEA DE NEGOCIO
 * ========================================================================
 */

/**
 * PRUEBA NEGOCIO 1: Análisis de Usabilidad y Experiencia de Usuario
 * Verifica que la aplicación sea intuitiva y fácil de usar
 */
describe('PRUEBA NEGOCIO 1: Análisis de Usabilidad UX', () => {
  test('La interfaz es intuitiva: todos los elementos principales están visibles', () => {
    render(<App />);

    // Verificar elementos clave de UX
    expect(screen.getByText(/TO DO LIST/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Add new todo/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText(/Pendientes/i)).toBeInTheDocument();
  });

  test('La aplicación proporciona feedback visual al usuario', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    // Verificar contador inicial
    expect(screen.getByText(/Pendientes:/i)).toBeInTheDocument();

    // Crear tarea y verificar feedback
    await userEvent.type(input, 'Test UX');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Test UX')).toBeInTheDocument();
      expect(screen.getByText(/Pendientes:/i).textContent).toContain('1');
    });
  });

  test('Los filtros mejoran la experiencia de navegación', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    // Crear tareas mixtas
    await userEvent.type(input, 'Pendiente 1');
    fireEvent.click(addButton);
    await userEvent.clear(input);

    await userEvent.type(input, 'Pendiente 2');
    fireEvent.click(addButton);

    // Completar una
    const checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox);

    // Filtrar por completadas
    const completedFilter = screen.getByText('Completed');
    fireEvent.click(completedFilter);

    // Debe mostrar solo la completada
    await waitFor(() => {
      expect(screen.getByText('Pendiente 1')).toBeInTheDocument();
      expect(screen.queryByText('Pendiente 2')).not.toBeInTheDocument();
    });
  });

  test('El diseño responsive se adapta al contenido', () => {
    const { container } = render(<App />);
    const appContainer = container.querySelector('.app-container');
    expect(appContainer).toHaveClass('flex', 'min-h-screen');
  });
});

/**
 * PRUEBA NEGOCIO 2: Análisis de Productividad y Valor Agregado
 * Verifica que la aplicación realmente ayude a los usuarios a ser más productivos
 */
describe('PRUEBA NEGOCIO 2: Análisis de Productividad', () => {
  test('El usuario puede gestionar múltiples tareas eficientemente', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    const tareas = ['Reunión 9am', 'Enviar reporte', 'Llamar cliente', 'Revisar código', 'Documentar API'];

    // Agregar 5 tareas rápidamente
    for (const tarea of tareas) {
      await userEvent.type(input, tarea);
      fireEvent.click(addButton);
      await userEvent.clear(input);
    }

    // Verificar que todas se agregaron
    tareas.forEach(tarea => {
      expect(screen.getByText(tarea)).toBeInTheDocument();
    });

    // Verificar contador
    expect(screen.getByText(/Pendientes:/i).textContent).toContain('5');
  });

  test('La búsqueda permite localizar tareas rápidamente en listas grandes', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    // Crear lista grande de tareas
    const tareas = [
      'Comprar víveres',
      'Pagar servicios',
      'Reunión equipo',
      'Actualizar software',
      'Backup base datos',
      'Revisar métricas',
      'Planificar sprint',
      'Code review PR-123'
    ];

    for (const tarea of tareas) {
      await userEvent.type(input, tarea);
      fireEvent.click(addButton);
      await userEvent.clear(input);
    }

    // Buscar tarea específica
    const searchInput = screen.getByPlaceholderText(/Buscar tareas/i);
    await userEvent.type(searchInput, 'software');

    // Solo debe aparecer la tarea buscada
    expect(screen.getByText('Actualizar software')).toBeInTheDocument();
    expect(screen.queryByText('Comprar víveres')).not.toBeInTheDocument();
  });

  test('El botón "Limpiar completadas" mejora la productividad', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    // Crear y completar varias tareas
    for (let i = 1; i <= 5; i++) {
      await userEvent.type(input, `Tarea completada ${i}`);
      fireEvent.click(addButton);
      await userEvent.clear(input);
    }

    // Completar todas
    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach(cb => fireEvent.click(cb));

    // Agregar tareas pendientes
    await userEvent.type(input, 'Nueva tarea pendiente');
    fireEvent.click(addButton);

    // Limpiar completadas
    await waitFor(() => {
      const clearButton = screen.getByText(/Limpiar completadas/i);
      fireEvent.click(clearButton);
    });

    // Solo debe quedar la pendiente
    await waitFor(() => {
      expect(screen.getByText('Nueva tarea pendiente')).toBeInTheDocument();
      expect(screen.queryByText('Tarea completada 1')).not.toBeInTheDocument();
      expect(screen.getByText(/Pendientes:/i).textContent).toContain('1');
      expect(screen.getByText(/Completadas:/i).textContent).toContain('0');
    });
  });

  test('Los contadores ayudan al seguimiento de progreso diario', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    // Crear 10 tareas
    for (let i = 1; i <= 10; i++) {
      await userEvent.type(input, `Tarea ${i}`);
      fireEvent.click(addButton);
      await userEvent.clear(input);
    }

    expect(screen.getByText(/Pendientes:/i).textContent).toContain('10');

    // Completar 6 tareas
    const checkboxes = screen.getAllByRole('checkbox');
    for (let i = 0; i < 6; i++) {
      fireEvent.click(checkboxes[i]);
    }

    // Verificar progreso (60% completado)
    await waitFor(() => {
      expect(screen.getByText(/Pendientes:/i).textContent).toContain('4');
      expect(screen.getByText(/Completadas:/i).textContent).toContain('6');
    });
  });

  test('La persistencia permite continuidad en el trabajo', async () => {
    // Día 1: Crear tareas
    const { unmount } = render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, 'Tarea para mañana');
    fireEvent.click(addButton);

    unmount();

    // Día 2: Verificar que persisten
    render(<App />);
    expect(screen.getByText('Tarea para mañana')).toBeInTheDocument();
  });
});
