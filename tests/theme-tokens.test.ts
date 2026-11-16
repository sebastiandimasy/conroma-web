import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync('src/styles/tokens.css', 'utf8');
// El :root de mapeo HeroUI → Conroma es el que contiene --accent: var(--color-accent).
const mapping = css.split(/^:root\s*\{/m).find((block) => block.includes('--accent: var(--color-accent)'))!.split(/^\}/m)[0];

const heroTokens = [
  '--foreground', '--muted', '--surface', '--surface-foreground', '--surface-secondary',
  '--surface-secondary-foreground', '--surface-tertiary', '--surface-tertiary-foreground',
  '--surface-hover', '--overlay', '--overlay-foreground', '--field-background', '--field-foreground',
  '--field-placeholder', '--field-border', '--segment', '--segment-foreground', '--border',
  '--separator', '--focus', '--link', '--success', '--success-foreground', '--warning', '--warning-foreground',
];

describe('tema: HeroUI hereda los tokens de Conroma', () => {
  it.each(heroTokens)('%s apunta a un token --color-*', (token) => {
    expect(mapping).toMatch(new RegExp(`^\\s*${token}:\\s*var\\(--color-`, 'm'));
  });

  it('el mapeo no lleva colores sueltos', () => {
    expect(mapping).not.toMatch(/#[0-9a-f]{3,8}\b|oklch\(|rgb\(/i);
  });
});
