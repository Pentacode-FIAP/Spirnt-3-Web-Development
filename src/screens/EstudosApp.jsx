import { useState, useEffect } from 'react';
import { Footer } from '../components/Footer';
import { carregar, salvar } from '../lib/storage';
import { Calendario } from './Calendario';
import { Galeria } from './Galeria';
import { Resumos } from './Resumos';
import { Exercicios } from './Exercicios';
import { Anotacoes } from './Anotacoes';
import { Chat } from './Chat';

export function EstudosApp({ abaInicial = 'calendario' }) {
  const [aba, setAba] = useState(abaInicial);
  const [materias, setMaterias] = useState(() => carregar('estudos:materias', []));

  useEffect(() => {
    salvar('estudos:materias', materias);
  }, [materias]);

  return (
    <div className="app-shell">
      <div className={`screen screen-${aba}`}>
        {aba === 'calendario' && <Calendario materias={materias} setMaterias={setMaterias} />}
        {aba === 'resumos' && <Resumos materias={materias} setMaterias={setMaterias} />}
        {aba === 'exercicios' && <Exercicios />}
        {aba === 'chat' && <Chat />}
        {aba === 'galeria' && <Galeria />}
        {aba === 'anotacoes' && <Anotacoes materias={materias} setMaterias={setMaterias} />}
      </div>
      <Footer ativa={aba} onChange={setAba} />
    </div>
  );
}
