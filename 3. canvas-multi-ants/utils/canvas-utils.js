export const setupCanvasHiDPI = (canvas, context) => {
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    const rect = canvas.getBoundingClientRect();
    const zoom = rect.width / width;
    const dpr = window.devicePixelRatio || 1;
    const scale = zoom * dpr;

    canvas.width = width * zoom * dpr;
    canvas.height = height * zoom * dpr;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // 변환 초기화
    context.setTransform(scale, 0, 0, scale, 0, 0); 
}