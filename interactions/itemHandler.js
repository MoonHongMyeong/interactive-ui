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

    const id = target.dataset.id;
    const startX = e.clientX;
    const startY = e.clientY;
    const initialLeft = parseInt(target.style.left);
    const initialTop = parseInt(target.style.top);

    const onMouseMove = (e) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      target.style.left = `${initialLeft + dx}px`;
      target.style.top = `${initialTop + dy}px`;
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };
}