import { useEffect, useRef, useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import { carregar, salvar } from '../lib/storage';
import { dataLocal } from '../lib/date';
import { fileToDataUrl } from '../lib/images';
import { FotoDetalhe } from './FotoDetalhe';
import { Header } from '../components/Header';
import { Toast } from '../components/Toast';

function agruparPorData(fotos) {
  const hoje = dataLocal(new Date());
  const ontem = dataLocal(new Date(Date.now() - 86400000));
  const grupos = new Map();
  for (const f of fotos) {
    const dia = dataLocal(new Date(f.dataUpload));
    const lista = grupos.get(dia) ?? [];
    lista.push(f);
    grupos.set(dia, lista);
  }
  const ordenado = [...grupos.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  return ordenado.map(([dia, itens]) => ({
    rotulo: dia === hoje ? 'Hoje' : dia === ontem ? 'Ontem' : dia,
    itens,
  }));
}

export function Galeria() {
  const [fotos, setFotos] = useState(() => carregar('estudos:fotos', []));
  useEffect(() => {
    salvar('estudos:fotos', fotos);
  }, [fotos]);

  const [selecionada, setSelecionada] = useState(null);
  const [toast, setToast] = useState(null);
  const inputUploadRef = useRef(null);
  const inputCameraRef = useRef(null);

  async function aoSelecionarArquivos(e) {
    const arquivos = e.target.files;
    if (!arquivos) return;
    const novas = [];
    for (const arquivo of Array.from(arquivos)) {
      try {
        const dataUrl = await fileToDataUrl(arquivo);
        novas.push({ id: Date.now() + novas.length, dataUrl, dataUpload: new Date().toISOString() });
      } catch {
        setToast({ tipo: 'erro', mensagem: 'Erro ao salvar foto — armazenamento cheio ou arquivo inválido.' });
        break;
      }
    }
    if (novas.length) setFotos([...fotos, ...novas]);
    e.target.value = '';
  }

  const grupos = agruparPorData([...fotos].sort((a, b) => b.dataUpload.localeCompare(a.dataUpload)));

  return (
    <div>
      <Header
        title="Galeria"
        subtitle="Todas as fotos que você já enviou"
        actions={
          <div className="acoes-icone">
            <button onClick={() => inputCameraRef.current?.click()} aria-label="Abrir câmera">
              <Camera size={18} strokeWidth={2} />
            </button>
            <button onClick={() => inputUploadRef.current?.click()} aria-label="Enviar foto">
              <Upload size={18} strokeWidth={2} />
            </button>
          </div>
        }
      />

      <input ref={inputCameraRef} type="file" accept="image/*" capture="environment" hidden onChange={aoSelecionarArquivos} />
      <input ref={inputUploadRef} type="file" accept="image/*" multiple hidden onChange={aoSelecionarArquivos} />

      {grupos.map((grupo) => (
        <div key={grupo.rotulo}>
          <h3 className="secao-titulo">{grupo.rotulo}</h3>
          <div className="galeria-grid">
            {grupo.itens.map((foto) => (
              <button key={foto.id} className="galeria-item" onClick={() => setSelecionada(foto)}>
                <img src={foto.dataUrl} alt="" />
              </button>
            ))}
          </div>
        </div>
      ))}
      {fotos.length === 0 && <p className="vazio">Nenhuma foto ainda</p>}

      {selecionada && (
        <FotoDetalhe
          foto={selecionada}
          onSalvarOcr={(id, texto) =>
            setFotos(fotos.map((f) => (f.id === id ? { ...f, ocrText: texto } : f)))
          }
          onFechar={() => setSelecionada(null)}
        />
      )}

      {toast && (
        <Toast message={toast.mensagem} tipo={toast.tipo} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
