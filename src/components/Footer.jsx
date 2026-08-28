import { FileText, ListChecks, MessageCircle, Image, NotebookPen, Calendar } from 'lucide-react';

const ITENS = [
  { tab: 'resumos', label: 'Resumos', Icon: FileText },
  { tab: 'exercicios', label: 'Exercícios', Icon: ListChecks },
  { tab: 'chat', label: 'Chat IA', Icon: MessageCircle },
  { tab: 'galeria', label: 'Galeria', Icon: Image },
  { tab: 'anotacoes', label: 'Anotações', Icon: NotebookPen },
  { tab: 'calendario', label: 'Calendário', Icon: Calendar },
];

export function Footer({ ativa, onChange }) {
  return (
    <nav className="bottom-nav">
      {ITENS.map((item) => (
        <button
          key={item.tab}
          className={`nav-item ${ativa === item.tab ? 'nav-item-ativa' : ''}`}
          onClick={() => onChange(item.tab)}
        >
          <span className="nav-icon-wrap">
            <item.Icon size={20} strokeWidth={2} />
          </span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
