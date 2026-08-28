import { useState } from 'react';
import { carregar } from '../lib/storage';
import { ExercicioLista } from '../components/ExercicioLista';
import { Header } from '../components/Header';

export function Exercicios() {
  const [resumos] = useState(() => carregar('estudos:resumos', []));
  const [exercicios] = useState(() => carregar('estudos:exercicios', []));
  const [resumoId, setResumoId] = useState(undefined);

  const ativo = resumoId ?? resumos[0]?.id;
  const exercicio = exercicios.find((e) => e.resumoId === ativo);

  return (
    <div>
      <Header title="Exercícios" subtitle="Pratique com base no que você estudou" />

      <div className="chips-scroll">
        {resumos.map((r) => {
          const qtd = exercicios.find((e) => e.resumoId === r.id)?.itens.length ?? 0;
          return (
            <button
              key={r.id}
              className={`chip ${ativo === r.id ? 'chip-ativo' : ''}`}
              onClick={() => setResumoId(r.id)}
            >
              {r.titulo}
              <span>{qtd} exercícios</span>
            </button>
          );
        })}
      </div>
      {resumos.length === 0 && <p className="vazio">Crie um resumo primeiro na aba Resumos</p>}

      {exercicio ? (
        <ExercicioLista itens={exercicio.itens} />
      ) : (
        ativo && <p className="vazio">Nenhum exercício gerado pra esse resumo ainda — abra o resumo pra gerar</p>
      )}
    </div>
  );
}
