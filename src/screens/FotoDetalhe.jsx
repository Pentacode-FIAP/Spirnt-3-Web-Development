import { useState } from 'react';
import { X, Copy } from 'lucide-react';
import { runOcr } from '../lib/gemini';
import { Toast } from '../components/Toast';

export function FotoDetalhe({ foto, onFechar, onSalvarOcr }) {
  const [texto, setTexto] = useState(foto.ocrText ?? '');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  async function rodarOcr() {
    setCarregando(true);
    setErro(null);
    try {
      const resultado = await runOcr(foto.dataUrl);
      setTexto(resultado);
      onSalvarOcr(foto.id, resultado);
    } catch {
      setErro('Erro ao gerar, tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  async function copiarTexto() {
    await navigator.clipboard.writeText(texto);
  }

  return (
    <div className="overlay">
      <div className="overlay-content">
        <div className="overlay-header">
          <h2>Foto</h2>
          <button onClick={onFechar}>
            <X size={18} strokeWidth={2} /> Fechar
          </button>
        </div>
        <img className="foto-grande" src={foto.dataUrl} alt="" />
        {!texto && (
          <button className="btn-primary" onClick={rodarOcr} disabled={carregando}>
            {carregando ? 'Lendo imagem...' : 'Rodar OCR'}
          </button>
        )}
        {texto && (
          <div className="ocr-resultado">
            <p>{texto}</p>
            <button onClick={copiarTexto}>
              <Copy size={18} strokeWidth={2} /> Copiar texto
            </button>
          </div>
        )}
        {erro && <Toast message={erro} onClose={() => setErro(null)} />}
      </div>
    </div>
  );
}
