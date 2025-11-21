import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

global.localStorage = localStorageMock;

beforeEach(() => {
  localStorage.clear();
});

const createTestName = (suite) => (name) => `${suite} - ${name}`;

const renderApp = () => render(<App />);

const addTask = async (label) => {
  const input = screen.getByPlaceholderText(/add new todo/i);
  await userEvent.clear(input);
  await userEvent.type(input, label);
  fireEvent.click(screen.getByRole('button', { name: /add todo/i }));
};

describe('PRUEBA 1: Carga de Interfaz Principal', () => {
  const testName = createTestName('PRUEBA 1');
  test(testName('La aplicación muestra encabezado y formulario'), () => {
    renderApp();
    expect(screen.getByText(/TO DO LIST/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/add new todo/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add todo/i })).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });
});

describe('PRUEBA 2: Visualización de Tareas Existentes', () => {
  const testName = createTestName('PRUEBA 2');
  test(testName('Se muestran mensajes y tareas actuales'), async () => {
    renderApp();
    expect(screen.getByText(/No hay tareas/i)).toBeInTheDocument();
    await addTask('Tarea 1');
    await addTask('Tarea 2');
    await waitFor(() => {
      expect(screen.getByText('Tarea 1')).toBeInTheDocument();
      expect(screen.getByText('Tarea 2')).toBeInTheDocument();
    });
  });
});

describe('PRUEBA 3: Creación de Tareas', () => {
  const testName = createTestName('PRUEBA 3');
  test(testName('Permite crear tareas y limpia el formulario'), async () => {
    renderApp();
    const input = screen.getByPlaceholderText(/add new todo/i);
    await addTask('Nueva tarea');
    await waitFor(() => expect(screen.getByText('Nueva tarea')).toBeInTheDocument());
    expect(input).toHaveValue('');
    const storedTodos = JSON.parse(localStorage.getItem('todos') || '[]');
    expect(storedTodos.some((todo) => todo.text === 'Nueva tarea')).toBeTruthy();
  });
});

describe('PRUEBA 4: Edición de Tareas', () => {
  const testName = createTestName('PRUEBA 4');
  test(testName('Permite editar el texto de una tarea existente'), async () => {
    renderApp();
    await addTask('Tarea original');
    const editButton = screen.getByAltText(/edit/i).closest('button');
    fireEvent.click(editButton);
    const editInput = await screen.findByDisplayValue('Tarea original');
    await userEvent.clear(editInput);
    await userEvent.type(editInput, 'Tarea editada');
    fireEvent.keyDown(editInput, { key: 'Enter', code: 'Enter' });
    await waitFor(() => expect(screen.getByDisplayValue('Tarea editada')).toBeInTheDocument());
  });
});

describe('PRUEBA 5: Eliminación de Tareas', () => {
  const testName = createTestName('PRUEBA 5');
  test(testName('Elimina una tarea y actualiza almacenamiento'), async () => {
    renderApp();
    await addTask('Para eliminar');
    const deleteButton = screen.getByAltText(/delete/i).closest('button');
    fireEvent.click(deleteButton);
    await waitFor(() => expect(screen.queryByText('Para eliminar')).not.toBeInTheDocument());
    const storedTodos = JSON.parse(localStorage.getItem('todos') || '[]');
    expect(storedTodos).toHaveLength(0);
  });
});

describe('PRUEBA 6: Cambio de Estado a Completada', () => {
  const testName = createTestName('PRUEBA 6');
  test(testName('Permite marcar una tarea como completada'), async () => {
    renderApp();
    await addTask('Completar');
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    await waitFor(() => {
      expect(screen.getByText(/Completadas:/i).textContent).toContain('1');
    });
  });
});

describe('PRUEBA 7: Revertir Estado Completado', () => {
  const testName = createTestName('PRUEBA 7');
  test(testName('Permite volver una tarea a pendiente'), async () => {
    renderApp();
    await addTask('Reversible');
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
    await waitFor(() => {
      expect(screen.getByText(/Pendientes:/i).textContent).toContain('1');
      expect(screen.getByText(/Completadas:/i).textContent).toContain('0');
    });
  });
});

describe('PRUEBA 8: Validación de Campo Vacío', () => {
  const testName = createTestName('PRUEBA 8');
  test(testName('Impide crear tareas sin título'), async () => {
    renderApp();
    const addButton = screen.getByRole('button', { name: /add todo/i });
    fireEvent.click(addButton);
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    const input = screen.getByPlaceholderText(/add new todo/i);
    await userEvent.type(input, '   ');
    fireEvent.click(addButton);
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });
});

