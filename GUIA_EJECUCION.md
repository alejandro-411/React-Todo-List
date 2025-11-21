# 🎯 Guía de Ejecución de Pruebas

## Sistema de Gestión de Tareas - To-Do App

**Autores:** Bryan Alejandro Benavides Gallego & Alejandro Castano Uzquiano  
**Universidad EAM** - Ingeniería de Software III

---

## 📦 Instalación

Antes de ejecutar las pruebas, asegúrate de tener instaladas todas las dependencias:

```bash
cd C:\Users\Bryan\Desktop\microservicios_parcial3\React-Todo-List
npm install
```

---

## 🧪 Comandos de Pruebas

### Ejecutar Todas las Pruebas

```bash
# Con interfaz interactiva
npm test

# Sin interfaz (modo CI)
npm test -- --watchAll=false

# Con cobertura de código
npm test -- --coverage
```

### Ejecutar Pruebas Específicas

```bash
# Ejecutar solo PRUEBA 1
npm test -- --testNamePattern="PRUEBA 1" --watchAll=false

# Ejecutar solo PRUEBA 2
npm test -- --testNamePattern="PRUEBA 2" --watchAll=false

# Ejecutar solo PRUEBA 3
npm test -- --testNamePattern="PRUEBA 3" --watchAll=false

# ... y así sucesivamente para PRUEBA 4 hasta PRUEBA 15

# Ejecutar PRUEBA NEGOCIO 1
npm test -- --testNamePattern="PRUEBA NEGOCIO 1" --watchAll=false

# Ejecutar PRUEBA NEGOCIO 2
npm test -- --testNamePattern="PRUEBA NEGOCIO 2" --watchAll=false
```

### Ejecutar Grupos de Pruebas

```bash
# Todas las pruebas funcionales (1-15)
npm test -- --testNamePattern="PRUEBA [0-9]" --watchAll=false

# Todas las pruebas de negocio (16-17)
npm test -- --testNamePattern="PRUEBA NEGOCIO" --watchAll=false

# Pruebas de creación, edición y eliminación
npm test -- --testNamePattern="Creación|Edición|Eliminación" --watchAll=false
```

---

## 🚀 Ejecución con Jenkins

### Prerequisitos

1. Jenkins instalado y configurado
2. Plugin de NodeJS instalado en Jenkins
3. Acceso al repositorio del proyecto

### Configuración del Pipeline

El proyecto incluye un `Jenkinsfile` completo que ejecuta:

1. **Instalación de dependencias** - `npm install`
2. **15 Pruebas Funcionales** - Ejecución individual de cada prueba
3. **Reporte de Cobertura** - Métricas de código
4. **Build de Producción** - `npm run build`
5. **2 Pruebas de Negocio** - Análisis de viabilidad
6. **Resumen Final** - Reporte consolidado

### Ejecutar en Jenkins

#### Opción 1: Pipeline desde SCM

```groovy
1. Crear un nuevo Job > Pipeline
2. En "Pipeline", seleccionar "Pipeline script from SCM"
3. SCM: Git
4. Repository URL: [URL de tu repositorio]
5. Script Path: Jenkinsfile
6. Guardar y ejecutar "Build Now"
```

#### Opción 2: Pipeline Script Directo

```groovy
1. Crear un nuevo Job > Pipeline
2. En "Pipeline", seleccionar "Pipeline script"
3. Copiar el contenido del Jenkinsfile
4. Guardar y ejecutar "Build Now"
```

### Comandos Jenkins (Windows)

Si usas Jenkins en Windows, los comandos en el Jenkinsfile usan `bat`:

```groovy
bat 'npm install'
bat 'npm test -- --testNamePattern="PRUEBA 1" --watchAll=false --coverage=false'
bat 'npm run build'
```

---

## 📊 Interpretación de Resultados

### Resultado Exitoso

```
PASS  src/App.test.js
  ✓ PRUEBA 1: Carga de interfaz principal (250ms)
  ✓ PRUEBA 2: Visualización de tareas existentes (180ms)
  ✓ PRUEBA 3: Creación de tareas (210ms)
  ...
  ✓ PRUEBA NEGOCIO 2: Análisis de Productividad (150ms)

Test Suites: 1 passed, 1 total
Tests:       17 passed, 17 total
Snapshots:   0 total
Time:        15.234s
```

### Resultado con Errores

```
FAIL  src/App.test.js
  ✓ PRUEBA 1: Carga de interfaz principal (250ms)
  ✗ PRUEBA 2: Visualización de tareas existentes (180ms)
  
  ● PRUEBA 2 › Se muestran todas las tareas creadas
  
    expect(received).toBeInTheDocument()
    
    Received element is not present in the document
```

---

## 🔍 Verificar Cobertura de Código

Después de ejecutar las pruebas con cobertura:

```bash
npm test -- --coverage --watchAll=false
```

Se generará un reporte en la consola y en la carpeta `coverage/`:

```
-------------------|---------|----------|---------|---------|
File               | % Stmts | % Branch | % Funcs | % Lines |
-------------------|---------|----------|---------|---------|
All files          |   95.2  |   88.7   |   92.5  |   96.1  |
 App.js            |   98.5  |   91.3   |   95.0  |   98.8  |
 Form.js           |   94.2  |   85.7   |   90.0  |   95.1  |
 Todo.js           |   92.8  |   87.5   |   88.9  |   93.7  |
-------------------|---------|----------|---------|---------|
```

Para ver el reporte HTML detallado:

```bash
# Windows
start coverage/lcov-report/index.html

# O navegar manualmente a:
C:\Users\Bryan\Desktop\microservicios_parcial3\React-Todo-List\coverage\lcov-report\index.html
```

---

## 🐛 Solución de Problemas Comunes

### Error: "Cannot find module"

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port 3000 already in use"

```bash
# Windows - Liberar el puerto
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

### Error: "Jest encountered an unexpected token"

Verifica que el mock de `nanoid` esté configurado en `setupTests.js`:

```javascript
jest.mock('nanoid', () => {
  return {
    nanoid: () => Math.random().toString(36).substring(2, 15)
  };
});
```

### Error: "No tests found"

```bash
# Asegúrate de que el archivo de pruebas exista
dir src\App.test.js

# O ejecuta con:
npm test -- --watchAll=false --passWithNoTests
```

---

## 📝 Lista de Verificación

Antes de ejecutar en producción o en Jenkins:

- [ ] ✅ Dependencias instaladas (`npm install`)
- [ ] ✅ Todas las pruebas pasan localmente
- [ ] ✅ Cobertura de código > 90%
- [ ] ✅ Build de producción exitoso (`npm run build`)
- [ ] ✅ No hay errores de ESLint
- [ ] ✅ Jenkinsfile validado
- [ ] ✅ Variables de entorno configuradas

---

## 📞 Soporte

Si encuentras problemas al ejecutar las pruebas, contacta a:

- **Bryan Alejandro Benavides Gallego**
- **Alejandro Castano Uzquiano**

Universidad EAM - Facultad de Ingeniería  
Ingeniería de Software III

---

## 📚 Recursos Adicionales

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

*Última actualización: Noviembre 2025*

