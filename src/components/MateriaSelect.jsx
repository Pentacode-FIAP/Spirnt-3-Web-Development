import { useEffect, useState } from 'react';
import { Materias } from '../screens/Materias';

export function MateriaSelect({ value, onChange, permitirVazio = true, materias, setMaterias }) {
  const [gerenciando, setGerenciando] = useState(false);

  useEffect(() => {
    if (!permitirVazio && value === undefined && materias.length > 0) {
      onChange(materias[0].id);
    }
  }, [permitirVazio, value, materias, onChange]);

  return (
    <>
      <div className="materia-field">
        <select
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
          aria-label="Matéria"
        >
          {permitirVazio && <option value="">Sem matéria</option>}
          {materias.map((m) => (
            <option key={m.id} value={m.id}>{m.nome}</option>
          ))}
        </select>
        <button className="link-materias" type="button" onClick={() => setGerenciando(true)}>
          {materias.length === 0 ? 'Criar matéria' : 'Gerenciar matérias'}
        </button>
      </div>
      {gerenciando && (
        <div className="overlay">
          <Materias materias={materias} setMaterias={setMaterias} onFechar={() => setGerenciando(false)} />
        </div>
      )}
    </>
  );
}
