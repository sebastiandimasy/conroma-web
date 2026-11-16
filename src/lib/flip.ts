/** Pone las dos caras del giro a los botones principales escritos en Astro (los de las islas
    de React ya las traen con <FlipLabel>; su DOM es de React y no se toca). */
export function initFlipButtons(root: ParentNode = document) {
  for (const button of root.querySelectorAll<HTMLElement>('.button--primary')) {
    if (button.querySelector('.flip') || button.closest('astro-island')) continue;
    const front = document.createElement('span');
    front.className = 'flip__face';
    front.append(...button.childNodes);
    const back = front.cloneNode(true) as HTMLElement;
    back.className = 'flip__face flip__face--back';
    back.setAttribute('aria-hidden', 'true');
    const flip = document.createElement('span');
    flip.className = 'flip';
    flip.append(front, back);
    button.append(flip);
  }
}
