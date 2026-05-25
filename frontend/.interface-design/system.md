# Sistema de Diseño ARMD-AI (.interface-design/system.md)

Este documento guarda los patrones de diseño y las decisiones de UI/UX tomadas para el proyecto **ARMD-AI** para asegurar la consistencia en futuras sesiones de desarrollo.

## 1. Dirección Visual e Identidad
- **Estilo**: Editorial Monochrome + Bloques Pastel Sólidos (Inspirado en Figma Marketing y FigJam).
- **Core**: Fondo blanco (`#ffffff`) en modo claro y fondo negro OLED (`#0c0c0e`) en modo oscuro. Estructura minimalista, tipografía de alta visibilidad, y botones en forma de píldora.
- **Storytelling**: Bloques de color pastel de pantalla completa con esquinas redondeadas generosas (`24px`) y rellenos internos amplios (`48px`) que contienen la narrativa clínica, separados siempre por espacio en blanco en el lienzo original.

## 2. Paleta de Colores Oficial (CSS Variables)
- **Monochrome Core**:
  - Claro: `--ink: #000000`, `--canvas: #ffffff`, `--primary: #000000` (Píldora activa).
  - Oscuro: `--ink: #f3f3f5`, `--canvas: #0c0c0e`, `--primary: #ffffff` (Píldora activa).
- **Bloques Pastel (Modo Claro / Modo Oscuro)**:
  - Menta (`block-mint`): `#c8e6cd` / `#112317` (Comportamiento y susceptibilidad).
  - Lila (`block-lilac`): `#c5b0f4` / `#201831` (Contexto de datos y origen).
  - Rosa (`block-pink`): `#efd4d4` / `#2a181b` (Calidad y cobertura semántica).
  - Lima (`block-lime`): `#dceeb1` / `#1c2514` (Resumen de limpieza y métricas).
  - Crema (`block-cream`): `#f4ecd6` / `#262117` (Variantes del dataset).
  - Coral (`block-coral`): `#f3c9b6` / `#2b1b15` (Modelado y validación cruzada).
  - Navy (`block-navy`): `#1f1d3d` / `#0d0c1e` (Notas metodológicas o cierres de contraste).
- **Superficies Adaptativas (NUNCA usar rgba fijo)**:
  - `--glass-surface`: `rgba(255,255,255,0.55)` / `rgba(255,255,255,0.06)` — Paneles semi-transparentes dentro de color-blocks.
  - `--glass-border`: `rgba(0,0,0,0.06)` / `rgba(255,255,255,0.08)` — Bordes de paneles glass.
  - `--code-bg`: `rgba(0,0,0,0.06)` / `rgba(255,255,255,0.08)` — Fondo de bloques `<code>`.
  - `--table-surface`: `rgba(255,255,255,0.7)` / `rgba(255,255,255,0.05)` — Fondo de tablas.
  - `--table-border` / `--table-border-soft` / `--table-row-hover`: Bordes y highlights de filas adaptivos.

## 3. Tipografía y Jerarquía
- **Sans Font**: `Inter` (fallback `system-ui`).
- **Mono Font**: `JetBrains Mono` (para metadatos, captions y bloques de código).
- **Display XL**: `86px` / Peso `340` / Interlineado `1.00` / Tracking `-1.72px`.
- **Display LG**: `64px` / Peso `340` / Interlineado `1.10` / Tracking `-0.96px` (Títulos de secciones).
- **Headline**: `26px` / Peso `540` / Interlineado `1.35` (Títulos dentro de bloques pastel).
- **Body**: `18px` / Peso `330` / Interlineado `1.45` (Texto por defecto).

## 4. Retícula y Espaciado (Grid & Spacing)
- **Unidad Base**: `8px`.
- **Escala de Espaciado**:
  - Gaps de iconos / chips: `8px` (`--space-xs`).
  - Relleno interno de botones/tarjetas: `16px` (`--space-md`) / `24px` (`--space-lg`).
  - Separación entre secciones del lienzo: `48px` / `96px` (`--space-section`).
- **Bordes e Insets**: Estilo limpio sin sombras duras. Líneas de separación extra finas (`1px` con opacidad rgba o colores muy tenues `--hairline` de `#e6e6e6` en claro y `#222226` en oscuro).

## 5. Patrones de Componentes Clave
- **Botón Primario (`button-primary`)**: Píldora totalmente redondeada (`50px`). Relleno negro con texto blanco en modo claro (invertido en oscuro).
- **Image Panel (`ImagePanel`)**: Tarjeta con borde fino (`--hairline`), esquinas redondeadas (`8px`), zoom interactivo sutil en hover (`scale(1.01)`), caption descriptiva en la parte inferior y un mensaje clave (`insight`) destacado en negrita.
- **Section Title (`SectionTitle`)**: Siempre precedido por un "eyebrow" en JetBrains Mono mayúscula con tracking expandido, un título en `display-lg` y un subtítulo ligero.
- **Circular View Transition**: Efecto spotlight circular calculado con clip-path a partir de las coordenadas del clic del ratón al alternar entre temas claro/oscuro.

## 6. Accesibilidad y Rendimiento
- **Animaciones**: Desactivadas si el usuario tiene activado `prefers-reduced-motion` en su sistema operativo.
- **Interacciones**: Todo elemento táctil o clickeable (`a`, `button`, `select`, tarjetas de variantes) tiene la propiedad `cursor: pointer` activa globalmente.
