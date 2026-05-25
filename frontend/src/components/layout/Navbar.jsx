import { Link, useLocation } from "react-router-dom";
import { Activity, Sun, Moon } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import styles from "./Navbar.module.css";

const navLinks = [
  { to: "/", label: "Análisis" },
  { to: "/modelos", label: "Modelos" },
];

export default function Navbar() {
  const location = useLocation();
  const { theme, toggle } = useTheme();

  const handleToggle = (e) => {
    const x = e.clientX;
    const y = e.clientY;
    document.documentElement.style.setProperty("--x", `${x}px`);
    document.documentElement.style.setProperty("--y", `${y}px`);

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );
    document.documentElement.style.setProperty("--r", `${endRadius}px`);

    if (!document.startViewTransition) {
      toggle();
      return;
    }

    document.startViewTransition(() => {
      toggle();
    });
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.logo}>
          <Activity size={20} strokeWidth={2.5} />
          <span className={styles.logoText}>ARMD-AI</span>
        </Link>

        <div className={styles.links}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`${styles.link} ${
                location.pathname === link.to ? styles.linkActive : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className={styles.actions}>
          <button
            onClick={handleToggle}
            className={`btn btn-icon ${styles.themeBtn}`}
            aria-label="Cambiar tema"
          >
            {theme === "light" ? (
              <Moon size={20} className={styles.themeToggleActive} key="moon" />
            ) : (
              <Sun size={20} className={styles.themeToggleActive} key="sun" />
            )}
          </button>
          <a
            href="https://github.com/JsLealM/armd-ai"
            target="_blank"
            rel="noopener noreferrer"
            className={`btn btn-primary ${styles.repoLink}`}
            style={{ fontSize: "16px", padding: "8px 16px" }}
          >
            Ver repositorio
          </a>
        </div>
      </nav>
    </header>
  );
}

