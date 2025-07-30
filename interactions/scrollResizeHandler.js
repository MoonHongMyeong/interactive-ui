export class ScrollResizeHandler {
    #container;
    #layer;

    constructor(container, layer) {
        this.#container = container;
        this.#layer = layer;
    }

    on() {
        this.#container.addEventListener('scroll', this.#resizeLayer);
    }

    off() {
        this.#container.removeEventListener('scroll', this.#resizeLayer);
    }

    #resizeLayer = () => {
        this.#layer.style.width = `${this.#container.scrollWidth}px`;
        this.#layer.style.height = `${this.#container.scrollHeight}px`;
    }
}