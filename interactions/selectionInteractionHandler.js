import { SelectionRenderer } from '../renderers/canvasSelectionRenderer.js'
import { selectionState } from '../state/selectionState.js';

export class SelectionInteractionHandler {
    #renderer;

    constructor(canvasElement){
        this.#renderer = new SelectionRenderer(canvasElement);
        this.#renderer.start();
    }

    onClick(event) {
        const isCtrlKey = event.ctrlKey || event.metaKey;
        const target = event.target.closest('.box');

        if (!isCtrlKey) selectionState.clear();

        if (target) {
            selectionState.toggle(target);
        } else {
            selectionState.clear();
        }
    }

    onResize(){
        this.#renderer.start();
    }

    destory() {
        this.#renderer.destroy();
    }
 
}
