import { selectionState } from "../state/selectionState.js";

export class ItemHandler {
  #renderer;

  constructor(renderer) {
    this.#renderer = renderer;
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

    const initialPostitions = selectedElements.map(el => {
      return {
        element: el,
        initialLeft: el.offsetLeft,
        initialTop: el.offsetTop
      }
    })

    const onMouseMove = (e) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      for ( const { element, initialLeft, initialTop } of initialPostitions ) {
        element.style.left = `${initialLeft + dx}px`;
        element.style.top = `${initialTop + dy}px`;
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