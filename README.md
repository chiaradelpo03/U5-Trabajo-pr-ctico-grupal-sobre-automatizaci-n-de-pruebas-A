# U5-Trabajo-pr-ctico-grupal-sobre-automatizaci-n-de-pruebas-A

# Trabajo Práctico: Automatización de Pruebas de Software

## 1. Descripción del Software Bajo Prueba y Técnicas Aplicadas

### Software Seleccionado
Para la realización de este trabajo se seleccionó la clase de dominio `Ahorcado`, desarrollada previamente como parte de un proyecto de la asignatura **Metodologías Ágiles**. 

El software implementa las reglas de negocio del clásico juego del Ahorcado:
* Inicialización con una palabra secreta e intentos máximos (por defecto, 6).
* Enmascaramiento dinámico de la palabra descubierta (ej. `_ A _ A`).
* Procesamiento de letras arriesgadas (`adivinar`), distinguiendo aciertos, fallos y letras repetidas.
* Gestión del estado final de la partida: `estaGanado()` y `estaPerdido()`.

---

### Técnicas de Diseño de Pruebas Implementadas

#### A. Pruebas por Tablas de Decisión
Esta técnica de caja negra se utilizó para evaluar de forma exhaustiva el método `adivinar(letra: string)`. El comportamiento del sistema depende de dos condiciones booleanas de entrada, dando lugar a 4 combinaciones posibles (reglas):

| Elemento | Regla 1 (R1) | Regla 2 (R2) | Regla 3 (R3) | Regla 4 (R4) |
| :--- | :---: | :---: | :---: | :---: |
| **Condición 1: ¿La letra pertenece a la palabra secreta?** | SÍ | NO | SÍ | NO |
| **Condición 2: ¿La letra ya fue arriesgada previamente?** | NO | NO | SÍ | SÍ |
| **Acción 1: Descuenta 1 intento restante** | NO | SÍ | NO | NO |
| **Acción 2: Revela la letra en la palabra enmascarada** | SÍ | NO | NO (ya revelada) | NO |
| **Acción 3: Registra en letras arriesgadas** | SÍ | SÍ | NO (sin duplicar)| NO (sin duplicar)|

*Cada una de estas 4 reglas cuenta con su caso de prueba automatizado correspondiente en el archivo de tests.*

#### B. Pruebas por Análisis de Valores Límite (Boundary Value Analysis - BVA)
Se aplicó sobre las variables críticas numéricas y de estado del juego:
1. **Intentos Restantes (Rango válido: [0, 6]):**
   * **Límite superior (6 intentos):** Estado inicial del juego. Comprueba que el contador esté al máximo y la partida no esté finalizada.
   * **Límite interior crítico (1 intento):** Situación extrema de supervivencia tras 5 fallos. Verifica que el juego siga activo (`estaPerdido() === false`).
   * **Frontera exacta de derrota (0 intentos):** Se alcanza tras el 6to fallo. Verifica la transición inmediata a partida perdida (`estaPerdido() === true`).
2. **Progreso de Aciertos hacia la Victoria:**
   * **Límite previo (1 letra restante por descubrir):** La partida continúa en juego (`estaGanado() === false`).
   * **Frontera de victoria (0 letras restantes):** Se descubre la última letra, activando la condición de triunfo (`estaGanado() === true`).

---

## 2. Herramientas Utilizadas y Justificación

### Herramientas Empleadas
* **Lenguaje:** TypeScript (ejecutado sobre Node.js)
* **Framework de Pruebas:** Vitest (v2.x)
* **Entorno de Desarrollo:** Visual Studio Code / Antigravity IDE

### Justificación de Elección
1. **TypeScript:** Proporciona un sistema de tipado estático sobre JavaScript que evita errores comunes de tipo antes de la ejecución. Permite que el código bajo prueba y los scripts de test compartan interfaces claras, autocompletado y autodocumentación.
2. **Vitest:**
   * **Velocidad y rendimiento:** Diseñado con arquitectura nativa ESM y Vite, lo que permite una ejecución casi instantánea de la suite de pruebas.
   * **Soporte nativo de TypeScript:** No requiere herramientas complejas de compilación previa (como `ts-jest` o `babel`).
   * **Sintaxis estándar:** Compatible con las convenciones universales de testing (`describe`, `it`, `expect`), facilitando la lectura tanto técnica como docente.
   * **Aislamiento:** Permite ejecutar pruebas unitarias puras en un entorno Node.js limpio sin necesidad de levantar navegadores ni dependencias pesadas.

---

## 3. Instrucciones de Ejecución

1. Abrir una terminal en la raíz de esta carpeta:
   ```bash
   cd "C:\Users\Chiar\OneDrive\Documentos\tp-testing-ahorcado"
   ```
2. Instalar dependencias (solo la primera vez):
   ```bash
   npm install
   ```
3. Ejecutar las pruebas automatizadas:
   ```bash
   npm test
   ```
