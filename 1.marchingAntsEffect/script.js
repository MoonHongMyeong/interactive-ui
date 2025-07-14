const box = document.querySelector('.box');

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

let selectedTarget = null;

const selectBoxOnClick = (element) => {
    if (!element.classList.contains('box')) return;
    if (selectedTarget === element) return;

    cancelSelectBoxInteraction();

    const { width, height } = element.getBoundingClientRect();

    // create svg
    const svg = document.createElementNS(SVG_NAMESPACE, 'svg');
    svg.setAttribute("id", "overlay")
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

    // create rect 
    const rect = document.createElementNS(SVG_NAMESPACE, 'rect');
    rect.setAttribute("x", '0');
    rect.setAttribute("y", '0');
    rect.setAttribute("width", width);
    rect.setAttribute("height", height);
    rect.setAttribute("fill", "none");
    rect.setAttribute("stroke", "#000");
    rect.setAttribute("stroke-width", "6");
    rect.setAttribute("stroke-dasharray", "10 10");
    rect.setAttribute("stroke-dashoffset", "0");
    
    //create animate
    const animate = document.createElementNS(SVG_NAMESPACE, 'animate');
    animate.setAttribute("attributeName", 'stroke-dashoffset');
    animate.setAttribute("from", "0");
    animate.setAttribute("to", "20");
    animate.setAttribute("dur", "1.5s");
    animate.setAttribute("repeatCount", "indefinite");

    rect.appendChild(animate);
    svg.appendChild(rect);
    element.appendChild(svg);

    selectedTarget = element;
}

const cancelSelectBoxInteraction = () => {
    const overlay = document.querySelector('#overlay');
    if(overlay) overlay.remove();
    selectedTarget = null;
}

const init = () => {
    document.addEventListener('click', e=> {
        e.stopPropagation();
        selectBoxOnClick(e.target);
    })
}

init();