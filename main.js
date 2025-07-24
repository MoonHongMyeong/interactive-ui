import { DragSelectHandler } from './interactions/dragSelectHandler.js';
import { SelectionInteractionHandler } from './interactions/selectionInteractionHandler.js'
import { SelectionOverlayRenderer } from './renderers/selectionOverlayRenderer.js';
import { SelectionRenderer } from './renderers/canvasSelectionRenderer.js';
import { ContextMenuHandler } from './interactions/contextMenuHandler.js'

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

        const testHtmlProvider = (target) => {
            if (target.className !== 'box-container') return '';
            return (
                `
                <div>chatGPT</div>
                <div>ClaudeCode</div>
                <div>grok</div>
                <div>gemini</div>
                <div>cursor</div>
                <div>windsurf</div>
                `
            );
        }

        const contextMenuHandler = new ContextMenuHandler(container, testHtmlProvider);
        contextMenuHandler.on();
    });

}

init();