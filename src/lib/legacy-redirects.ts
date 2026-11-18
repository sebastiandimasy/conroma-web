import type { Property } from '../data/properties';

/** Línea de public/.htaccess que el build sustituye por las 301 de fichas antiguas. */
export const LEGACY_MARKER = '  # @fichas-antiguas (las genera el build: src/lib/legacy-redirects.ts)';

/** Una 301 por ficha: cualquier URL antigua que acabe en su id (/detalle/inmueble/<id>,
    /detalle/en_venta/.../<id>/) va a la ficha nueva. */
export function legacyRedirectRules(properties: Property[], slugOf: (p: Property) => string): string[] {
  return properties
    .filter((property) => property.legacyId)
    .map((property) => {
      const id = property.legacyId!.replace(/\./g, '\\.');
      return `  RewriteRule ^detalle/(.+/)?${id}/?$ /es/inmueble/${slugOf(property)}/ [R=301,L]`;
    });
}

export function injectLegacyRules(htaccess: string, rules: string[]): string {
  return htaccess.replace(LEGACY_MARKER, rules.join('\n'));
}
