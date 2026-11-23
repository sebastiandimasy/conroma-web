/** iOS Safari solo aplica :active si hay algún touchstart registrado. Con este, las pulsaciones de
    motion.css responden al dedo. Pasivo: no frena el scroll. */
export function initTouch(): void {
  document.addEventListener('touchstart', () => {}, { passive: true });
}
