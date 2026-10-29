import { describe, expect, it } from 'vitest';
import { phoneUrl, whatsappMessage, whatsappUrl } from '../src/lib/links';

describe('links', () => {
  it('builds a wa.me url with the business number', () => {
    expect(whatsappUrl()).toMatch(/^https:\/\/wa\.me\/34626378687\?text=/);
  });

  it('writes the property reference into the message', () => {
    const message = whatsappMessage({ propertyRef: 'M-1001', propertyTitle: 'Piso en venta en Centre, Malgrat de Mar' });
    expect(message).toBe('Hola, me interesa el piso en venta en Centre, Malgrat de Mar (ref. M-1001). ¿Lo puedo ver?');
  });

  it('uses the chosen reason', () => {
    expect(whatsappMessage({ reason: 'valoracion' })).toBe('Hola. Quiero saber cuánto vale mi piso.');
  });

  it('encodes the message', () => {
    expect(whatsappUrl({ reason: 'general' })).not.toContain(' ');
  });

  it('builds a tel url', () => {
    expect(phoneUrl()).toBe('tel:+34626378687');
  });
});
