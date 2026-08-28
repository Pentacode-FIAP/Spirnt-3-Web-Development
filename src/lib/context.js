import { dataLocal } from './date.js';

export function montarContextoChat({ materias, eventos, resumos, anotacoes, fotos }) {
  const materiaNome = (id) => materias.find((m) => m.id === id)?.nome ?? 'sem matéria';

  const linhas = [];
  linhas.push('Você é um assistente de estudos com acesso a tudo que o aluno já cadastrou no app.');

  linhas.push('\nMatérias cadastradas: ' + (materias.map((m) => m.nome).join(', ') || 'nenhuma'));

  const hoje = dataLocal(new Date());
  const proximos = [...eventos].filter((e) => e.data >= hoje).sort((a, b) => a.data.localeCompare(b.data));
  linhas.push('\nPróximos eventos:');
  for (const e of proximos) {
    linhas.push(`- ${e.data} (${e.tipo}) ${e.titulo} — ${materiaNome(e.materiaId)}`);
  }

  linhas.push('\nResumos disponíveis:');
  for (const r of resumos) {
    linhas.push(`- "${r.titulo}" (${materiaNome(r.materiaId)}): ${r.conteudo}`);
  }

  linhas.push('\nAnotações:');
  for (const a of anotacoes) {
    linhas.push(`- "${a.titulo}": ${a.conteudo}`);
  }

  const textosOcr = fotos.filter((f) => f.ocrText);
  if (textosOcr.length) {
    linhas.push('\nTexto extraído de fotos (OCR):');
    for (const f of textosOcr) {
      linhas.push(`- ${f.ocrText}`);
    }
  }

  return linhas.join('\n');
}
