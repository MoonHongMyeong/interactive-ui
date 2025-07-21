import { SelectionInteractionHandler } from './interactions/selectionInteractionHandler.js'

function init() {
    document.addEventListener('DOMContentLoaded', () => {
        const canvas = document.querySelector('#box-canvas');
        const selectionHandler = new SelectionInteractionHandler(canvas);
        selectionHandler.on();
    });

}

init();