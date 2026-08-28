import { useState } from 'react';
import { Onboarding } from './Onboarding';
import { Camera } from './Camera';
import { CameraModos } from './CameraModos';

const CHAVE_ONBOARDING = 'jovi_onboarding_visto';

export function CameraApp({ onAbrirEstudos }) {
  const [tela, setTela] = useState(() =>
    localStorage.getItem(CHAVE_ONBOARDING) ? 'camera' : 'onboarding',
  );

  function concluirOnboarding() {
    localStorage.setItem(CHAVE_ONBOARDING, '1');
    setTela('camera');
  }

  if (tela === 'onboarding') {
    return <Onboarding onConcluir={concluirOnboarding} />;
  }
  if (tela === 'config') {
    return <CameraModos onVoltar={() => setTela('camera')} />;
  }
  return <Camera onAbrirConfig={() => setTela('config')} onAbrirEstudos={onAbrirEstudos} />;
}
