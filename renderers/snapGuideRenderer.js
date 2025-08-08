import { guideLineState } from '../state/snapGuideState.js';
import { setupCanvasHiDPI } from "../utils/hiDpiCanvas.js";
import { debounce } from '../utils/debounce.js';

export class GuideRenderer {
  #canvas;
  #ctx;
  #animationId = null;
  #dashOffset = 0;
  #handleResize;
  #viewport;

  constructor(canvas) {
    this.#canvas = canvas;
    this.#ctx = canvas.getContext('2d');
    this.#viewport = this.#canvas.parentElement;
    
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
      window.removeEventListener('resize', this.#handleResize);
      if (this.#animationId) {
          cancelAnimationFrame(this.#animationId);
          this.#animationId = null;
      }
  }

  destroy() {
      this.stop();
  }

  #resizeCanvas() {
    setupCanvasHiDPI(this.#canvas, this.#ctx);
  }

  #draw() {
    const lines = guideLineState.get();

    if (!lines || lines.length === 0) {
      this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
      this.#animationId = requestAnimationFrame(() => this.#draw());
      return;
    }

    this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

    this.#ctx.setLineDash([5, 5]);
    this.#ctx.strokeStyle = '#000';
    this.#ctx.lineDashOffset = -this.#dashOffset;
    this.#ctx.lineWidth = 1;

    // Viewport absolute position within the scrollable container
    const offsetX = this.#viewport ? this.#viewport.offsetLeft : 0;
    const offsetY = this.#viewport ? this.#viewport.offsetTop : 0;

    for (const line of lines) {
      this.#ctx.beginPath();
      if (line.axis === 'x') {
        const xPos = line.position - offsetX;
        this.#ctx.moveTo(xPos, 0);
        this.#ctx.lineTo(xPos, this.#canvas.height);
      } else {
        const yPos = line.position - offsetY;
        this.#ctx.moveTo(0, yPos);
        this.#ctx.lineTo(this.#canvas.width, yPos);
      }
      this.#ctx.strokeStyle = 'rgba(0,0,255,0.5)';
      this.#ctx.stroke();
    }

    this.#animationId = requestAnimationFrame(() => this.#draw());
  }
}
