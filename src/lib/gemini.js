const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const MODEL = 'gemini-3.5-flash-lite';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

function dataUrlParaBase64(dataUrl) {
  const [cabecalho, base64] = dataUrl.split(',');
  const mimeType = cabecalho.match(/data:(.*);base64/)?.[1] ?? 'image/jpeg';
  return { mimeType, base64 };
}

const TIMEOUT_MS = 30_000;

async function callGemini(parts) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
  let res;
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts }] }),
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('A IA demorou demais pra responder. Tente novamente.');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
  if (!res.ok) {
    throw new Error(`Gemini API error: ${res.status}`);
  }
  const data = await res.json();
  const texto = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof texto !== 'string') {
    throw new Error('Resposta da IA vazia ou inválida');
  }
  return texto;
}

export async function runOcr(dataUrl) {
  const { mimeType, base64 } = dataUrlParaBase64(dataUrl);
  return callGemini([
    { text: 'Extraia todo o texto visível nesta imagem. Preserve fórmulas matemáticas quando possível. Devolva apenas o texto extraído, sem comentários adicionais.' },
    { inline_data: { mime_type: mimeType, data: base64 } },
  ]);
}

export async function gerarResumo(fotos, materiaNome) {
  const parts = [
    { text: `Você é um assistente de estudos. Baseado nestas fotos de anotações da matéria "${materiaNome}", gere um resumo organizado em tópicos, em português, cobrindo os principais conceitos. Devolva em texto simples, sem formatação markdown (sem **, ###, $$, listas com * etc.) — use apenas quebras de linha e numeração simples como "1." para organizar os tópicos, já que o texto é exibido sem renderização de markdown.` },
  ];
  for (const dataUrl of fotos) {
    const { mimeType, base64 } = dataUrlParaBase64(dataUrl);
    parts.push({ inline_data: { mime_type: mimeType, data: base64 } });
  }
  return callGemini(parts);
}

export async function gerarExercicios(resumoConteudo) {
  const prompt = `Baseado neste resumo de estudos:\n\n${resumoConteudo}\n\nGere 5 exercícios variando a dificuldade (facil, medio, dificil), cada um com pergunta e resposta. Devolva APENAS um JSON válido, sem markdown, no formato: [{"pergunta": "...", "dificuldade": "facil", "resposta": "..."}]`;
  const texto = await callGemini([{ text: prompt }]);
  const limpo = texto.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '');
  const parsed = JSON.parse(limpo);
  if (!Array.isArray(parsed)) throw new Error('Formato inesperado');
  return parsed;
}

export async function enviarMensagemChat(contexto, historico, mensagem) {
  const prompt = `${contexto}\n\n---\n\nHistórico da conversa:\n${historico
    .map((h) => `${h.role === 'user' ? 'Aluno' : 'IA'}: ${h.texto}`)
    .join('\n')}\n\nAluno: ${mensagem}\n\nResponda como assistente de estudos, em português, de forma direta e útil. Use texto simples, sem formatação markdown (sem **, ###, listas com * etc.), pois a resposta é exibida sem renderização de markdown.`;
  return callGemini([{ text: prompt }]);
}
