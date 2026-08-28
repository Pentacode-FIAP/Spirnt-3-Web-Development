export function diasRestantes(dataISO) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const alvo = new Date(dataISO + 'T00:00:00');
  const diffMs = alvo.getTime() - hoje.getTime();
  return Math.ceil(diffMs / 86_400_000);
}

export function tempoLeituraMin(texto) {
  const palavras = texto.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(palavras / 200));
}

export function embaralhar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}
