import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { carregar, salvar } from '../lib/storage';
import { MateriaSelect } from '../components/MateriaSelect';
import { Header } from '../components/Header';
import { Toast } from '../components/Toast';

export function Anotacoes({ materias, setMaterias }) {
  const [anotacoes, setAnotacoes] = useState(() => carregar('estudos:anotacoes', []));
  useEffect(() => {
    salvar('estudos:anotacoes', anotacoes);
  }, [anotacoes]);
  const [resumos] = useState(() => carregar('estudos:resumos', []));

  const anotacoesOrdenadas = [...anotacoes].sort((a, b) => b.data.localeCompare(a.data));

  const [formAberto, setFormAberto] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [materiaId, setMateriaId] = useState(undefined);
  const [resumoId, setResumoId] = useState(undefined);
  const [editandoId, setEditandoId] = useState(undefined);
  const [erro, setErro] = useState(null);

  function resumoTitulo(id) {
    return resumos.find((r) => r.id === id)?.titulo;
  }

  function limparFormulario() {
    setTitulo('');
    setConteudo('');
    setMateriaId(undefined);
    setResumoId(undefined);
    setEditandoId(undefined);
  }

  function abrirNovaNota() {
    limparFormulario();
    setFormAberto(true);
  }

  function abrirEdicao(id) {
    const anotacao = anotacoes.find((item) => item.id === id);
    if (!anotacao || anotacao.id === undefined) return;
    setTitulo(anotacao.titulo);
    setConteudo(anotacao.conteudo);
    setMateriaId(anotacao.materiaId);
    setResumoId(anotacao.resumoId);
    setEditandoId(anotacao.id);
    setFormAberto(true);
  }

  function fecharFormulario() {
    limparFormulario();
    setFormAberto(false);
  }

  function excluirAnotacao(id, tituloAnotacao) {
    if (id === undefined || !window.confirm(`Excluir a anotação “${tituloAnotacao}”?`)) return;
    setAnotacoes(anotacoes.filter((a) => a.id !== id));
  }

  function salvarAnotacao() {
    if (!titulo.trim()) return;
    const dados = {
      titulo: titulo.trim(),
      conteudo: conteudo.trim(),
      materiaId,
      resumoId,
      data: new Date().toISOString(),
    };
    try {
      if (editandoId !== undefined) {
        setAnotacoes(anotacoes.map((a) => (a.id === editandoId ? { ...a, ...dados } : a)));
      } else {
        setAnotacoes([...anotacoes, { ...dados, id: Date.now() }]);
      }
      fecharFormulario();
    } catch {
      setErro('Erro ao salvar anotação, tente novamente.');
    }
  }

  return (
    <div>
      <Header
        title="Anotações"
        subtitle="Suas ideias, com ou sem resumo"
        actions={
          <button className="header-icon-action" onClick={abrirNovaNota} aria-label="Criar nova nota" title="Nova nota">
            <Plus size={20} strokeWidth={2} />
          </button>
        }
      />

      <ul className="lista-anotacoes">
        {anotacoesOrdenadas.map((a) => (
          <li key={a.id}>
            <div className="anotacao-cabecalho">
              <strong>{a.titulo}</strong>
              <div className="item-actions">
                <button onClick={() => abrirEdicao(a.id)} aria-label={`Editar ${a.titulo}`}><Pencil size={16} strokeWidth={2} /></button>
                <button className="item-action-danger" onClick={() => excluirAnotacao(a.id, a.titulo)} aria-label={`Excluir ${a.titulo}`}><Trash2 size={16} strokeWidth={2} /></button>
              </div>
            </div>
            <p className="anotacao-conteudo">{a.conteudo}</p>
            <span className="pill">
              {resumoTitulo(a.resumoId) ? `Vinculada a: ${resumoTitulo(a.resumoId)}` : 'Sem resumo vinculado'}
            </span>
          </li>
        ))}
        {anotacoes.length === 0 && <li className="vazio">Nenhuma anotação ainda</li>}
      </ul>

      {formAberto && (
        <div className="overlay">
          <div className="overlay-content">
            <div className="overlay-header">
              <h2>{editandoId !== undefined ? 'Editar nota' : 'Nova nota'}</h2>
              <button onClick={fecharFormulario}>
                <X size={18} strokeWidth={2} /> Fechar
              </button>
            </div>
            <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Título" />
            <textarea value={conteudo} onChange={(e) => setConteudo(e.target.value)} placeholder="Escreva sua anotação" rows={5} />
            <MateriaSelect value={materiaId} onChange={setMateriaId} materias={materias} setMaterias={setMaterias} />
            <select value={resumoId ?? ''} onChange={(e) => setResumoId(e.target.value ? Number(e.target.value) : undefined)}>
              <option value="">Sem resumo vinculado</option>
              {resumos.map((r) => (
                <option key={r.id} value={r.id}>{r.titulo}</option>
              ))}
            </select>
            <button className="btn-primary" onClick={salvarAnotacao}>
              {editandoId !== undefined ? 'Salvar alterações' : 'Salvar'}
            </button>
          </div>
        </div>
      )}

      {erro && <Toast message={erro} onClose={() => setErro(null)} />}
    </div>
  );
}
