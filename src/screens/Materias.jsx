import { useState } from 'react';
import { X } from 'lucide-react';

const CORES = ['#274628', '#5b7596', '#a3651f', '#7a6ba8', '#b04e72', '#3f7a75'];

function corPara(nome) {
  let hash = 0;
  for (let i = 0; i < nome.length; i++) hash = (hash * 31 + nome.charCodeAt(i)) >>> 0;
  return CORES[hash % CORES.length];
}

export function Materias({ materias, setMaterias, onFechar }) {
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState(null);

  function adicionar() {
    const limpo = nome.trim();
    if (!limpo) return;
    try {
      setMaterias([...materias, { id: Date.now(), nome: limpo, cor: corPara(limpo) }]);
      setNome('');
      setErro(null);
    } catch {
      setErro('Erro ao salvar matéria, tente novamente.');
    }
  }

  function remover(id) {
    setMaterias(materias.filter((m) => m.id !== id));
  }

  return (
    <div className="overlay-content">
      <div className="overlay-header">
        <h2>Matérias</h2>
        <button onClick={onFechar}>
          <X size={18} strokeWidth={2} /> Fechar
        </button>
      </div>
      <div className="form-row">
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome da matéria"
          onKeyDown={(e) => e.key === 'Enter' && adicionar()}
        />
        <button className="btn-primary" onClick={adicionar}>Adicionar</button>
      </div>
      {erro && <p className="meta" style={{ color: 'var(--prova)' }}>{erro}</p>}
      <ul className="lista-materias">
        {materias.map((m) => (
          <li key={m.id}>
            <span className="materia-cor" style={{ background: m.cor }} />
            {m.nome}
            <button className="btn-danger" onClick={() => remover(m.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
