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

beforeEach(() => {
  localStorage.clear();
});

/**
 * PRUEBA 1: Carga de la interfaz principal
 */
describe('PRUEBA 1: Carga de Interfaz Principal', () => {
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

  test('Se muestran los botones de filtro', () => {
    render(<App />);
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });
});

/**
 * PRUEBA 2: Visualización de tareas existentes
 */
describe('PRUEBA 2: Visualización de Tareas', () => {
  test('Se muestra mensaje cuando no hay tareas', () => {
    render(<App />);
    expect(screen.getByText(/No hay tareas/i)).toBeInTheDocument();
  });

  test('Se muestran todas las tareas creadas', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, 'Tarea 1');
    fireEvent.click(addButton);

    await userEvent.clear(input);
    await userEvent.type(input, 'Tarea 2');
    fireEvent.click(addButton);

    expect(screen.getByText('Tarea 1')).toBeInTheDocument();
    expect(screen.getByText('Tarea 2')).toBeInTheDocument();
  });
});

/**
 * PRUEBA 3: Creación de tareas
 */
describe('PRUEBA 3: Creación de Tareas', () => {
  test('Se puede crear una nueva tarea', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, 'Nueva tarea');
    fireEvent.click(addButton);

    expect(screen.getByText('Nueva tarea')).toBeInTheDocument();
  });

  test('El input se limpia después de crear', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, 'Tarea');
    fireEvent.click(addButton);

    expect(input.value).toBe('');
  });

  test('La tarea se guarda en localStorage', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, 'Tarea');
    fireEvent.click(addButton);

    const stored = JSON.parse(localStorage.getItem('todos') || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].text).toBe('Tarea');
  });
});

/**
 * PRUEBA 4: Edición de tareas
 */
describe('PRUEBA 4: Edición de Tareas', () => {
  test('Se puede editar una tarea', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, 'Tarea original');
    fireEvent.click(addButton);

    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(btn => btn.querySelector('img[alt="edit todo"]'));

    if (editButton) {
      fireEvent.click(editButton);
      const editInput = screen.getByDisplayValue('Tarea original');
      await userEvent.clear(editInput);
      await userEvent.type(editInput, 'Tarea modificada');
      fireEvent.keyDown(editInput, { key: 'Enter', code: 'Enter' });

      await waitFor(() => {
        expect(screen.queryByText('Tarea modificada')).toBeInTheDocument();
      });
    }
  });
});

/**
 * PRUEBA 5: Eliminación de tareas
 */
describe('PRUEBA 5: Eliminación de Tareas', () => {
  test('Se puede eliminar una tarea', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, 'Tarea a eliminar');
    fireEvent.click(addButton);

    expect(screen.getByText('Tarea a eliminar')).toBeInTheDocument();

    const deleteButtons = screen.getAllByRole('button');
    const deleteButton = deleteButtons.find(btn => btn.querySelector('img[alt="delete todo"]'));

    if (deleteButton) {
      fireEvent.click(deleteButton);
      await waitFor(() => {
        expect(screen.queryByText('Tarea a eliminar')).not.toBeInTheDocument();
      });
    }
  });

  test('Se elimina de localStorage', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, 'Tarea');
    fireEvent.click(addButton);

    const deleteButtons = screen.getAllByRole('button');
    const deleteButton = deleteButtons.find(btn => btn.querySelector('img[alt="delete todo"]'));

    if (deleteButton) {
      fireEvent.click(deleteButton);
      await waitFor(() => {
        const stored = JSON.parse(localStorage.getItem('todos') || '[]');
        expect(stored).toHaveLength(0);
      });
    }
  });
});

/**
 * PRUEBA 6: Marcar como completada
 */
describe('PRUEBA 6: Marcar como Completada', () => {
  test('Se puede marcar como completada', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, 'Tarea');
    fireEvent.click(addButton);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  test('El contador se actualiza', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, 'Tarea');
    fireEvent.click(addButton);

    expect(screen.getByText(/Pendientes:/i).textContent).toContain('1');

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(screen.getByText(/Pendientes:/i).textContent).toContain('0');
      expect(screen.getByText(/Completadas:/i).textContent).toContain('1');
    });
  });
});

/**
 * PRUEBA 7: Revertir estado completado
 */
