import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { carregar, salvar } from '../lib/storage';
import { gerarExercicios } from '../lib/gemini';
import { tempoLeituraMin, embaralhar } from '../lib/math';
import { Toast } from '../components/Toast';
import { ExercicioLista } from '../components/ExercicioLista';

export function ResumoDetalhe({ resumo, onFechar }) {
  const [exercicios, setExercicios] = useState(() => carregar('estudos:exercicios', []));
  useEffect(() => {
    salvar('estudos:exercicios', exercicios);
  }, [exercicios]);

  const exercicio = exercicios.find((e) => e.resumoId === resumo.id);

  const [itensEmbaralhados, setItensEmbaralhados] = useState([]);
  useEffect(() => {
    setItensEmbaralhados(exercicio ? embaralhar(exercicio.itens) : []);
  }, [exercicio]);

  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState(null);

  async function gerar() {
    setGerando(true);
    setErro(null);
    try {
      const itens = await gerarExercicios(resumo.conteudo);
      setExercicios([
        ...exercicios,
        { id: Date.now(), resumoId: resumo.id, itens, criadoEm: new Date().toISOString() },
      ]);
    } catch {
      setErro('Erro ao gerar, tente novamente.');
    } finally {
      setGerando(false);
    }
  }

  return (
    <div className="overlay">
      <div className="overlay-content">
        <div className="overlay-header">
          <h2>{resumo.titulo}</h2>
          <button onClick={onFechar}>
            <X size={18} strokeWidth={2} /> Fechar
          </button>
        </div>
        <p className="resumo-conteudo">{resumo.conteudo}</p>
        <p className="meta">~{tempoLeituraMin(resumo.conteudo)} min de leitura</p>

        {!exercicio && (
          <button className="btn-primary" onClick={gerar} disabled={gerando}>
            {gerando ? 'Gerando...' : 'Gerar exercícios'}
          </button>
        )}
        {exercicio && <ExercicioLista itens={itensEmbaralhados} />}
        {erro && <Toast message={erro} onClose={() => setErro(null)} />}
      </div>
    </div>
  );
}
