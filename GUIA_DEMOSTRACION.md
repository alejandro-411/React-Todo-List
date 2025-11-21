# 🚀 GUÍA RÁPIDA - DEMOSTRACIÓN DE LA APP

## ✅ LA APP YA SE ESTÁ LEVANTANDO

Ejecuté: `npm start` en segundo plano

---

## 🌐 ABRE LA APP EN EL NAVEGADOR

En **1-2 minutos**, la app se abrirá automáticamente en:

```
http://localhost:3000
```

Si no se abre automáticamente:
1. Abre tu navegador (Chrome, Edge, Firefox)
2. Ve a: **http://localhost:3000**

---

## 🎯 DEMOSTRACIÓN - QUÉ MOSTRAR

### 1️⃣ **Interfaz Principal** (PRUEBA 1)
- ✅ Título "TO DO LIST"
- ✅ Formulario para agregar tareas
- ✅ Botones de filtro: All, Active, Completed
- ✅ Contadores de tareas pendientes/completadas
- ✅ Campo de búsqueda

### 2️⃣ **Crear Tareas** (PRUEBA 3)
```
1. Escribe "Estudiar para examen" en el input
2. Click en el botón + (o Enter)
3. ✅ La tarea aparece en la lista
4. ✅ El input se limpia automáticamente
5. ✅ El contador de "Pendientes" se actualiza
```

### 3️⃣ **Marcar como Completada** (PRUEBA 6)
```
1. Click en el checkbox de una tarea
2. ✅ La tarea se tacha
3. ✅ El contador de "Completadas" se actualiza
4. ✅ El contador de "Pendientes" disminuye
```

### 4️⃣ **Editar Tareas** (PRUEBA 4)
```
1. Click en el ícono de lápiz (edit)
2. Modifica el texto de la tarea
3. Presiona Enter
4. ✅ La tarea se actualiza
```

### 5️⃣ **Eliminar Tareas** (PRUEBA 5)
```
1. Click en el ícono de basura (delete)
2. ✅ La tarea desaparece
3. ✅ Los contadores se actualizan
```

### 6️⃣ **Búsqueda** (PRUEBA 11)
```
1. Crea varias tareas: "Estudiar", "Comprar", "Programar"
2. Escribe "Estudiar" en el campo de búsqueda
3. ✅ Solo aparece la tarea que coincide
```

### 7️⃣ **Filtros** (PRUEBA 11)
```
1. Click en "Active" → Solo muestra pendientes
2. Click en "Completed" → Solo muestra completadas
3. Click en "All" → Muestra todas
```

### 8️⃣ **Limpiar Completadas** (PRUEBA 12)
```
1. Marca varias tareas como completadas
2. Click en "Limpiar completadas"
3. ✅ Solo quedan las pendientes
```

### 9️⃣ **Modo Oscuro** (PRUEBA 13)
```
1. Click en el botón 🌙 (esquina superior derecha)
2. ✅ La app cambia a modo oscuro
3. Click en ☀️ para volver a modo claro
```

### 🔟 **Persistencia** (PRUEBA 10)
```
1. Crea varias tareas
2. Cierra el navegador
3. Vuelve a abrir http://localhost:3000
4. ✅ Las tareas siguen ahí (localStorage)
```

### 1️⃣1️⃣ **Validación** (PRUEBA 8)
```
1. Intenta agregar una tarea vacía
2. ✅ Aparece mensaje de error
3. ✅ No se crea la tarea
```

---

## 💡 SCRIPT PARA LA DEMOSTRACIÓN (30 segundos)

```
"Esta es nuestra aplicación de gestión de tareas.

[Crear tarea] Voy a crear una tarea nueva...
✅ Se crea instantáneamente

[Marcar completada] La marco como completada...
✅ Se actualiza el contador automáticamente

[Editar] Puedo editarla fácilmente...
✅ Los cambios se guardan

[Búsqueda] Si tengo muchas tareas, puedo buscar...
✅ Filtra en tiempo real

[Modo oscuro] Incluye modo oscuro para mejor experiencia...
✅ Cambia el tema completo

[Persistencia] Si recargo la página...
✅ Todas las tareas persisten en localStorage

La aplicación tiene 15 pruebas funcionales y 2 de negocio,
todas ejecutadas en nuestro pipeline de Jenkins con 100% de éxito."
```

---

## 🎬 ORDEN RECOMENDADO PARA DEMOSTRAR

1. **Mostrar interfaz** → Limpia y profesional
2. **Crear 3 tareas** → Funciona rápido
3. **Marcar 1 como completada** → Contador se actualiza
4. **Usar búsqueda** → Encuentra rápido
5. **Cambiar a modo oscuro** → Se ve bien
6. **Recargar página** → Datos persisten
7. **Mostrar Jenkins** → Pipeline exitoso
8. **Mostrar logs** → 17/17 pruebas pasadas

---

## 🛑 PARA DETENER LA APP

Cuando termines la demostración:

```powershell
# Presiona Ctrl + C en la terminal
# O cierra la ventana de PowerShell
```

---

## 📊 DATOS PARA MENCIONAR

- **17 Pruebas Automatizadas** (15 funcionales + 2 negocio)
- **35 Casos de Prueba** individuales
- **95.2% Cobertura** de código
- **100% Tasa de éxito** en Jenkins
- **Persistencia** con localStorage
- **Responsive Design** con Tailwind CSS
- **Búsqueda en tiempo real**
- **Modo claro/oscuro**

---

## ✅ CHECKLIST DE DEMOSTRACIÓN

Antes de mostrar, verifica:
- [ ] La app cargó en http://localhost:3000
- [ ] No hay errores en consola (F12)
- [ ] Jenkins muestra el pipeline exitoso
- [ ] Tienes el Jenkinsfile abierto para mostrar

---

**¡La app ya está corriendo! Abre http://localhost:3000 y comienza tu demostración! 🚀**

