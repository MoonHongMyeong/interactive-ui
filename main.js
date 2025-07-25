import { DragSelectHandler } from './interactions/dragSelectHandler.js';
import { SelectionInteractionHandler } from './interactions/selectionInteractionHandler.js'
import { SelectionOverlayRenderer } from './renderers/selectionOverlayRenderer.js';
import { SelectionRenderer } from './renderers/canvasSelectionRenderer.js';
import { ContextMenuHandler } from './interactions/contextMenuHandler.js';
import { ItemRenderer } from './renderers/itemRenderer.js';
import { ItemHandler } from './interactions/itemHandler.js';
import { ViewportSyncHandler } from './interactions/viewportSyncHandler.js';

function init() {
    document.addEventListener('DOMContentLoaded', () => {
        const container = document.querySelector('.box-container');
        const viewport = container.querySelector('#viewport');
        const canvas = document.querySelector('#box-canvas');
        const layer = document.querySelector('#box-layer');

        const canvasSelectionRenderer = new SelectionRenderer(canvas);
        const selectionHandler = new SelectionInteractionHandler(layer, canvasSelectionRenderer);
        selectionHandler.on();

        const selectionOverlayRenderer = new SelectionOverlayRenderer(layer);
        const dragSelectHandler = new DragSelectHandler(selectionOverlayRenderer);
        dragSelectHandler.on();

        const testHtmlProvider = (target) => {
            if (target.id !== 'box-layer') return '';
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

        const contextMenuHandler = new ContextMenuHandler(layer, testHtmlProvider);
        contextMenuHandler.on();

        const items = [
            { id: "a", x: 100, y: 100, width:100, height: 100, bgColor: "brown" },
            { id: "b", x: 1500, y: 100, width:100, height: 100, bgColor: "black" },
            { id: "c", x: 300, y: 400, width:100, height: 100, bgColor: "green" },
            { id: "d", x: 600, y: 800, width:100, height: 100, bgColor: "blue" }
        ];

        const itemRenderer = new ItemRenderer(layer);
        const itemHandler = new ItemHandler(itemRenderer);
        itemHandler.init(items);

        const viewportSyncHandler = new ViewportSyncHandler(container, viewport);
        viewportSyncHandler.on();
    });

}

init();