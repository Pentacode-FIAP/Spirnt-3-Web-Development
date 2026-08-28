export function Header({ title, subtitle, actions }) {
  return (
    <header className="screen-header">
      <div className="screen-header-copy">
        <h1>{title}</h1>
        <p className="subtitulo">{subtitle}</p>
      </div>
      {actions && <div className="screen-header-actions">{actions}</div>}
    </header>
  );
}
