import { selectionState } from "../state/selectionState.js";
import { setupCanvasHiDPI } from "../utils/canvas-utils.js";
import { debounce } from '../utils/debounce.js';

export class SelectionRenderer {
    #canvas;
    #ctx;
    #dashOffset = 0;
    #animationId = null;
    #handleResize;

    constructor(canvasElement) {
        this.#canvas = canvasElement;
        this.#ctx = this.#canvas.getContext("2d");
        if (!this.#ctx) throw new Error("Initialize context failed");

        this.#resizeCanvas();

        this.#handleResize = debounce(() => {
            this.#resizeCanvas();
            this.start();
        }, 300);

        window.addEventListener('resize', this.#handleResize);
    }

    start() {
        if (this.#animationId) cancelAnimationFrame(this.#animationId);
        this.#draw();
    }

    stop() {
        if (this.#animationId) {
            cancelAnimationFrame(this.#animationId);
            this.#animationId = null;
        }
    }

    destroy() {
        this.stop();
        window.removeEventListener('resize', this.#handleResize);
    }

    #resizeCanvas() {
        setupCanvasHiDPI(this.#canvas, this.#ctx);
    }

    #draw() {
        const ctx = this.#ctx;
        const targets = selectionState.get();
        const canvasRect = this.#canvas.getBoundingClientRect();

        // 이전 프레임 초기화
        ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

        // 선 스타일 설정
        ctx.setLineDash([10, 10]);
        ctx.strokeStyle = '#000';
        ctx.lineDashOffset = -this.#dashOffset;
        ctx.lineWidth = 2;

        for (const target of targets){
            const elRect = target.getBoundingClientRect();
            const x = elRect.x - canvasRect.x;
            const y =  elRect.y - canvasRect.y;
            const width = elRect.width;
            const height = elRect.height;

            // 약간의 외곽선 여유 공각 확보
            ctx.strokeRect(x - 1, y - 1, width + 2, height + 2);
        }

        // offset 증가 (다음 프레임)
        this.#dashOffset += 1;
        // 다음 프레임 예약
        this.#animationId = requestAnimationFrame(() => this.#draw());
    }
}