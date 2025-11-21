@echo off
echo ========================================
echo   SUBIENDO ARCHIVOS A GITHUB
echo ========================================
echo.

cd /d "C:\Users\Bryan\Desktop\microservicios_parcial3\React-Todo-List"

echo [1/5] Verificando repositorio...
git status
echo.

echo [2/5] Agregando archivos...
git add Jenkinsfile
git add src/App.test.js
git add src/setupTests.js
echo   - Jenkinsfile
echo   - src/App.test.js
echo   - src/setupTests.js
echo.

echo [3/5] Creando commit...
git commit -m "Simplificar Jenkinsfile y agregar suite de 17 pruebas automatizadas"
echo.

echo [4/5] Subiendo a GitHub...
git push origin main
echo.

echo [5/5] Verificando en GitHub...
echo.
echo Ve a: https://github.com/alejandro-411/React-Todo-List
echo Debe aparecer:
echo   - Jenkinsfile (simplificado)
echo   - src/App.test.js (17 pruebas)
echo   - src/setupTests.js (mock de nanoid)
echo.

echo ========================================
echo   PROCESO COMPLETADO
echo ========================================
echo.
echo Ahora ejecuta el pipeline en Jenkins.
echo.
pause

