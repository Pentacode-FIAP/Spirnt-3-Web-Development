import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { carregar, salvar } from '../lib/storage';
import { MateriaSelect } from '../components/MateriaSelect';
import { Header } from '../components/Header';
import { Toast } from '../components/Toast';
import { gerarResumo } from '../lib/gemini';
import { ResumoDetalhe } from './ResumoDetalhe';

export function Resumos({ materias, setMaterias }) {
  const [fotos] = useState(() => carregar('estudos:fotos', []));
  const [resumos, setResumos] = useState(() => carregar('estudos:resumos', []));
  useEffect(() => {
    salvar('estudos:resumos', resumos);
  }, [resumos]);

  const fotosOrdenadas = [...fotos].sort((a, b) => b.dataUpload.localeCompare(a.dataUpload));
  const resumosOrdenados = [...resumos].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));

  const [fotoIds, setFotoIds] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [materiaId, setMateriaId] = useState(undefined);
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState(null);
  const [aberto, setAberto] = useState(null);

  function alternarFoto(id) {
    setFotoIds((atual) => (atual.includes(id) ? atual.filter((x) => x !== id) : [...atual, id]));
  }

  function materiaNome(id) {
    return materias.find((m) => m.id === id)?.nome ?? 'Sem matéria';
  }

  async function gerar() {
    if (fotoIds.length === 0 || !titulo.trim()) return;
    setGerando(true);
    setErro(null);
    try {
      const dataUrls = fotos.filter((f) => fotoIds.includes(f.id)).map((f) => f.dataUrl);
      const conteudo = await gerarResumo(dataUrls, materiaNome(materiaId));
      setResumos([
        ...resumos,
        { id: Date.now(), titulo: titulo.trim(), materiaId, conteudo, fotoIds, criadoEm: new Date().toISOString() },
      ]);
      setFotoIds([]);
      setTitulo('');
    } catch {
      setErro('Erro ao gerar, tente novamente.');
    } finally {
      setGerando(false);
    }
  }

  return (
    <div>
      <Header title="Resumos" subtitle="Transforme fotos em material de estudo" />

      <h3 className="secao-titulo">Criar novo resumo</h3>
      <div className="galeria-grid">
        {fotosOrdenadas.map((foto) => (
          <button
            key={foto.id}
            className={`galeria-item ${fotoIds.includes(foto.id) ? 'galeria-item-selecionada' : ''}`}
            onClick={() => alternarFoto(foto.id)}
            aria-label={fotoIds.includes(foto.id) ? 'Foto selecionada' : 'Selecionar foto'}
          >
            <img src={foto.dataUrl} alt="" />
            {fotoIds.includes(foto.id) && (
              <span className="check-selecionado">
                <Check size={16} strokeWidth={2} />
              </span>
            )}
          </button>
        ))}
      </div>
      {fotos.length === 0 && <p className="vazio">Envie fotos na Galeria primeiro</p>}

      <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Nome do resumo" />
      <MateriaSelect value={materiaId} onChange={setMateriaId} permitirVazio={false} materias={materias} setMaterias={setMaterias} />
      <button className="btn-primary" onClick={gerar} disabled={gerando || fotoIds.length === 0 || !titulo.trim()}>
        {gerando ? 'Gerando...' : 'Gerar resumo com IA'}
      </button>

      <h3 className="secao-titulo">Seus resumos</h3>
      <ul className="lista-resumos">
        {resumosOrdenados.map((r) => (
          <li key={r.id} onClick={() => setAberto(r)}>
            <span className="pill">{materiaNome(r.materiaId)}</span>
            <strong>{r.titulo}</strong>
            <span className="meta">{r.fotoIds.length} fotos · {new Date(r.criadoEm).toLocaleDateString('pt-BR')}</span>
          </li>
        ))}
        {resumos.length === 0 && <li className="vazio">Nenhum resumo ainda</li>}
      </ul>

      {erro && <Toast message={erro} onClose={() => setErro(null)} />}
      {aberto && <ResumoDetalhe resumo={aberto} onFechar={() => setAberto(null)} />}
    </div>
  );
}
