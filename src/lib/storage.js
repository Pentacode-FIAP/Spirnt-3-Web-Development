export function carregar(chave, padrao) {
  try {
    const bruto = localStorage.getItem(chave);
    return bruto ? JSON.parse(bruto) : padrao;
  } catch {
    return padrao;
  }
}

export function salvar(chave, valor) {
  localStorage.setItem(chave, JSON.stringify(valor));
}
