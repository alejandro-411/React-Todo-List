# 📝 React Todo App - Sistema de Gestión de Tareas

Aplicación web moderna para gestión de tareas desarrollada con React y Tailwind CSS, implementando todas las funcionalidades del Plan de Pruebas de Ingeniería de Software III.

> **Nota**: Este proyecto es un fork de [staringelf/React-Todo-List](https://github.com/staringelf/React-Todo-List) con funcionalidades adicionales implementadas para cumplir con los requisitos del Plan de Pruebas de la asignatura.

## 👥 Integrantes del Proyecto

- **Bryan Alejandro Benavides Gallego**
- **Alejandro Castaño Uzquiano**

**Institución**: Universidad EAM - Facultad de Ingeniería  
**Programa**: Ingeniería de Software  
**Asignatura**: Ingeniería de Software III  
**Fecha**: Noviembre 2025

## ✨ Funcionalidades Principales

### Funcionalidades Originales (Fork base)
✅ Crear, editar y eliminar tareas  
✅ Marcar tareas como completadas  
✅ Filtros (Todas, Activas, Completadas)  
✅ Persistencia de datos (localStorage)

### Funcionalidades Agregadas por Nuestro Equipo
🆕 **Búsqueda en tiempo real** - Filtrado de tareas por palabra clave  
🆕 **Contador de tareas** - Visualización de tareas pendientes y completadas  
🆕 **Limpiar tareas completadas** - Eliminar todas las completadas con un clic  
🆕 **Modo claro/oscuro** - Toggle entre temas con persistencia  
🆕 **Validación mejorada** - Mensajes de error para campos vacíos y límite de caracteres  
🆕 **Límite de caracteres** - Validación de 30 caracteres en creación y 100 en edición  
🆕 **Prevención de desbordamiento** - Mejor manejo de texto largo  
🆕 **Documentación completa** - JSDoc en todos los métodos  

## 🚀 Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start

# Ejecutar pruebas
npm test

# Ejecutar pruebas con cobertura
npm test -- --coverage

# Construir para producción
npm run build
```

## 🧪 Sistema de Pruebas

Este proyecto incluye un **sistema completo de pruebas automatizadas**:

### 📊 Cobertura de Pruebas
- ✅ **15 Pruebas Funcionales** - Validación completa de todas las funcionalidades
- ✅ **2 Pruebas de Negocio** - Análisis de usabilidad y productividad
- ✅ **Integración Continua** - Pipeline automatizado con Jenkins
- ✅ **Tasa de Éxito: 100%** - Todas las pruebas pasando

### 🎯 Pruebas Implementadas

#### Pruebas Funcionales (1-15)
1. ✅ Carga de interfaz principal
2. ✅ Visualización de tareas existentes
3. ✅ Creación de tareas
4. ✅ Edición de tareas
5. ✅ Eliminación de tareas
6. ✅ Marcar como completada
7. ✅ Revertir estado completado
8. ✅ Validación de campo vacío
9. ✅ Contador de tareas
10. ✅ Persistencia de datos
11. ✅ Búsqueda de tareas
12. ✅ Limpiar tareas completadas
13. ✅ Modo claro/oscuro
14. ✅ Limpieza de sesión
15. ✅ Cierre controlado

#### Pruebas de Negocio (16-17)
16. ✅ Análisis de Usabilidad UX
17. ✅ Análisis de Productividad

### 📋 Ejecutar Pruebas Específicas

```bash
# Ejecutar prueba específica por número
npm test -- --testNamePattern="PRUEBA 1"

# Ejecutar todas las pruebas funcionales
npm test -- --testNamePattern="PRUEBA [0-9]"

# Ejecutar solo pruebas de negocio
npm test -- --testNamePattern="PRUEBA NEGOCIO"

# Modo watch para desarrollo
npm test -- --watch
```

## 📖 Documentación Completa

- Ver [DOCUMENTACION.md](./DOCUMENTACION.md) para información detallada sobre funcionalidades
- Ver [PLAN_DE_PRUEBAS.md](./PLAN_DE_PRUEBAS.md) para el plan completo de pruebas y resultados

## LiveDemo
  [React Todo List App](http://todo-list-flame-pi.vercel.app/)




https://user-images.githubusercontent.com/40386632/206925060-70c1f76a-a8f3-426f-bf22-6788191b08b7.mp4