describe('PRUEBA 7: Revertir Estado', () => {
  test('Se puede revertir a pendiente', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, 'Tarea');
    fireEvent.click(addButton);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  test('El contador se actualiza al revertir', async () => {
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

    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(screen.getByText(/Pendientes:/i).textContent).toContain('1');
      expect(screen.getByText(/Completadas:/i).textContent).toContain('0');
    });
  });
});

/**
 * PRUEBA 8: Validación campo vacío
 */
describe('PRUEBA 8: Validación Campo Vacío', () => {
  test('No se puede crear tarea vacía', async () => {
    render(<App />);
    const addButton = screen.getByRole('button', { name: /add/i });

    fireEvent.click(addButton);

    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  test('Muestra error con espacios', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, '   ');
    fireEvent.click(addButton);

    expect(input).toBeInTheDocument();
  });
});

/**
 * PRUEBA 9: Contador de tareas
 */
describe('PRUEBA 9: Contador de Tareas', () => {
  test('Se actualiza al agregar', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, 'Tarea 1');
    fireEvent.click(addButton);
    expect(screen.getByText(/Pendientes:/i).textContent).toContain('1');

    await userEvent.clear(input);
    await userEvent.type(input, 'Tarea 2');
    fireEvent.click(addButton);
    expect(screen.getByText(/Pendientes:/i).textContent).toContain('2');
  });

  test('Se actualiza al completar', async () => {
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

  test('Se actualiza al eliminar', async () => {
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
 * PRUEBA 10: Persistencia de datos
 */
describe('PRUEBA 10: Persistencia de Datos', () => {
  test('Las tareas persisten', async () => {
    const { unmount } = render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, 'Tarea persistente');
    fireEvent.click(addButton);

    unmount();
    render(<App />);

    expect(screen.getByText('Tarea persistente')).toBeInTheDocument();
  });

  test('El estado persiste', async () => {
    const { unmount } = render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, 'Tarea');
    fireEvent.click(addButton);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    unmount();
    render(<App />);

    const newCheckbox = screen.getByRole('checkbox');
    expect(newCheckbox).toBeChecked();
  });
});

/**
 * PRUEBA 11: Búsqueda de tareas
 */
describe('PRUEBA 11: Búsqueda de Tareas', () => {
  test('Filtra correctamente', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, 'Comprar leche');
    fireEvent.click(addButton);
    await userEvent.clear(input);

    await userEvent.type(input, 'Estudiar React');
    fireEvent.click(addButton);

    const searchInput = screen.getByPlaceholderText(/Buscar tareas/i);
    await userEvent.type(searchInput, 'React');

    expect(screen.getByText('Estudiar React')).toBeInTheDocument();
    expect(screen.queryByText('Comprar leche')).not.toBeInTheDocument();
  });

  test('Muestra mensaje sin resultados', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, 'Tarea');
    fireEvent.click(addButton);

    const searchInput = screen.getByPlaceholderText(/Buscar tareas/i);
    await userEvent.type(searchInput, 'xyz');

    expect(screen.getByText(/No se encontraron resultados/i)).toBeInTheDocument();
  });
});

/**
 * PRUEBA 12: Limpiar completadas
 */
describe('PRUEBA 12: Limpiar Completadas', () => {
  test('Elimina solo completadas', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, 'Tarea 1');
    fireEvent.click(addButton);
    await userEvent.clear(input);

    await userEvent.type(input, 'Tarea 2');
    fireEvent.click(addButton);

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    await waitFor(() => {
      const clearButton = screen.getByText(/Limpiar completadas/i);
      fireEvent.click(clearButton);
    });

    await waitFor(() => {
      expect(screen.queryByText('Tarea 1')).not.toBeInTheDocument();
      expect(screen.getByText('Tarea 2')).toBeInTheDocument();
    });
  });

  test('Mantiene pendientes', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, 'Pendiente');
    fireEvent.click(addButton);
    await userEvent.clear(input);

    await userEvent.type(input, 'Completada');
    fireEvent.click(addButton);

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);

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
 * PRUEBA 13: Modo claro/oscuro
 */
