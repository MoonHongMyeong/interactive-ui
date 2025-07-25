import { mouseDragState } from "../state/mouseDragState.js";
import { selectionState } from "../state/selectionState.js";
import { updateSelectionFromBox } from "../utils/selectionHitTest.js";
import { getLayerRelativePosition } from "../utils/coordinate-util.js";

export class DragSelectHandler {
    #container
    #overlay
    #startPoint;

    constructor(renderer){
        this.#container = renderer.getContainer();
        this.#overlay = renderer;
    }

    on() {
        this.#container.addEventListener('mousedown', this.#onMouseDown);
    }

    off() {
        if ( !this.#container ) return;
        this.#container.removeEventListener('mousedown', this.#onMouseDown);
    }

    dispose() {
        this.off();
        this.#container = null;
        this.#overlay?.dispose();
        this.#overlay = null;
    }

    #onMouseDown = (event) => {
        if (event.button !== 0) return;
        event.preventDefault();

        const isTargetInsideSelected = [...selectionState.get()].some(el => el.contains(event.target));
        const isClickOnContainer = event.target === this.#container;
        const isCtrlKey = event.ctrlKey || event.metaKey;

        if (!isTargetInsideSelected && isClickOnContainer && !isCtrlKey ) {
            selectionState.clear();
        }

        // 오직 배경 클릭일 때만 드래그 시작
        if (isClickOnContainer) {
            const { x, y } = getLayerRelativePosition(event, this.#container);
            this.#startPoint = { x, y };
            mouseDragState.start();

            this.#container.addEventListener('mousemove', this.#onMouseMove);
            document.addEventListener('mouseup', this.#onMouseUp);
        }
    }

    #onMouseMove = (event) => {
        if ( !mouseDragState.isActive() ) return;
        event.preventDefault();

        const x1 = this.#startPoint.x;
        const y1 = this.#startPoint.y;
        const { x: x2, y: y2 } = getLayerRelativePosition(event, this.#container);

        const x = Math.min(x1, x2);
        const y = Math.min(y1, y2);
        const width = Math.abs(x2 - x1);
        const height = Math.abs(y2 - y1);

        this.#overlay.setBox(x, y, width, height);
        updateSelectionFromBox({ x, y, width, height }, this.#container);
    }

    #onMouseUp = (event) => {
        if ( !mouseDragState.isActive() ) return;
        event.preventDefault();
        
        this.#overlay?.clear();

        this.#container.removeEventListener('mousemove', this.#onMouseMove);
        document.removeEventListener('mouseup', this.#onMouseUp);
    }
}