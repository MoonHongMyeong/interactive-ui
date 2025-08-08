export class SelectionOverlayRenderer {
    #container;
    #svg;
    #rect;

    constructor(containerElement) {
        this.#container = containerElement;
        this.#createSvg();
    }

    getContainer() {
        return this.#container;
    }

    #createSvg() {
        this.#svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.#svg.style.position = "absolute";
        this.#svg.style.top = 0;
        this.#svg.style.left = 0;
        this.#svg.style.width = "100%";
        this.#svg.style.height = "100%";
        this.#svg.style.pointerEvents = "none";

        this.#rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        this.#rect.setAttribute("fill", "rgba(0, 128, 255, 0.2)");
        this.#rect.setAttribute("stroke", "#0080ff");
        this.#rect.setAttribute("stroke-dasharray", "4");
        this.#rect.setAttribute("visibility", "hidden");

        this.#svg.appendChild(this.#rect);
        this.#container.appendChild(this.#svg);
    }

    setBox(x, y, width, height) {
        this.#rect.setAttribute("x", x);
        this.#rect.setAttribute("y", y);
        this.#rect.setAttribute("width", width);
        this.#rect.setAttribute("height", height);
        this.#rect.setAttribute("visibility", "visible");
    }

    clear() {
        this.#rect.setAttribute("visibility", "hidden");
    }

    dispose() {
        this.#svg?.remove();
        this.#container = null;
        this.#svg = null;
        this.#rect = null;
    }
}
