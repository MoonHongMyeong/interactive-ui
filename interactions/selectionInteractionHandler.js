import { SelectionRenderer } from '../renderers/canvasSelectionRenderer.js'

export class SelectionInteractionHandler {
    #renderer;
    #selectedTargets = new Set();

    constructor(canvasElement){
        this.#renderer = new SelectionRenderer(canvasElement);
        this.#renderer.start();
    }

    onClick(event) {
        const isCtrlKey = event.ctrlKey || event.metaKey;
        const target = event.target.closest('.box');

        if (!isCtrlKey) this.#selectedTargets.clear();

        if (target) {
        this.#selectedTargets.has(target)
            ? this.#selectedTargets.delete(target)
            : this.#selectedTargets.add(target);
        } else {
        this.#selectedTargets.clear();
        }

        this.#updateRenderer();
    }

    onResize(){
        this.#renderer.start();
    }

    #updateRenderer() {
        this.#renderer.setTargets([...this.#selectedTargets]);
    }

    #destory() {
        this.#renderer.destroy();
    }
 
}
