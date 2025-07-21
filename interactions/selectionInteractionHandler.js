import { SelectionRenderer } from '../renderers/canvasSelectionRenderer.js'
import { selectionState } from '../state/selectionState.js';

export class SelectionInteractionHandler {
    #renderer;

    constructor(canvasElement){
        this.#renderer = new SelectionRenderer(canvasElement);
        this.#renderer.start();
    }

    on(){
        document.addEventListener('click', this.#onClick);
    }

    off() {
        this.#renderer.destroy();
        document.removeEventListener('click', this.#onClick);
    }

    #onClick(event) {
        const isCtrlKey = event.ctrlKey || event.metaKey;
        const target = event.target.closest('.box');

        if (!isCtrlKey) selectionState.clear();

        if (target) {
            selectionState.toggle(target);
        } else {
            selectionState.clear();
        }
    }
}
