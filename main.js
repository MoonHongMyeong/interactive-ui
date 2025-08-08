import { ContextMenuHandler } from './interactions/contextMenuHandler.js';
import { DragSelectHandler } from './interactions/selectionBoxHandler.js';
import { ItemHandler } from './interactions/itemHandler.js';
import { ScrollResizeHandler } from './interactions/scrollResizeHandler.js';
import { ViewportSyncHandler } from './interactions/viewportSyncHandler.js';
import { CanvasSelectionRenderer } from './renderers/marchingAntsRenderer.js';
import { GuideRenderer } from './renderers/snapGuideRenderer.js';
import { ItemRenderer } from './renderers/boxRenderer.js';
import { SelectionOverlayRenderer } from './renderers/selectionBoxRenderer.js';

function init() {
    document.addEventListener('DOMContentLoaded', () => {
        const container = document.querySelector('.box-container');
        const viewport = container.querySelector('#viewport');
        const effectCanvas = viewport.querySelector('#effect-layer');
        const guideCanvas = viewport.querySelector('#guide-layer');
        const layer = container.querySelector('#box-layer');

        const canvasSelectionRenderer = new CanvasSelectionRenderer(effectCanvas);

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
        const guideLineRenderer = new GuideRenderer(guideCanvas);
        guideLineRenderer.start();
        const itemHandler = new ItemHandler(itemRenderer, container, canvasSelectionRenderer);
        itemHandler.init(items);

        const scrollResizeHandler = new ScrollResizeHandler(container, layer);
        scrollResizeHandler.on();

        const viewportSyncHandler = new ViewportSyncHandler(container, viewport);
        viewportSyncHandler.on();
    });

}

init();