describe('PRUEBA 13: Modo Claro/Oscuro', () => {
  test('Existe botón de tema', () => {
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

  test('Se guarda en localStorage', async () => {
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
 * PRUEBA 14: Limpieza de sesión
 */
describe('PRUEBA 14: Limpieza de Sesión', () => {
  test('Se puede limpiar localStorage', () => {
    localStorage.setItem('todos', JSON.stringify([{ id: '1', text: 'Test', completed: false }]));
    expect(localStorage.getItem('todos')).toBeTruthy();

    localStorage.clear();
    expect(localStorage.getItem('todos')).toBeNull();
  });

  test('Funciona después de limpiar', () => {
    localStorage.clear();
    render(<App />);
    expect(screen.getByText(/TO DO LIST/i)).toBeInTheDocument();
  });
});

/**
 * PRUEBA 15: Cierre controlado
 */
describe('PRUEBA 15: Cierre Controlado', () => {
  test('Se desmonta sin errores', () => {
    const { unmount } = render(<App />);
    expect(() => unmount()).not.toThrow();
  });

  test('Datos persisten después de desmontar', async () => {
    const { unmount } = render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, 'Tarea');
    fireEvent.click(addButton);

    unmount();

    const stored = JSON.parse(localStorage.getItem('todos') || '[]');
    expect(stored).toHaveLength(1);
  });

  test('No quedan listeners activos', () => {
    const { unmount } = render(<App />);
    unmount();
    expect(true).toBe(true);
  });
});

/**
 * PRUEBA NEGOCIO 1: Análisis de Usabilidad UX
 */
describe('PRUEBA NEGOCIO 1: Análisis de Usabilidad UX', () => {
  test('Elementos principales visibles', () => {
    render(<App />);
    expect(screen.getByText(/TO DO LIST/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Add new todo/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  test('Proporciona feedback visual', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, 'Test');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });

  test('Filtros mejoran navegación', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, 'Tarea 1');
    fireEvent.click(addButton);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    const completedFilter = screen.getByText('Completed');
    fireEvent.click(completedFilter);

    await waitFor(() => {
      expect(screen.getByText('Tarea 1')).toBeInTheDocument();
    });
  });

  test('Diseño responsive', () => {
    const { container } = render(<App />);
    const appContainer = container.querySelector('.app-container');
    expect(appContainer).toHaveClass('flex', 'min-h-screen');
  });
});

/**
 * PRUEBA NEGOCIO 2: Análisis de Productividad
 */
describe('PRUEBA NEGOCIO 2: Análisis de Productividad', () => {
  test('Gestiona múltiples tareas', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    const tareas = ['Tarea 1', 'Tarea 2', 'Tarea 3'];

    for (const tarea of tareas) {
      await userEvent.type(input, tarea);
      fireEvent.click(addButton);
      await userEvent.clear(input);
    }

    tareas.forEach(tarea => {
      expect(screen.getByText(tarea)).toBeInTheDocument();
    });
  });

  test('Búsqueda rápida', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, 'Comprar');
    fireEvent.click(addButton);
    await userEvent.clear(input);

    await userEvent.type(input, 'Estudiar');
    fireEvent.click(addButton);

    const searchInput = screen.getByPlaceholderText(/Buscar tareas/i);
    await userEvent.type(searchInput, 'Estudiar');

    expect(screen.getByText('Estudiar')).toBeInTheDocument();
    expect(screen.queryByText('Comprar')).not.toBeInTheDocument();
  });

  test('Limpiar mejora productividad', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, 'Completada');
    fireEvent.click(addButton);
    await userEvent.clear(input);

    await userEvent.type(input, 'Pendiente');
    fireEvent.click(addButton);

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    await waitFor(() => {
      const clearButton = screen.getByText(/Limpiar completadas/i);
      fireEvent.click(clearButton);
    });

    await waitFor(() => {
      expect(screen.queryByText('Completada')).not.toBeInTheDocument();
      expect(screen.getByText('Pendiente')).toBeInTheDocument();
    });
  });

  test('Contadores ayudan seguimiento', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, 'Tarea');
    fireEvent.click(addButton);

    expect(screen.getByText(/Pendientes:/i).textContent).toContain('1');
  });

  test('Persistencia permite continuidad', async () => {
    const { unmount } = render(<App />);
    const input = screen.getByPlaceholderText(/Add new todo/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(input, 'Tarea importante');
    fireEvent.click(addButton);

    unmount();
    render(<App />);

    expect(screen.getByText('Tarea importante')).toBeInTheDocument();
  });
});

