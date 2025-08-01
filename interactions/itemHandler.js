import { selectionState } from "../state/selectionState.js";

export class ItemHandler {
  #renderer;
  #scrollContainer;

  constructor(renderer, scrollContainer) {
    this.#renderer = renderer;
    this.#scrollContainer = scrollContainer;
  }

  init(items) {
    this.#renderer.render(items);
    const container = this.#renderer.getContainer();
    container.addEventListener('mousedown', this.#onMouseDown);
  }

  #onMouseDown = (e) => {
    e.preventDefault();

    const target = e.target.closest('.box');
    if (!target || !selectionState.get().has(target)) return;

    const selectedElements = [...selectionState.get()];
    const startX = e.clientX;
    const startY = e.clientY;

    const startScrollleft = this.#scrollContainer.scrollLeft;
    const startScrollTop = this.#scrollContainer.scrollTop;

    const initialPostitions = selectedElements.map(el => {
      return {
        element: el,
        initialLeft: el.offsetLeft,
        initialTop: el.offsetTop
      }
    })

    const onMouseMove = (e) => {
      const dx = (e.clientX - startX) + (this.#scrollContainer.scrollLeft - startScrollleft);
      const dy = (e.clientY - startY) + (this.#scrollContainer.scrollTop - startScrollTop);

      const minInitialLeft = Math.min(...initialPostitions.map(p => p.initialLeft));
      const minInitialTop = Math.min(...initialPostitions.map(p => p.initialTop));

      const clampedDx = Math.max(dx, -minInitialLeft);
      const clampedDy = Math.max(dy, -minInitialTop);

      for ( const { element, initialLeft, initialTop } of initialPostitions ) {
        element.style.left = `${initialLeft + clampedDx}px`;
        element.style.top = `${initialTop + clampedDy}px`;
      }
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };
}