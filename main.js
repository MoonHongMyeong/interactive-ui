import { DragSelectHandler } from './interactions/dragSelectHandler.js';
import { SelectionInteractionHandler } from './interactions/selectionInteractionHandler.js'
import { SelectionOverlayRenderer } from './renderers/selectionOverlayRenderer.js';

function init() {
    document.addEventListener('DOMContentLoaded', () => {
        const canvas = document.querySelector('#box-canvas');
        const selectionHandler = new SelectionInteractionHandler(canvas);
        selectionHandler.on();

        const container = document.querySelector('.box-container');
        const selectionOverlayRenderer = new SelectionOverlayRenderer(container);
        const dragSelectHandler = new DragSelectHandler(container, selectionOverlayRenderer);
        dragSelectHandler.on();
    });

}

init();