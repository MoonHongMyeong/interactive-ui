import { SelectionInteractionHandler } from './interactions/selectionInteractionHandler.js'

function init() {
    document.addEventListener('DOMContentLoaded', () => {
        const canvas = document.querySelector('#box-canvas');
        const handler = new SelectionInteractionHandler(canvas);

        document.addEventListener('click', e => handler.onClick(e));
        document.addEventListener('resize', () => handler.onResize());
    });
}

init();