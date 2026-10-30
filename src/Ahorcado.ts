export class Ahorcado {
  private palabraSecreta: string;
  private letrasAdivinadas = new Set<string>();
  private intentosRestantes: number;

  constructor(palabra: string, intentosMaximos = 6) {
    this.palabraSecreta = palabra.trim().toUpperCase();
    this.intentosRestantes = intentosMaximos;
  }

  obtenerPalabraEnmascarada(): string {
    return Array.from(this.palabraSecreta, letra =>
      this.letrasAdivinadas.has(letra) ? letra : '_',
    ).join(' ');
  }

  adivinar(letra: string): void {
    const letraMayuscula = letra.toUpperCase();
    if (this.letrasAdivinadas.has(letraMayuscula)) {
      return;
    }
    if (!this.palabraSecreta.includes(letraMayuscula)) {
      this.intentosRestantes--;
    }
    this.letrasAdivinadas.add(letraMayuscula);
  }

  obtenerIntentosRestantes(): number {
    return this.intentosRestantes;
  }

  reiniciar(): void {
    this.intentosRestantes = 6;
    this.letrasAdivinadas.clear();
  }

  estaGanado(): boolean {
    return Array.from(this.palabraSecreta).every(letra => this.letrasAdivinadas.has(letra));
  }

  estaPerdido(): boolean {
    return this.intentosRestantes === 0;
  }

  obtenerLetrasArriesgadas(): string[] {
    return Array.from(this.letrasAdivinadas);
  }
}
