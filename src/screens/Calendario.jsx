import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { carregar, salvar } from '../lib/storage';
import { dataLocal } from '../lib/date';
import { diasRestantes } from '../lib/math';
import { EventoForm } from './EventoForm';
import { Header } from '../components/Header';

const DIAS_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const ROTULO_TIPO = { prova: 'Prova', atividade: 'Atividade', revisao: 'Revisão' };

function isoData(d) {
  return dataLocal(d);
}

export function Calendario({ materias, setMaterias }) {
  const [referencia, setReferencia] = useState(() => new Date());
  const [selecionado, setSelecionado] = useState(() => isoData(new Date()));
  const [formAberto, setFormAberto] = useState(false);
  const [eventoEditando, setEventoEditando] = useState(undefined);

  const [eventos, setEventos] = useState(() => carregar('estudos:eventos', []));
  useEffect(() => {
    salvar('estudos:eventos', eventos);
  }, [eventos]);

  const ano = referencia.getFullYear();
  const mes = referencia.getMonth();

  const dias = (() => {
    const primeiroDia = new Date(ano, mes, 1);
    const inicioOffset = primeiroDia.getDay();
    const totalDias = new Date(ano, mes + 1, 0).getDate();
    const celulas = [];
    for (let i = 0; i < inicioOffset; i++) celulas.push(null);
    for (let d = 1; d <= totalDias; d++) celulas.push(new Date(ano, mes, d));
    return celulas;
  })();

  const eventosPorData = new Map();
  for (const ev of eventos) {
    const lista = eventosPorData.get(ev.data) ?? [];
    lista.push(ev);
    eventosPorData.set(ev.data, lista);
  }

  const hojeIso = isoData(new Date());
  const proximos = [...eventos]
    .filter((e) => e.data >= hojeIso)
    .sort((a, b) => a.data.localeCompare(b.data));

  function materiaNome(id) {
    return materias.find((m) => m.id === id)?.nome;
  }

  function salvarEvento(dados, id) {
    if (id !== undefined) {
      setEventos(eventos.map((e) => (e.id === id ? { ...e, ...dados } : e)));
    } else {
      setEventos([...eventos, { ...dados, id: Date.now() }]);
    }
  }

  function novoLembrete() {
    setEventoEditando(undefined);
    setFormAberto(true);
  }

  function editarEvento(evento) {
    setEventoEditando(evento);
    setFormAberto(true);
  }

  function excluirEvento(evento) {
    if (evento.id === undefined || !window.confirm(`Excluir o lembrete “${evento.titulo}”?`)) return;
    setEventos(eventos.filter((e) => e.id !== evento.id));
  }

  return (
    <div>
      <Header title="Calendário" subtitle="Provas, entregas e revisões" />

      <div className="calendario-header">
        <button onClick={() => setReferencia(new Date(ano, mes - 1, 1))} aria-label="Mês anterior">
          <ChevronLeft size={20} strokeWidth={2} />
        </button>
        <span>{MESES[mes]} {ano}</span>
        <button onClick={() => setReferencia(new Date(ano, mes + 1, 1))} aria-label="Próximo mês">
          <ChevronRight size={20} strokeWidth={2} />
        </button>
      </div>

      <div className="calendario-grid">
        {DIAS_SEMANA.map((d, i) => <div key={i} className="calendario-dia-semana">{d}</div>)}
        {dias.map((data, i) => {
          if (!data) return <div key={i} />;
          const iso = isoData(data);
          const temEvento = eventosPorData.has(iso);
          const ativo = iso === selecionado;
          return (
            <button
              key={i}
              className={`calendario-dia ${ativo ? 'calendario-dia-ativo' : ''}`}
              onClick={() => setSelecionado(iso)}
            >
              {data.getDate()}
              {temEvento && <span className="calendario-ponto" />}
            </button>
          );
        })}
      </div>

      <h3 className="secao-titulo">Próximos</h3>
      <ul className="lista-eventos">
        {proximos.map((ev) => {
          const diasEvento = diasRestantes(ev.data);
          return (
            <li key={ev.id}>
              <div className="evento-data">
                {ev.data.slice(8, 10)}
                <span>{MESES[Number(ev.data.slice(5, 7)) - 1].slice(0, 3).toUpperCase()}</span>
              </div>
              <div className="evento-info">
                <strong>{ev.titulo}</strong>
                {materiaNome(ev.materiaId) && <span className="evento-materia">{materiaNome(ev.materiaId)}</span>}
              </div>
              <span className={`pill pill-${ev.tipo}`}>{ROTULO_TIPO[ev.tipo]}</span>
              <span className="pill pill-dias">
                {diasEvento === 0 ? 'Hoje' : diasEvento > 0 ? `em ${diasEvento} dia${diasEvento === 1 ? '' : 's'}` : `há ${Math.abs(diasEvento)} dia${Math.abs(diasEvento) === 1 ? '' : 's'}`}
              </span>
              <div className="item-actions">
                <button onClick={() => editarEvento(ev)} aria-label={`Editar ${ev.titulo}`}><Pencil size={16} strokeWidth={2} /></button>
                <button className="item-action-danger" onClick={() => excluirEvento(ev)} aria-label={`Excluir ${ev.titulo}`}><Trash2 size={16} strokeWidth={2} /></button>
              </div>
            </li>
          );
        })}
      </ul>

      <button className="link-acao" onClick={novoLembrete}>+ Novo lembrete</button>

      {formAberto && (
        <EventoForm
          dataInicial={selecionado}
          evento={eventoEditando}
          materias={materias}
          setMaterias={setMaterias}
          onSalvar={salvarEvento}
          onFechar={() => setFormAberto(false)}
        />
      )}
    </div>
  );
}
