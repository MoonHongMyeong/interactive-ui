import { mouseDragState } from '../state/mouseDragState.js';
import { selectionState } from '../state/selectionState.js';

export class SelectionInteractionHandler {
    #container;
    #renderer;

    constructor(container, renderer){
        this.#container = container;
        this.#renderer = renderer;
        this.#renderer.start();
    }

    on(){
        this.#container.addEventListener('click', this.#onClick);
    }

    off() {
        this.#container.removeEventListener('click', this.#onClick);
        this.#renderer.destroy();
    }

    #onClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        
        if ( mouseDragState.isActive() ) {
            mouseDragState.stop();
            return;
        }

        const isCtrlKey = event.ctrlKey || event.metaKey;
        const target = event.target.closest('.box');

        if (!isCtrlKey) selectionState.clear();

        if (target) selectionState.toggle(target);
    }
}
