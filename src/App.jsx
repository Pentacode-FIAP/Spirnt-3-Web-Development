import { useState } from 'react';
import { CameraApp } from './screens/CameraApp';
import { EstudosApp } from './screens/EstudosApp';

export default function App() {
  const [area, setArea] = useState('camera');
  const [abaEstudosInicial, setAbaEstudosInicial] = useState('calendario');

  function abrirEstudos(aba) {
    setAbaEstudosInicial(aba);
    setArea('estudos');
  }

  return (
    <div className="phone-frame">
      <div className="phone-notch" />
      {area === 'camera' ? (
        <CameraApp onAbrirEstudos={abrirEstudos} />
      ) : (
        <EstudosApp abaInicial={abaEstudosInicial} />
      )}
    </div>
  );
}
