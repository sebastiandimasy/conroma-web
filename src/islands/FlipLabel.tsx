import type { ReactNode } from 'react';

/** Contenido del botón principal en dos caras: al pasar el cursor, la de delante gira y entra
    la de detrás (CSS en components.css). Mismo marcado que el que pone BaseLayout a los botones
    de Astro. */
export function FlipLabel({ children }: { children: ReactNode }) {
  return (
    <span className="flip">
      <span className="flip__face">{children}</span>
      <span className="flip__face flip__face--back" aria-hidden="true">
        {children}
      </span>
    </span>
  );
}
