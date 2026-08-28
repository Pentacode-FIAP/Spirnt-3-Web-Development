const ROTULO_DIFICULDADE = { facil: 'Fácil', medio: 'Médio', dificil: 'Difícil' };

export function ExercicioLista({ itens }) {
  return (
    <ol className="lista-exercicios">
      {itens.map((item, i) => (
        <li key={i}>
          <div className="exercicio-linha">
            <span className="exercicio-numero">{i + 1}</span>
            <span className="exercicio-pergunta">{item.pergunta}</span>
            <span className={`pill pill-${item.dificuldade}`}>{ROTULO_DIFICULDADE[item.dificuldade]}</span>
          </div>
          <details>
            <summary>Ver resposta</summary>
            <p>{item.resposta}</p>
          </details>
        </li>
      ))}
    </ol>
  );
}
