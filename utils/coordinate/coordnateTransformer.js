export class CoordinateTransformer {
    #viewportElement;
    #layerElement;

    constructor(viewportElement, layerElement) {
        this.#viewportElement = viewportElement;
        this.#layerElement = layerElement;
    }

    // style 기반으로 위치를 읽는다
    #getViewportOffset() {
        return {
            left: parseFloat(this.#viewportElement.style.left || '0'),
            top: parseFloat(this.#viewportElement.style.top || '0')
        };
    }

    /**
     * clientX/Y 기준 좌표를 layer 기준 상대 좌표로 변환
     */
    viewportToLayerCoords(point) {
        const offset = this.#getViewportOffset();
        return {
            x: point.x + offset.left,
            y: point.y + offset.top
        };
    }

    /**
     * layer 좌표를 viewport 좌표계로 변환 (예: contextMenu 위치 등)
     */
    layerToViewportCoords(point) {
        const offset = this.#getViewportOffset();
        return {
            x: point.x - offset.left,
            y: point.y - offset.top
        };
    }

    getViewportOffset() {
        return this.#getViewportOffset(); // 외부에서도 접근 가능하게
    }

    getViewport() {
        return this.#viewportElement.getBoundingClientRect();
    }
}