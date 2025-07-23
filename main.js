import { DragSelectHandler } from './interactions/dragSelectHandler.js';
import { SelectionInteractionHandler } from './interactions/selectionInteractionHandler.js'
import { SelectionOverlayRenderer } from './renderers/selectionOverlayRenderer.js';
import { SelectionRenderer } from './renderers/canvasSelectionRenderer.js';

function init() {
    document.addEventListener('DOMContentLoaded', () => {
        const canvas = document.querySelector('#box-canvas');
        const container = document.querySelector('.box-container');

        const canvasSelectionRenderer = new SelectionRenderer(canvas);
        const selectionHandler = new SelectionInteractionHandler(container, canvasSelectionRenderer);
        selectionHandler.on();
       
        const selectionOverlayRenderer = new SelectionOverlayRenderer(container);
        const dragSelectHandler = new DragSelectHandler(container, selectionOverlayRenderer);
        dragSelectHandler.on();
    });

}

init();