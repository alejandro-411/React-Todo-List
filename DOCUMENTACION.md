# Sistema de Gestión de Tareas - To-Do App

Aplicación web moderna para gestión de tareas desarrollada con React, implementando todas las funcionalidades especificadas en el Plan de Pruebas de Ingeniería de Software III.

## Información del Proyecto

> **Proyecto Base**: Este es un fork de [staringelf/React-Todo-List](https://github.com/staringelf/React-Todo-List)  
> **Modificaciones**: Se agregaron múltiples funcionalidades extra para cumplir con los requisitos del Plan de Pruebas de Ingeniería de Software III

**Repositorio Original**: https://github.com/staringelf/React-Todo-List  
**Nuestro Fork**: https://github.com/alejandro-411/React-Todo-List

## Funcionalidades Implementadas

### Funcionalidades del Proyecto Original (Fork Base)

#### Gestión Básica de Tareas
- **Crear tareas**: Agregar nuevas tareas
- **Editar tareas**: Modificar el texto de tareas existentes con edición inline
- **Eliminar tareas**: Borrar tareas individuales
- **Marcar como completadas**: Toggle para cambiar el estado de las tareas

#### Filtrado Básico
- **Filtros**: Ver todas las tareas, solo activas o solo completadas

#### Persistencia
- **LocalStorage**: Las tareas se guardan automáticamente
- **Recuperación automática**: Los datos persisten al cerrar y reabrir la aplicación

---

### Funcionalidades Agregadas por Nuestro Equipo

#### Búsqueda en Tiempo Real
- **Búsqueda por palabra clave**: Filtrar tareas mientras escribes
- **Búsqueda case-insensitive**: No distingue entre mayúsculas y minúsculas
- **Mensaje de "sin resultados"**: Feedback visual cuando no hay coincidencias
- **Compatible con filtros**: La búsqueda se combina con los filtros All/Active/Completed

#### Contador de Tareas
- **Contador dinámico**: Muestra el número exacto de tareas pendientes y completadas
- **Actualización automática**: Se actualiza en tiempo real al crear, completar o eliminar tareas
- **Diseno visual atractivo**: Badges con colores diferentes para cada tipo

#### Botón Limpiar Completadas
- **Eliminación masiva**: Botón para eliminar todas las tareas completadas de una vez
- **Confirmación visual**: Muestra el número de tareas a eliminar
- **Acceso rápido**: Ubicado estratégicamente en la interfaz

#### Modo Claro/Oscuro
- **Toggle de tema**: Cambiar entre modo claro y oscuro con un clic
- **Persistencia del tema**: El tema seleccionado se guarda en localStorage
- **Transiciones suaves**: Animaciones fluidas al cambiar de tema
- **Iconos dinámicos**: Sol para modo claro, luna para modo oscuro
- **Aplicación completa**: Todos los componentes respetan el tema seleccionado

#### Validaciones Mejoradas
- **Validación de campos vacíos**: Mensaje de error visible al intentar crear/editar tarea sin texto
- **Límite de caracteres en creación**: Máximo 30 caracteres con contador visual
- **Límite de caracteres en edición**: Máximo 100 caracteres con validación
- **Mensajes de error temporales**: Alertas que desaparecen automáticamente después de 3 segundos
- **Prevención de espacios vacíos**: Trim automático del texto
- **Restauración automática**: Si la edición es inválida, se restaura el texto original

#### Prevención de Desbordamiento de Texto
- **Break-words CSS**: Evita que texto largo desborde el contenedor
- **Límites de caracteres**: Previene entradas excesivamente largas
- **Diseno responsive mejorado**: Mantiene la interfaz limpia en cualquier dispositivo

#### Deshabilitación de Autocompletado
- **autoComplete="off"**: Previene sugerencias del navegador en inputs
- **Mejor experiencia de usuario**: No interfiere el historial del navegador con las tareas

#### Documentación Completa del Código
- **JSDoc en todos los métodos**: Comentarios profesionales explicando cada función
- **Documentación de parámetros**: @param tags en todas las funciones
- **Comentarios inline**: Explicaciones claras de la lógica compleja
- **Documentación de componentes**: Descripción de props y funcionalidad de cada componente

#### Mejoras en la Interfaz de Usuario
- **Diseno responsive mejorado**: Adaptable a diferentes tamanos de pantalla
- **Animaciones suaves**: Transiciones en hover, cambios de tema y acciones
- **Efectos visuales**: Scale en hover, sombras y gradientes
- **Accesibilidad mejorada**: Etiquetas ARIA y elementos semánticos

## Instalación y Ejecución

### Prerrequisitos
- Node.js (v14 o superior)
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/alejandro-411/React-Todo-List.git
cd React-Todo-List
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar en modo desarrollo**
```bash
npm start
```

La aplicación se abrirá automáticamente en [http://localhost:3000](http://localhost:3000)

### Scripts Disponibles

- `npm start` - Ejecuta la app en modo desarrollo
- `npm test` - Ejecuta las pruebas
- `npm run build` - Crea build de producción
- `npm run deploy` - Despliega en GitHub Pages

## Casos de Prueba Implementados

Basado en el Plan de Pruebas de Ingeniería de Software III:

1. **Prueba 1**: Apertura de la aplicación
2. **Prueba 2**: Visualización de lista de tareas
3. **Prueba 3**: Creación de tareas
4. **Prueba 4**: Edición de tareas
5. **Prueba 5**: Eliminación de tareas
6. **Prueba 6**: Marcar tareas como completadas
7. **Prueba 7**: Filtrado de tareas (All, Active, Completed)
8. **Prueba 8**: Validación de campos vacíos
9. **Prueba 9**: Contador de tareas pendientes
10. **Prueba 10**: Persistencia de datos
11. **Prueba 11**: Búsqueda de tareas por palabra clave
12. **Prueba 13**: Limpiar tareas completadas
13. **Prueba 14**: Modo claro/oscuro

## Tecnologías Utilizadas

- **React 18.2.0** - Framework principal
- **Tailwind CSS** - Estilos y diseno
- **nanoid** - Generación de IDs únicos
- **localStorage** - Persistencia de datos
- **React Hooks** - Gestión de estado (useState, useEffect, useRef)
- **Custom Hooks** - useLocalStorage para persistencia

## Estructura del Proyecto

```
React-Todo-List/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── FilterButton.js    # Botones de filtrado
│   │   ├── Form.js             # Formulario de creación
│   │   └── Todo.js             # Componente de tarea individual
│   ├── icons/                  # Iconos SVG
│   ├── lib/
│   │   └── useLocalStorage.js  # Hook personalizado
│   ├── App.js                  # Componente principal
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
└── README.md
```

## Características Destacadas

- **Sin dependencias de backend**: Aplicación completamente funcional en el cliente
- **Experiencia de usuario optimizada**: Interfaz intuitiva y responsive
- **Código limpio y mantenible**: Componentes reutilizables y bien estructurados
- **Performance**: Renderizado optimizado con React
- **Accesibilidad**: Cumple con estándares de accesibilidad web

## Guía de Uso

### Crear una tarea
1. Escribe el texto de la tarea en el campo de entrada
2. Presiona el botón "+" o Enter
3. La tarea aparecerá en la lista

### Editar una tarea
1. Haz clic en el ícono de lápiz ✏️
2. Modifica el texto directamente en la lista
3. Presiona Enter o haz clic fuera para guardar

### Completar una tarea
- Haz clic en el checkbox al lado de la tarea
- La tarea se marcará con una línea atravesada

### Buscar tareas
- Usa el campo de búsqueda 🔍
- Los resultados se filtran en tiempo real

### Filtrar tareas
- **All**: Muestra todas las tareas
- **Active**: Solo tareas pendientes
- **Completed**: Solo tareas completadas

### Limpiar completadas
- Haz clic en el botón "🗑️ Limpiar completadas"
- Se eliminarán todas las tareas marcadas como completadas

### Cambiar tema
- Haz clic en el ícono ☀️/🌙 en la esquina superior derecha
- El tema se guardará automáticamente

## Créditos y Licencia

### Proyecto Original
**Autor Original**: [staringelf](https://github.com/staringelf)  
**Repositorio Base**: [React-Todo-List](https://github.com/staringelf/React-Todo-List)  
**Licencia Original**: MIT License

### Nuestras Contribuciones
Este fork fue desarrollado como parte del curso de Ingeniería de Software III en la Universidad EAM, agregando las siguientes funcionalidades extra:
- Búsqueda en tiempo real
- Contador de tareas
- Modo claro/oscuro con persistencia
- Botón de limpiar completadas
- Validaciones mejoradas con límites de caracteres
- Documentación completa con JSDoc
- Mejoras en la UI/UX

## Integrantes del Proyecto

- **Bryan Alejandro Benavides Gallego**
- **Alejandro Castano Uzquiano**

---

**Fecha de desarrollo**: Noviembre 2025  
**Institución**: Universidad EAM - Facultad de Ingeniería  
**Programa**: Ingeniería de Software  
**Asignatura**: Ingeniería de Software III  
**Tipo de Proyecto**: Fork con funcionalidades adicionales
