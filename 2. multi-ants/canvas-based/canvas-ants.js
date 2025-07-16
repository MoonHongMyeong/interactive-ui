let canvas, ctx;

let rects = [];
let dashOffset = 0;
let animationId = null

export const initCanvas = (canvasElement) => {
    canvas = canvasElement;
    ctx = canvas.getContext("2d");

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
 
export const updateRects = (newRects) => {
    rects = newRects;
}

const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setLineDash([10, 10]);
    ctx.strokeStyle = '#000';
    ctx.lineDashOffset = -dashOffset;
    ctx.lineWidth = 2;

    rects.forEach(({ x, y, width, height}) => {
        ctx.strokeRect(x-1, y-1, width+2, height+2);
    });

    dashOffset += 1;
    animationId = requestAnimationFrame(draw);
}

export const startAnts = () => {
    if(animationId) cancelAnimationFrame(animationId);
    draw();
}
