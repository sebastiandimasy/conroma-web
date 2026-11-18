import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { getListings, propertySlug, retiradasEnHabitatsoft } from '../src/data/properties';
import { injectLegacyRules, legacyRedirectRules, LEGACY_MARKER } from '../src/lib/legacy-redirects';

describe('datos de la web antigua', () => {
  it('la ficha toma el certificado energético publicado en Habitatsoft', () => {
    const chalet = getListings().find((p) => p.ref === 'C-1198-H');
    expect(chalet?.energyRating).toBe('D');
    expect(chalet?.energyEmissions).toBe(46);
    expect(chalet?.energyConsumptionRating).toBe('D');
    expect(chalet?.legacyId).toBe('49263636613.527526');
  });
});

describe('inventario desfasado', () => {
  it('no publica lo que Habitatsoft ya no publica', () => {
    const refs = getListings().map((p) => p.ref);
    expect(refs).not.toContain('T-2020-H'); // da 404 en la web antigua
    expect(refs).toContain('C-1198-H');
    expect(retiradasEnHabitatsoft.length).toBe(22);
  });
});

describe('redirecciones 1:1 de fichas antiguas', () => {
  const sample = { ref: 'C-1', legacyId: '49263636613.527526' };

  it('lleva cualquier URL antigua con ese id a la ficha nueva', () => {
    const [rule] = legacyRedirectRules([sample as never], () => 'chalet-x-c-1');
    expect(rule).toBe('  RewriteRule ^detalle/(.+/)?49263636613\\.527526/?$ /es/inmueble/chalet-x-c-1/ [R=301,L]');
  });

  it('ignora inmuebles sin id antiguo', () => {
    expect(legacyRedirectRules([{ ref: 'C-2' } as never], () => 'x')).toEqual([]);
  });

  it('inserta las reglas en el marcador del .htaccess', () => {
    const out = injectLegacyRules(`a\n${LEGACY_MARKER}\nb`, ['  R1', '  R2']);
    expect(out).toBe('a\n  R1\n  R2\nb');
  });

  it('el marcador está en public/.htaccess antes de las reglas genéricas de /detalle', () => {
    const htaccess = readFileSync('public/.htaccess', 'utf8');
    const marker = htaccess.indexOf(LEGACY_MARKER);
    expect(marker).toBeGreaterThan(-1);
    expect(marker).toBeLessThan(htaccess.indexOf('RewriteRule ^detalle/'));
  });

  it('hay una regla por cada ficha publicada con id antiguo', () => {
    const listed = getListings().filter((p) => p.legacyId);
    expect(legacyRedirectRules(listed, propertySlug).length).toBe(listed.length);
    expect(listed.length).toBeGreaterThan(90);
  });
});
