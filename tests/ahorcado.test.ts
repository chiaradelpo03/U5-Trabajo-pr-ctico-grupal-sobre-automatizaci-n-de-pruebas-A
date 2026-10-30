import { describe, expect, it } from 'vitest';
import { Ahorcado } from '../src/Ahorcado';

describe('Pruebas Automatizadas sobre el juego del Ahorcado', () => {

  // =========================================================================
  // TÉCNICA 1: PRUEBAS POR TABLAS DE DECISIÓN
  //
  // Método bajo prueba: adivinar(letra: string)
  //
  // Condiciones de entrada:
  //   C1: ¿La letra pertenece a la palabra secreta? (S / N)
  //   C2: ¿La letra ya fue arriesgada previamente? (S / N)
  //
  // Acciones esperadas:
  //   A1: Descontar 1 intento restante.
  //   A2: Revelar la letra en la palabra enmascarada.
  //   A3: Registrar la letra en el listado de letras arriesgadas.
  //
  // Matriz de Decisión:
  // +-----------------------------+-------+-------+-------+-------+
  // | Reglas                      |  R1   |  R2   |  R3   |  R4   |
  // +-----------------------------+-------+-------+-------+-------+
  // | C1: Letra en la palabra     |  S    |  N    |  S    |  N    |
  // | C2: Letra repetida          |  N    |  N    |  S    |  S    |
  // +-----------------------------+-------+-------+-------+-------+
  // | A1: Descuenta intento       |  NO   |  SÍ   |  NO   |  NO   |
  // | A2: Revela letra en máscara |  SÍ   |  NO   |  NO*  |  NO   |
  // | A3: Registra en arriesgadas |  SÍ   |  SÍ   |  NO*  |  NO*  |
  // +-----------------------------+-------+-------+-------+-------+
  // (* En R3 y R4 la letra ya estaba revelada / arriesgada, no se duplica)
  // =========================================================================
  describe('Técnica 1: Tablas de Decisión', () => {
    it('Regla 1 (Acierto nuevo): No descuenta intentos, revela la letra y la registra en arriesgadas', () => {
      const juego = new Ahorcado('GATO');

      juego.adivinar('A');

      expect(juego.obtenerIntentosRestantes()).toBe(6);
      expect(juego.obtenerPalabraEnmascarada()).toBe('_ A _ _');
      expect(juego.obtenerLetrasArriesgadas()).toEqual(['A']);
    });

    it('Regla 2 (Fallo nuevo): Descuenta 1 intento, no altera la máscara y registra la letra en arriesgadas', () => {
      const juego = new Ahorcado('GATO');

      juego.adivinar('Z');

      expect(juego.obtenerIntentosRestantes()).toBe(5);
      expect(juego.obtenerPalabraEnmascarada()).toBe('_ _ _ _');
      expect(juego.obtenerLetrasArriesgadas()).toEqual(['Z']);
    });

    it('Regla 3 (Acierto repetido): No descuenta intentos ni altera el estado ya revelado', () => {
      const juego = new Ahorcado('GATO');
      juego.adivinar('A'); // Primera vez: acierto

      // Segunda vez: misma letra ya ingresada
      juego.adivinar('A');

      expect(juego.obtenerIntentosRestantes()).toBe(6);
      expect(juego.obtenerPalabraEnmascarada()).toBe('_ A _ _');
      expect(juego.obtenerLetrasArriesgadas()).toEqual(['A']); // Sin duplicados
    });

    it('Regla 4 (Fallo repetido): No vuelve a descontar intentos adicionales', () => {
      const juego = new Ahorcado('GATO');
      juego.adivinar('Z'); // Primera vez: fallo -> baja a 5

      // Segunda vez: misma letra incorrecta repetida
      juego.adivinar('Z');

      expect(juego.obtenerIntentosRestantes()).toBe(5); // Se mantiene en 5, no baja a 4
      expect(juego.obtenerLetrasArriesgadas()).toEqual(['Z']);
    });
  });

  // =========================================================================
  // TÉCNICA 2: ANÁLISIS DE VALORES LÍMITE (BVA)
  //
  // Se evalúan las fronteras críticas del dominio:
  //
  // 1. Variable numérico-entera: intentosRestantes (Rango válido: [0, 6])
  //    - Límite máximo / inicial: 6 intentos restantes (juego activo).
  //    - Límite interior crítico (borde de supervivencia): 1 intento restante (activo).
  //    - Límite frontera exacta de derrota: 0 intentos restantes (estaPerdido() === true).
  //
  // 2. Condición de victoria: Letras pendientes de adivinar (Rango: [0, N])
  //    - Límite interior (1 letra faltante): estaGanado() === false.
  //    - Límite frontera exacta de victoria (0 letras faltantes): estaGanado() === true.
  // =========================================================================
  describe('Técnica 2: Análisis de Valores Límite', () => {
    it('Límite superior (6 intentos): Estado inicial correcto sin pérdida de partida', () => {
      const juego = new Ahorcado('SOL');

      expect(juego.obtenerIntentosRestantes()).toBe(6);
      expect(juego.estaPerdido()).toBe(false);
    });

    it('Límite interior (1 intento restante): Partida al límite pero aún NO perdida', () => {
      const juego = new Ahorcado('SOL');

      // 5 letras incorrectas distintas (6 -> 5 -> 4 -> 3 -> 2 -> 1)
      const errores = ['A', 'B', 'C', 'D', 'E'];
      errores.forEach(letra => juego.adivinar(letra));

      expect(juego.obtenerIntentosRestantes()).toBe(1);
      expect(juego.estaPerdido()).toBe(false);
    });

    it('Frontera exacta de derrota (0 intentos restantes): Condición de partida perdida activada', () => {
      const juego = new Ahorcado('SOL');

      // 6 letras incorrectas distintas (llega exactamente a 0)
      const errores = ['A', 'B', 'C', 'D', 'E', 'F'];
      errores.forEach(letra => juego.adivinar(letra));

      expect(juego.obtenerIntentosRestantes()).toBe(0);
      expect(juego.estaPerdido()).toBe(true);
    });

    it('Frontera de victoria: 1 letra pendiente (NO ganado) vs 0 letras pendientes (GANADO)', () => {
      const juego = new Ahorcado('LUZ');

      // Paso previo: faltan letras
      juego.adivinar('L');
      juego.adivinar('U');
      // Límite: Queda exactamente 1 letra pendiente ('Z')
      expect(juego.estaGanado()).toBe(false);

      // Frontera exacta: se adivina la última letra restante (0 letras pendientes)
      juego.adivinar('Z');
      expect(juego.estaGanado()).toBe(true);
    });
  });
});
