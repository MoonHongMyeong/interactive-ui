export class ViewportSyncHandler {
    #container;
    #viewport;

    constructor(container, viewport) {
        this.#container = container;
        this.#viewport = viewport;
    }

    on() {
        this.#container.addEventListener('scroll', this.#onScroll);
        this.#sync();
    }

    dispose() {
        this.#container.removeEventListener('scroll', this.#onScroll);
    }

    #onScroll = () => {
        this.#sync();
    }

    #sync() {
        const scrollLeft = this.#container.scrollLeft;
        const scrollTop = this.#container.scrollTop;

        const maxScrollLeft = this.#container.scrollWidth - this.#container.clientWidth;
        const maxScrollTop = this.#container.scrollHeight - this.#container.clientHeight;

        const x = Math.min(scrollLeft, maxScrollLeft);
        const y = Math.min(scrollTop, maxScrollTop);

        this.#viewport.style.left = `${x}px`;
        this.#viewport.style.top = `${y}px`;
    }
}