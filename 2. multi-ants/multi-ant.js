const box = document.querySelector('.box');

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

let selectedTargets = new Set();

const createOverlay = (element) => {
    const { width, height } = element.getBoundingClientRect();

    // create svg
    const svg = document.createElementNS(SVG_NAMESPACE, 'svg');
    svg.setAttribute("class", "overlay")
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

    return svg;
}

const selectBoxOnClick = (element) => {
    if (element.querySelector('.overlay')) return;
    if (selectedTargets.has(element)) return;

    const svg = createOverlay(element);
    element.appendChild(svg);
    selectedTargets.add(element);
}

const clearAllSelection = () => {
    selectedTargets.forEach(deselectBoxOnClick);
    selectedTargets.clear();
}

const deselectBoxOnClick = (element) => {
    const overlay = element.querySelector('.overlay');
    if(overlay) overlay.remove();
    selectedTargets.delete(element);
}

const init = () => {
    document.addEventListener('click', e => {
        const isCtrlKey = e.ctrlKey || e.metaKey;
        const target = e.target.closest('.box');

        if (!target){
            clearAllSelection();
            return;
        } 

        if(isCtrlKey){
            if (selectedTargets.has(target)){
                deselectBoxOnClick(target);
            }else{
                selectBoxOnClick(target);
            }
        }else{
            clearAllSelection();
            selectBoxOnClick(target);
        }
    })
}

init();