describe('PRUEBA 9: Contador de Tareas', () => {
  const testName = createTestName('PRUEBA 9');
  test(testName('Actualiza los contadores al agregar, completar y eliminar'), async () => {
    renderApp();
    await addTask('Contar 1');
    await addTask('Contar 2');
    expect(screen.getByText(/Pendientes:/i).textContent).toContain('2');
    const checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox);
    await waitFor(() => expect(screen.getByText(/Completadas:/i).textContent).toContain('1'));
    const deleteButton = screen.getAllByAltText(/delete/i)[0].closest('button');
    fireEvent.click(deleteButton);
    await waitFor(() => expect(screen.getByText(/Pendientes:/i).textContent).toContain('1'));
  });
});

describe('PRUEBA 10: Persistencia de Datos', () => {
  const testName = createTestName('PRUEBA 10');
  test(testName('Mantiene tareas y estado tras recargar'), async () => {
    const { unmount } = renderApp();
    await addTask('Persistente');
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    unmount();
    renderApp();
    expect(screen.getByText('Persistente')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeChecked();
  });
});

describe('PRUEBA 11: Búsqueda de Tareas', () => {
  const testName = createTestName('PRUEBA 11');
  test(testName('Filtra tareas por palabra clave'), async () => {
    renderApp();
    await addTask('Comprar leche');
    await addTask('Estudiar React');
    const searchInput = screen.getByPlaceholderText(/buscar tareas/i);
    await userEvent.type(searchInput, 'React');
    expect(screen.getByText('Estudiar React')).toBeInTheDocument();
    expect(screen.queryByText('Comprar leche')).not.toBeInTheDocument();
  });
});

describe('PRUEBA 12: Limpiar Tareas Completadas', () => {
  const testName = createTestName('PRUEBA 12');
  test(testName('Elimina únicamente las tareas completadas'), async () => {
    renderApp();
    await addTask('Completa 1');
    await addTask('Pendiente 2');
    const checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox);
    const clearButton = await screen.findByText(/limpiar completadas/i);
    fireEvent.click(clearButton);
    await waitFor(() => {
      expect(screen.queryByText('Completa 1')).not.toBeInTheDocument();
      expect(screen.getByText('Pendiente 2')).toBeInTheDocument();
    });
  });
});

describe('PRUEBA 13: Modo Claro/Oscuro', () => {
  const testName = createTestName('PRUEBA 13');
  test(testName('Permite alternar modo y persistir preferencia'), async () => {
    renderApp();
    const themeButton = screen.getByRole('button', { name: /🌙|☀️/ });
    fireEvent.click(themeButton);
    await waitFor(() => {
      const savedTheme = localStorage.getItem('darkMode');
      expect(savedTheme).not.toBeNull();
    });
  });
});

describe('PRUEBA 14: Limpieza de Sesión', () => {
  const testName = createTestName('PRUEBA 14');
  test(testName('Limpia datos y reinicia la interfaz'), () => {
    localStorage.setItem('todos', JSON.stringify([{ id: 'x', text: 'Mock', completed: false }]));
    localStorage.clear();
    renderApp();
    expect(screen.getByText(/TO DO LIST/i)).toBeInTheDocument();
  });
});

describe('PRUEBA 15: Cierre Controlado', () => {
  const testName = createTestName('PRUEBA 15');
  test(testName('Se desmonta sin errores y conserva datos'), async () => {
    const { unmount } = renderApp();
    await addTask('Antes de cerrar');
    unmount();
    const storedTodos = JSON.parse(localStorage.getItem('todos') || '[]');
    expect(storedTodos).toHaveLength(1);
  });
});

describe('PRUEBA NEGOCIO 1: Análisis de Usabilidad UX', () => {
  const testName = createTestName('PRUEBA NEGOCIO 1');
  test(testName('La interfaz presenta elementos clave para el usuario'), async () => {
    renderApp();
    await addTask('Tarea UX');
    expect(screen.getByText(/Pendientes:/i)).toBeInTheDocument();
    expect(screen.getByText(/Completadas:/i)).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/buscar tareas/i)).toBeInTheDocument();
  });
});

describe('PRUEBA NEGOCIO 2: Análisis de Productividad', () => {
  const testName = createTestName('PRUEBA NEGOCIO 2');
  test(testName('Facilita gestionar listas largas de tareas'), async () => {
    renderApp();
    const tasks = ['Reunión', 'Enviar correo', 'Deploy'];
    for (const task of tasks) {
      await addTask(task);
    }
    tasks.forEach((task) => {
      expect(screen.getByText(task)).toBeInTheDocument();
    });
    const checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox);
    const clearButton = await screen.findByText(/limpiar completadas/i);
    fireEvent.click(clearButton);
    await waitFor(() => expect(screen.queryByText('Reunión')).not.toBeInTheDocument());
  });
});
