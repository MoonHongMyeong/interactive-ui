export class CoordinateTransformer {
    #viewportElement;
    #layerElement;

    constructor(viewportElement, layerElement) {
        this.#viewportElement = viewportElement;
        this.#layerElement = layerElement;
    }

    #getRects = () => {
        return {
            viewport: this.#viewportElement.getBoundingClientRect(),
            layer: this.#layerElement.getBoundingClientRect()
        }
    }

    /**
     * @param {{ x: number, y: number }} point - clientX/Y 기반 좌표
     */
    viewportToLayerCoords(point) {
        const { viewport, layer } = this.#getRects();
        return {
            x: point.x + ( layer.left - viewport.left ),
            y: point.y + ( layer.top - viewport.top )
        };
    }

    /**
     * @param {{ x: number, y: number }} point - clientX/Y 기반 좌표
     */  
    layerToViewportCoords(point){
        const { layer, viewport } = this.#getRects();
        return {
            x: point.x + ( viewport.left - layer.left),
            y: point.y + ( viewport.top - layer.top)
        }
    }

    getViewportRect() {
        return this.#viewportElement.getBoundingClientRect();
    }
    
    getViewportOffsetStyle() {
        const style = getComputedStyle(this.#viewportElement);
        return {
            top: parseFloat(style.top) || 0,
            left: parseFloat(style.left) || 0
        }
    }
}