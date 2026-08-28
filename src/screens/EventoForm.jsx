import { useState } from 'react';
import { X } from 'lucide-react';
import { MateriaSelect } from '../components/MateriaSelect';

export function EventoForm({ dataInicial, evento, onFechar, onSalvar, materias, setMaterias }) {
  const [titulo, setTitulo] = useState(evento?.titulo ?? '');
  const [data, setData] = useState(evento?.data ?? dataInicial);
  const [materiaId, setMateriaId] = useState(evento?.materiaId);
  const [tipo, setTipo] = useState(evento?.tipo ?? 'prova');
  const [erro, setErro] = useState(null);

  function salvar() {
    if (!titulo.trim() || !data) return;
    try {
      onSalvar({ titulo: titulo.trim(), data, materiaId, tipo }, evento?.id);
      onFechar();
    } catch {
      setErro('Erro ao salvar lembrete, tente novamente.');
    }
  }

  return (
    <div className="overlay">
      <div className="overlay-content">
        <div className="overlay-header">
          <h2>{evento ? 'Editar lembrete' : 'Novo lembrete'}</h2>
          <button onClick={onFechar}>
            <X size={18} strokeWidth={2} /> Fechar
          </button>
        </div>
        <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Título" />
        <input type="date" value={data} onChange={(e) => setData(e.target.value)} />
        <MateriaSelect value={materiaId} onChange={setMateriaId} materias={materias} setMaterias={setMaterias} />
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="prova">Prova</option>
          <option value="atividade">Atividade</option>
          <option value="revisao">Revisão</option>
        </select>
        {erro && <p className="meta" style={{ color: 'var(--prova)' }}>{erro}</p>}
        <button className="btn-primary" onClick={salvar}>{evento ? 'Salvar alterações' : 'Salvar'}</button>
      </div>
    </div>
  );
}
