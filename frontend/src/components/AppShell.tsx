import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { appRoutes, navItems } from '../routes/routes';

interface AppShellProps {
  openEvaluation: () => void;
}

export function AppShell({ openEvaluation }: AppShellProps) {
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => navigate(appRoutes.home)} type="button" aria-label="Ir a inicio">
          <span className="brand-mark">+</span>
          <span>ARMD-AI</span>
        </button>
        <nav className="nav-links" aria-label="Navegacion principal">
          {navItems.map((page) => (
            <NavLink
              key={page.path}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              end={page.end}
              to={page.path}
            >
              {page.label}
            </NavLink>
          ))}
        </nav>
        <button className="primary-action compact" onClick={openEvaluation} type="button">
          Nueva evaluacion
        </button>
      </header>
      <Outlet />
      <footer className="footer">
        <strong>ARMD-AI - Prototipo academico</strong>
        <span>No usar como dispositivo medico. No reemplaza antibiograma ni criterio medico.</span>
      </footer>
    </div>
  );
}
